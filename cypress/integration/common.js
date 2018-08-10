export const checkApi = (url, key, items) => {
  fetch(url).then((res) => res.json()).then((body) => {
    items.forEach((c) => {
      expect(body.filter((item) => item[key] === c)).to.not.be.empty
    })
  })
}

export const urls = {
  hydraAdmin: `http://${process.env.HYDRA_HOST || 'localhost'}:${process.env.HYDRA_ADMIN_PORT || 4445}`,
  oathkeeperApi: `http://${process.env.OATHKEEPER_API_HOST || 'localhost'}:${process.env.OATHKEEPER_API_PORT || 4456}`,
  keto: `http://${process.env.KETO_HOST || 'localhost'}:${process.env.KETO_PORT || 4466}`,
  consumer: `http://${process.env.CONSUMER_HOST || 'localhost'}:${process.env.CONSUMER_PORT || 4477}`
}