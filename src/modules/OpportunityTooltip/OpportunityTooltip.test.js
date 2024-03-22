import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render } from 'tests';
import MockDate from 'mockdate';

// app
import OpportunityTooltip from './OpportunityTooltip';

describe('MODULES › OpportunityTooltip', () => {
  describe('@render', () => {
    it('renders nothing if not passed any props', () => {
      // arrange
      const { container } = render(<OpportunityTooltip />);
      expect(container).toBeEmptyDOMElement();
    });

    it('renders the title', () => {
      // arrange
      const tooltip = {
        client: { name: 'foo' },
      };
      const { getByTestId } = render(<OpportunityTooltip tooltip={tooltip} />);
      expect(getByTestId('mapbox-tooltip-title')).toHaveTextContent('foo');
    });

    it('renders the address', () => {
      // arrange
      const tooltip = {
        outputAddress: 'bar',
      };
      const { queryByTestId } = render(<OpportunityTooltip tooltip={tooltip} />);

      // assert
      expect(queryByTestId('mapbox-tooltip-item')).toHaveTextContent('bar');
    });
  });

  describe('premiums', () => {
    const currentYear = 2020;

    beforeEach(() => {
      MockDate.set(currentYear.toString());
    });

    afterEach(() => {
      MockDate.reset();
    });

    describe('@render', () => {
      it('renders the premium subtitle if there are premiums from previous year with positive premium amount', () => {
        // arrange
        const tooltip = {
          client: { name: 'foo' },
          outputAddress: 'bar',
          premiumSnapshots: [{ id: 1, departmentId: 1, year: 2019, premium: 10000 }],
        };
        const { queryAllByTestId } = render(<OpportunityTooltip tooltip={tooltip} />);

        // assert
        expect(queryAllByTestId('mapbox-tooltip-item')[1]).toHaveTextContent(`app.premium_plural (${currentYear - 1} - USD)`);
      });

      it("doesn't render the premium subtitle if there are no premiums", () => {
        // arrange
        const tooltip = {};
        const { queryByTestId } = render(<OpportunityTooltip tooltip={tooltip} />);

        // assert
        expect(queryByTestId('opportunity-tooltip-premiums-list')).toBeNull();
      });

      it("doesn't render the premium subtitle if there are no premiums for the previous year", () => {
        // arrange
        const tooltip = { premiumSnapshots: [{ id: 1, departmentId: 1, year: 2018, premium: 10000 }] };
        const { queryByTestId } = render(<OpportunityTooltip tooltip={tooltip} />);

        // assert
        expect(queryByTestId('opportunity-tooltip-premiums-list')).toBeNull();
      });

      it("doesn't render the premium subtitle if there are no premiums with a positive premium amount", () => {
        // arrange
        const tooltip = {
          premiumSnapshots: [
            { id: 1, departmentId: 1, year: 2019, premium: 0 },
            { id: 1, departmentId: 1, year: 2019, premium: -5000 },
          ],
        };
        const { queryByTestId } = render(<OpportunityTooltip tooltip={tooltip} />);

        // assert
        expect(queryByTestId('opportunity-tooltip-premiums-list')).toBeNull();
      });

      it('renders the premium list with valid premiums', () => {
        // arrange
        const initialState = {
          referenceData: {
            departments: [
              { id: 1, name: 'property' },
              { id: 2, name: 'cyber' },
              { id: 3, name: 'health' },
              { id: 4, name: 'aviation' },
              { id: 5, name: 'maritime' },
            ],
          },
        };
        const tooltip = {
          client: { name: 'foo' },
          outputAddress: 'bar',
          premiumSnapshots: [
            { id: 1, departmentId: 1, year: 2017, premium: 0 },
            { id: 1, departmentId: 1, year: 2018, premium: 3000 },
            { id: 1, departmentId: 1, year: 2019, premium: 10000 }, // valid
            { id: 1, departmentId: 2, year: 2018, premium: 5000 },
            { id: 1, departmentId: 2, year: 2019, premium: -7000 },
            { id: 1, departmentId: 3, year: 2019, premium: 5000 }, // valid
            { id: 1, departmentId: 4, year: 2018, premium: 10000 },
            { id: 1, departmentId: 4, year: 2020, premium: 15000 },
            { id: 1, departmentId: 5, year: 2020, premium: 25000 },
            { id: 1, departmentId: 6, year: 2020, premium: 100000 }, // valid but no dept with this ID, so will be skipped
          ],
        };
        const { queryByText, getByTestId } = render(<OpportunityTooltip tooltip={tooltip} />, { initialState });
        const list = getByTestId('opportunity-tooltip-premiums-list');

        // assert
        expect(list).toBeInTheDocument();
        expect(list.children.length).toBe(2);
        expect(queryByText('property')).toBeInTheDocument();
        expect(queryByText('cyber')).toBeFalsy();
        expect(queryByText('health')).toBeInTheDocument();
        expect(queryByText('aviation')).toBeFalsy();
        expect(queryByText('maritime')).toBeFalsy();
      });

      it('renders the premiums department name and value', () => {
        // arrange
        const initialState = {
          referenceData: {
            departments: [{ id: 1, name: 'property' }],
          },
        };
        const tooltip = {
          client: { name: 'foo' },
          outputAddress: 'bar',
          premiumSnapshots: [{ id: 1, departmentId: 1, year: 2019, premium: 10000 }],
        };
        const { queryByText } = render(<OpportunityTooltip tooltip={tooltip} />, { initialState });

        // assert
        expect(queryByText('property')).toBeInTheDocument();
        expect(queryByText('format.currency(10000)')).toBeInTheDocument();
      });
    });
  });
});
