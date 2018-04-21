build-dev:
    docker build -t oryd/hydra:latest $GOPATH/src/github.com/ory/hydra/
    docker build -t oryd/oathkeeper:latest $GOPATH/src/github.com/ory/oathkeeper/
    docker build -t oryd/keto:latest $GOPATH/src/github.com/ory/keto/
