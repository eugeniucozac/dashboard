import fetchMock from 'fetch-mock';
import { downloadWhitespacePdfRequest, downloadWhitespacePdfFailure, downloadWhitespacePdfSuccess } from './whitespace.actions.downloadPdf';

describe('STORES › ACTIONS › whitespace.downloadPdf', () => {
  afterEach(() => {
    fetchMock.restore();
  });

  describe('downloadWhitespaceZip', () => {
    it('should create an action for fetch started', () => {
      // assert
      expect(downloadWhitespacePdfRequest('123')).toEqual({
        type: 'WHITESPACE_PDF_DOWNLOAD_REQUEST',
        payload: '123',
      });
    });

    it('should create an action for fetch success', () => {
      // assert
      expect(downloadWhitespacePdfSuccess()).toEqual({
        type: 'WHITESPACE_PDF_DOWNLOAD_SUCCESS',
      });
    });

    it('should create an action for fetch failure', () => {
      // arrange
      const errorObject = { status: 404 };
      const expectedAction = { type: 'WHITESPACE_PDF_DOWNLOAD_FAILURE', payload: errorObject };

      // assert
      expect(downloadWhitespacePdfFailure(errorObject)).toEqual(expectedAction);
    });
  });
});
