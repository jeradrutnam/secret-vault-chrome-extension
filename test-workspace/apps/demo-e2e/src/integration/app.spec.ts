import { getGreeting, getLoginButton } from '../support/app.po';

describe('demo', () => {
  beforeEach(() => cy.visit('/'));

  it('home page should have a login button', () => {
    // Custom command example, see `../support/commands.ts` file
    // cy.login('my-email@something.com', 'myPassword');

    // Function helper example, see `../support/app.po.ts` file
    getLoginButton().click();
  });
});
