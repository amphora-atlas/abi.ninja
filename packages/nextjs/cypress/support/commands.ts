/// <reference types="cypress" />
import { HEIMDALL_API_URL } from "~~/utils/constants";

Cypress.Commands.add("wakeUpHeimdall", () => {
  const contractAddress = "0x759c0e9d7858566df8ab751026bedce462ff42df";
  const rpcUrl = "1rpc.io/sepolia";

  cy.request({
    method: "GET",
    url: `${HEIMDALL_API_URL}/${contractAddress}?rpc_url=${rpcUrl}`,
    failOnStatusCode: false,
    timeout: 30000,
  }).then(response => {
    cy.log(`Decompilation backend wake-up call completed with status: ${response.status}`);
  });
});

Cypress.Commands.add("visitContract", (contractAddress: string, chainId: string, encodedAbi?: string) => {
  const url = encodedAbi
    ? `http://localhost:3000/${contractAddress}/${chainId}/${encodedAbi}`
    : `http://localhost:3000/${contractAddress}/${chainId}`;
  cy.visit(url);
});

Cypress.Commands.add("interactWithMethod", (methodName: string, inputValue: string) => {
  cy.contains(methodName).click();
  cy.get('input[placeholder="address"]').type(inputValue);
  cy.get("button").contains("Read 📡").click();
  cy.get("body").should("contain", "Result:");
});

export {};
