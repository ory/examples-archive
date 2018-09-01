ARG HYDRA_VERSION
ARG KETO_VERSION
ARG OATHKEEPER_VERSION

FROM oryd/hydra:$HYDRA_VERSION
FROM oryd/keto:$KETO_VERSION
FROM oryd/oathkeeper:$OATHKEEPER_VERSION

FROM alpine:3.7

ENV BUILD_DEPS="gettext"  \
    RUNTIME_DEPS="libintl python3 py-pip supervisor bash curl"

RUN set -x && \
    apk add --no-cache --update $RUNTIME_DEPS && \
    apk add --virtual build_deps $BUILD_DEPS &&  \
    cp /usr/bin/envsubst /usr/local/bin/envsubst && \
    apk del build_deps

RUN pip install --upgrade pip
# RUN apk add --no-cache supervisor bash curl

COPY --from=0 /usr/bin/hydra /usr/bin/hydra
COPY --from=1 /usr/bin/keto /usr/bin/keto
COPY --from=2 /usr/bin/oathkeeper /usr/bin/oathkeeper

RUN pip install supervisor-stdout

# The context of docker-compose is `../` which is why we need to cd back into full-stack
ADD ./full-stack/config /config
ADD ./full-stack/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
# But it allows us to include the scripts directly
ADD ./scripts /scripts

ENTRYPOINT ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
