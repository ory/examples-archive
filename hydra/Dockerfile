ARG HYDRA_VERSION

FROM oryd/hydra:$HYDRA_VERSION

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

# This is the ORY Hydra port
EXPOSE 4444

COPY --from=0 /usr/bin/hydra /usr/bin/hydra

RUN pip install supervisor-stdout

ADD supervisord.conf /etc/supervisor/conf.d/supervisord.conf

ADD ./config/ /config/

VOLUME /scripts

ENTRYPOINT ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
