describe('Compra E2E', () => {
  const EMAIL = 'nico@gmail.com'
  const PASSWORD = 'abc'
  const SELLER_EMAIL = 'santiago@gmail.com'
  const SELLER_PASSWORD = 'abc'

  it('flujo de compra completo', () => {
    // Estado limpio y abrir la app
    cy.clearLocalStorage()
    cy.visit('http://localhost:3000')

    // --- LOGIN como VENDEDOR (santiago) y actualizar stock ---
    cy.get('.subbar').find('.login-button').contains('Iniciar sesión').should('be.visible').click()

    cy.get('.login-modal-overlay').should('exist')
    cy.get('.login-modal-content').should('be.visible').within(() => {
      cy.get('input[type="email"]').should('be.visible').clear({ force: true }).type(SELLER_EMAIL)
      cy.get('input[type="password"]').should('be.visible').clear({ force: true }).type(SELLER_PASSWORD)
      cy.contains('button', 'Iniciar sesión').click()
    })

    // Verificar que el vendedor quedó en localStorage
    cy.window({ timeout: 10000 }).its('localStorage').should((ls) => {
      const raw = ls.getItem('user')
      expect(raw).to.not.be.null
      const parsed = JSON.parse(raw)
      expect(parsed.displayName).to.be.a('string')
    })

    // Ir a 'Mis productos' en la subbar
    cy.get('.subbar').contains(/mis productos/i).click({ force: true })

    // Ubicar el Honda Civic y actualizar stock (responder al prompt con 10)
    cy.contains(/Honda Civic/i, { timeout: 10000 }).should('be.visible')
    // Stubear window.prompt antes de hacer click en el botón que lo dispara
    cy.window().then((win) => {
      cy.stub(win, 'prompt').returns('10')
    })
    // Click en el botón 'Actualizar stock' (manejar variantes de texto)
    cy.contains(/actualiz(ar|a)r stock|actualzar stock|actualizar/i).first().click({ force: true })

    // Cerrar sesión del vendedor: abrir el menú de cuenta y hacer logout
    cy.get('.subbar').contains(/santiago/i).click({ force: true })
    cy.contains(/cerrar sesi[oó]n|cerrar sesión|logout/i).click({ force: true })

    // --- LOGIN (mismo flujo que en login.cy.js) para el comprador ---
    cy.get('.subbar').find('.login-button').contains('Iniciar sesión').should('be.visible').click()

    cy.get('.login-modal-overlay').should('exist')
    cy.get('.login-modal-content').should('be.visible').within(() => {
      cy.get('input[type="email"]').should('be.visible').clear({ force: true }).type(EMAIL)
      cy.get('input[type="password"]').should('be.visible').clear({ force: true }).type(PASSWORD)
      cy.contains('button', 'Iniciar sesión').click()
    })

    cy.window({ timeout: 10000 }).its('localStorage').should((ls) => {
      const raw = ls.getItem('user')
      expect(raw).to.not.be.null
      const parsed = JSON.parse(raw)
      expect(parsed.displayName).to.be.a('string')
    })

    cy.get('.subbar').find('.utilities-text').should('exist')

    // --- NAVEGAR A CATEGORÍAS y seleccionar 'vehiculo' ---
    cy.get('.subbar').contains(/categor/i).click()
    cy.contains(/veh[ií]culo/i).click()

    // --- SELECCIONAR producto 'Honda Civic' y ver detalles ---
    // Primero intentar localizar el producto por texto y abrir detalle
    cy.contains(/Honda Civic/i, { timeout: 10000 }).should('be.visible').then(($el) => {
      // Si el texto está dentro de una tarjeta, intentar hacer click en la tarjeta
      cy.wrap($el).click({ force: true })
    })

    // Asegurarse de que haya un botón 'Ver detalles' y clickearlo (fallback)
    cy.contains(/ver detalles/i).click({ force: true })

    // --- Incrementar cantidad a 2 y agregar al carrito ---
    // Buscar controles de cantidad y botón '+' dentro de la vista de detalle
    cy.get('main, .product-detail, .product-details, .details').first().within(() => {
      // Pulsar '+' dos veces (puede haber un solo botón con texto '+')
      cy.contains('button', '+').click({ force: true })
      cy.contains(/agregar a carrito/i).click({ force: true })
    })

    // --- Abrir carrito desde la navbar y finalizar compra ---
    cy.get('header').find('[data-testid="cart-icon"], .cart-icon, .cart, .shopping-cart, .nav-cart, button[aria-label="cart"], button[aria-label="Carrito"]').first().click({ force: true })

    // Click al botón de finalizar usando su clase/selector (input)
    cy.get('input.botonFinalizarCompra, .botonFinalizarCompra', { timeout: 10000 }).should('be.visible').click({ force: true })
    // --- Rellenar formulario de información de entrega con datos random ---
    const rnd = Date.now().toString().slice(-6)

    // Localizar un formulario; rellenar todos los inputs textuales visibles
    cy.get('form').first().within(() => {
      cy.get('input[type="text"], input[type="email"], input[type="number"], textarea').then(($inputs) => {
        if ($inputs.length > 0) {
          const values = [
            `Ecuador`,
            `Valencia`,
            `Eder`,
            `Calle Falsa ${Math.floor(Math.random() * 1000)}`,
            1111,
            '2022',
          ]
          Cypress._.forEach($inputs, (el, idx) => {
            const v = values[idx] || `valor${rnd}`
            cy.wrap(el).clear({ force: true }).type(v, { force: true })
          })
        } else {
          // Fallback si no hay inputs visibles con esos selectores
          cy.get('input[name="nombre"]').type(`Nombre ${rnd}`, { force: true })
          cy.get('input[name="telefono"]').type(`+54911${rnd}`, { force: true })
          cy.get('input[name="direccion"]').type(`Calle Falsa ${Math.floor(Math.random() * 1000)}`, { force: true })
        }
      })

      // Enviar pedido
      cy.contains(/enviar pedido|enviar/i).click({ force: true })
    })

    // --- Verificar confirmación del pedido ---
    cy.contains(/pedido|gracias|compra realizada|confirmaci[oó]n/i, { timeout: 10000 }).should('exist')

    // --- LOGOUT del comprador 'nico' ---
    cy.get('.subbar').contains(/nico/i).click({ force: true })
    cy.contains(/cerrar sesi[oó]n|cerrar sesión|logout/i).click({ force: true })

    // --- LOGIN como VENDEDOR nuevamente y gestionar pedido ---
    cy.get('.subbar').find('.login-button').contains('Iniciar sesión').should('be.visible').click()
    cy.get('.login-modal-overlay').should('exist')
    cy.get('.login-modal-content').should('be.visible').within(() => {
      cy.get('input[type="email"]').should('be.visible').clear({ force: true }).type(SELLER_EMAIL)
      cy.get('input[type="password"]').should('be.visible').clear({ force: true }).type(SELLER_PASSWORD)
      cy.contains('button', 'Iniciar sesión').click()
    })

    cy.window({ timeout: 10000 }).its('localStorage').should((ls) => {
      const raw = ls.getItem('user')
      expect(raw).to.not.be.null
    })

    // Ir a 'Mis pedidos' en la subbar
    cy.get('.subbar').contains(/mis pedidos/i).click({ force: true })

    // Función helper: click en el último icono 'lapiz' (editar)
    const clickLastPencil = () => {
      cy.get('body').then(($body) => {
        const candidates = $body.find('button:contains("✎"), [title="Editar"], .action-icon edit-btn')
        if (candidates.length) {
          cy.wrap(candidates.eq(candidates.length - 1)).click({ force: true })
        } else {
          // Fallback: intentar con botones con aria-label
          cy.get('button:contains("✎"), [title="Editar"], .action-icon edit-btn').last().click({ force: true })
        }
      })
    }

    // Actualizar estados secuencialmente
    const statusPatterns = [/Confirmado/i, /EnPreparacion/i, /Enviado/i, /Entregado/i]

    statusPatterns.forEach((pattern) => {
      // Abrir editor del último pedido
      clickLastPencil()
      // Seleccionar el botón del estado
    cy.get('.state-menu').should('be.visible').within(() => {
      cy.contains(pattern, { timeout: 5000 }).first().click({ force: true })
    })
      
      // Dar un pequeño descanso para que la UI procese el cambio
      cy.wait(500)
    })
  })
})

