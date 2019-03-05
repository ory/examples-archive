import { urls } from '../common'

describe('full-stack', () => {

  it('completes the oathkeeper flow', () => {
    cy.clearCookies()
    cy.visit(urls.consumer)

    cy.get('#oathkeeper').click()

    cy.get('input[type="email"]').type("foo@bar.com")
    cy.get('input[type="password"]').type("foobar")
    cy.get('input[type="submit"]').click()

    cy.get('input[type="checkbox"]').click({ multiple: true })
    cy.get('#remember').click()
    cy.get('input[value="Allow access"]').click()

    cy.get('#with').should('to.contain', 'Congratulations')
    cy.get('#without').should('to.contain', `{"error":{"code":401,"status":"Unauthorized","message":"Access credentials are invalid"}}`)
    cy.get('#invalid').should('to.contain', `{"error":{"code":403,"status":"Forbidden","reason":"Access token introspection says token is not active","message":"Access credentials are not sufficient to access this resource"}}`)
  })

  it('completes the introspection flow', () => {
    cy.clearCookies()
    cy.visit(urls.consumer)

    cy.get('#introspection').click()

    cy.get('input[type="email"]').type("foo@bar.com")
    cy.get('input[type="password"]').type("foobar")
    cy.get('input[type="submit"]').click()

    cy.get('input[type="checkbox"]').click({ multiple: true })

    // We don't want to remember consent or re-running test will fail
    cy.get('#remember').click()
    cy.get('input[value="Allow access"]').click()

    cy.get('#with').should('to.contain', `"title": "What an incredible blog post!",`)
    cy.get('#without').should('to.contain', `<h1>Bearer token is not active</h1>`)
    cy.get('#invalid').should('to.contain', `<h1>Bearer token is not active</h1>`)
  })

  it('completes the keto simple flow', () => {
    cy.clearCookies()
    cy.visit(urls.consumer)

    cy.get('#keto').click()

    cy.get('#peter').should('to.contain', `"title": "What an incredible blog post!",`)
    cy.get('#bob').should('to.contain', `<h1>Request was not allowed</h1>`)
    cy.get('#empty').should('to.contain', `No credentials provided`)
  })
})
