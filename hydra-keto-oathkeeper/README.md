# Full Ecosystem

This boots up all services (ORY Oathkeeper, ORY Hydra, ORY Keto) and creates the respective database schemas.

## Running the Example

Run this example with:

```
$ make pull
$ make start-hko
```

Please be patient. In the background the system will boot a PostgreSQL database, execute SQL migrations for two services, then create
several configuration items. This might take up to 5 minutes, depending on your system. While you wait or when having trouble, you may want
to check `docker logs hydra-bc_postgresd_1`, `docker logs hydra-bc_keto-migrate_1`, `docker logs hydra-bc_oathkeeper-migrate_1`, `docker logs hydra-bc_hydra-migrate_1`,
and `docker logs hydra-bc_services_1`.

Once you are confident that everything is loaded (you're not seeing any error messages), try to run:

```
$ curl http://localhost:4444/clients
$ curl http://localhost:4456/rules
$ curl http://localhost:4466/policies
```

You should see the preconfigured settings and no errors.

To perform the OAuth 2 Authorize Code Flow, install ORY Hydra >= 1.0.0 locally and run:

```
$ hydra token user --client-id example-auth-code --client-secret secret --endpoint http://localhost:4444
```

## Architecture

This example has three docker containers:

* A PostgreSQL database for ORY Hydra, ORY Keto, ORY Oathkeeper.
* Our reference [login and consent provider](https://github.com/ory/hydra-login-consent-node) exposed at port `3000`.
* A docker container runs `supervisord` which is configured to run these services:
  * `hydra serve --dangerous-force-http` which is exposed directly (without access control) at port `4444`.
  * `oathkeeper serve proxy` which is exposed at port `4455`.
  * `oathkeeper serve api` exposed at port `4456`. This endpoint lets you manage ORY Oathkeeper if you need to. Be aware
  that this service is not configured to use the database. Every time you restart the container, you will have to redo
  all changes made.
  * `keto serve` exposed at port `4466` without access control.
  * A script that loads all configuration items from the `./config` directory and imports ORY Hydra OAuth 2.0 Clients, ORY Keto Access Control Policies, and
  ORY Oathkeeper Access Rules to each respective service.

The `./supervisord.conf` contains the configuration for `supervisord`. You can check it out if you want to learn how
each service environment is set up. The supervisor set up needs a few plugins (fail on repeated errors and prefix output logs)
in order to work properly. We'd like to move away from `supervisord` at some point, but for now it's the best tool we
have for the job. On the downside, `python3` and `pip` are installed to execute the plugins.

If you intend to run a system based on this example in production, be aware that none of the ports (except the Oathkeeper Proxy)
should be exposed directly to the open internet, as some of the endpoint expose administrative features.
