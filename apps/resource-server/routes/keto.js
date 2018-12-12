const express = require('express')
const router = express.Router()
const fetch = require('node-fetch')
const basicAuth = require('express-basic-auth')

const wardenSubject = ({ resource, action }) => (req, res, next) => {
  return fetch(process.env.KETO_URL + '/engines/acp/ory/exact/allowed', {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({ resource, action, subject: req.auth.user })
  })
    .then(res => res.ok ? res.json() : Promise.reject(new Error(res.statusText)))
    .then(body => {
      if (!body.allowed) {
        return next(new Error('Request was not allowed'))
      }

      req.user = body
      next()
    })
    .catch(err => next(err))
}

router.get('/subject',
  // Let's add basic auth here
  basicAuth({
    users: {
      'peter': 'password1',
      'bob': 'password2'
    },
    unauthorizedResponse: (req) => req.auth ? ('Credentials ' + req.auth.user + ':' + req.auth.password + ' rejected') : 'No credentials provided'
  }),
  // This middleware takes the username from the basic auth to perform the warden request.
  //
  // We tell the warden that the resource is blog:posts:2 and the action blog:read.
  wardenSubject({
    resource: 'blog:posts:2',
    action: 'blog:read'
  }),
  (req, res, next) => {
    res.json({
      title: 'What an incredible blog post!',
      content: 'This blog post is so interesting, wow! By the way, you have full privileges to read this content as the request has been authorized. Isn\'t that just great? We\'ve even included the user data from the request here! Amazing!',
      author: 'Aeneas Rekkas',
      user: req.auth.user
    })
  })

module.exports = router
