const path = require('path');
const express = require('express');
const xss = require('xss');
const UsersService = require('./user-service')

const usersRouter = express.Router()
const jsonParser = express.json()

const serializeUser = user => ({
    id: user.id,
    first_name: xss(user.first_name),
    last_name: xss(user.last_name),
    email: xss(user.email),
    password: user.password,
    impact: xss(user.impact),
    money_spent: user.money_spent,
    start_date: user.start_date,
})

usersRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        UsersService.get
    })
    .post(jsonParser, (req, res, next) => {
        const { first_name, last_name, email, password, impact, money_spent } = req.body
        const newUser = { first_name, last_name, email, password, impact, money_spent }

        for (const field of ['first_name', 'last_name', 'email', 'password', 'impact', 'money_spent'])
            if (!req.body[field])
                return res.status(200).json({
                    error: { message: `Missing '${field} in body request`}
                });

        UsersService.insertUser(req.app.get('db'), newUser)
                .then(user => {
                    res 
                        .status(201)
                        .location(path.posix.join(req.originalUrl, `/${user.id}`))
                        .json(serializeUser(user))
                })
                .catch(next) 
    })



usersRouter
    .route('/user')
    .all((req, res, next) => {
        UsersService.getById(
            req.app.get('db'),
            req.user.id
        )
            .then(user => {
                if (!user) {
                    return res.status(404).json({
                        error: { message: `User does not exist` }
                    })
                }
                res.user = user
                next()
            })
            .catch(next)
    })
    .get((req, res, next) => {
        UsersService.getById(
            req.app.get('db'),
            req.user.id
        )
            .then(user => {
                if (!user) {
                    return res.status(404).json({
                        error: { message: `User does not exist` }
                    })
                }
                res.json(user)
                next()
            })
            .catch(next)
    })
    .delete((req, res, next) => {
        UsersService.deleteUser(
            req.app.get('db'),
            req.user.id
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
    })


    module.exports = usersRouter