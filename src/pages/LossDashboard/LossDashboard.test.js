import React from 'react';
import { render, screen } from 'tests';
import LossDashboard from './LossDashboard';

describe('PAGES › LossDashboard', () => {
  const initialState = {
    claims: {
      selectedLossInformation: {
        lossRef: 1,
      },
    },
  };

  // it("renders nothing if loss object doesn't exist", () => {
  //   // arrange
  //   render(<LossDashboard />);

  //   // assert
  //   expect(screen.queryByTestId('breadcrumb')).not.toBeInTheDocument();
  //   expect(screen.queryByTestId('loss-functions-popover-ellipsis')).not.toBeInTheDocument();
  //   expect(screen.queryByTestId('tabs-mui')).not.toBeInTheDocument();
  // });

  it('renders the Breadcrumb', () => {
    // arrange
    render(<LossDashboard />, { initialState });

    // assert
    expect(screen.getByTestId('breadcrumb')).toBeInTheDocument();
    expect(screen.getByTestId('breadcrumb').querySelector('li:nth-child(1)')).toHaveTextContent('claims.loss.title');
    expect(screen.getByTestId('breadcrumb').querySelector('li:nth-child(2)')).toHaveTextContent('claims.loss.text');
  });

  it('renders the Popover Button', () => {
    // arrange
    render(<LossDashboard />, { initialState });

    // assert
    expect(screen.getByTestId('loss-functions-popover-ellipsis')).toBeInTheDocument();
  });

  it('renders the Tabs', () => {
    // arrange
    render(<LossDashboard />, { initialState });

    // assert
    expect(screen.getByTestId('tabs-mui')).toBeInTheDocument();
    expect(screen.getAllByTestId('tabs-mui-item')[0]).toHaveTextContent('claims.loss.tabMenu.details');
    expect(screen.getAllByTestId('tabs-mui-item')[1]).toHaveTextContent('claims.loss.tabMenu.actions');
    expect(screen.getAllByTestId('tabs-mui-item')[2]).toHaveTextContent('claims.loss.tabMenu.docs');
    expect(screen.getAllByTestId('tabs-mui-item')[3]).toHaveTextContent('claims.loss.tabMenu.notes');
    expect(screen.getAllByTestId('tabs-mui-item')[4]).toHaveTextContent('claims.loss.tabMenu.auditTrail');
  });
});
