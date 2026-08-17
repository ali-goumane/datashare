describe('US01 — upload authentifié', () => {
  const password = 'password12'

  it('génère un lien de partage après téléversement', () => {
    const email = `upload.${Date.now()}@datashare.test`

    cy.visit('/register')
    cy.get('#email').type(email)
    cy.get('#password').type(password)
    cy.get('#confirm').type(password)
    cy.get('[data-testid="register-submit"]').click()
    cy.location('pathname').should('eq', '/espace')

    cy.contains('button', 'Ajouter des fichiers').click()
    cy.get('input[type="file"]').selectFile(
      {
        contents: Cypress.Buffer.from('fichier de test cypress'),
        fileName: 'notes.txt',
        mimeType: 'text/plain',
      },
      { force: true },
    )
    cy.get('[data-testid="upload-submit"]').click()
    cy.contains('Félicitations, ton fichier sera conservé chez nous')
    cy.get('a')
      .contains(/\/download\//)
      .should('exist')
  })
})
