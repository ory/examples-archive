# examples

```
docker build -t oryd/hydra:dev $GOPATH/src/github.com/ory/hydra/
docker build -t oryd/oathkeeper:dev $GOPATH/src/github.com/ory/oathkeeper/
docker build -t oryd/keto:dev $GOPATH/src/github.com/ory/keto/
   ```


```
docker build -t oryd/examples:oauth2-hydra-bc ./oauth2-hydra-bc
docker run oryd/examples:oauth2-hydra-bc
```