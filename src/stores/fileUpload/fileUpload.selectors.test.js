import * as fileUploadSelectors from './fileUpload.selectors';

describe('STORES › SELECTORS › fileUpload', () => {
  const { selectFileUploadData, selectFileUploadLoading, selectFileUploadLoaded } = fileUploadSelectors;

  it('selectFileUploadData', () => {
    // assert
    expect(selectFileUploadData({})).toEqual({});
    expect(selectFileUploadData({ fileUpload: { data: null } })).toEqual({});
    expect(selectFileUploadData({ fileUpload: { data: {} } })).toEqual({});
    expect(selectFileUploadData({ fileUpload: { data: { id: 1 } } })).toEqual({ id: 1 });
  });

  it('selectFileUploadLoading', () => {
    // assert
    expect(selectFileUploadLoading({})).toEqual(false);
    expect(selectFileUploadLoading({ fileUpload: { loading: null } })).toEqual(false);
    expect(selectFileUploadLoading({ fileUpload: { loading: true } })).toEqual(true);
    expect(selectFileUploadLoading({ fileUpload: { loading: false } })).toEqual(false);
  });

  it('selectFileUploadLoaded', () => {
    // assert
    expect(selectFileUploadLoaded({})).toEqual(false);
    expect(selectFileUploadLoaded({ fileUpload: { loaded: null } })).toEqual(false);
    expect(selectFileUploadLoaded({ fileUpload: { loaded: true } })).toEqual(true);
    expect(selectFileUploadLoaded({ fileUpload: { loaded: false } })).toEqual(false);
  });
});
