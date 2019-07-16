const path = require('path')
const express = require('express')
const xss = require('xss')
const CommentsService = require('./comments-service')
const { requireAuth } = require('../middleware/auth')

const commentsRouter = express.Router()
const jsonParser = express.json()

const serializeComment = comment => ({
    id: comment.id,
    comment: xss(comment.comment),
    post_id: comment.post_id,
    owner: comment.owner
})

commentsRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        CommentsService.getAllComments(knexInstance)
            .then(comments => {
                res.json(comments.map(serializeComment))
            })
            .catch(next)
    })
    .post(requireAuth, jsonParser, (req, res, next) => {
        const owner = req.user.id
        const { comment, post_id } = req.body
        const newComment = { comment, post_id, owner }  
        
        for (const [key, value] of Object.entries(newComment))
            if (value == null) 
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body`}
                })


        CommentsService.insertComment(
            req.app.get('db'),
            newComment
        )
            .then(comment => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${comment.id}`))
                    .json(serializeComment(comment))
            })
            .catch(next)
    })


    commentsRouter
        .route('/:postId')
        .get(requireAuth, (req, res, next) => {
            const knexInstance = req.app.get('db');
            CommentsService.getById(knexInstance, req.params.postId)
                .then(comments => {
                    if (!comments) {
                        return res.status(404).json({
                            error: { message: `Post doesn't exist` }
                        })
                    }
                    res.json(comments)
                    next()
                })
                .catch(next)
        })

    module.exports = commentsRouter