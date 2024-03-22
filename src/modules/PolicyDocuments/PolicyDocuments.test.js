import React from 'react';
import fetchMock from 'fetch-mock';
import { render, waitForElementToBeRemoved } from 'tests';
import PolicyDocuments from './PolicyDocuments';

describe('MODULES › PolicyDocuments', () => {
  describe('@render', () => {
    const responseData = {
      guiResponseList: [
        { componentName: 'Department', entity: [1, 2, 3] },
        { componentName: 'DocumentType', entity: [1, 2, 3] },
        { componentName: 'XBInstance', entity: [1, 2, 3] },
      ],
    };

    afterEach(() => {
      jest.clearAllMocks();
      fetchMock.restore();
    });

    it('renders the tabs', () => {
      // arrange
      const { getByTestId, getByRole } = render(<PolicyDocuments />);

      // assert
      expect(getByTestId('tabs')).toBeInTheDocument();
      expect(getByRole('tab', { name: /fileUpload.tabs.upload/ })).toBeInTheDocument();
      expect(getByRole('tab', { name: /fileUpload.tabs.search/ })).toBeInTheDocument();
    });

    it('renders the loading spinner when GUI data is loading', () => {
      // arrange
      const { getByTestId, getByText } = render(<PolicyDocuments />, {
        initialState: { fileUpload: { data: {}, loading: true, loaded: false } },
      });

      // assert
      expect(getByTestId('loader')).toBeInTheDocument();
      expect(getByText('fileUpload.loading')).toBeInTheDocument();
    });

    it("renders an error message if the data wasn't fetch successful", async () => {
      // arrange
      fetchMock.post('glob:*/data/gui/screen/fileupload', { body: { status: 'ERROR', data: {} } });

      const { getByText } = render(<PolicyDocuments />);

      // assert
      await waitForElementToBeRemoved(() => getByText('fileUpload.loading'));
      expect(getByText('fileUpload.missingGuiData')).toBeInTheDocument();
    });

    it('renders upload form if data fetch is successful', async () => {
      // arrange
      fetchMock.post('glob:*/data/gui/screen/fileupload', { body: { status: 'OK', data: responseData } });
      const { queryByTestId, getByTestId, getByText, queryByText } = render(<PolicyDocuments />);

      // assert
      await waitForElementToBeRemoved(() => getByText('fileUpload.loading'));
      expect(queryByTestId('loader')).not.toBeInTheDocument();
      expect(queryByText('fileUpload.missingGuiData')).not.toBeInTheDocument();
      expect(getByTestId('tab-content-upload')).toBeInTheDocument();
    });
  });
});
