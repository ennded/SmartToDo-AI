describe("Todo Flow", () => {
  it("Creates and completes a todo", () => {
    cy.visit("/login");
    cy.get("#email").type("test@example.com");
    cy.get("#password").type("password123");
    cy.get('button[type="submit"]').click();

    cy.get('[data-testid="new-todo-input"]').type("Test Todo");
    cy.get('[data-testid="add-todo-button"]').click();

    cy.contains("Test Todo").should("exist");
    cy.get('[data-testid="complete-button"]').first().click();
    cy.get('[data-testid="todo-status"]').first().should("contain", "Done");
  });
});
