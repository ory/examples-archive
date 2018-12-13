import { checkApi, urls } from "../common";

describe('environment', () => {
  it('should be able to fetch all the data from hydra', () => {
    expect(checkApi(`${urls.hydraAdmin}/clients`, 'client_id', ['subjects:hydra:clients:oathkeeper-client', 'consumer-app', 'example-auth-code', 'example-auth-code'])).to.be.empty
  })
  it('should be able to fetch all the data from oathkeeper', () => {
    expect(checkApi(`${urls.oathkeeperApi}/rules`, 'id', ['resources:oathkeeper:rules:resource-server-oathkeeper'])).to.be.empty
  })
  it('should be able to fetch all the data from keto', () => {
    expect(checkApi(`${urls.keto}/engines/acp/ory/exact/policies`, 'id', ['resources:keto:policies:peter-blog'])).to.be.empty
  })
})
