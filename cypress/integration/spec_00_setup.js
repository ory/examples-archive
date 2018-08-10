import { checkApi, urls } from "./common";

describe('environment', () => {
  it('should be able to fetch all the data', () => {
    checkApi(`${urls.hydraAdmin}/clients`, 'client_id', ['subjects:hydra:clients:oathkeeper-client', 'consumer-app', 'example-auth-code', 'example-auth-code'])
    checkApi(`${urls.oathkeeperApi}/rules`, 'id', ['resources:oathkeeper:rules:resource-server-oathkeeper'])
    checkApi(`${urls.keto}/policies`, 'id', ['resources:keto:policies:peter-blog'])
  })
})
