import * as utils from 'utils';

describe('UTILS › file', () => {
  describe('download', () => {
    const blob = 123;
    const filename = 'foo.txt';

    it('does nothing if blob is undefined', () => {
      // act
      utils.file.download(null, filename);

      //assert
      expect(window.URL.createObjectURL).toHaveBeenCalledTimes(0);
    });

    it('does nothing if filename is falsy', () => {
      // act
      utils.file.download(blob);

      //assert
      expect(window.URL.createObjectURL).toHaveBeenCalledTimes(0);

      // act
      utils.file.download(blob, '');

      //assert
      expect(window.URL.createObjectURL).toHaveBeenCalledTimes(0);
    });

    it('create a dynamic download link to trigger a file download', () => {
      // act
      utils.file.download(blob, filename);

      //assert
      expect(window.URL.createObjectURL).toHaveBeenCalledWith(123);
    });
  });

  describe('getFilenameFromHeadersBlob', () => {
    it('should return undefined if not given valid headers', () => {
      //assert
      expect(utils.file.getFilenameFromHeadersBlob()).toBeUndefined();
      expect(utils.file.getFilenameFromHeadersBlob(false)).toBeUndefined();
      expect(utils.file.getFilenameFromHeadersBlob(true)).toBeUndefined();
      expect(utils.file.getFilenameFromHeadersBlob('')).toBeUndefined();
      expect(utils.file.getFilenameFromHeadersBlob('foo')).toBeUndefined();
    });

    it('should return undefined if not given valid headers and blob', () => {
      //assert
      expect(utils.file.getFilenameFromHeadersBlob(null, null)).toBeUndefined();
      expect(utils.file.getFilenameFromHeadersBlob(null, {})).toBeUndefined();
      expect(utils.file.getFilenameFromHeadersBlob(null, { type: '' })).toBeUndefined();
      expect(utils.file.getFilenameFromHeadersBlob(null, { type: 'text/xml' })).toBeUndefined();
    });

    it('should return undefined if not given valid headers and blob and default name', () => {
      //assert
      expect(utils.file.getFilenameFromHeadersBlob(null, null, 'dummy')).toBeUndefined();
      expect(utils.file.getFilenameFromHeadersBlob(null, {}, 'dummy')).toBeUndefined();
      expect(utils.file.getFilenameFromHeadersBlob(null, { type: '' }, 'dummy')).toBeUndefined();
      expect(utils.file.getFilenameFromHeadersBlob(null, { type: 'text/xml' }, 'dummy')).not.toBeUndefined();
    });

    it('should return the filename from the headers Content-Disposition', () => {
      //assert
      expect(utils.file.getFilenameFromHeadersBlob({ get: () => 'foo.txt' })).toBeUndefined();
      expect(utils.file.getFilenameFromHeadersBlob({ get: () => 'attachment; foo.txt' })).toBeUndefined();
      expect(utils.file.getFilenameFromHeadersBlob({ get: () => 'attachment; filename=foo.txt' })).toBe('foo.txt');
    });

    it('should revert to default filename and blob type if not given valid headers', () => {
      //assert
      expect(utils.file.getFilenameFromHeadersBlob(null, { type: 'text/xml' }, 'dummy')).toBe('dummy.xml');
      expect(utils.file.getFilenameFromHeadersBlob({ get: () => 'foo.txt' }, { type: 'text/xml' }, 'dummy')).toBe('dummy.xml');
      expect(utils.file.getFilenameFromHeadersBlob({ get: () => 'attachment; foo.txt' }, { type: 'text/xml' }, 'dummy')).toBe('dummy.xml');
      expect(utils.file.getFilenameFromHeadersBlob({ get: () => 'attachment; filename=' }, { type: 'text/xml' }, 'dummy')).toBe(
        'dummy.xml'
      );
      expect(utils.file.getFilenameFromHeadersBlob({ get: () => 'attachment; filename=foo.txt' }, { type: 'text/xml' }, 'dummy')).toBe(
        'foo.txt'
      );
    });
  });

  describe('getFileExtensionFromBlobType', () => {
    it('should return undefined if not given a valid blob', () => {
      //assert
      expect(utils.file.getFileExtensionFromBlobType()).toBeUndefined();
      expect(utils.file.getFileExtensionFromBlobType(false)).toBeUndefined();
      expect(utils.file.getFileExtensionFromBlobType(true)).toBeUndefined();
      expect(utils.file.getFileExtensionFromBlobType('')).toBeUndefined();
      expect(utils.file.getFileExtensionFromBlobType([])).toBeUndefined();
      expect(utils.file.getFileExtensionFromBlobType({})).toBeUndefined();
      expect(utils.file.getFileExtensionFromBlobType({ type: '' })).toBeUndefined();
    });

    it('should generate a filename given a string and a blob', () => {
      //assert
      expect(utils.file.getFileExtensionFromBlobType({ type: 'application/json' })).toBe('json');
      expect(utils.file.getFileExtensionFromBlobType({ type: 'application/msexcel' })).toBe('xlsx');
      expect(utils.file.getFileExtensionFromBlobType({ type: 'application/msword' })).toBe('doc');
      expect(utils.file.getFileExtensionFromBlobType({ type: 'application/pdf' })).toBe('pdf');
      expect(utils.file.getFileExtensionFromBlobType({ type: 'application/rtf' })).toBe('rtf');
      expect(utils.file.getFileExtensionFromBlobType({ type: 'application/vnd.ms-excel' })).toBe('xls');
      expect(utils.file.getFileExtensionFromBlobType({ type: 'application/vnd.ms-powerpoint' })).toBe('ppt');
      expect(utils.file.getFileExtensionFromBlobType({ type: 'application/vnd.oasis.opendocument.presentation' })).toBe('odp');
      expect(utils.file.getFileExtensionFromBlobType({ type: 'application/vnd.oasis.opendocument.spreadsheet' })).toBe('ods');
      expect(utils.file.getFileExtensionFromBlobType({ type: 'application/vnd.oasis.opendocument.text' })).toBe('odt');
      expect(
        utils.file.getFileExtensionFromBlobType({ type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' })
      ).toBe('pptx');
      expect(utils.file.getFileExtensionFromBlobType({ type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })).toBe(
        'xlsx'
      );
      expect(
        utils.file.getFileExtensionFromBlobType({ type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })
      ).toBe('docx');
      expect(utils.file.getFileExtensionFromBlobType({ type: 'application/xml' })).toBe('xml');
      expect(utils.file.getFileExtensionFromBlobType({ type: 'application/zip' })).toBe('zip');
      expect(utils.file.getFileExtensionFromBlobType({ type: 'text/plain' })).toBe('txt');
      expect(utils.file.getFileExtensionFromBlobType({ type: 'text/xml' })).toBe('xml');
    });

    it('should return undefined if the blob type is not found', () => {
      //assert
      expect(utils.file.getFileExtensionFromBlobType({ type: 'application/xyz' })).toBeUndefined();
    });
  });

  describe('getFileExtensionFromFilename', () => {
    it('should return the file extension', () => {
      //assert
      expect(utils.file.getFileExtensionFromFilename()).toBe('');
      expect(utils.file.getFileExtensionFromFilename(false)).toBe('');
      expect(utils.file.getFileExtensionFromFilename(true)).toBe('');
      expect(utils.file.getFileExtensionFromFilename(undefined)).toBe('');
      expect(utils.file.getFileExtensionFromFilename(null)).toBe('');
      expect(utils.file.getFileExtensionFromFilename([])).toBe('');
      expect(utils.file.getFileExtensionFromFilename({})).toBe('');
      expect(utils.file.getFileExtensionFromFilename('')).toBe('');
      expect(utils.file.getFileExtensionFromFilename('filename')).toBe('');
      expect(utils.file.getFileExtensionFromFilename('filename.')).toBe('');
      expect(utils.file.getFileExtensionFromFilename('filename..')).toBe('');
      expect(utils.file.getFileExtensionFromFilename('filename.abc')).toBe('abc');
      expect(utils.file.getFileExtensionFromFilename('filename.abc.')).toBe('');
      expect(utils.file.getFileExtensionFromFilename('filename.abc.xyz')).toBe('xyz');
      expect(utils.file.getFileExtensionFromFilename('filename.abc...xyz')).toBe('xyz');
    });
  });

  describe('getFilenameWithoutExtensionFromFilename', () => {
    it('should return the file name without the extension', () => {
      //assert
      expect(utils.file.getFilenameWithoutExtensionFromFilename()).toBe('');
      expect(utils.file.getFilenameWithoutExtensionFromFilename(false)).toBe('');
      expect(utils.file.getFilenameWithoutExtensionFromFilename(true)).toBe('');
      expect(utils.file.getFilenameWithoutExtensionFromFilename(undefined)).toBe('');
      expect(utils.file.getFilenameWithoutExtensionFromFilename(null)).toBe('');
      expect(utils.file.getFilenameWithoutExtensionFromFilename([])).toBe('');
      expect(utils.file.getFilenameWithoutExtensionFromFilename({})).toBe('');
      expect(utils.file.getFilenameWithoutExtensionFromFilename('')).toBe('');
      expect(utils.file.getFilenameWithoutExtensionFromFilename('filename')).toBe('filename');
      expect(utils.file.getFilenameWithoutExtensionFromFilename('filename.')).toBe('filename.');
      expect(utils.file.getFilenameWithoutExtensionFromFilename('filename..')).toBe('filename..');
      expect(utils.file.getFilenameWithoutExtensionFromFilename('filename.abc')).toBe('filename');
      expect(utils.file.getFilenameWithoutExtensionFromFilename('filename.abc.')).toBe('filename.abc.');
      expect(utils.file.getFilenameWithoutExtensionFromFilename('filename.abc.xyz')).toBe('filename.abc');
      expect(utils.file.getFilenameWithoutExtensionFromFilename('filename.abc...xyz')).toBe('filename.abc..');
    });
  });
});
