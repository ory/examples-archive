ARG HYDRA_VERSION
ARG KETO_VERSION
ARG OATHKEEPER_VERSION

FROM oryd/hydra:$HYDRA_VERSION
FROM oryd/keto:$KETO_VERSION
FROM oryd/oathkeeper:$OATHKEEPER_VERSION

FROM alpine:3.7

ARG SETUP_EXAMPLE
ENV ENV_SETUP_EXAMPLE=$SETUP_EXAMPLE
ENV BUILD_DEPS="gettext"  \
    RUNTIME_DEPS="libintl"

RUN set -x && \
    apk add --update $RUNTIME_DEPS && \
    apk add --virtual build_deps $BUILD_DEPS &&  \
    cp /usr/bin/envsubst /usr/local/bin/envsubst && \
    apk del build_deps

RUN apk add --no-cache supervisor bash curl

# This is the ORY Hydra port
EXPOSE 4444

# This is the ORY Oathkeeper Proxy port
EXPOSE 4455

# This is the ORY Oathkeeper API port
EXPOSE 4456

# This is the ORY Keto port
EXPOSE 4466

COPY --from=0 /usr/bin/hydra /usr/bin/hydra
COPY --from=1 /usr/bin/keto /usr/bin/keto
COPY --from=2 /usr/bin/oathkeeper /usr/bin/oathkeeper

ADD supervisord.conf /etc/supervisor/conf.d/supervisord.conf
ADD . /tmp/
RUN chmod -R a=+x /tmp/scripts/

RUN mv "/tmp/${ENV_SETUP_EXAMPLE}/config" /tmp/config

ENTRYPOINT ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
