/// <reference types="Cypress" />

describe("login tests", () => {
  it("does not work with wrong credentials", () => {
    cy.visit("/home");
    cy.contains("a.nav-link", "Login / Sign up").click();

    cy.hash().should("eq", "#/login");

    cy.get("[data-cy=username").type("test-user1");
    cy.get("[data-cy=password").type("456");
    cy.get("[data-cy=login-form").submit();
  });

  it("does work with correct credentials", () => {
    cy.visit("/home");
    cy.contains("a.nav-link", "Login / Sign up").click();

    cy.hash().should("eq", "#/login");

    cy.get("[data-cy=username").type("test-user1");
    cy.get("[data-cy=password").type("123");
    cy.get("[data-cy=login-form").submit();

    cy.hash().should("eq", "#/dashboard");
  });
});
