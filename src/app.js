require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')

const app = express()

const morganOption = (NODE_ENV === 'production')
    ? 'tiny'
    : 'common';

const path = require('path') 
let root = path.join(__dirname, '..', 'build/') 
app.use(express.static(root))
app.use(morgan(morganOption))
app.use(cors())
app.use(helmet())

app.get('/', (req, res) => {
    res.send('dream-dogs/index.html')
})

app.get('/manifest.json', (req, res) => {
    res.json({
        "short_name": "Dream Dogs",
        "manifest_version": 2,
        "version": "one",
        "name": "Dream Dogs App",
        "icons": [
          {
            "src": "dog.ico",
            "sizes": "64x64 32x32 24x24 16x16",
            "type": "image/x-icon"
          }
        ],
        "start_url": "./index.html",
        "display": "standalone",
        "theme_color": "#000000",
        "background_color": "#ffffff"
      })
})

app.use(function errorHandler(error, req, res, next) {
    let response;
    if (NODE_ENV === 'production') {
        response = { error: {message: 'server error'} }
    }
    else {
        console.error(error)
        response = { message: error.message, error}
    }
    res.status(500).json(response)
})

module.exports = app