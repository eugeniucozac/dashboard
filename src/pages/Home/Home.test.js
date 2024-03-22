import React from 'react';
import { render, within, waitFor } from 'tests';
import Home from './Home';
import * as utils from 'utils';
import * as constants from 'consts';

describe('PAGES › Home', () => {
  describe('@render', () => {
    const loggedInUser = {
      id: 1,
      departmentIds: [200, 300],
      departmentSelected: 2,
      auth: {
        accessToken: 'abc123',
      },
      offices: [
        { id: 1, name: 'Office 1', parent: { id: 10, name: 'Parent 10' } },
        { id: 2, name: 'Office 2', parent: { id: 20, name: 'Parent 20' } },
        { id: 3, name: 'Office 3', parent: { id: 20, name: 'Parent 20' } },
        { id: 4, name: 'Office 4', parent: { id: 20, name: 'Parent 20' } },
      ],
    };

    const refData = {
      departments: [
        { id: 100, name: 'one' },
        { id: 200, name: 'two' },
        { id: 300, name: 'three' },
        { id: 400, name: 'four' },
        { id: 500, name: 'five' },
      ],
    };

    const initialStateBroker = {
      user: {
        ...loggedInUser,
        role: 'BROKER',
      },
      referenceData: refData,
    };

    const initialStateCobroker = {
      user: {
        ...loggedInUser,
        role: 'COBROKER',
      },
      referenceData: refData,
    };

    const initialState = {
      ui: {
        brand: constants.BRAND_PRICEFORBES,
      },
    };

    it('renders the page title', async () => {
      // arrange
      render(<Home />);

      // assert
      await waitFor(() => expect(document.title).toContain('home.title'));
    });

    it('renders the text content and video iframe for Price Forbes', () => {
      // arrange
      const { container, getByText } = render(<Home />, { initialState });
      const appName = utils.app.getAppName(constants.BRAND_PRICEFORBES);

      // assert
      expect(getByText(appName)).toBeInTheDocument();
      expect(getByText('home.slogan1')).toBeInTheDocument();
      expect(getByText('home.slogan2')).toBeInTheDocument();
      expect(getByText('home.slogan3')).toBeInTheDocument();

      expect(container.querySelector('iframe[title="home.videoAltText"]')).toBeInTheDocument();
    });

    it('renders the text content and video iframe for Bishopsgate', () => {
      // arrange
      const { container, getByText } = render(<Home />, {
        initialState: {
          ui: {
            brand: constants.BRAND_BISHOPSGATE,
          },
        },
      });
      const appName = utils.app.getAppName(constants.BRAND_BISHOPSGATE);

      // assert
      expect(getByText(appName)).toBeInTheDocument();
      expect(getByText('home.slogan1')).toBeInTheDocument();
      expect(getByText('home.slogan2')).toBeInTheDocument();
      expect(getByText('home.slogan3')).toBeInTheDocument();

      expect(container.querySelector('iframe[title="home.videoAltText"]')).not.toBeInTheDocument();
    });

    it('renders only the departments available for the current user', () => {
      // arrange
      const { getByTestId, queryByTestId } = render(<Home />, { initialState: initialStateBroker });

      // assert
      expect(queryByTestId('card-100')).not.toBeInTheDocument();
      expect(getByTestId('card-200')).toBeInTheDocument();
      expect(getByTestId('card-300')).toBeInTheDocument();
    });

    it('renders the departments list for BROKER', () => {
      // arrange
      const { getByText, getByTestId } = render(<Home />, { initialState: initialStateBroker });

      // assert
      expect(getByText('app.department_plural')).toBeInTheDocument();
      expect(within(getByTestId('card-200')).getByText('two')).toBeInTheDocument();
      expect(within(getByTestId('card-300')).getByText('three')).toBeInTheDocument();
    });

    it('renders the departments list for COBROKER', () => {
      // arrange
      const { getByText, getByTestId } = render(<Home />, { initialState: initialStateCobroker });

      // assert
      expect(getByText('app.department_plural')).toBeInTheDocument();
      expect(within(getByTestId('card-200')).getByText('two')).toBeInTheDocument();
      expect(within(getByTestId('card-300')).getByText('three')).toBeInTheDocument();
    });

    it("doesn't render the offices list for BROKER", () => {
      // arrange
      const { queryByText } = render(<Home />, { initialState: initialStateBroker });

      // assert
      expect(queryByText('app.office_plural')).not.toBeInTheDocument();
      expect(queryByText('Office 1')).not.toBeInTheDocument();
      expect(queryByText('Office 2')).not.toBeInTheDocument();
      expect(queryByText('Office 3')).not.toBeInTheDocument();
      expect(queryByText('Office 4')).not.toBeInTheDocument();
    });

    it('renders the departments list for COBROKER', () => {
      // arrange
      const { getByText, getByTestId } = render(<Home />, { initialState: initialStateCobroker });

      // assert
      expect(getByText('app.office_plural')).toBeInTheDocument();
      expect(within(getByTestId('card-1')).getByText('Office 1')).toBeInTheDocument();
      expect(within(getByTestId('card-1')).getByText('Parent 10')).toBeInTheDocument();
      expect(within(getByTestId('card-2')).getByText('Office 2')).toBeInTheDocument();
      expect(within(getByTestId('card-2')).getByText('Parent 20')).toBeInTheDocument();
      expect(within(getByTestId('card-3')).getByText('Office 3')).toBeInTheDocument();
      expect(within(getByTestId('card-3')).getByText('Parent 20')).toBeInTheDocument();
      expect(within(getByTestId('card-4')).getByText('Office 4')).toBeInTheDocument();
      expect(within(getByTestId('card-4')).getByText('Parent 20')).toBeInTheDocument();
    });
  });
});
