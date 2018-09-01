export const checkApi = (url, key, items) => fetch(url)
  .then((res) => res.json())
  .then((body) => Promise.resolve(body.map((b) => b[key]).filter((id) => items.indexOf(id) === -1)))

export const urls = {
  hydraAdmin: `http://${Cypress.env('HYDRA_ADMIN_HOST') || 'localhost'}:${Cypress.env('HYDRA_ADMIN_PORT') || 4445}`,
  oathkeeperApi: `http://${Cypress.env('OATHKEEPER_API_HOST') || 'localhost'}:${Cypress.env('OATHKEEPER_API_PORT') || 4456}`,
  keto: `http://${Cypress.env('KETO_HOST') || 'localhost'}:${Cypress.env('KETO_PORT') || 4466}`,
  consumer: `http://${Cypress.env('CONSUMER_HOST')|| 'localhost'}:${Cypress.env('CONSUMER_PORT') || 4477}`
}
