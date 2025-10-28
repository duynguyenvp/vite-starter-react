describe('Page3 - Counter', () => {
  // Note: make sure your dev server is running (vite) at http://localhost:5173
  // either set Cypress baseUrl in cypress config or use the full URL below.

  const url = Cypress.config('baseUrl') ?? 'http://localhost:5173';

  it('shows initial value and increments/decrements', () => {
    cy.visit(`${url}/page3`);

    // assert initial value (Page3 renders Counter with initialValue={10})
    cy.get('[data-testid="count-value"]').should('have.text', '10');

    // increment
    cy.get('[data-testid="increment-button"]').click();
    cy.get('[data-testid="count-value"]').should('have.text', '11');

    // decrement twice
    cy.get('[data-testid="decrement-button"]').click();
    cy.get('[data-testid="decrement-button"]').click();
    cy.get('[data-testid="count-value"]').should('have.text', '9');
  });

  it('buttons are accessible and visible', () => {
    cy.visit(`${url}/page3`);
    cy.get('[data-testid="increment-button"]').should('be.visible').and('have.attr', 'aria-label', 'Increase count');
    cy.get('[data-testid="decrement-button"]').should('be.visible').and('have.attr', 'aria-label', 'Decrease count');
  });
});