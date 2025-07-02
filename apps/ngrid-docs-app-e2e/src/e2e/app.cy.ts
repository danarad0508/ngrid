describe('ngrid-docs-app', () => {
  beforeEach(() => cy.visit('/'));

  it('should display welcome message', () => {
    cy.get('.mat-headline-2').contains('nGrid');
    cy.get('pbl-ngrid')
      .nGrid()
      .should((ngrid) => {
        expect(ngrid.getColumns()).to.deep.eq([
          'drag_and_drop_handle',
          'selection',
          'id',
          'name',
          'email',
          'country',
          'sales',
          'address',
          'rating',
          'feedback',
        ]);
      });
  });
});
