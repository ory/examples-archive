const express = require('express')
const router = express.Router()
const fetch = require('node-fetch')
const url = require('url')
const qs = require('querystring')

const tokenUrl = url.parse(process.env.OAUTH2_TOKEN_URL)

// We will use simple-oauth2 to perform the client credentials grant. We need to perform that grant because the
// OAuth 2.0 Token Introspection endpoints requires either a valid OAuth 2.0 Client ID and an OAuth 2.0 Client Secret,
// or a valid OAuth 2.0 Access Token.
//
// Because ORY Hydra uses BCrypt to hash OAuth 2.0 Client Secrets, so it's better to use an OAuth 2.0 Access Token when
// performing the OAuth 2.0 Token Introspection flow. Otherwise, the constant password hashing will cause significant
// CPU load.
const oauth2 = require('simple-oauth2').create({
  client: {
    id: process.env.OAUTH2_CLIENT_ID,
    secret: process.env.OAUTH2_CLIENT_SECRET,
  },
  auth: {
    tokenHost: 'http://' + tokenUrl.host,
    tokenPath: tokenUrl.path
  },
  options: {
    bodyFormat: 'form'
  }
})

let token = null

const refresh = () => {
  if (token) {
    if (token.expired()) {
      return token.refresh().then((t) => {
        token = t
        return Promise.resolve()
      })
    }

    return Promise.resolve()
  }

  return oauth2.clientCredentials.getToken()
    .then((result) => {
      token = oauth2.accessToken.create(result)
      return Promise.resolve()
    }).catch((err) => {
      console.error(err)
      return Promise.reject(err)
    })
}

const introspect = (req, res, next) => {
  refresh()
    .then(() => {
      return fetch(process.env.OAUTH2_INTROSPECT_URL, {
        headers: {
          Authorization: 'bearer ' + qs.escape(token.token.access_token),
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': qs.escape(token.token.access_token).length
        },
        method: 'POST',
        body: qs.stringify({ token: req.get('Authorization').replace(/bearer\s/gi, '') })
      })
    })
    .then(res => res.ok ? res.json() : Promise.reject(new Error(res.statusText)))
    .then(body => {
      console.error('body', body)
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
