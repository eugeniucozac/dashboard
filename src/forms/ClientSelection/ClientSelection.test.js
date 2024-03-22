import React from 'react';
import { render, getFormAutocomplete } from 'tests';
import ClientSelection from './ClientSelection';

describe('FORMS › ClientSelection', () => {
  const props = {
    handleClose: () => {},
  };

  describe('@render', () => {
    it('renders without crashing', () => {
      // arrange
      const { container } = render(<ClientSelection {...props} />);

      // assert
      expect(container).toBeInTheDocument();
    });

    it('renders the form', () => {
      // arrange
      const { getByTestId } = render(<ClientSelection {...props} />);

      // assert
      expect(getByTestId('form-clientSelection')).toBeInTheDocument();
    });

    it('renders nothing if no options have been fetched', () => {
      // arrange
      const { container } = render(<ClientSelection {...props} />);

      // assert
      expect(container.querySelector(getFormAutocomplete('client'))).not.toBeInTheDocument();
    });

    it('renders the form inputs', () => {
      // arrange
      const initialState = {
        parent: {
          list: [
            { id: 1, name: 'one' },
            { id: 2, name: 'two' },
          ],
        },
      };
      const { container } = render(<ClientSelection {...props} />, { initialState });

      // assert
      expect(container.querySelector(getFormAutocomplete('client'))).toBeInTheDocument();
    });
  });
});
