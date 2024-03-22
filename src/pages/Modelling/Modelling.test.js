import React from 'react';
import fetchMock from 'fetch-mock';

// app
import { render, waitFor } from 'tests';
import Modelling from './Modelling';

describe('PAGES › Modelling', () => {
  afterEach(() => {
    fetchMock.restore();
  });

  describe('@render', () => {
    it('renders the page title', async () => {
      // arrange
      render(<Modelling />);

      // assert
      await waitFor(() => expect(document.title).toContain('modelling.title'));
    });
  });
});
