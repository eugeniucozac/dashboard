import { getUploadedFiles } from 'stores';

describe('STORES › SELECTORS › dms', () => {
  describe('UI data', () => {
    const state = {
      ui: {
        brand: '',
        nav: { expanded: false },
        sidebar: { expanded: false },
        modal: [],
        loader: { queue: [] },
        notification: { queue: [] },
        files: [{ file: { name: 'foo.jpg', path: 'foo.jpg', type: null } }],
      },
    };

    it('should test getUploadedFiles for UI data', () => {
      const expectedData = [{ file: { name: 'foo.jpg', path: 'foo.jpg', type: null } }];

      expect(getUploadedFiles(state)).toEqual(expectedData);
    });
  });

});
