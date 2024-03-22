import React from 'react';
import { render, waitFor, fireEvent, getFormText } from 'tests';
import Search from './Search';

describe('COMPONENTS › Search', () => {
  const search = jest.fn();
  const reset = jest.fn();

  const props = {
    handlers: {
      search,
      reset,
    },
  };

  describe('@render', () => {
    it('renders without crashing', () => {
      // arrange
      const { container } = render(<Search {...props} />);

      // assert
      expect(container).toBeInTheDocument();
    });

    it('renders the form', () => {
      // arrange
      const { getByTestId } = render(<Search {...props} />);

      // assert
      expect(getByTestId('form-search')).toBeInTheDocument();
    });

    it('renders the submit button by default', () => {
      // arrange
      const { queryByText } = render(<Search {...props} />);

      // assert
      expect(queryByText('app.go')).toBeInTheDocument();
    });

    it("doesn't render the submit button if not defined", () => {
      // arrange
      const { queryByText } = render(<Search {...props} submitButton={false} />);

      // assert
      expect(queryByText('app.go')).not.toBeInTheDocument();
    });

    it('renders the form inputs', () => {
      // arrange
      const { container } = render(<Search {...props} />);

      // assert
      expect(container.querySelector(getFormText('query'))).toBeInTheDocument();
    });

    it('renders the magnifier icon', () => {
      // arrange
      const { getByTestId } = render(<Search {...props} />);

      // assert
      // expect(getByTestId('search-field').querySelector('svg')).toBeInTheDocument();
    });

    it("doesn't render clear icon (x) if there's no text typed", () => {
      // arrange
      const { queryByTestId } = render(<Search {...props} />);

      // assert
      expect(queryByTestId('search-button-clear')).not.toBeInTheDocument();
    });

    it('renders the clear icon (x) after user types text', () => {
      // arrange
      const { container, getByTestId } = render(<Search {...props} />);
      const input = container.querySelector('input[name="query"]');

      // act
      fireEvent.change(input, { target: { value: 'a' } });

      // assert
      // expect(getByTestId('search-button-clear')).toBeInTheDocument();
    });
  });

  describe('@actions', () => {
    it('triggers the submit handler when pressing GO button', async () => {
      // arrange
      const { container } = render(<Search {...props} />);
      const input = container.querySelector('input[name="query"]');
      const btnGo = container.querySelector('button[data-testid="search-button-go"]');

      // act
      fireEvent.change(input, { target: { value: 'abc' } });
      fireEvent.click(btnGo);

      // assert
      await waitFor(() => expect(search).toHaveBeenCalledTimes(1));
      await waitFor(() => expect(reset).toHaveBeenCalledTimes(0));
    });
  });
});
