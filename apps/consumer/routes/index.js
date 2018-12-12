const express = require('express')
const router = express.Router()
const refresh = require('passport-oauth2-refresh')
const fetch = require('node-fetch')

const passport = require('passport')
const OAuth2Strategy = require('passport-oauth2')

// We'll use Passort.js to request OAuth 2.0 Access tokens
//
// For more info, go to:
//
//  - http://www.passportjs.org/
//  - https://github.com/jaredhanson/passport-oauth2
//  - https://github.com/fiznool/passport-oauth2-refresh
//
// You can obviously use any OAuth 2.0 Library you want. Passport.js is quite popular in the Node ecosystem.
passport.use('oauth2', new OAuth2Strategy({
    authorizationURL: process.env.OAUTH2_AUTH_URL,
    tokenURL: process.env.OAUTH2_TOKEN_URL,
    clientID: process.env.OAUTH2_CLIENT_ID,
    clientSecret: process.env.OAUTH2_CLIENT_SECRET,
    callbackURL: process.env.OAUTH2_REDIRECT_URL,
    state: true,
    scope: ['offline', 'openid', 'articles.read']
  },
  (accessToken, refreshToken, profile, cb) => cb(null, { accessToken, profile })
))
passport.use('refresh', refresh)

passport.serializeUser((user, done) => {
  done(null, JSON.stringify(user))
})

passport.deserializeUser((user, done) => {
  done(null, JSON.parse(user))
})
// End of Passport.js configuration

// This configuration contains where each backend is located. If a backend is empty, we will not show the link to it on
// the front page.
//
// This is useful because we're using this example app in a couple of different configurations.
const backends = {
  oathkeeper: process.env.BACKEND_OATHKEEPER_URL,
  warden: {
    subject: process.env.BACKEND_WARDEN_SUBJECT_URL,
  },
  introspect: process.env.BACKEND_INTROSPECT_URL
}

// This is a middleware that checks if the user is authenticated. It also remembers the URL so it can be used to
// redirect to it after the user authenticated.
const checkAuthentication = (req, res, next) => {
  // The `isAuthenticated` is available because of Passport.js
  if (!req.isAuthenticated()) {
    req.session.redirectTo = req.url
    res.redirect('/auth')
    return
  }
  next()
}

// A small helper function to make a request to the backend. It includes a bearer token in the request header.
const makeBearerRequest = (url, authorization, response, next) => fetch(url, {
  headers: { Authorization: 'bearer ' + authorization }
}).then((res) => res.ok ? res.json() : res.text())
  .then((body) => {
    response.body = typeof body === 'string' ? body : JSON.stringify(body, null, 2)
  })
  .catch(err => next(err))

const makeBasicRequest = (url, { username, password }, response, next) => fetch(url, {
  headers: {
    Authorization:
      (username + password).length ?
        'basic ' + Buffer.from(username + ":" + password).toString('base64') :
        ''
  }
}).then((res) => res.ok ? res.json() : res.text())
  .then((body) => {
    response.body = typeof body === 'string' ? body : JSON.stringify(body, null, 2)
  })
  .catch(err => next(err))

// This shows the home page.
router.get('/', (req, res, next) => {
  res.render('index', { backends })
})

// This route makes several requests to the resource server. The accessed URL at the resource server is protected
// using the OAuth 2.0 Token Introspection protocol.
router.get('/articles/secure-backend-with-oauth2-token-introspection',
  checkAuthentication,
  async (req, res, next) => {
    const data = {
      pageTitle: 'This endpoint makes requests to a server secured using OAuth 2.0 Token Introspection',
      accessToken: req.user.accessToken, backends,
      valid: { body: '' }, invalid: { body: '' }, empty: { body: '' },
      url: backends.introspect
    }

    // Let's make a request to the backend with the access token
    await makeBearerRequest(backends.introspect, req.user.accessToken, data.valid, next)

    // Let's make a request without a token
    await makeBearerRequest(backends.introspect, '', data.empty, next)

    // Let's make a request without a random (invalid) JSON Web Token
    await makeBearerRequest(backends.introspect, 'invalid-token', data.invalid, next)

    res.render('articles/oauth2', data)
  })

router.get('/articles/secure-backend-with-ory-oathkeeper',
  checkAuthentication,
  async (req, res, next) => {
    const data = {
      pageTitle: 'This endpoint makes requests to a server secured using ORY Oathkeeper',
      accessToken: req.user.accessToken, backends,
      valid: { body: '' }, invalid: { body: '' }, empty: { body: '' },
      url: backends.oathkeeper
    }

    // Let's make a request to the backend with the access token
    await makeBearerRequest(backends.oathkeeper, req.user.accessToken, data.valid, next)

    // Let's make a request without a token
    await makeBearerRequest(backends.oathkeeper, '', data.empty, next)

    // Let's make a request without a random (invalid) bearer token
    await makeBearerRequest(backends.oathkeeper, 'invalid-token', data.invalid, next)

    res.render('articles/oauth2', data)
  })

// This route makes several requests to the resource server. The accessed URL at the resource server is protected
// using the ORY Keto Warden API - and more specifically the Warden Subject Authorization.
router.get('/articles/secure-backend-with-ory-keto',
  // Authentication is not required here because we will use basic authentication in the requests.
  // checkAuthentication,
  async (req, res, next) => {
    const data = {
      pageTitle: 'This endpoint makes requests to a server secured using HTTP Basic Auth and ORY Keto',
      backends,
      peter: { body: '', auth: { username: 'peter', password: 'password1' } },
      bob: { body: '', auth: { username: 'bob', password: 'password2' } },
      empty: { body: '', auth: { username: '', password: '' } },
      url: backends.warden.subject
    }

    // Let's make a request as user peter
    await makeBasicRequest(backends.warden.subject, data.peter.auth, data.peter, next)

    // Let's make a request as user bob
    await makeBasicRequest(backends.warden.subject, data.bob.auth, data.bob, next)

    // Let's make a request without any username/password
    await makeBasicRequest(backends.warden.subject, data.empty.auth, data.empty, next)

    res.render('articles/subject', data)
  })

// This endpoint initializes the OAuth2 request
router.get('/auth', passport.authenticate('oauth2'))

// This endpoint handles OAuth2 requests (exchanges code for token)
router.get('/auth/callback', passport.authenticate('oauth2'), (req, res, next) => {
  // After success, redirect to the page we came from originally
  res.redirect(req.session.redirectTo)
})

module.exports = router
