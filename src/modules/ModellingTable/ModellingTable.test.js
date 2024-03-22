import React from 'react';
import { render } from 'tests';
import '@testing-library/jest-dom/extend-expect';

// app
import ModellingTable from './ModellingTable';

describe('MODULES › ModellingTable', () => {
  describe('@render', () => {
    const props = {
      modellingList: [
        { id: 1, status: 'PENDING', insured: { name: 'insured name 1' }, notes: 'mock notes 1', dueDate: '12/09/2020' },
        { id: 2, status: 'DONE', insured: { name: 'insured name 2' }, notes: 'mock notes 2', dueDate: '01/08/2020' },
      ],
      handleDoubleClickRow: jest.fn(),
      sort: {},
      handleUpdateModellingTask: jest.fn(),
    };

    it('renders without crashing', () => {
      // arrange
      render(<ModellingTable />);
    });

    it('should render table', () => {
      // arrange
      const { getByText } = render(<ModellingTable {...props} />);

      // assert
      expect(getByText('placement.modelling.id')).toBeInTheDocument();
      expect(getByText('placement.modelling.insured')).toBeInTheDocument();
      expect(getByText('placement.modelling.dueDate')).toBeInTheDocument();
      expect(getByText('placement.modelling.notes')).toBeInTheDocument();
      expect(getByText('app.status')).toBeInTheDocument();
      expect(getByText('1')).toBeInTheDocument();
      expect(getByText('format.date(12/09/2020)')).toBeInTheDocument();
      expect(getByText('insured name 1')).toBeInTheDocument();
      expect(getByText('status.pending')).toBeInTheDocument();
      expect(getByText('mock notes 1')).toBeInTheDocument();
      expect(getByText('2')).toBeInTheDocument();
      expect(getByText('format.date(01/08/2020)')).toBeInTheDocument();
      expect(getByText('insured name 2')).toBeInTheDocument();
      expect(getByText('status.done')).toBeInTheDocument();
      expect(getByText('mock notes 2')).toBeInTheDocument();
    });
  });
});
