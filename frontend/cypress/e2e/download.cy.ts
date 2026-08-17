describe('US02 — téléchargement via lien', () => {
  it('affiche les métadonnées et déclenche le téléchargement', () => {
    cy.intercept('GET', '**/api/files/token/*', {
      statusCode: 200,
      body: {
        name: 'compte-rendu.pdf',
        type: 'application/pdf',
        size: 2048,
        expire_at: new Date(Date.now() + 86400000).toISOString(),
        hasPassword: false,
        expired: false,
      },
    }).as('meta')

    cy.intercept('POST', '**/api/files/token/*/download', {
      statusCode: 200,
      headers: { 'content-type': 'application/pdf' },
      body: 'pdf-bytes',
    }).as('download')

    cy.visit('/download/demo-token')
    cy.wait('@meta')
    cy.contains('compte-rendu.pdf')
    cy.contains('button', 'Télécharger').click()
    cy.wait('@download')
  })

  it('signale un lien expiré', () => {
    cy.intercept('GET', '**/api/files/token/*', {
      statusCode: 200,
      body: {
        name: 'archive.zip',
        type: 'application/zip',
        size: 10,
        expire_at: '2020-01-01T00:00:00.000Z',
        hasPassword: false,
        expired: true,
      },
    })

    cy.visit('/download/expired-token')
    cy.contains("Ce fichier n'est plus disponible en téléchargement car il a expiré.")
  })
})
