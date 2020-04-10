const fs = require('fs')
const path = require('path')
const express = require('express')
const webpack = require('webpack')
const webpackMiddleware = require('webpack-dev-middleware')
const webpackConfig = require('./webpack.config')

const app = express()
const port = 9001
const publicPath = path.join(__dirname, 'public')
const viewPath = path.join(__dirname, 'views')
const viewEngine = 'ejs'

app.set('views', viewPath)
app.set('view engine', viewEngine)

app.use(express.static(publicPath))
app.use(webpackMiddleware(webpack(webpackConfig), {lazy: true}))

const pages = [
  {
    path: '/hello',
    title: 'Avatar Demo',
  },
  {
    path: '/multiple-files',
    title: 'Multiple File Previews',
  },
  {
    path: '/standalone',
    title: 'Standalone Script',
  },
  {
    path: '/github',
    title: 'GitHub Textarea',
  },
  {
    path: '/form-insert-at',
    title: 'Inserting Text',
  },
  {
    path: '/events',
    title: 'Event Handlers',
  },
  {
    path: '/webcam-photo',
    title: 'Webcam Photo',
  },
]

app.get('/', (req, res) => {
  res.redirect(pages[0].path)
})

app.get('/:page', (req, res, next) => {
  const currentPage = pages.find(page => page.path == req.path)
  res.render(req.params.page, {pages, currentPage})
})

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}/`)
})
