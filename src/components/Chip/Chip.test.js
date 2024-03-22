import React from 'react';
import { render } from 'tests';
import Chip from './Chip';

describe('COMPONENTS › Chip', () => {
  it('renders without crashing', () => {
    // assert
    render(<Chip />);
  });

  it('renders avatar', () => {
    // arrange
    const { getByText } = render(<Chip avatar={<span>me</span>} />);

    // assert
    expect(getByText('me')).toBeInTheDocument();
  });

  it('renders label', () => {
    // arrange
    const { getByText } = render(<Chip label="chip label" />);

    // assert
    expect(getByText('chip label')).toBeInTheDocument();
  });
});
