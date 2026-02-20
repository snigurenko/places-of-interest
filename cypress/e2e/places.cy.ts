describe('Places of Interest App', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  describe('Initial load', () => {
    it('renders the app layout with sidebar and map', () => {
      cy.get('.sidebar').should('be.visible')
      cy.get('.map-area').should('be.visible')
      cy.get('.map-container').should('be.visible')
    })

    it('displays the app title', () => {
      cy.get('.search-title').should('contain.text', 'Places of Interest')
    })

    it('populates the search input with the default location', () => {
      cy.get('.search-bar input').should('have.value', 'Alicante')
    })

    it('performs a default search on load and shows results', () => {
      cy.get('.info', { timeout: 15000 }).should('be.visible')
      cy.get('.info').should('contain.text', 'places near')
      cy.get('.info').should('contain.text', 'Alicante')
    })

    it('renders place cards after default search', () => {
      cy.get('.place-card', { timeout: 15000 }).should('have.length.greaterThan', 0)
    })

    it('shows "Results" header when places are loaded', () => {
      cy.get('.list-header', { timeout: 15000 }).should('contain.text', 'Results')
    })
  })

  describe('Search functionality', () => {
    it('searches for a new location via Enter key', () => {
      cy.get('.search-bar input').clear().type('Barcelona{enter}')
      cy.get('.info', { timeout: 15000 }).should('contain.text', 'Barcelona')
      cy.get('.place-card').should('have.length.greaterThan', 0)
    })

    it('searches for a new location via button click', () => {
      cy.get('.search-bar input').clear().type('Madrid')
      cy.get('.search-bar button').click()
      cy.get('.info', { timeout: 15000 }).should('contain.text', 'Madrid')
    })

    it('disables input and shows loader while searching', () => {
      cy.get('.search-bar input').clear().type('Paris{enter}')
      cy.get('.search-bar input').should('be.disabled')
      cy.get('.info', { timeout: 15000 }).should('be.visible')
    })

    it('shows skeleton placeholders while loading', () => {
      cy.get('.search-bar input').clear().type('London{enter}')
      cy.get('.skeleton-list').should('exist')
      cy.get('.place-card', { timeout: 15000 }).should('have.length.greaterThan', 0)
    })

    it('keeps search button disabled when input is blank', () => {
      cy.get('.search-bar input').clear().type('   ')
      cy.get('.search-bar button').should('be.disabled')
    })

    it('shows error for invalid location', () => {
      cy.get('.search-bar input').clear().type('xyznonexistent12345{enter}')
      cy.get('.error', { timeout: 15000 }).should('be.visible')
      cy.get('.error').should('contain.text', 'not found')
    })
  })

  describe('Place cards', () => {
    beforeEach(() => {
      cy.get('.place-card', { timeout: 15000 }).should('have.length.greaterThan', 0)
    })

    it('each card displays a name and category', () => {
      cy.get('.place-card').first().within(() => {
        cy.get('.name').should('not.be.empty')
        cy.get('.category').should('not.be.empty')
      })
    })

    it('highlights a card when clicked', () => {
      cy.get('.place-card').first().click()
      cy.get('.place-card.active').should('have.length', 1)
    })
  })

  describe('Place detail modal', () => {
    beforeEach(() => {
      cy.get('.place-card', { timeout: 15000 }).should('have.length.greaterThan', 0)
    })

    it('opens modal when a place card is clicked', () => {
      cy.get('.place-card').first().click()
      cy.get('.modal', { timeout: 10000 }).should('be.visible')
      cy.get('.modal h2').should('not.be.empty')
    })

    it('displays category badges in the modal', () => {
      cy.get('.place-card').first().click()
      cy.get('.modal', { timeout: 10000 }).should('be.visible')
      cy.get('.modal .badge').should('have.length.greaterThan', 0)
    })

    it('closes modal when close button is clicked', () => {
      cy.get('.place-card').first().click()
      cy.get('.modal', { timeout: 10000 }).should('be.visible')
      cy.get('.modal .close').click()
      cy.get('.modal').should('not.exist')
    })

    it('closes modal when clicking the overlay', () => {
      cy.get('.place-card').first().click()
      cy.get('.modal', { timeout: 10000 }).should('be.visible')
      cy.get('.overlay').click('topRight')
      cy.get('.modal').should('not.exist')
    })
  })

  describe('Map', () => {
    it('renders the Mapbox map canvas', () => {
      cy.get('.map-container', { timeout: 10000 }).should('be.visible')
      cy.get('.mapboxgl-canvas', { timeout: 10000 }).should('exist')
    })

    it('shows map markers after places load', () => {
      cy.get('.place-card', { timeout: 15000 }).should('have.length.greaterThan', 0)
      cy.get('.map-marker', { timeout: 10000 }).should('have.length.greaterThan', 0)
    })
  })
})
