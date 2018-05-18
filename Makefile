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

pull:
		docker pull oryd/oathkeeper-preview:latest
		docker pull oryd/hydra-preview:latest
		docker pull oryd/keto:latest

###

start-hydra-bc:
		cd hydra-bc; LOGIN_CONSENT_VERSION=latest HYDRA_VERSION=latest KETO_VERSION=latest OATHKEEPER_VERSION=latest docker-compose up --build -d

restart-hydra-bc:
		cd hydra-bc; LOGIN_CONSENT_VERSION=latest HYDRA_VERSION=latest KETO_VERSION=latest OATHKEEPER_VERSION=latest docker-compose restart

rm-hydra-bc:
		cd hydra-bc; LOGIN_CONSENT_VERSION=latest HYDRA_VERSION=latest KETO_VERSION=latest OATHKEEPER_VERSION=latest docker-compose kill
		cd hydra-bc; LOGIN_CONSENT_VERSION=latest HYDRA_VERSION=latest KETO_VERSION=latest OATHKEEPER_VERSION=latest docker-compose rm -f

reset-hydra-bc: rm-hydra-bc start-hydra-bc

###

start-hko:
		cd hydra-keto-oathkeeper; LOGIN_CONSENT_VERSION=latest HYDRA_VERSION=latest KETO_VERSION=latest OATHKEEPER_VERSION=latest docker-compose up --build -d

restart-hko:
		cd hydra-keto-oathkeeper; LOGIN_CONSENT_VERSION=latest HYDRA_VERSION=latest KETO_VERSION=latest OATHKEEPER_VERSION=latest docker-compose restart

rm-hko:
		cd hydra-keto-oathkeeper; LOGIN_CONSENT_VERSION=latest HYDRA_VERSION=latest KETO_VERSION=latest OATHKEEPER_VERSION=latest docker-compose kill
		cd hydra-keto-oathkeeper; LOGIN_CONSENT_VERSION=latest HYDRA_VERSION=latest KETO_VERSION=latest OATHKEEPER_VERSION=latest docker-compose rm -f

reset-hko: rm-hko start-hko

###

start-hydra:
		cd hydra; LOGIN_CONSENT_VERSION=latest HYDRA_VERSION=latest docker-compose up --build -d

restart-hydra:
		cd hydra; LOGIN_CONSENT_VERSION=latest HYDRA_VERSION=latest docker-compose restart

rm-hydra:
		cd hydra; LOGIN_CONSENT_VERSION=latest HYDRA_VERSION=latest docker-compose kill
		cd hydra; LOGIN_CONSENT_VERSION=latest HYDRA_VERSION=latest docker-compose rm -f

reset-hydra: rm-hydra start-hydra
