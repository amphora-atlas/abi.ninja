/// <reference types="cypress" />

describe("Decimal Selector Feature", () => {
  it("should display decimal selector buttons and calculate raw values correctly", () => {
    cy.visit("http://localhost:3000/0xde30da39c46104798bb5aa3fe8b9e0e1f348163f/1");

    cy.contains("setValue", { timeout: 10000 }).click();

    cy.contains("18 decimals", { timeout: 10000 }).should("be.visible");
    cy.contains("6 decimals").should("be.visible");
    cy.contains("None").should("be.visible");

    cy.contains("6 decimals").first().click();
    cy.get('input[placeholder="uint128"]').clear().type("100");

    cy.get("body").should("contain", "100,000,000");

    cy.contains("18 decimals").first().click();
    cy.get('input[placeholder="uint128"]').clear().type("1");

    cy.get("body").should("contain", "1,000,000,000,000,000,000");

    cy.contains("None").first().click();
    cy.get('input[placeholder="uint128"]').clear().type("500");

    cy.get("body").should("not.contain", "500,000,000");
  });

  it("should handle edge cases correctly", () => {
    cy.visit("http://localhost:3000/0xde30da39c46104798bb5aa3fe8b9e0e1f348163f/1");
    cy.contains("setValue", { timeout: 10000 }).click();

    cy.contains("6 decimals", { timeout: 10000 }).first().click();
    cy.get('input[placeholder="uint128"]').clear().type("0");
    cy.get("body").should("not.contain", "0,000,000");

    cy.get('input[placeholder="uint128"]').clear();
    cy.get("body").should("not.contain", ",000,000");

    cy.get('input[placeholder="uint128"]').type("10");
    cy.contains("6 decimals").first().click();
    cy.get("body").should("contain", "10,000,000");

    cy.contains("18 decimals").first().click();
    cy.get("body").should("contain", "10,000,000,000,000,000,000");

    cy.contains("None").first().click();
    cy.get("body").should("not.contain", "10,000,000,000");
  });

  it("should work with payable value field", () => {
    cy.visit("http://localhost:3000/0xde30da39c46104798bb5aa3fe8b9e0e1f348163f/1");
    cy.contains("setValue", { timeout: 10000 }).click();

    cy.scrollTo("bottom");

    cy.contains("payable value", { timeout: 10000 }).should("be.visible");

    cy.get("button").contains("6 decimals").last().click();
    cy.get('input[placeholder="value (wei)"]').clear().type("50");

    cy.get("body").should("contain", "50,000,000");

    cy.get("button").contains("18 decimals").last().click();
    cy.get('input[placeholder="value (wei)"]').clear().type("2");

    cy.get("body").should("contain", "2,000,000,000,000,000,000");

    cy.get("button").contains("None").last().click();
    cy.get('input[placeholder="value (wei)"]').clear().type("100");

    cy.get("body").should("not.contain", "100,000,000");
  });

  it("should display raw values with proper formatting", () => {
    cy.visit("http://localhost:3000/0xde30da39c46104798bb5aa3fe8b9e0e1f348163f/1");
    cy.contains("setValue", { timeout: 10000 }).click();

    cy.contains("18 decimals", { timeout: 10000 }).first().click();
    cy.get('input[placeholder="uint128"]').type("123");

    cy.get("body").should("contain", "123,000,000,000,000,000,000");

    cy.contains("6 decimals").first().click();
    cy.get('input[placeholder="uint128"]').clear().type("456");

    cy.get("body").should("contain", "456,000,000");

    cy.get("svg").should("be.visible");
  });
});
