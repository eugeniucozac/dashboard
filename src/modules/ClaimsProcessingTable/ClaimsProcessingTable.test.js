import React from 'react';
import { render, screen } from 'tests';
import ClaimsProcessingTable from './ClaimsProcessingTable';

const renderClaimsProcessingTable = () => {
  return render(<ClaimsProcessingTable />);
};

describe('MODULES › ClaimsProcessingTable', () => {
  it('renders table wrapper', () => {
    // arrange
    renderClaimsProcessingTable();

    // assert
    expect(screen.getByTestId('claims-processing-search-table')).toBeInTheDocument();
    expect(screen.getByTestId('claims-processing-table')).toBeInTheDocument();
  });
});
