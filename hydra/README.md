# ORY Hydra and User Login & Consent Reference Implementation

This example sets up ORY Hydra and our [User Login and Consent reference implementation](https://github.com/ory/hydra-login-consent-node).
It works very similar to the other examples as it provides a custom Dockerfile and loads supervisord in order to import
the ORY Hydra clients.

```
$ make pull
$ make start-hydra
```

To perform - for example - the OAuth 2 Authorize Code Flow, install ORY Hydra >= 1.0.0 locally and run:

```
$ hydra token user --client-id example-auth-code --client-secret secret --endpoint http://localhost:4444
```
