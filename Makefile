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

start-hydra-bc:
		docker pull oryd/oathkeeper-preview:latest
		docker pull oryd/hydra-preview:latest
		docker pull oryd/keto:latest
		cd hydra-bc; LOGIN_CONSENT_VERSION=latest HYDRA_VERSION=latest KETO_VERSION=latest OATHKEEPER_VERSION=latest docker-compose up --build -d

restart-hydra-bc:
		docker pull oryd/oathkeeper-preview:latest
		docker pull oryd/hydra-preview:latest
		docker pull oryd/keto:latest
		cd hydra-bc; LOGIN_CONSENT_VERSION=latest HYDRA_VERSION=latest KETO_VERSION=latest OATHKEEPER_VERSION=latest docker-compose restart

kill-hydra-bc:
		docker pull oryd/oathkeeper-preview:latest
		docker pull oryd/hydra-preview:latest
		docker pull oryd/keto:latest
		cd hydra-bc; LOGIN_CONSENT_VERSION=latest HYDRA_VERSION=latest KETO_VERSION=latest OATHKEEPER_VERSION=latest docker-compose kill

reset-hydra-bc:
		docker pull oryd/oathkeeper-preview:latest
		docker pull oryd/hydra-preview:latest
		docker pull oryd/keto:latest
		cd hydra-bc; LOGIN_CONSENT_VERSION=latest HYDRA_VERSION=latest KETO_VERSION=latest OATHKEEPER_VERSION=latest docker-compose kill
		cd hydra-bc; LOGIN_CONSENT_VERSION=latest HYDRA_VERSION=latest KETO_VERSION=latest OATHKEEPER_VERSION=latest docker-compose rm -f
		cd hydra-bc; LOGIN_CONSENT_VERSION=latest HYDRA_VERSION=latest KETO_VERSION=latest OATHKEEPER_VERSION=latest docker-compose up --build -d

start-hko:
		docker pull oryd/oathkeeper-preview:latest
		docker pull oryd/hydra-preview:latest
		docker pull oryd/keto:latest
		cd hydra-keto-oathkeeper; LOGIN_CONSENT_VERSION=latest HYDRA_VERSION=latest KETO_VERSION=latest OATHKEEPER_VERSION=latest docker-compose up --build -d

restart-hko:
		docker pull oryd/oathkeeper-preview:latest
		docker pull oryd/hydra-preview:latest
		docker pull oryd/keto:latest
		cd hydra-keto-oathkeeper; LOGIN_CONSENT_VERSION=latest HYDRA_VERSION=latest KETO_VERSION=latest OATHKEEPER_VERSION=latest docker-compose restart

kill-hko:
		docker pull oryd/oathkeeper-preview:latest
		docker pull oryd/hydra-preview:latest
		docker pull oryd/keto:latest
		cd hydra-keto-oathkeeper; LOGIN_CONSENT_VERSION=latest HYDRA_VERSION=latest KETO_VERSION=latest OATHKEEPER_VERSION=latest docker-compose kill

reset-hko:
		docker pull oryd/oathkeeper-preview:latest
		docker pull oryd/hydra-preview:latest
		docker pull oryd/keto:latest
		cd hydra-keto-oathkeeper; LOGIN_CONSENT_VERSION=latest HYDRA_VERSION=latest KETO_VERSION=latest OATHKEEPER_VERSION=latest docker-compose kill
		cd hydra-keto-oathkeeper; LOGIN_CONSENT_VERSION=latest HYDRA_VERSION=latest KETO_VERSION=latest OATHKEEPER_VERSION=latest docker-compose rm -f
		cd hydra-keto-oathkeeper; LOGIN_CONSENT_VERSION=latest HYDRA_VERSION=latest KETO_VERSION=latest OATHKEEPER_VERSION=latest docker-compose up --build -d
