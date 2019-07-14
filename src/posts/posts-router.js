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

postsRouter
    .route('/')
    .get(requireAuth, (req, res, next) => {
        const knexInstance = req.app.get('db');
        PostsService.getAllPosts(knexInstance)
            .then(posts => {
                res.json(posts.map(serializePost))
            })
            .catch(next);
    })
    .post(requireAuth, jsonParser, (req, res, next) => {
        const { post_title, post_content } = req.body
        const post = { post_title, post_content } 

        for (const [key, value] of Object.entries(post))
            if (value == null)
                return res.status(400).json({
                    error: { message: `Missing '${key} in body request`}
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
        .route('/:post_id')
        .all(requireAuth, (req, res, next) => {
            const knexInstance = req.app.get('db');
            PostsService.getById(knexInstance, req.params.post_id)
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
        .patch(requireAuth, jsonParser, (req, res, next) => {
            const { post_title, post_content} = req.body
            const postToUpdate = { post_title, post_content}

            const numberOfValues = Object.values(postToUpdate).filter(Boolean).length
            if (numberOfValues === 0) {
                res.status(400).jsson({
                    error: {
                        message: `Request must contain  'post title', and 'post content'`
                    }
                })
            }

            PostsService.updatePost(
                req.app.get('db'),
                req.params.post_id,
                postToUpdate
            )
                .then(numRowsAffected => {
                    res.status(204).end()
                })
                .catch(next)
        })



    module.exports = postsRouter;