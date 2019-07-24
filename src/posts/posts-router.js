const path = require('path');
const express = require('express');
const xss = require('xss');
const PostsService = require('./posts-service');
const { requireAuth } = require('../middleware/auth');

const postsRouter = express.Router();
const jsonParser = express.json();

const serializePost = post => ({
    id: post.id,
    post_title: xss(post.post_title),
    post_content: xss(post.post_content),
    owner: post.owner
})

const serializeFullPost = post => ({
    id: post.id,
    post_title: xss(post.post_title),
    post_content: xss(post.post_content),
    owner: post.owner,
    first_name: post.first_name,
    last_name: post.last_name
})

postsRouter
    .route('/')
    .get(requireAuth, (req, res, next) => {
        const knexInstance = req.app.get('db');
        PostsService.getAllPosts(knexInstance)
            .then(posts => {
                res.json(posts.map(serializeFullPost))
            })
            .catch(next);
    })
    .post(requireAuth, jsonParser, (req, res, next) => {
        const owner = req.user.id;
        const { post_title, post_content } = req.body
        const post = { post_title, post_content, owner } 


        for (const [key, value] of Object.entries(post))
            if (value == null)
                return res.status(400).json({
                    error: { message: `Missing '${key}' in body request`}
                });

        
        PostsService.insertPost(req.app.get('db'), post)
                .then(post => {
                    res
                        .status(201)
                        .location(path.posix.join(req.originalUrl, `/${post.id}`))
                        .json(serializePost(post))
                })
                .catch(next);
    })

    postsRouter
        .route('/getAllLikes')
        .get(requireAuth, (req, user, next) => {
            const knexInstance = req.app.get('db');
            PostsService.getAllLikedPosts(knexInstance)
                .then(likes =>{
                    res.json(likes);
                })
                .catch(next)
        })

    postsRouter
        .route('/getRandom')
        .get(requireAuth, (req, res, next) => {
            const knexInstance = req.app.get('db');
            PostsService.getAllPosts(knexInstance)
                .then(posts => {
                    const allPosts = posts.map(serializeFullPost)
                    const randomPost = Math.floor(Math.random() * allPosts.length)
                    res.json(allPosts[randomPost])
                })
                .catch(next);
        })

    postsRouter
        .route('/myPost')
        .get(requireAuth, (req, res, next) => {
            const owner = req.user.id;
            PostsService.getByOwnerId(req.app.get('db'), owner)
                .then(posts => {
                    res.json(posts.map(serializePost))
                })
                .catch(next);
        })

    postsRouter
        .route('/:postId/likes')
        .get(requireAuth, (req, res, next) => {
            const knexInstance = req.app.get('db');
            PostsService.getLikesByPostId(knexInstance, req.params.postId)
                .then(likes => {
                    if (!likes) {
                        return res.status(404).json({
                            error: { message: `Post doesn't exist` }
                        })
                    }
                    return res.json(likes)
                })
                .catch(next)
        })
        .post(requireAuth, (req, res, next) => {
            const knexInstance = req.app.get('db');
            const owner = req.user.id;
            const post_id = req.params.postId;
            const newLike = { owner, post_id }
            
            PostsService.likedByUser(knexInstance, owner, post_id)
                .then(liked => {
                    if (liked) 
                        return res.status(400).json({error: `Already Liked`})
                    
                    return PostsService.insertLike(knexInstance, newLike)
                        .then(like => {
                            res
                                .status(201)
                                .location(path.posix.join(req.originalUrl, `/${like.id}`))
                                .json(like)
                        })
                })
                .catch(next)
        })
        .delete(requireAuth, (req, res, next) => {
            const knexInstance = req.app.get('db');
            const owner = req.user.id;
            const post_id = req.params.postId;

            PostsService.deleteLike(
                knexInstance,
                owner,
                post_id
            )
                .then(() => {
                    res.status(204).end()
                })
                .catch(next)
        })

    postsRouter
        .route('/:postId')
        .all(requireAuth, (req, res, next) => {
            const knexInstance = req.app.get('db');
            PostsService.getById(knexInstance, req.params.postId)
                .then(post => {
                    if (!post) {
                        return res.status(404).json({
                            error: { message: `Post doesn't exist` }
                        })
                    }
                    res.post = post
                    next()
                })
                .catch(next)
        })
        .get(requireAuth, (req, res, next) => {res.json(serializePost(res.post))})
        .delete(requireAuth, (req, res, next) => {
            PostsService.deletePost(
                req.app.get('db'),
                req.params.postId
            )
                .then(() => {
                    res.status(204).end()
                })
                .catch(next)
        })
        .patch(requireAuth, jsonParser, (req, res, next) => {
            const { post_title, post_content} = req.body
            const postToUpdate = { post_title, post_content}

            const numberOfValues = Object.values(postToUpdate).filter(Boolean).length
            if (numberOfValues === 0) {
                res.status(400).json({
                    error: {
                        message: `Request must contain  'post title', and 'post content'`
                    }
                })
            }

            PostsService.updatePost(
                req.app.get('db'),
                req.params.postId,
                postToUpdate
            )
                .then(numRowsAffected => {
                    res.status(204).end()
                })
                .catch(next)
        })



    module.exports = postsRouter;