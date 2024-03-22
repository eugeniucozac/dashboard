import React from 'react';
import { render } from 'tests';
import '@testing-library/jest-dom/extend-expect';

// app
import ModellingList from './ModellingList';

describe('MODULES › ModellingList', () => {
  describe('@render', () => {
    const state = {
      modelling: {
        list: {
          items: [
            { id: 1, status: 'PENDING', insured: { name: 'insured name 1' }, notes: 'mock notes 1', dueDate: '12/09/2020' },
            { id: 2, status: 'DONE', insured: { name: 'insured name 2' }, notes: 'mock notes 2', dueDate: '01/08/2020' },
          ],
        },
        selected: { id: 3, status: 'IN PROGRESS', notes: 'mock notes 3', dueDate: '03/09/2020' },
      },
      placement: {
        selected: {
          insureds: [],
        },
      },
    };

    it('renders without crashing', () => {
      // arrange
      render(<ModellingList />);
    });

    it('should render modelling list', () => {
      // arrange
      const { getByText } = render(<ModellingList />, { initialState: state, route: ['/placement/modelling/1'] });

      // assert
      expect(getByText('placement.modelling.title')).toBeInTheDocument();
      expect(getByText('format.date(12/09/2020)')).toBeInTheDocument();
      expect(getByText('insured name 1')).toBeInTheDocument();
      expect(getByText('status.pending')).toBeInTheDocument();
      expect(getByText('mock notes 1')).toBeInTheDocument();
      expect(getByText('format.date(01/08/2020)')).toBeInTheDocument();
      expect(getByText('insured name 2')).toBeInTheDocument();
      expect(getByText('status.done')).toBeInTheDocument();
      expect(getByText('mock notes 2')).toBeInTheDocument();
    });
  });
});
