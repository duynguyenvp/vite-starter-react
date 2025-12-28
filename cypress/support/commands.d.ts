/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject = JQuery<HTMLInputElement> | any> {
    paste(text: string): Chainable<Subject>;
  }
}

import './commands';

export {};
