describe('US03 / US04 — inscription et connexion', () => {
  const password = 'password12'

  it('crée un compte puis se reconnecte', () => {
    const email = `cypress.${Date.now()}@datashare.test`

    cy.visit('/register')
    cy.get('#email').type(email)
    cy.get('#password').type(password)
    cy.get('#confirm').type(password)
    cy.get('[data-testid="register-submit"]').click()
    cy.location('pathname').should('eq', '/espace')
    cy.contains('Mes fichiers')

    cy.contains('button', 'Déconnexion').click()
    cy.visit('/login')
    cy.get('#email').type(email)
    cy.get('#password').type(password)
    cy.get('[data-testid="login-submit"]').click()
    cy.location('pathname').should('eq', '/espace')
  })
})
