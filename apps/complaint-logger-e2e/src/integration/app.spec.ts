import { getGreeting } from '../support/app.po';

describe('complaint-logger', () => {
  beforeEach(() => cy.visit('/'));

  it('should display welcome message', () => {
    getGreeting().contains('Welcome to complaint-logger!');
  });
});
