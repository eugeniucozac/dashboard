import get from 'lodash/get';

export const selectFileUploadData = (state) => get(state, 'fileUpload.data') || {};
export const selectFileUploadLoading = (state) => Boolean(get(state, 'fileUpload.loading'));
export const selectFileUploadLoaded = (state) => Boolean(get(state, 'fileUpload.loaded'));
