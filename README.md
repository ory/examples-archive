# examples

```
docker build -t oryd/hydra:latest $GOPATH/src/github.com/ory/hydra/
docker build -t oryd/oathkeeper:latest $GOPATH/src/github.com/ory/oathkeeper/
docker build -t oryd/keto:latest $GOPATH/src/github.com/ory/keto/
```


```
docker build -t oryd/examples:oauth2-hydra-bc ./oauth2-hydra-bc
docker run oryd/examples:oauth2-hydra-bc
```