FROM cypress/base:10

WORKDIR /app

ADD package.json /app/package.json
ADD package-lock.json /app/package-lock.json

RUN npm ci

ADD cypress.json cypress.json
ADD cypress cypress

CMD ["/bin/sh"]
