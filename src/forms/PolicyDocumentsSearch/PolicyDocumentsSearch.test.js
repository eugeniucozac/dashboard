import React from 'react';
import { render, waitFor, within, getFormAutocompleteMui, getFormDatepicker, fireEvent } from 'tests';
import fetchMock from 'fetch-mock';
import PolicyDocumentsSearch from './PolicyDocumentsSearch';

describe('FORMS › PolicyDocumentsSearch', () => {
  describe('@render', () => {
    afterEach(() => {
      fetchMock.restore();
    });

    it('renders the search form', async () => {
      // arrange
      const { container, getByTestId, getByText } = render(<PolicyDocumentsSearch />);

      // assert
      // form
      expect(getByTestId('form-PolicyDocumentsSearch')).toBeInTheDocument();

      // form buttons
      expect(getByText('app.cancel')).toBeInTheDocument();
      expect(getByText('fileUpload.searchDocuments')).toBeInTheDocument();

      // risk reference search input
      expect(container.querySelector(getFormAutocompleteMui('riskReference'))).toBeInTheDocument();
      expect(container.querySelector(getFormAutocompleteMui('insuredName'))).toBeInTheDocument();
      expect(container.querySelector(getFormAutocompleteMui('documentType'))).toBeInTheDocument();
      expect(container.querySelector(getFormAutocompleteMui('department'))).toBeInTheDocument();
      expect(container.querySelector(getFormAutocompleteMui('xbInstance'))).toBeInTheDocument();
      expect(container.querySelector(getFormDatepicker('inceptionYear'))).toBeInTheDocument();
    });

    it('renders the document list after a search', async () => {
      // arrange
      fetchMock.get('glob:*/data/search/document', {
        // temporary fix while using json-server
        // fetchMock.post('glob:*/data/search/document', {
        body: {
          status: 'OK',
          data: [
            {
              spdocumentID: 1,
              documentName: 'filename 1',
              documentTypeDescription: 'documentType 1',
              documentVersion: null,
              uploadedby: 'uploadedby 1',
              uploadeddate: 1,
              insuredName: 'insured 1',
              inceptionDate: 11,
              departmentName: 'department 1',
              xbinstance: 'xbInstance 1',
            },
            {
              spdocumentID: 2,
              documentName: 'filename 2',
              documentTypeDescription: 'documentType 2',
              documentVersion: '',
              uploadedby: 'uploadedby 2',
              uploadeddate: 2,
              insuredName: 'insured 2',
              inceptionDate: 22,
              departmentName: 'department 2',
              xbinstance: 'xbInstance 2',
            },
            {
              spdocumentID: 3,
              documentName: 'filename 3',
              documentTypeDescription: 'documentType 3',
              documentVersion: '1.0',
              uploadedby: 'uploadedby 3',
              uploadeddate: 3,
              insuredName: 'insured 3',
              inceptionDate: 33,
              departmentName: 'department 3',
              xbinstance: 'xbInstance 3',
            },
            {
              spdocumentID: 4,
              documentName: 'filename 4',
              documentTypeDescription: 'documentType 4',
              documentVersion: '2.0',
              uploadedby: 'uploadedby 4',
              uploadeddate: 4,
              insuredName: 'insured 4',
              inceptionDate: 44,
              departmentName: 'department 4',
              xbinstance: 'xbInstance 4',
            },
            {
              spdocumentID: 5,
              documentName: 'filename 5',
              documentTypeDescription: 'documentType 5',
              documentVersion: '3.0',
              uploadedby: 'uploadedby 5',
              uploadeddate: 5,
              insuredName: 'insured 5',
              inceptionDate: 55,
              departmentName: 'department 5',
              xbinstance: 'xbInstance 5',
            },
          ],
          pagination: {
            page: 4,
            size: 2,
            totalElements: 100,
            totalPages: 50,
          },
        },
      });
      const { container, getByTestId, getByText } = render(<PolicyDocumentsSearch />);
      const input = container.querySelector('input[name="inceptionYear"]');
      const btn = container.querySelector('button[type="submit"]');

      // act
      fireEvent.change(input, { target: { value: '2000' } });
      fireEvent.click(btn);

      // assert
      await waitFor(() => getByTestId('policyDocumentSearch-list'));

      const row1 = getByTestId('policyDocumentSearch-list').querySelector('tbody tr:nth-child(1)');
      const row2 = getByTestId('policyDocumentSearch-list').querySelector('tbody tr:nth-child(2)');
      const row3 = getByTestId('policyDocumentSearch-list').querySelector('tbody tr:nth-child(3)');
      const row4 = getByTestId('policyDocumentSearch-list').querySelector('tbody tr:nth-child(4)');
      const row5 = getByTestId('policyDocumentSearch-list').querySelector('tbody tr:nth-child(5)');

      // table columns
      expect(getByText('app.filename')).toBeInTheDocument();
      expect(getByText('app.documentType')).toBeInTheDocument();
      expect(getByText('fileUpload.fields.documentVersion.label')).toBeInTheDocument();
      expect(getByText('app.uploadedBy')).toBeInTheDocument();
      expect(getByText('app.uploadedDate')).toBeInTheDocument();
      expect(getByText('app.insured')).toBeInTheDocument();
      expect(getByText('app.inceptionDate')).toBeInTheDocument();
      expect(getByText('app.department')).toBeInTheDocument();
      expect(getByText('app.xbInstance')).toBeInTheDocument();

      // table rows
      expect(within(row1).getByText('filename 1')).toBeInTheDocument();
      expect(within(row1).getByText('documentType 1')).toBeInTheDocument();
      expect(within(row1).getByText('uploadedby 1')).toBeInTheDocument();
      expect(within(row1).getByText('format.date(1)')).toBeInTheDocument();
      expect(within(row1).getByText('insured 1')).toBeInTheDocument();
      expect(within(row1).getByText('format.date(11)')).toBeInTheDocument();
      expect(within(row1).getByText('department 1')).toBeInTheDocument();
      expect(within(row1).getByText('xbInstance 1')).toBeInTheDocument();

      expect(within(row2).getByText('filename 2')).toBeInTheDocument();
      expect(within(row2).getByText('documentType 2')).toBeInTheDocument();
      expect(within(row2).getByText('uploadedby 2')).toBeInTheDocument();
      expect(within(row2).getByText('format.date(2)')).toBeInTheDocument();
      expect(within(row2).getByText('insured 2')).toBeInTheDocument();
      expect(within(row2).getByText('format.date(22)')).toBeInTheDocument();
      expect(within(row2).getByText('department 2')).toBeInTheDocument();
      expect(within(row2).getByText('xbInstance 2')).toBeInTheDocument();

      expect(within(row3).getByText('filename 3')).toBeInTheDocument();
      expect(within(row3).getByText('documentType 3')).toBeInTheDocument();
      expect(within(row3).getByText('1.0')).toBeInTheDocument();
      expect(within(row3).getByText('uploadedby 3')).toBeInTheDocument();
      expect(within(row3).getByText('format.date(3)')).toBeInTheDocument();
      expect(within(row3).getByText('insured 3')).toBeInTheDocument();
      expect(within(row3).getByText('format.date(33)')).toBeInTheDocument();
      expect(within(row3).getByText('department 3')).toBeInTheDocument();
      expect(within(row3).getByText('xbInstance 3')).toBeInTheDocument();

      expect(within(row4).getByText('filename 4')).toBeInTheDocument();
      expect(within(row4).getByText('documentType 4')).toBeInTheDocument();
      expect(within(row4).getByText('2.0')).toBeInTheDocument();
      expect(within(row4).getByText('uploadedby 4')).toBeInTheDocument();
      expect(within(row4).getByText('format.date(4)')).toBeInTheDocument();
      expect(within(row4).getByText('insured 4')).toBeInTheDocument();
      expect(within(row4).getByText('format.date(44)')).toBeInTheDocument();
      expect(within(row4).getByText('department 4')).toBeInTheDocument();
      expect(within(row4).getByText('xbInstance 4')).toBeInTheDocument();

      expect(within(row5).getByText('filename 5')).toBeInTheDocument();
      expect(within(row5).getByText('documentType 5')).toBeInTheDocument();
      expect(within(row5).getByText('3.0')).toBeInTheDocument();
      expect(within(row5).getByText('uploadedby 5')).toBeInTheDocument();
      expect(within(row5).getByText('format.date(5)')).toBeInTheDocument();
      expect(within(row5).getByText('insured 5')).toBeInTheDocument();
      expect(within(row5).getByText('format.date(55)')).toBeInTheDocument();
      expect(within(row5).getByText('department 5')).toBeInTheDocument();
      expect(within(row5).getByText('xbInstance 5')).toBeInTheDocument();
    });

    it("renders a warning if there's no results after a search", async () => {
      // arrange
      fetchMock.get('glob:*/data/search/document', {
        // temporary fix while using json-server
        // fetchMock.post('glob:*/data/search/document', {
        body: {
          status: 'OK',
          data: [],
        },
      });
      const { container, getByText } = render(<PolicyDocumentsSearch />);
      const input = container.querySelector('input[name="inceptionYear"]');
      const btn = container.querySelector('button[type="submit"]');

      // act
      fireEvent.change(input, { target: { value: '2000' } });
      fireEvent.click(btn);
      await waitFor(() => getByText('fileUpload.noResults'));

      // assert
      expect(getByText('fileUpload.noResults')).toBeInTheDocument();
    });

    it("renders a warning if there's more than 100 results after a search", async () => {
      // arrange
      fetchMock.get('glob:*/data/search/document', {
        // temporary fix while using json-server
        // fetchMock.post('glob:*/data/search/document', {
        body: {
          status: 'OK',
          data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
          pagination: {
            page: 1,
            size: 10,
            totalElements: 125,
            totalPages: 13,
          },
        },
      });
      const { container, getByText } = render(<PolicyDocumentsSearch />);
      const input = container.querySelector('input[name="inceptionYear"]');
      const btn = container.querySelector('button[type="submit"]');

      // act
      fireEvent.change(input, { target: { value: '2000' } });
      fireEvent.click(btn);
      await waitFor(() => getByText('fileUpload.tooManyResults'));

      // assert
      // expect(getByText('fileUpload.tooManyResults')).toBeInTheDocument();
    });
  });
});
