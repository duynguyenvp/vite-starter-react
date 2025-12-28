import 'cypress-real-events';

describe('Page3 - Decimal Validation Form', () => {
  const url = Cypress.config('baseUrl') ?? 'http://localhost:5173';

  const fields = [
    { name: 'greaterThanOrEqual', valid: '100', invalid: '99', error: 'Giá trị phải >= 100' },
    { name: 'greaterThan', valid: '1', invalid: '0', error: 'Giá trị phải > 0' },
    { name: 'lessThanOrEqual', valid: '1000', invalid: '1001', error: 'Giá trị phải <= 1000' },
    { name: 'lessThan', valid: '499', invalid: '500', error: 'Giá trị phải < 500' },
    { name: 'equals', valid: '50', invalid: '49', error: 'Giá trị phải = 50' },
    { name: 'isPositive', valid: '1', invalid: '-1', error: 'Giá trị phải là số dương' },
    { name: 'isNegative', valid: '-1', invalid: '1', error: 'Giá trị phải là số âm' },
    { name: 'isZero', valid: '0', invalid: '1', error: 'Giá trị phải = 0' },
    {
      name: 'maxDecimalPlaces',
      valid: '1,23',
      invalid: '1,234',
      error: 'Tối đa 2 chữ số thập phân',
    },
    { name: 'min', valid: '10', invalid: '9', error: 'Giá trị phải >= 10' },
    { name: 'max', valid: '100', invalid: '101', error: 'Giá trị phải <= 100' },
    { name: 'range', valid: '50', invalid: '0', error: 'Giá trị phải trong khoảng 1-100' },
    { name: 'combined', valid: '100', invalid: '9', error: 'Giá trị phải >= 10' },
    { name: 'optional', valid: '', invalid: '-1', error: 'Nếu nhập thì phải >= 0' },
  ];

  it('validates all fields in a user flow', () => {
    cy.visit(`${url}/page3`);
    fields.forEach(({ name, invalid, error, valid }) => {
      // Input invalid value and blur
      cy.get(`input[name="${name}"]`).clear().type(invalid, { delay: 100 });
      cy.get('body').click({ force: true }); // blur
      cy.wait(100); // wait for validation
      if (error) {
        cy.contains(error).should('be.visible');
      }
      // Input valid value and blur
      cy.get(`input[name="${name}"]`).clear();
      valid && cy.get(`input[name="${name}"]`).type(valid, { delay: 100 });
      cy.get('body').click({ force: true }); // blur
      cy.wait(100); // wait for validation
      if (error) {
        cy.contains(error).should('not.exist');
      }
    });
  });

  it('submits valid form', () => {
    cy.visit(`${url}/page3`);
    fields.forEach(({ name, valid }) => {
      cy.get(`input[name="${name}"]`).clear().realType(valid);
    });
    cy.contains('Submit').realClick();
    cy.on('window:alert', (txt) => {
      expect(txt).to.contain('Form submitted successfully');
    });
  });

  it('reset button clears all fields', () => {
    cy.visit(`${url}/page3`);
    fields.forEach(({ name, valid }) => {
      cy.get(`input[name="${name}"]`).clear().realType(valid);
    });
    cy.contains('Reset').realClick();
    fields.forEach(({ name }) => {
      cy.get(`input[name="${name}"]`).should('have.value', '');
    });
  });
});
