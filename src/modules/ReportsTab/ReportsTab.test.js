import React from 'react';

//app
import { render, screen } from 'tests';
import ReportsTabView from './ReportsTab.view';

const renderClaimsProcessing = () => {
  return render(<ReportsTabView />);
};

describe('Modules > Report Tab', () => {
  it('renders without crashing', () => {
    // arrange
    renderClaimsProcessing();

    // assert
    expect(screen.getByTestId('reports-tab')).toBeInTheDocument();
  });
});
