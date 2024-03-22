import React from 'react';
import { render, screen } from 'tests';
import { Theme } from './Theme';

describe('COMPONENTS › Theme', () => {
  it('renders without crashing', () => {
    render(<Theme />);
  });

  it('renders the children component(s)', () => {
    render(
      <Theme>
        <h1>Title</h1>
        <h2>Subtitle</h2>
        <p>Lorem ipsum dolor sit amet</p>
      </Theme>
    );

    expect(screen.getAllByRole('heading')).toHaveLength(2);
    expect(screen.getByRole('heading', { name: 'Title' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Subtitle/i })).toBeInTheDocument();
    expect(screen.getByText(/Lorem ipsum dolor sit amet/i)).toBeInTheDocument();
  });
});
