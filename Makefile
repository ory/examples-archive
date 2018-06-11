DOCKER_VERSION := $(shell docker --version 2>/dev/null)
DOCKER_COMPOSE_VERSION := $(shell docker-compose --version 2>/dev/null)

all:
ifndef DOCKER_VERSION
    $(error "command docker is not available, please install Docker")
endif
ifndef DOCKER_COMPOSE_VERSION
    $(error "command docker-compose is not available, please install Docker")
endif
ifndef ${OATHKEEPER_VERSION}
	OATHKEEPER_VERSION=v1.0.0-beta.2
endif

build-dev:
		docker build -t oryd/hydra:dev ${GOPATH}/src/github.com/ory/hydra/
		docker build -t oryd/oathkeeper:dev ${GOPATH}/src/github.com/ory/oathkeeper/
		docker build -t oryd/keto:dev ${GOPATH}/src/github.com/ory/keto/

###

start-hydra-bc:
		cd hydra-bc; LOGIN_CONSENT_VERSION=v1.0.0-beta.2 HYDRA_VERSION=v1.0.0-beta.2 KETO_VERSION=v1.0.0-beta.2 OATHKEEPER_VERSION=v1.0.0-beta.2 docker-compose up --build -d

restart-hydra-bc:
		cd hydra-bc; LOGIN_CONSENT_VERSION=v1.0.0-beta.2 HYDRA_VERSION=v1.0.0-beta.2 KETO_VERSION=v1.0.0-beta.2 OATHKEEPER_VERSION=v1.0.0-beta.2 docker-compose restart

rm-hydra-bc:
		cd hydra-bc; LOGIN_CONSENT_VERSION=v1.0.0-beta.2 HYDRA_VERSION=v1.0.0-beta.2 KETO_VERSION=v1.0.0-beta.2 OATHKEEPER_VERSION=v1.0.0-beta.2 docker-compose kill
		cd hydra-bc; LOGIN_CONSENT_VERSION=v1.0.0-beta.2 HYDRA_VERSION=v1.0.0-beta.2 KETO_VERSION=v1.0.0-beta.2 OATHKEEPER_VERSION=v1.0.0-beta.2 docker-compose rm -f

reset-hydra-bc: rm-hydra-bc start-hydra-bc

###

start-full-stack:
		cd full-stack; LOGIN_CONSENT_VERSION=v1.0.0-beta.2 HYDRA_VERSION=v1.0.0-beta.2 KETO_VERSION=v1.0.0-beta.2 OATHKEEPER_VERSION=v1.0.0-beta.2 docker-compose up --build -d

restart-full-stack:
		cd full-stack; LOGIN_CONSENT_VERSION=v1.0.0-beta.2 HYDRA_VERSION=v1.0.0-beta.2 KETO_VERSION=v1.0.0-beta.2 OATHKEEPER_VERSION=v1.0.0-beta.2 docker-compose restart

rm-full-stack:
		cd full-stack; LOGIN_CONSENT_VERSION=v1.0.0-beta.2 HYDRA_VERSION=v1.0.0-beta.2 KETO_VERSION=v1.0.0-beta.2 OATHKEEPER_VERSION=v1.0.0-beta.2 docker-compose kill
		cd full-stack; LOGIN_CONSENT_VERSION=v1.0.0-beta.2 HYDRA_VERSION=v1.0.0-beta.2 KETO_VERSION=v1.0.0-beta.2 OATHKEEPER_VERSION=v1.0.0-beta.2 docker-compose rm -f

reset-full-stack: rm-full-stack start-full-stack

###

start-hydra:
		cd hydra; LOGIN_CONSENT_VERSION=v1.0.0-beta.2 HYDRA_VERSION=v1.0.0-beta.2 docker-compose up --build -d

restart-hydra:
		cd hydra; LOGIN_CONSENT_VERSION=v1.0.0-beta.2 HYDRA_VERSION=v1.0.0-beta.2 docker-compose restart

rm-hydra:
		cd hydra; LOGIN_CONSENT_VERSION=v1.0.0-beta.2 HYDRA_VERSION=v1.0.0-beta.2 docker-compose kill
		cd hydra; LOGIN_CONSENT_VERSION=v1.0.0-beta.2 HYDRA_VERSION=v1.0.0-beta.2 docker-compose rm -f

reset-hydra: rm-hydra start-hydra
