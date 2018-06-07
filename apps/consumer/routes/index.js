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
    valid: process.env.BACKEND_WARDEN_TOKEN_URL,
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
const makeRequest = (url, authorization, response) => fetch(url, {
  headers: { Authorization: 'bearer ' + authorization }
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
      accessToken: req.user.accessToken, backends,
      valid: { body: '' }, invalid: { body: '' }, empty: { body: '' },
      url: backends.introspect
    }

    // Let's make a request to the backend with the access token
    await makeRequest(backends.introspect, req.user.accessToken, data.valid)

    // Let's make a request without a token
    await makeRequest(backends.introspect, '', data.empty)

    // Let's make a request without a random (invalid) JSON Web Token
    await makeRequest(backends.introspect, 'invalid-token', data.invalid)

    res.render('articles/secure-backend-with-oauth2-token-introspection', data)
  })

router.get('/articles/secure-backend-with-ory-oathkeeper',
  checkAuthentication,
  async (req, res, next) => {
    const data = {
      accessToken: req.user.accessToken, backends,
      valid: { body: '' }, invalid: { body: '' }, empty: { body: '' },
      url: backends.oathkeeper
    }

    // Let's make a request to the backend with the access token
    await makeRequest(backends.oathkeeper, req.user.accessToken, data.valid)

    // Let's make a request without a token
    await makeRequest(backends.oathkeeper, '', data.empty)

    // Let's make a request without a random (invalid) JSON Web Token
    await makeRequest(backends.oathkeeper, 'eyJhbGciOiJIUzI1NiIsImtpZCI6InB1YmxpYzoxYTE4NmYyNS1kODgyLTQ3NDEtYjI4Mi1jZWFkMDhmNjkzZTMiLCJ0eXAiOiJKV1QifQ.eyJhdWQiOlsidGVzdC1jbGllbnQiLCJ0ZXN0LWNsaWVudCJdLCJhdXRoX3RpbWUiOjE1Mjc1OTMwNzksImNfaGFzaCI6ImI4T0N1bDF5dUl6akZBSDN1WFBZNlEiLCJleHAiOjE1Mjc1OTY3MjEsImlhdCI6MTUyNzU5MzEyMiwiaXNzIjoiaHR0cHM6Ly9vaWRjLWNlcnRpZmljYXRpb24ub3J5LnNoOjg0NDMvIiwianRpIjoiZDc5ODI0M2ItMGYzNy00MTJkLWEwZjUtZWQ0OGI0YWVjMDQxIiwibm9uY2UiOiJqUkppV3o5WGVheXhNa3VMIiwicmF0IjoxNTI3NTkzMTIwLCJzdWIiOiJmb29AYmFyLmNvbSJ9.GD33KZ7rTDDyqsPpXRCZODuf3r6oqtcH48bs5jsK-BI', data.invalid)

    res.render('articles/secure-backend-with-ory-oathkeeper', data)
  })

// This endpoint initializes the OAuth2 request
router.get('/auth', passport.authenticate('oauth2'))

// This endpoint handles OAuth2 requests (exchanges code for token)
router.get('/auth/callback', passport.authenticate('oauth2'), (req, res, next) => {
  // After success, redirect to the page we came from originally
  res.redirect(req.session.redirectTo)
})

module.exports = router
