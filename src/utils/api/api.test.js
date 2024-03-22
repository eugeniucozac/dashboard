import * as utils from 'utils';
import { getUrl, getQueryString, getHeaders } from './api';
import fetchMock from 'fetch-mock';
import config from 'config';

describe('UTILS › api', () => {
  let spy;

  beforeEach(() => {
    spy = jest.spyOn(global.console, 'error');
  });

  afterEach(() => {
    fetchMock.restore();
    spy.mockReset();
  });

  const defaultResponse = {
    ok: true,
    status: 200,
    body: '{"status":"success","data":123}',
  };

  const errorMsg = {
    message: 'Missing fetch parameters',
  };

  xdescribe('get', () => {
    beforeEach(() => {
      fetchMock.get('*', { body: { status: 'success', data: 123 } });
    });

    it('should return undefined if fetch promise is missing params', async () => {
      // assert
      await expect(utils.api.get({})).rejects.toEqual(errorMsg);
    });

    it('should return fetch promise with endpoint', () => {
      // assert
      return expect(utils.api.get({ endpoint: 'http://domain.com' })).resolves.toMatchObject({
        ...defaultResponse,
        url: 'http://domain.com/',
      });
    });

    it('should return fetch promise with path', () => {
      // assert
      return expect(utils.api.get({ endpoint: 'http://domain.com', path: 'foo' })).resolves.toMatchObject({
        ...defaultResponse,
        url: 'http://domain.com/foo',
      });
    });

    it('should return fetch promise with params', () => {
      // assert
      return expect(utils.api.get({ endpoint: 'http://domain.com', path: 'foo', params: { a: 1, b: 2 } })).resolves.toMatchObject({
        ...defaultResponse,
        url: 'http://domain.com/foo?a=1&b=2',
      });
    });
  });

  xdescribe('post', () => {
    beforeEach(() => {
      fetchMock.post('*', { body: { status: 'success', data: 123 } });
    });

    it('should return undefined if fetch promise is missing params', async () => {
      // assert
      await expect(utils.api.post({})).rejects.toEqual(errorMsg);
    });

    it('should return fetch promise with endpoint', () => {
      // assert
      return expect(utils.api.post({ endpoint: 'http://domain.com' })).resolves.toMatchObject({
        ...defaultResponse,
        url: 'http://domain.com/',
      });
    });

    it('should return fetch promise with path', () => {
      // assert
      return expect(utils.api.post({ endpoint: 'http://domain.com', path: 'foo' })).resolves.toMatchObject({
        ...defaultResponse,
        url: 'http://domain.com/foo',
      });
    });

    it('should return fetch promise with data and params', () => {
      // assert
      return expect(utils.api.post({ endpoint: 'http://domain.com', path: 'foo', params: { a: 1, b: 2 } })).resolves.toMatchObject({
        ...defaultResponse,
        url: 'http://domain.com/foo?a=1&b=2',
      });
    });
  });

  xdescribe('multiPartPost', () => {
    beforeEach(() => {
      fetchMock.post('*', { body: { status: 'success', data: 123 } });
    });

    it('should return undefined if fetch promise is missing params', async () => {
      // assert
      await expect(utils.api.post({})).rejects.toEqual(errorMsg);
    });

    it('should return fetch promise with endpoint', () => {
      // assert
      return expect(utils.api.post({ endpoint: 'http://domain.com' })).resolves.toMatchObject({
        ...defaultResponse,
        url: 'http://domain.com/',
      });
    });

    it('should return fetch promise with path', () => {
      // assert
      return expect(utils.api.post({ endpoint: 'http://domain.com', path: 'foo' })).resolves.toMatchObject({
        ...defaultResponse,
        url: 'http://domain.com/foo',
      });
    });

    it('should return fetch promise with data and params', () => {
      // assert
      return expect(utils.api.post({ endpoint: 'http://domain.com', path: 'foo', params: { a: 1, b: 2 } })).resolves.toMatchObject({
        ...defaultResponse,
        url: 'http://domain.com/foo?a=1&b=2',
      });
    });
  });

  xdescribe('put', () => {
    beforeEach(() => {
      fetchMock.put('*', { body: { status: 'success', data: 123 } });
    });

    it('should return undefined if fetch promise is missing params', async () => {
      // assert
      await expect(utils.api.put({})).rejects.toEqual(errorMsg);
    });

    it('should return fetch promise with endpoint', () => {
      // assert
      return expect(utils.api.put({ endpoint: 'http://domain.com' })).resolves.toMatchObject({
        ...defaultResponse,
        url: 'http://domain.com/',
      });
    });

    it('should return fetch promise with path', () => {
      // assert
      return expect(utils.api.put({ endpoint: 'http://domain.com', path: 'foo' })).resolves.toMatchObject({
        ...defaultResponse,
        url: 'http://domain.com/foo',
      });
    });

    it('should return fetch promise with data and params', () => {
      // assert
      return expect(utils.api.put({ endpoint: 'http://domain.com', path: 'foo', params: { a: 1, b: 2 } })).resolves.toMatchObject({
        ...defaultResponse,
        url: 'http://domain.com/foo?a=1&b=2',
      });
    });
  });

  xdescribe('patch', () => {
    beforeEach(() => {
      fetchMock.patch('*', { body: { status: 'success', data: 123 } });
    });

    it('should return undefined if fetch promise is missing params', async () => {
      // assert
      await expect(utils.api.patch({})).rejects.toEqual(errorMsg);
    });

    it('should return fetch promise with endpoint', () => {
      // assert
      return expect(utils.api.patch({ endpoint: 'http://domain.com' })).resolves.toMatchObject({
        ...defaultResponse,
        url: 'http://domain.com/',
      });
    });

    it('should return fetch promise with path', () => {
      // assert
      return expect(utils.api.patch({ endpoint: 'http://domain.com', path: 'foo' })).resolves.toMatchObject({
        ...defaultResponse,
        url: 'http://domain.com/foo',
      });
    });

    it('should return fetch promise with data and params', () => {
      // assert
      return expect(utils.api.patch({ endpoint: 'http://domain.com', path: 'foo', params: { a: 1, b: 2 } })).resolves.toMatchObject({
        ...defaultResponse,
        url: 'http://domain.com/foo?a=1&b=2',
      });
    });
  });

  xdescribe('delete', () => {
    beforeEach(() => {
      fetchMock.delete('*', { body: { status: 'success', data: 123 } });
    });

    it('should return undefined if fetch promise is missing params', async () => {
      // assert
      await expect(utils.api.delete({})).rejects.toEqual(errorMsg);
    });

    it('should return fetch promise with endpoint', () => {
      // assert
      return expect(utils.api.delete({ endpoint: 'http://domain.com' })).resolves.toMatchObject({
        ...defaultResponse,
        url: 'http://domain.com/',
      });
    });

    it('should return fetch promise with path', () => {
      // assert
      return expect(utils.api.delete({ endpoint: 'http://domain.com', path: 'foo' })).resolves.toMatchObject({
        ...defaultResponse,
        url: 'http://domain.com/foo',
      });
    });

    it('should return fetch promise with params', () => {
      // assert
      return expect(utils.api.delete({ endpoint: 'http://domain.com', path: 'foo', params: { a: 1, b: 2 } })).resolves.toMatchObject({
        ...defaultResponse,
        url: 'http://domain.com/foo?a=1&b=2',
      });
    });
  });

  describe('handleResponse', () => {
    describe('should return the response', () => {
      describe('json', () => {
        it('success', () => {
          // arrange
          const json = {
            status: 'success',
            data: 'foo',
          };
          const response = {
            ok: true,
            status: 200,
            type: 'dummy',
            statusText: 'Yay',
            json: () => json,
            headers: { get: () => 'application/json' },
          };

          // assert
          expect(utils.api.handleResponse(response)).toBe(json);
        });

        it('failure', () => {
          // arrange
          const error = {
            ok: false,
            status: 500,
            type: 'Network error',
            statusText: 'Page not found',
          };
          const response = {
            ok: true,
            status: error.status,
            type: error.type,
            statusText: error.statusText,
            json: () => {
              return Promise.reject(error);
            },
            headers: { get: () => 'application/json' },
          };

          // assert
          expect(utils.api.handleResponse(response)).rejects.toEqual(error);
        });
      });

      describe('text', () => {
        it('success', () => {
          // arrange
          const text = 'foo bar';
          const response = {
            ok: true,
            status: 200,
            type: 'dummy',
            statusText: 'Yay',
            text: () => text,
            headers: { get: () => 'text/plain' },
          };

          // assert
          expect(utils.api.handleResponse(response)).toBe(text);
        });

        it('failure', () => {
          // arrange
          const error = {
            ok: false,
            status: 500,
            type: 'Network error',
            statusText: 'Page not found',
          };
          const response = {
            ok: true,
            status: error.status,
            type: error.type,
            statusText: error.statusText,
            text: () => {
              return Promise.reject(error);
            },
            headers: { get: () => 'text/plain' },
          };

          // assert
          expect(utils.api.handleResponse(response)).rejects.toEqual(error);
        });
      });

      describe('not supported', () => {
        it('failure', () => {
          // arrange
          const error = {
            ok: true,
            text: 'type not supported...',
          };
          const response = {
            ok: true,
            status: 200,
            text: () => {
              return Promise.reject(error);
            },
            headers: { get: () => 'foo/bar' },
          };

          // assert
          expect(utils.api.handleResponse(response)).rejects.toEqual({ type: 'application type not supported' });
        });
      });
    });
  });

  describe('handleResponseBlob', () => {
    it('should return the response blob', () => {
      // arrange
      const blob = new Blob();
      const error = {
        ok: false,
        status: 500,
        type: 'Network error',
        statusText: 'Page not found',
      };
      const responseSuccess = {
        ok: true,
        status: 200,
        type: 'dummy',
        statusText: 'Yay',
        blob: () => blob,
      };
      const responseFail = {
        ok: true,
        status: error.status,
        type: error.type,
        statusText: error.statusText,
        blob: () => {
          return Promise.reject(error);
        },
      };

      // assert
      expect(utils.api.handleResponseBlob(responseSuccess)).toBe(blob);
      expect(utils.api.handleResponseBlob(responseFail)).rejects.toEqual(error);
    });
  });

  describe('handleResponseJsonObject', () => {
    it('should return the response json if default key ID is valid', () => {
      // arrange
      const json = {
        id: 1,
        foo: 'bar',
      };

      // assert
      expect(utils.api.handleResponseJsonObject(json)).toEqual(json);
    });

    it('should return the response json if custom key is valid', () => {
      // arrange
      const json = {
        id: 1,
        foo: 'bar',
        hello: 'world',
      };

      // assert
      expect(utils.api.handleResponseJsonObject(json, 'hello')).toEqual(json);
    });

    it('should reject the Promise if the response json is invalid', () => {
      // assert
      expect(utils.api.handleResponseJsonObject({})).rejects.toEqual({ message: 'API data format error' });
      expect(utils.api.handleResponseJsonObject({ id: 0 })).rejects.toEqual({ message: 'API data format error' });
      expect(utils.api.handleResponseJsonObject({ id: '' })).rejects.toEqual({ message: 'API data format error' });
      expect(utils.api.handleResponseJsonObject({ id: null })).rejects.toEqual({ message: 'API data format error' });
      expect(utils.api.handleResponseJsonObject({ id: false })).rejects.toEqual({ message: 'API data format error' });
      expect(utils.api.handleResponseJsonObject({ id: true }, 'foo')).rejects.toEqual({ message: 'API data format error' });

      expect(utils.api.handleResponseJsonObject({ id: 1, foo: 0 }, 'bar')).rejects.toEqual({ message: 'API data format error' });
      expect(utils.api.handleResponseJsonObject({ id: 1, foo: '' }, 'bar')).rejects.toEqual({ message: 'API data format error' });
      expect(utils.api.handleResponseJsonObject({ id: 1, foo: null }, 'bar')).rejects.toEqual({ message: 'API data format error' });
      expect(utils.api.handleResponseJsonObject({ id: 1, foo: false }, 'bar')).rejects.toEqual({ message: 'API data format error' });
      expect(utils.api.handleResponseJsonObject({ id: 1, foo: true }, 'bar')).rejects.toEqual({ message: 'API data format error' });

      expect(utils.api.handleResponseJsonObject({ error: { status: 500 } })).rejects.toEqual({
        message: 'API data format error',
        error: { status: 500 },
      });
      expect(utils.api.handleResponseJsonObject('some error msg', 'foo')).rejects.toEqual({
        message: 'API data format error',
        error: 'some error msg',
      });
    });
  });

  describe('handleResponseJsonArray', () => {
    it("should return the response json array if it's a valid array", () => {
      // assert
      expect(utils.api.handleResponseJsonArray([])).toEqual([]);
      expect(utils.api.handleResponseJsonArray([1, 2, 3])).toEqual([1, 2, 3]);
    });

    it('should reject the Promise if the response json array is invalid', () => {
      // assert
      expect(utils.api.handleResponseJsonArray()).rejects.toEqual({ message: 'API data format error' });
      expect(utils.api.handleResponseJsonArray({})).rejects.toEqual({ message: 'API data format error' });
      expect(utils.api.handleResponseJsonArray(123)).rejects.toEqual({ message: 'API data format error' });
      expect(utils.api.handleResponseJsonArray(true)).rejects.toEqual({ message: 'API data format error' });
      expect(utils.api.handleResponseJsonArray(false)).rejects.toEqual({ message: 'API data format error' });

      expect(utils.api.handleResponseJsonArray('')).rejects.toEqual({ message: 'API data format error', error: '' });
      expect(utils.api.handleResponseJsonArray('foo')).rejects.toEqual({ message: 'API data format error', error: 'foo' });
      expect(utils.api.handleResponseJsonArray({ error: { msg: 'error', status: 500 } })).rejects.toEqual({
        message: 'API data format error',
        error: { msg: 'error', status: 500 },
      });
    });
  });

  describe('handleData', () => {
    it('should return the data if the request was successful', () => {
      // arrange
      const jsonSuccess = {
        status: 'success',
        data: 'foo',
      };

      // assert
      expect(utils.api.handleData(jsonSuccess)).toEqual(jsonSuccess.data);
    });

    it('should return an error object if the request failed', () => {
      // assert
      return expect(utils.api.handleData({ data: null })).rejects.toEqual({
        data: null,
        message: 'API data format error',
      });
    });

    it('should return an error object with error type if the request failed', () => {
      // assert
      return expect(utils.api.handleData({ status: 'fail', data: null })).rejects.toEqual({
        status: 'fail',
        data: null,
        message: 'API data format error (fail)',
      });
    });
  });

  describe('handleError', () => {
    it('should handle the handleError method', () => {
      // arrange
      const params = {
        file: 'params file string',
        message: 'params title string',
        dummy: 'dummy param should not be displayed',
      };

      const error = {
        response: {
          ok: true,
          type: 'lorem',
          status: 200,
          statusText: 'ipsum',
          foo: 'all/any property should be in error object',
        },
      };

      const errorJson = {
        ...error,
        json: {
          foo: 'bar',
          message: 'json response error endpoint message',
        },
      };

      const errorText = {
        ...error,
        text: 'text response error endpoint message',
      };

      const expectedError = {
        response: error.response,
      };

      const expectedErrorJson = {
        response: errorJson.response,
        message: errorJson.json.message,
        error: { ...errorJson.json },
      };

      const expectedErrorText = {
        response: errorText.response,
        message: errorText.text,
      };

      const expectedParams = {
        file: params.file,
        message: params.message,
      };

      // assert
      expect(utils.api.handleError(error)).toEqual(expectedError);
      expect(utils.api.handleError(errorJson)).toEqual(expectedErrorJson);
      expect(utils.api.handleError(errorText)).toEqual(expectedErrorText);
      expect(utils.api.handleError(error, params)).toEqual({ ...expectedParams, ...expectedError });
      expect(utils.api.handleError(errorJson, params)).toEqual({ ...expectedParams, ...expectedErrorJson });
      expect(utils.api.handleError(errorText, params)).toEqual({ ...expectedParams, ...expectedErrorText });
    });
  });

  describe('handleUnauthorized', () => {
    it('should do nothing if no error is passed', () => {
      // act
      utils.api.handleUnauthorized();

      // assert
      expect(console.error).toHaveBeenCalledTimes(0);
    });

    it('should do nothing for unknown errors', () => {
      // act
      utils.api.handleUnauthorized({ status: 1 });

      // assert
      expect(console.error).toHaveBeenCalledTimes(0);
    });

    it('should do nothing if missing params', () => {
      // act
      utils.api.handleUnauthorized({ status: 401 });

      // assert
      expect(console.error).toHaveBeenCalledTimes(0);
    });

    it('should log error and dispatch logout action for 401 Unauthorized error', () => {
      // arrange
      const dispatch = jest.fn(() => 'dispatch');

      // act
      utils.api.handleUnauthorized({ status: 401 }, dispatch);

      // assert
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith('Unauthorized', { status: 401 });
    });
  });

  describe('pagination', () => {
    it('should return the pagination object', () => {
      // arrange
      const defaultPagination = {
        itemsTotal: 0,
        page: 1,
        pageSize: config.ui.pagination.default,
        pageTotal: 0,
        query: '',
      };

      // assert
      expect(utils.api.pagination()).toEqual({});
      expect(utils.api.pagination(null)).toEqual({});
      expect(utils.api.pagination({})).toEqual(defaultPagination);
      expect(utils.api.pagination({ pagination: { totalElements: 100 } })).toEqual({ ...defaultPagination, itemsTotal: 100 });
      expect(utils.api.pagination({ pagination: { page: 2 } })).toEqual({ ...defaultPagination, page: 2 });
      expect(utils.api.pagination({ pagination: { size: 20 } })).toEqual({ ...defaultPagination, pageSize: 20 });
      expect(utils.api.pagination({ pagination: { totalPages: 50 } })).toEqual({ ...defaultPagination, pageTotal: 50 });
      expect(utils.api.pagination({ pagination: { query: 'foo' } })).toEqual({ ...defaultPagination, query: 'foo' });
      expect(
        utils.api.pagination({
          pagination: {
            totalElements: 100,
            page: 2,
            size: 20,
            totalPages: 50,
            query: 'foo',
          },
        })
      ).toEqual({
        itemsTotal: 100,
        page: 2,
        pageSize: 20,
        pageTotal: 50,
        query: 'foo',
      });
    });
  });

  describe('getErrorMessage', () => {
    it('should return the error message string', () => {
      // assert
      // expect(utils.api.pagination()).toEqual({});
      // expect(utils.api.pagination(null)).toEqual({});
      // expect(utils.api.pagination({})).toEqual(defaultPagination);
      // expect(utils.api.pagination({ pagination: { totalElements: 100 } })).toEqual({ ...defaultPagination, itemsTotal: 100 });
      // expect(utils.api.pagination({ pagination: { page: 2 } })).toEqual({ ...defaultPagination, page: 2 });
      // expect(utils.api.pagination({ pagination: { size: 20 } })).toEqual({ ...defaultPagination, pageSize: 20 });
      // expect(utils.api.pagination({ pagination: { totalPages: 50 } })).toEqual({ ...defaultPagination, pageTotal: 50 });
      // expect(utils.api.pagination({ pagination: { query: 'foo' } })).toEqual({ ...defaultPagination, query: 'foo' });
    });
  });

  describe('getUrl', () => {
    it('should return the endpoint url with path if provided', () => {
      // assert
      expect(getUrl()).toEqual('');
      expect(getUrl(null)).toEqual('');
      expect(getUrl(null, 'bar')).toEqual('');
      expect(getUrl('foo')).toEqual('foo');
      expect(getUrl('foo', 'bar')).toEqual('foo/bar');
      expect(getUrl('foo', '', { a: 1, b: 2 })).toEqual('foo?a=1&b=2');
      expect(getUrl('foo', 'bar', { a: 1, b: 2 })).toEqual('foo/bar?a=1&b=2');
      expect(getUrl('', 'bar')).toEqual('');
      expect(getUrl('', 'bar', { a: 1, b: 2 })).toEqual('');
      expect(getUrl('', '', { a: 1, b: 2 })).toEqual('');
    });
  });

  describe('getQueryString', () => {
    it('should return the query string from the params provided', () => {
      // assert
      expect(getQueryString()).toEqual('');
      expect(getQueryString(null)).toEqual('');
      expect(getQueryString([])).toEqual('');
      expect(getQueryString('foo')).toEqual('');
      expect(getQueryString({})).toEqual('');
      expect(getQueryString({ key: '123456' })).toEqual('?key=123456');
      expect(getQueryString({ key: '123456', name: 'dummy' })).toEqual('?key=123456&name=dummy');
    });
  });

  describe('getHeaders', () => {
    it('should return the headers with token if provided', () => {
      // arrange
      const defaultHeadersJson = {
        'Content-Type': 'application/json',
      };

      // assert
      expect(getHeaders()).toEqual(defaultHeadersJson);
      expect(getHeaders(null)).toEqual(defaultHeadersJson);
      expect(getHeaders(0)).toEqual(defaultHeadersJson);
      expect(getHeaders('')).toEqual(defaultHeadersJson);
      expect(getHeaders(' ')).toEqual({ ...defaultHeadersJson, Authorization: 'Bearer  ' });
      expect(getHeaders('foo')).toEqual({ ...defaultHeadersJson, Authorization: 'Bearer foo' });
      expect(getHeaders('foo', 'dummy')).toEqual({ Authorization: 'Bearer foo' });
      expect(getHeaders('foo', false)).toEqual({ Authorization: 'Bearer foo' });
    });
  });
});
