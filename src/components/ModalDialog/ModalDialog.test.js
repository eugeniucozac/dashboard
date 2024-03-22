import React from 'react';
import { render } from 'tests';
import ModalDialog from './ModalDialog';

describe('COMPONENTS › ModalDialog', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders without crashing', () => {
    render(<ModalDialog />);
  });
});
