import isString from 'lodash/isString';

// app
import { FILE_EXTENSION, DMS_DOC_VIEW_FORMATS } from 'consts';
import * as utils from 'utils';

const utilsFile = {
  download: (blob, filename) => {
    if (!blob || !filename) return;

    const url = window.URL.createObjectURL(blob);
    const link = window.document.createElement('a');

    link.href = url;
    link.download = filename;
    window.document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  },

  viewDoc: (blob, filename) => {
    if (!blob) {
      const ext = utilsFile.getFileExtensionFromFilename(filename).toLowerCase();
      return { url: '', ext, mimeType: utilsFile.getFileMimeTypefromFileExtension(ext) };
    }
    if (!filename) return { url: '', ext: '', mimeType: '' };

    const ext = utilsFile.getFileExtensionFromFilename(filename).toLowerCase();
    const mimeType = utilsFile.getFileMimeTypefromFileExtension(ext);
    const blobdata = new Blob([blob], { type: mimeType?.type });
    return { url: mimeType?.type ? URL.createObjectURL(blobdata) : '', ext, mimeType };
  },

  getFilenameFromHeadersBlob: (headers, blob, defaultName) => {
    const fallbackExtension = utilsFile.getFileExtensionFromBlobType(blob);
    const fallbackFilename = defaultName && isString(defaultName) && fallbackExtension ? `${defaultName}.${fallbackExtension}` : undefined;

    if (headers && utils.generic.isFunction(headers.get)) {
      const contentDisposition = headers.get('Content-Disposition') || '';
      const filenameParts = contentDisposition.split('filename=');
      const filenameStringParts = filenameParts && filenameParts[1] ? filenameParts[1].split(';') : '';
      const filename = filenameStringParts && filenameStringParts[0];

      return filename || fallbackFilename;
    }

    return fallbackFilename;
  },

  getFileExtensionFromBlobType: (blob) => {
    if (!blob || !blob.type) return;

    return FILE_EXTENSION[blob.type];
  },

  truncate: (n, len) => {
    const ext = n.lastIndexOf('.') > -1 ? n.substring(n.lastIndexOf('.') - 2, n.length).toLowerCase() : '';
    let filename = n.replace('.' + ext, '');
    if (filename.length <= len) {
      return n;
    }
    filename = filename.substr(0, len) + (n.length > len ? '..' : '');
    return filename + '.' + ext;
  },
  getFileExtensionFromFilename: (filename) => {
    if (!filename || typeof filename !== 'string' || !filename.includes('.')) return '';

    return filename.split('.').pop();
  },

  getFilenameWithoutExtensionFromFilename: (filename) => {
    if (!filename || typeof filename !== 'string') return '';

    return filename.replace(/\.[^/.]+$/, '');
  },

  getFileMimeTypefromFileExtension: (fileExtentsion) => {
    return utils.generic.isValidObject(DMS_DOC_VIEW_FORMATS, fileExtentsion) ? DMS_DOC_VIEW_FORMATS[fileExtentsion] : {};
  },
};

export default utilsFile;
