# ORY Ecosystem Deployment Examples

[![CircleCI](https://circleci.com/gh/ory/examples.svg?style=shield)](https://circleci.com/gh/ory/examples)

This repository contains deployment examples and templates for the ORY Ecosystem. This repository does not contain
examples for the [ORY Editor](https://github.com/ory/editor), but ORY Hydra, ORY Oathkeeper, and ORY Keto.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Overview](#overview)
  - [Scripts](#scripts)
- [Examples](#examples)
- [Apps](#apps)
  - [Resource Server](#resource-server)
  - [Consumer Application](#consumer-application)
- [Development](#development)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Overview

Each example typically consists of these parts:

- `docker-compose.yml`: The definition for docker-compose.
- `supervisord.conf`: Configuration for `supervisord` which runs multiple services at once in one Docker container.
- `config`: Contains configuration items (typically JSON files) for OAuth 2.0 Clients, Access Control Policies, and so on.
- `Dockerfile`: A customized Dockerfile that is capable of running `supervisord` as well as each service.

Please be aware that **you can't run multiple examples at once as ports will clash**. Use `make rm-<example-name>` to
kill and remove the containers of a running example before starting up another one.

### Scripts

We wrote several helper scripts capable of:

- Substituting environment variables in JSON files
- Retrying statements on failure
- Importing JSON files to the respective services (ORY Hydra, ORY Keto, ORY Oathkeeper)

You will encounter several environment variables in each `docker-compose.yml` file. These are either used for the
services directly (e.g. `HYDRA_DATABASE_URL`) or are used for variable substitution in the configuration files
(e.g. `HYDRA_SUBJECT_PREFIX`).

Typically, environment variables are prefixed with the service name they are used for - so `HYDRA_DATABASE_URL` is the
`DATABASE_URL` environment variable for ORY Hydra. We use variable substitution in the `supervisord.conf` file to achieve that.

## Examples

This repository provides several examples. Each example is documented in detail in the example's README.

* [Full Stack](./full-stack): This example sets up all ORY services, the exemplary User Login and Consent
Application, the exemplary OAuth 2.0 [Consumer Application](#consumer-application), and an exemplary [Resource Server](#resource-server)
as well as example policies and OAuth 2.0 Clients.
* [Basic ORY Hydra setup](./hydra): This example sets up ORY Hydra and our exemplary User Login and Consent Application.
It is the minimal required set up for ORY Hydra which you can use to start experimenting.
* [Backwards-compatible template](./hydra-bc): This example provides a Docker Image that offers a backwards compatible
(for versions 0.11.0 / 0.10.0) experience by combining ORY Oathkeeper, ORY Keto, and ORY Hydra in the same Docker Image.

## Apps

This repository contains two exemplary applications, both written in NodeJS with Express. The idea here is to show you the different ways you can
authorize requests on both sides (consumer, resource server) and shows the difference in approaches of protecting your services
with ORY Keto, ORY Oathkeeper, ORY Hydra, or any combination of the three.

The application's code has been documented, and we encourage you to read it. Please note that almost all SDKs used (like
Passport.js) are built on open standards such as OAuth 2.0. If you do not write applications in NodeJS you will be able
to find SDKs with similar functionality in other languages.

Please note that the code is making use of some [ES6 features](oauth2.jade), such as arrow functions, as well as
async/await. Additionally, don't be fooled by ~100 Lines of Code. We packed everything in one file so you have a better
time navigating the source code. The most interesting files will be the ones contained in the `routes` directory.
All other files are either boilerplate ExpressJS or HTML views, with minimal changes to the ExpressJS middleware
in each respective `./app.js` file.

### Resource Server

A resource server is an application that, for example, exposes a CRUD API for modifying blog articles.
Resource servers are usually protected - you don't want a hacker to be able to delete all your blog articles -
and require valid credentials (authentication) as well as a certain permission (e.g. alice is allowed to modify this article)
in order to execute the action.

There are different types of credentials (Cookie, JSON Web Token, OAuth 2.0 Access Token, ...) that can be used to protect
a resource server. Therefore, the [resource server](./apps/resource-server) has several different routes:

* [/introspect](./apps/resource-server/routes/introspect.js): This route requires that an OAuth 2.0 Access Token
is included in the HTTP header ([`Authorization: bearer <token>`](https://tools.ietf.org/html/rfc6750)) and uses the
[OAuth 2.0 Token Introspection](https://tools.ietf.org/html/rfc7662) flow to validate the token.
* [/oathkeeper](./apps/resource-server/routes/oathkeeper.js): This route also accepts a bearer token
([`Authorization: bearer <token>`](https://tools.ietf.org/html/rfc6750)) but this time it has to be a JSON Web Token
signed by ORY Oathkeeper.
* [/warden/](./apps/resource-server/routes/warden.js): This route uses the ORY Keto Warden API to check if a request
is allowed to perform the request. It consists of two subroutes:
  * `/warden/access-token`: This endpoint requires an OAuth 2.0 Access Token in the HTTP header
    ([`Authorization: bearer <token>`](https://tools.ietf.org/html/rfc6750)) and checks if the token's subject is allowed
    to perform the requested action using ORY Keto.
  * `/warden/subject`: This endpoint requires HTTP Basic Auth (`Authorization: basic ...`) and checks if the
    provided credentials match the username/password pairs (`peter:password1`, `bob:password2`)
    and if so, asks the ORY Keto Warden API if the user (e.g. `peter`, `bob`, `alice`) is allowed to perform the action.

### Consumer Application

The [consumer application](./apps/consumer) is a web server that fetches data from the backend ("resource server")
and displays it. In this particular case, the application makes requests to different [Resource Server](#resource-server) endpoints.

The consumer application has several routes (e.g. `/articles/secure-backend-with-oauth2-token-introspection`) which use
different endpoints at the [Resource Server](#resource-server). The idea here is to show you the different ways you can
authorize requests on both sides (consumer, resource server).

Some endpoints in the consumer application require a valid OAuth 2.0 Access Token from the user. When accessing one
of those endpoints, you will be redirected to ORY Hydra and asked to login in and grant the application the required
scopes. Make sure to **select all scopes** or the examples might not work.

## Development

In case you wish to develop one of the projects and test them out with the examples here, first build the docker images
for each project:

```
docker build -t oryd/hydra:dev $GOPATH/src/github.com/ory/hydra/
docker build -t oryd/oathkeeper:dev $GOPATH/src/github.com/ory/oathkeeper/
docker build -t oryd/keto:dev $GOPATH/src/github.com/ory/keto/
```

then run Docker Compose in the example you would wish to test and set the version tags to `dev`:

```
$ cd some/example
$ LOGIN_CONSENT_VERSION=v1.0.0-beta.2 HYDRA_VERSION=dev KETO_VERSION=dev OATHKEEPER_VERSION=dev docker-compose up --build -d
```
