describe('Login E2E', () => {
  const EMAIL = 'nico@gmail.com'
  const PASSWORD = 'abc'

  it('inicia sesión correctamente y muestra el usuario', () => {

    // Asegurar un estado limpio y abrir la app
    cy.clearLocalStorage();
    cy.visit('http://localhost:3000');

    // Hacer click en el botón de login que está dentro de la barra (subbar)
    cy.get('.subbar').find('.login-button').contains('Iniciar sesión').should('be.visible').click();

    // Esperar a que el modal esté presente y operar dentro de él
    cy.get('.login-modal-overlay').should('exist');
    cy.get('.login-modal-content').should('be.visible').within(() => {
      cy.get('input[type="email"]').should('be.visible').type(EMAIL);
      cy.get('input[type="password"]').should('be.visible').type(PASSWORD);
      cy.contains('button', 'Iniciar sesión').click();
    });

    // Esperar a que localStorage tenga el usuario (backend real) y comprobar
    cy.window().its('localStorage').should((ls) => {
      const raw = ls.getItem('user');
      expect(raw).to.not.be.null;
      const parsed = JSON.parse(raw);
      expect(parsed.displayName).to.be.a('string');
    });

    // Comprobar que en la UI aparece algún texto de usuario en la subbar
    cy.get('.subbar').find('.utilities-text').should('exist');
  });
});