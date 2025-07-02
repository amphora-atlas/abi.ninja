/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to wake up the heimdall-rs backend.
     * @example cy.wakeUpHeimdall()
     */
    wakeUpHeimdall(): Chainable<void>;

    /**
     * Custom command to visit a contract directly via URL path parameters.
     * @example cy.visitContract('0x1234...', '1', 'encodedAbi')
     */
    visitContract(contractAddress: string, chainId: string, encodedAbi?: string): Chainable<void>;

    /**
     * Custom command to interact with a specific contract method.
     * @example cy.interactWithMethod('balanceOf', '0x1234...')
     */
    interactWithMethod(methodName: string, inputValue: string): Chainable<void>;
  }
}
