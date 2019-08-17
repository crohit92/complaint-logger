import { getGreeting } from '../support/app.po';

describe('complaint-handler', () => {
  beforeEach(() => cy.visit('/'));

  it('should display welcome message', () => {
    getGreeting().contains('Welcome to complaint-handler!');
  });
});
