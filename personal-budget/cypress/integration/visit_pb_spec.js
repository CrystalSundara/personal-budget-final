/// <reference types="Cypress" />

describe("Visit Personal Budget", () => {
  it("test url works", () => {
    cy.eyesOpen({
      appName: "Personal Budget",
      testName: "Visit home",
    });

    cy.visit("/home");

    cy.eyesCheckWindow({
      tag: "Login page",
      target: "window",
      fully: true,
    });

    cy.eyesClose();
  });
});
