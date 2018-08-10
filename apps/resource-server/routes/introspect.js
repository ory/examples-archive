const express = require('express')
const router = express.Router()
const fetch = require('node-fetch')
const url = require('url')
const qs = require('querystring')

const introspect = (req, res, next) => {
  const body = qs.stringify({ token: req.get('Authorization').replace(/bearer\s/gi, '') })
  return fetch(process.env.OAUTH2_INTROSPECT_URL, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': body.length
    },
    method: 'POST', body
  })
    .then(res => res.ok ? res.json() : Promise.reject(new Error(res.statusText)))
    .then(body => {
      if (!body.active) {
        return next(new Error('Bearer token is not active'))
      } else if (body.token_type && body.token_type !== 'access_token') {
        // ORY Hydra also returns the token type (access_token or refresh_token). Other server's don't do that
        // but it will help us to make sure to only accept access tokens here, not refresh tokens
        return next(new Error('Bearer token is not an access token'))
      }

      req.user = body
      next()
    })
    .catch(err => next(err))
}

router.get('/',
  introspect,
  (req, res, next) => {
    res.json({
      title: 'What an incredible blog post!',
      content: 'This blog post is so interesting, wow! By the way, you have full privileges to read this content as the request has been authorized. Isn\'t that just great? We\'ve even included the user data from the request here! Amazing!',
      author: 'Aeneas Rekkas',
      user: req.user
    })
  })

module.exports = router
