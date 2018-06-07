# ORY Ecosystem Deployment Examples

This repository contains deployment examples and templates for the ORY Ecosystem. This repository does not contain
examples for the [ORY Editor](https://github.com/ory/editor), but ORY Hydra, ORY Oathkeeper, and ORY Keto.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Overview](#overview)
  - [Scripts](#scripts)
- [Examples](#examples)
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

### Apps

This repository contains two exemplary applications, both written in NodeJS with Express.

#### Resource Server

A resource server is an application that, for example, exposes a CRUD API for modifying, for example, blog articles.
As such, resource servers are usually protected and require valid credentials (authentication) as well as a certain permission
in order to execute the action.

There are different types of credentials (Cookie, JSON Web Token, OAuth 2.0 Access Token, ...) that can be used to protect
a resource server. Therefore, the [resource server](./apps/resource-server) has three routes:

* [/protected/introspect](./apps/resource-server/routes/introspect): This route requires that an OAuth 2.0 Access Token
is included in the HTTP header ([`Authorization: bearer <token>`](https://tools.ietf.org/html/rfc6750)) and uses the
[OAuth 2.0 Token Introspection](https://tools.ietf.org/html/rfc7662) standard to validate the token.
* [/protected/oathkeeper](./apps/resource-server/routes/oathkeeper): This route also accepts a bearer token
([`Authorization: bearer <token>`](https://tools.ietf.org/html/rfc6750)) but this time it has to be a JSON Web Token
signed by ORY Oathkeeper.
* [/protected/warden/](./apps/resource-server/routes/warden): This route uses the ORY Keto Warden API to check if a request
is allowed to perform the request. It consists of three subroutes:
  * `/protected/warden/access-token`: This endpoint requires an OAuth 2.0 Access Token in the HTTP header
    ([`Authorization: bearer <token>`](https://tools.ietf.org/html/rfc6750)) and checks if the token's subject is allowed
    to perform the requested action.
  * `/protected/warden/subject`: This endpoint requires HTTP Basic Auth (`Authorization: basic ...`) and checks if the
    provided credentials match the username/password pairs (`peter:password1`, `bob:password2`, `alice:password3`)
     and if so, asks the ORY Keto Warden API if the user (e.g. `peter`, `bob`, `alice`) is allowed to perform the action.

#### Consumer

The [consumer application](./apps/consumer) is a web server that fetches data from the "backend"
- for example the [Resource Server](#resource-server) - and displays it. To do that it, for example, is able to request
OAuth 2.0 Access Tokens.

### Docker

* [Full Ecosystem](./hydra-keto-oathkeeper): This example sets up OYR Hydra, ORY Keto, ORY Oathkeeper, an exemplary
user login & consent application as well as a resource server and a client app.
* [ORY Hydra and User Login & Consent Reference Implementation](./hydra): This example sets up OYR Hydra, an exemplary
user login & consent application as well as a resource server and a client app.
* [Backwards Compatible Template for ORY Hydra < 1.0.0](./hydra-bc): This example configures ORY Hydra, ORY Oathkeeper,
and ORY Keto in such a way that the APIs mimic the APIs from versions prior to ORY Hydra 1.0.0. This example will
only be interesting if you were using ORY Hydra beofre the 1.0 release.

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
$ HYDRA_VERSION=dev KETO_VERSION=dev OATHKEEPER_VERSION=dev docker-compose up --build -d
```
