DOCKER_VERSION := $(shell docker --version 2>/dev/null)
DOCKER_COMPOSE_VERSION := $(shell docker-compose --version 2>/dev/null)

all:
ifndef DOCKER_VERSION
    $(error "command docker is not available, please install Docker")
endif
ifndef DOCKER_COMPOSE_VERSION
    $(error "command docker-compose is not available, please install Docker")
endif

build-dev:
		docker build -t oryd/hydra:dev ${GOPATH}/src/github.com/ory/hydra/
		docker build -t oryd/oathkeeper:dev ${GOPATH}/src/github.com/ory/oathkeeper/
		docker build -t oryd/keto:dev ${GOPATH}/src/github.com/ory/keto/

up-dev:
		SETUP_EXAMPLE=oauth2-hydra-bc HYDRA_VERSION=dev KETO_VERSION=dev OATHKEEPER_VERSION=dev docker-compose up --build -d

start-dev: build-dev up-dev