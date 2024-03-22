import fetchMock from 'fetch-mock';
import { downloadWhitespaceZipRequest, downloadWhitespaceZipFailure, downloadWhitespaceZipSuccess } from './whitespace.actions.downloadZip';

describe('STORES › ACTIONS › whitespace.downloadZip', () => {
  afterEach(() => {
    fetchMock.restore();
  });

  describe('downloadWhitespaceZip', () => {
    it('should create an action for fetch started', () => {
      // assert
      expect(downloadWhitespaceZipRequest('123')).toEqual({
        type: 'WHITESPACE_ZIP_DOWNLOAD_REQUEST',
        payload: '123',
      });
    });

    it('should create an action for fetch success', () => {
      // assert
      expect(downloadWhitespaceZipSuccess()).toEqual({
        type: 'WHITESPACE_ZIP_DOWNLOAD_SUCCESS',
      });
    });

    it('should create an action for fetch failure', () => {
      // arrange
      const errorObject = { status: 404 };
      const expectedAction = { type: 'WHITESPACE_ZIP_DOWNLOAD_FAILURE', payload: errorObject };

      // assert
      expect(downloadWhitespaceZipFailure(errorObject)).toEqual(expectedAction);
    });
  });
});
