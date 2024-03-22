import React from 'react';
import { render, waitFor, screen } from 'tests';
import userEvent from '@testing-library/user-event';
import { MultiSelect } from 'components';
import { TableFilters } from './TableFilters';

describe('COMPONENTS › TableFilters', () => {
  describe('search', () => {
    it('renders search field by default', () => {
      const { queryByTestId } = render(<TableFilters />);

      expect(queryByTestId('form-search')).toBeInTheDocument();
    });

    it("doesn't render search field if set to false", () => {
      const { queryByTestId } = render(<TableFilters search={false} />);

      expect(queryByTestId('form-search')).not.toBeInTheDocument();
    });
  });

  describe('filters', () => {
    const options = [
      { id: 'audi', name: 'Audi' },
      { id: 'bmw', name: 'BMW' },
      { id: 'mercedes', name: 'Mercedes' },
    ];

    const filters = [
      {
        id: 'one',
        type: 'multiSelect',
        label: 'Filter 1',
        value: [],
        options: options,
        content: <MultiSelect id="one" options={options} />,
      },
      {
        id: 'two',
        type: 'multiSelect',
        label: 'Filter 2',
        value: [],
        options: options,
        content: <MultiSelect id="two" options={options} />,
      },
    ];

    it('renders filters toggle button by default if filters array is defined', () => {
      const { queryByTestId } = render(<TableFilters filtersArray={filters} />);

      expect(queryByTestId('filters-button-toggle')).toBeInTheDocument();
    });

    it("doesn't render filters toggle button if set to false", () => {
      const { queryByTestId } = render(<TableFilters filters={false} filtersArray={filters} />);

      expect(queryByTestId('filters-button-toggle')).not.toBeInTheDocument();
    });

    it('renders filters content if defined in prop', () => {
      const { queryByText, queryByTestId } = render(<TableFilters filtersArray={filters} />);

      expect(queryByTestId('filters-content')).toBeInTheDocument();
      expect(queryByText('Filter 1')).toBeInTheDocument();
      expect(queryByText('Filter 2')).toBeInTheDocument();
    });

    it("doesn't render filters content if not defined in props", () => {
      const { queryByText, queryByTestId } = render(<TableFilters />);

      expect(queryByTestId('filters-content')).not.toBeInTheDocument();
      expect(queryByText('Filter 1')).not.toBeInTheDocument();
    });
  });

  describe('flexi columns', () => {
    const columns = [
      { id: 'id', label: 'Id', visible: true },
      { id: 'name', label: 'Name', visible: true },
      { id: 'city', label: 'City', visible: true },
      { id: 'country', label: 'Country' },
      { id: 'number', label: 'Number' },
      { id: 'status', label: 'Status' },
    ];

    it("doesn't render flexi columns toggle button if columns array is not defined in props", () => {
      const { queryByTestId } = render(<TableFilters columns />);
      expect(queryByTestId('columns-button-toggle')).not.toBeInTheDocument();
    });

    it('renders flexi columns toggle button if columns array is defined in props', () => {
      const { queryByTestId } = render(<TableFilters columns columnsArray={[{ id: 1 }]} />);
      expect(queryByTestId('columns-button-toggle')).toBeInTheDocument();
    });

    it("doesn't render search field if set to false", () => {
      const { queryByTestId } = render(<TableFilters columns={false} columnsArray={[{ id: 1 }]} />);
      expect(queryByTestId('columns-button-toggle')).not.toBeInTheDocument();
    });

    it('toggles the columns popover on column icon button click', async () => {
      const { queryByText, queryByTestId } = render(<TableFilters columns columnsArray={columns} />);

      // act
      userEvent.click(screen.getByTestId('columns-button-toggle'));
      await waitFor(() => expect(queryByText('filters.columns.title')).toBeInTheDocument());

      // assert
      expect(queryByText('Id')).toBeInTheDocument();
      expect(queryByText('Name')).toBeInTheDocument();
      expect(queryByText('City')).toBeInTheDocument();
      expect(queryByText('Country')).toBeInTheDocument();
      expect(queryByText('Number')).toBeInTheDocument();
      expect(queryByText('Status')).toBeInTheDocument();

      // act
      userEvent.click(screen.getByTestId('columns-button-toggle'));
      await waitFor(() => expect(queryByText('filters.columns.title')).not.toBeInTheDocument());

      // assert
      expect(queryByText('Id')).not.toBeInTheDocument();
      expect(queryByText('Name')).not.toBeInTheDocument();
      expect(queryByText('City')).not.toBeInTheDocument();
      expect(queryByText('Country')).not.toBeInTheDocument();
      expect(queryByText('Number')).not.toBeInTheDocument();
      expect(queryByText('Status')).not.toBeInTheDocument();
    });
  });
});
