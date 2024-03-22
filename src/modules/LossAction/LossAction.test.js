import React from 'react';
import { render, screen } from 'tests';
import LossAction from './LossAction';

const renderLossAction = () => {
  return render(<LossAction />);
};

describe('MODULES › LossAction', () => {
  it('renders without crashing', () => {
    // arrange
    renderLossAction();

    // assert
    expect(screen.getByTestId('loss-action')).toBeInTheDocument();
  });

  it('renders table', () => {
    // arrange
    renderLossAction();

    // assert
    expect(screen.getByTestId('loss-action-table')).toBeInTheDocument();
    expect(screen.getByTestId('loss-action-search-table')).toBeInTheDocument();
  });
});
