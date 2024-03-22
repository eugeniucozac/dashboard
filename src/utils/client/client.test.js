import * as utils from 'utils';

describe('UTILS › client', () => {
  describe('offices', () => {
    describe('getByid', () => {
      const arr = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];

      it('return undefined if missing array of clients', () => {
        expect(utils.client.offices.getById()).toBeUndefined();
        expect(utils.client.offices.getById(null)).toBeUndefined();
        expect(utils.client.offices.getById(false)).toBeUndefined();
        expect(utils.client.offices.getById(true)).toBeUndefined();
        expect(utils.client.offices.getById(1)).toBeUndefined();
        expect(utils.client.offices.getById('foo')).toBeUndefined();
      });

      it('return undefined if missing client ID', () => {
        expect(utils.client.offices.getById(arr)).toBeUndefined();
        expect(utils.client.offices.getById(arr, null)).toBeUndefined();
        expect(utils.client.offices.getById(arr, false)).toBeUndefined();
        expect(utils.client.offices.getById(arr, '')).toBeUndefined();
        expect(utils.client.offices.getById(arr, 0)).toBeUndefined();
      });

      it('return the first matching client', () => {
        expect(utils.client.offices.getById(arr, 1)).toEqual({ id: 1 });
        expect(utils.client.offices.getById(arr, 2)).toEqual({ id: 2 });
        expect(utils.client.offices.getById(arr, 999)).toBeUndefined();
      });
    });

    describe('getNameList', () => {
      it('return undefined if missing array of offices', () => {
        expect(utils.client.offices.getNameList()).toBeUndefined();
        expect(utils.client.offices.getNameList(null)).toBeUndefined();
        expect(utils.client.offices.getNameList(false)).toBeUndefined();
        expect(utils.client.offices.getNameList(true)).toBeUndefined();
        expect(utils.client.offices.getNameList(1)).toBeUndefined();
        expect(utils.client.offices.getNameList('foo')).toBeUndefined();
        expect(utils.client.offices.getNameList({})).toBeUndefined();
        expect(utils.client.offices.getNameList([])).toBeUndefined();
      });

      it('return the comma deliminated list of office names', () => {
        expect(utils.client.offices.getNameList([{ name: 'Office 1' }])).toBe('Office 1');
        expect(utils.client.offices.getNameList([{ name: 'Office 1' }, { name: 'Office 2' }])).toBe('Office 1, Office 2');
      });
    });
  });

  describe('parent', () => {
    describe('getName', () => {
      it('return undefined if not passed a valid object', () => {
        expect(utils.client.parent.getName()).toBeUndefined();
        expect(utils.client.parent.getName(null)).toBeUndefined();
        expect(utils.client.parent.getName(false)).toBeUndefined();
        expect(utils.client.parent.getName(true)).toBeUndefined();
        expect(utils.client.parent.getName(1)).toBeUndefined();
        expect(utils.client.parent.getName('foo')).toBeUndefined();
        expect(utils.client.parent.getName([])).toBeUndefined();
        expect(utils.client.parent.getName({})).toBeUndefined();
        expect(utils.client.parent.getName({ foo: 'bar' })).toBeUndefined();
      });

      it('return the parent name', () => {
        expect(utils.client.parent.getName({ name: 'bar' })).toBe('bar');
      });
    });

    describe('getLogoFilePath', () => {
      it('return undefined if not passed a valid object', () => {
        expect(utils.client.parent.getLogoFilePath()).toBeUndefined();
        expect(utils.client.parent.getLogoFilePath(null)).toBeUndefined();
        expect(utils.client.parent.getLogoFilePath(false)).toBeUndefined();
        expect(utils.client.parent.getLogoFilePath(true)).toBeUndefined();
        expect(utils.client.parent.getLogoFilePath(1)).toBeUndefined();
        expect(utils.client.parent.getLogoFilePath('foo')).toBeUndefined();
        expect(utils.client.parent.getLogoFilePath([])).toBeUndefined();
        expect(utils.client.parent.getLogoFilePath({})).toBeUndefined();
        expect(utils.client.parent.getLogoFilePath({ foo: 'bar' })).toBeUndefined();
      });

      it('return the parent logo file path', () => {
        expect(utils.client.parent.getLogoFilePath({ logoFileName: '' })).toBeFalsy();
        expect(utils.client.parent.getLogoFilePath({ logoFileName: 'path/to/image.jpg' })).toBe(
          'https://edgeassets.blob.core.windows.net/logo/path/to/image.jpg'
        );
      });
    });
  });
});
