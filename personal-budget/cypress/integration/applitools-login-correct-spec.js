/// <reference types="Cypress" />

describe("login tests", () => {
  it("does work with correct credentials", () => {
    cy.eyesOpen({
      appName: "Personal Budget",
      testName: "Fill form to login",
    });
    cy.visit("/home");
    cy.contains("a.nav-link", "Login / Sign up").click();

    cy.hash().should("eq", "#/login");

    cy.eyesCheckWindow({
      tag: "Login page",
      target: "window",
      fully: true,
    });
    cy.screenshot();

    cy.get("[data-cy=username")
      .type("test-user1")
      .should("have.value", "test-user1");
    cy.get("[data-cy=password").type("123").should("have.value", "123");
    cy.get("[data-cy=login-form").submit();

    cy.hash().should("eq", "#/dashboard");

    cy.eyesCheckWindow({
      tag: "Dashboard",
      target: "window",
      fully: true,
    });
    cy.screenshot();

    cy.eyesClose();
  });
});
