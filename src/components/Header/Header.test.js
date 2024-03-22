import React from 'react';
import { render } from 'tests';
import { Header } from './Header';

describe('COMPONENTS › Header', () => {
  it('renders without crashing', () => {
    render(<Header classes={{}} />);
  });
});
