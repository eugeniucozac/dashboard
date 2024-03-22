import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render } from 'tests';
import OpeningMemoList from './OpeningMemoList';
import fetchMock from 'fetch-mock';
import * as pdfHelper from '../OpeningMemo/OpeningMemo.pdf';

describe('MODULES › OpeningMemoList', () => {
  const initialState = {
    openingMemo: {
      list: {
        items: [
          { id: 111, departmentId: 333, uniqueMarketReference: 112, status: 'APPROVED' },
          { id: 222, uniqueMarketReference: 223, status: 'APPROVED' },
          { id: 333, departmentId: 444, uniqueMarketReference: 112, status: 'IN PROGRESS' },
          { id: 444, departmentId: 555, uniqueMarketReference: 'UMR123', status: 'AWAITING APPROVAL' },
        ],
      },
    },
    placement: { selected: { id: 444 } },
    referenceData: { departments: [{ id: 333, name: 'Bar' }] },
  };

  afterEach(() => {
    fetchMock.restore();
  });

  describe('@render', () => {
    it('renders without crashing', () => {
      // arrange
      const { container } = render(<OpeningMemoList />);

      // assert
      expect(container).toBeInTheDocument();
    });

    it('renders table headers', () => {
      // arrange
      const { queryAllByTestId } = render(<OpeningMemoList />, { initialState });
      const tableHeaderCells = queryAllByTestId('table-cell');

      // assert
      expect(tableHeaderCells[0]).toHaveTextContent('placement.openingMemo.riskReference');
      expect(tableHeaderCells[1]).toHaveTextContent('app.status');
      expect(tableHeaderCells[2]).toHaveTextContent('placement.openingMemo.columnNames.accountHandler');
      expect(tableHeaderCells[3]).toHaveTextContent('placement.openingMemo.columnNames.isAuthorised');
      expect(tableHeaderCells[4]).toHaveTextContent('openingMemo.reInsured');
      expect(tableHeaderCells[5]).toHaveTextContent('app.inceptionDate');
      expect(tableHeaderCells[6]).toHaveTextContent('app.download');
    });

    it('renders table row', () => {
      // arrange
      const { getByTestId } = render(<OpeningMemoList />, { initialState });
      const row = getByTestId('opening-memo-111');
      const rowInProgress = getByTestId('opening-memo-333');
      const rowAwaitingApproval = getByTestId('opening-memo-444');

      // assert
      expect(row).toBeInTheDocument();
      expect(row.children[0]).toHaveTextContent('112');
      expect(row.children[1]).toHaveTextContent('status.approved');
      expect(rowInProgress.children[1]).toHaveTextContent('status.inprogress');
      expect(rowAwaitingApproval.children[1]).toHaveTextContent('status.awaitingapproval');
    });
  });

  describe('@actions', () => {
    it('calls downloadPDF when clicking the download icon', () => {
      // arrange
      const expectedArguments = {
        departmentName: 'Bar',
        openingMemo: { id: 111, departmentId: 333, uniqueMarketReference: 112, status: 'APPROVED' },
        referenceData: { departments: [{ id: 333, name: 'Bar' }] },
      };
      pdfHelper.downloadPDF = jest.fn();
      const { getAllByTestId } = render(<OpeningMemoList />, { initialState });

      // act
      fireEvent.click(getAllByTestId('download-pdf')[0]);

      // assert
      expect(pdfHelper.downloadPDF).toHaveBeenCalledWith(expectedArguments);
    });
  });
});
