# Full Stack

This boots up all services (ORY Oathkeeper, ORY Hydra, ORY Keto) and creates the respective database schemas. It also
boots the exemplary consumer application and resource server.

## Running the Example

Run this example with:

```
$ make start-full-stack
```

Please be patient. In the background the system will boot a PostgreSQL database, execute SQL migrations for two services, then create
several configuration items. This might take up to 5 minutes, depending on your system. While you wait or when having trouble, you may want
to check `docker logs hydra-bc_postgresd_1`, `docker logs hydra-bc_keto-migrate_1`, `docker logs hydra-bc_oathkeeper-migrate_1`, `docker logs hydra-bc_hydra-migrate_1`,
and `docker logs hydra-bc_services_1`.

Once you are confident that everything is loaded (you're not seeing any error messages), try to run:

```
$ curl http://localhost:4445/clients
$ curl http://localhost:4456/rules
$ curl http://localhost:4466/policies
```

You should see the preconfigured settings and no errors.

To perform the OAuth 2 Authorize Code Flow, install ORY Hydra >= 1.0.0 locally and run:

```
$ hydra token user --client-id example-auth-code --client-secret secret --endpoint http://localhost:4444 --port 5555
```

Next, you should open [http://localhost:4477](http://localhost:4477) and check out the different examples.

## Architecture

This example has three docker containers:

* A PostgreSQL database for ORY Hydra, ORY Keto, ORY Oathkeeper.
* Our reference [login and consent provider](https://github.com/ory/hydra-login-consent-node) exposed at port `3000`.
* `hydra serve all --dangerous-force-http` which is exposed directly (without access control) at port `4444` an dport `4445`.
* `oathkeeper serve proxy` which is exposed at port `4455`.
* `oathkeeper serve api` exposed at port `4456`. This endpoint lets you manage ORY Oathkeeper if you need to. Be aware
  that this service is not configured to use the database. Every time you restart the container, you will have to redo
  all changes made.
* `keto serve` exposed at port `4466` without access control.
* A script that loads all configuration items from the `./config` directory and imports ORY Hydra OAuth 2.0 Clients, ORY Keto Access Control Policies, and
  ORY Oathkeeper Access Rules to each respective service.
* The exemplary consumer application on port `4477`
* The exemplary resource server on port `4478`

If you intend to run a system based on this example in production, be aware that none of the ports (except the Oathkeeper Proxy)
should be exposed directly to the open internet, as some of the endpoint expose administrative features.

## Configuration

This set up loads several configuration files located in [./config](./config):

* OAuth 2.0 Clients for ORY Hydra:
  * `consumer-app.json`: This client allows the [consumer app](../apps/consumer) to request an OAuth 2.0 Access Token
  from the end user.
  * `example-auth-code-flow.json`: This client allows you to run the `hydra token user --client-id example-auth-code --client-secret secret --endpoint http://localhost:4444` command.
  * `introspection-app.json`: This client allows the resource server to perform the OAuth 2.0 Token Introspection flow.
  * `oathkeeper.json`: This client allows ORY Oathkeeper to perform the OAuth 2.0 Token Introspection flow.
  * `keto.json`: This client allows ORY Keto to perform the OAuth 2.0 Token Introspection flow.
* Access Control Policies for ORY Keto:
  * `blog-foobar.json`: This policy allows the user `foo@bar.com` (this is the user from the exemplary login provider) to
  perform `blog:read` on resource `blog:posts:1`. The goal of this policy is to show how the ORY Keto Warden API works
  when implemented at the [resource server](../apps/resource-server).
  * `blog-peter.json`: This is another policy for an exemplary user `peter` and is also used at the exemplary [resource server](../apps/resource-server).
* Access Rules for ORY Oathkeeper:
  * `resource-server.json`: This access rule defines how the [`/oathkeeper` endpoint of the resource server](../apps/resource-server/routes/oathkeeper.js)
  is being accessed.
