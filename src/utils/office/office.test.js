import * as utils from 'utils';

describe('UTILS › office', () => {
  describe('withFullName', () => {
    it('return office objects with fullname property', () => {
      // arrange
      const officeWithoutNames = { id: 1 };
      const officeWithParentEmpty = { id: 1, parent: {} };
      const officeWithParentName = { id: 1, parent: { name: 'parent' } };
      const officeWithOfficeName = { id: 1, name: 'office' };
      const officeWithBothNames = { id: 1, parent: { name: 'parent' }, name: 'office' };

      // assert
      expect(utils.office.withFullName(officeWithoutNames)).toEqual({ ...officeWithoutNames, fullname: '' });
      expect(utils.office.withFullName(officeWithParentEmpty)).toEqual({ ...officeWithParentEmpty, fullname: '' });
      expect(utils.office.withFullName(officeWithParentName)).toEqual({ ...officeWithParentName, fullname: 'parent' });
      expect(utils.office.withFullName(officeWithOfficeName)).toEqual({ ...officeWithOfficeName, fullname: 'office' });
      expect(utils.office.withFullName(officeWithBothNames)).toEqual({ ...officeWithBothNames, fullname: 'parent - office' });
    });

    it('return array of offices objects with fullname property', () => {
      // arrange
      const officeWithoutNames = [{ id: 1 }, { id: 2 }];
      const officeWithParentEmpty = [
        { id: 1, parent: {} },
        { id: 2, parent: {} },
      ];
      const officeWithParentName = [
        { id: 1, parent: { name: 'parent1' } },
        { id: 2, parent: { name: 'parent2' } },
      ];
      const officeWithOfficeName = [
        { id: 1, name: 'office1' },
        { id: 2, name: 'office2' },
        { id: 3, name: 'office3' },
      ];
      const officeWithBothNames = [
        { id: 1, parent: { name: 'parent1' }, name: 'office1' },
        { id: 2, parent: { name: 'parent2' }, name: 'office2' },
        { id: 3, parent: { name: 'parent3' }, name: 'office3' },
      ];

      // assert
      expect(utils.office.withFullName(officeWithoutNames)).toEqual(
        officeWithoutNames.map((office) => {
          return { ...office, fullname: '' };
        })
      );
      expect(utils.office.withFullName(officeWithParentEmpty)).toEqual(
        officeWithParentEmpty.map((office) => {
          return { ...office, fullname: '' };
        })
      );
      expect(utils.office.withFullName(officeWithParentName)).toEqual(
        officeWithParentName.map((office) => {
          return { ...office, fullname: `parent${office.id}` };
        })
      );
      expect(utils.office.withFullName(officeWithOfficeName)).toEqual(
        officeWithOfficeName.map((office) => {
          return { ...office, fullname: `office${office.id}` };
        })
      );
      expect(utils.office.withFullName(officeWithBothNames)).toEqual(
        officeWithBothNames.map((office) => {
          return { ...office, fullname: `parent${office.id} - office${office.id}` };
        })
      );
    });
  });

  describe('getMainOffice', () => {
    it("should return the first office if there's one or more than one", () => {
      expect(utils.office.getMainOffice(null)).toBeUndefined();
      expect(utils.office.getMainOffice(true)).toBeUndefined();
      expect(utils.office.getMainOffice(false)).toBeUndefined();
      expect(utils.office.getMainOffice('foo')).toBeUndefined();
      expect(utils.office.getMainOffice([])).toBeUndefined();
      expect(utils.office.getMainOffice({})).toBeUndefined();
      expect(utils.office.getMainOffice([{ name: 'foo' }])).toEqual({ name: 'foo' });
      expect(utils.office.getMainOffice([{ name: 'foo' }, { name: 'bar' }])).toEqual({ name: 'foo' });
    });
  });

  describe('getMainOfficeName', () => {
    it('should return name of first office', () => {
      expect(utils.office.getMainOfficeName(null)).toBe('');
      expect(utils.office.getMainOfficeName(true)).toBe('');
      expect(utils.office.getMainOfficeName(false)).toBe('');
      expect(utils.office.getMainOfficeName('foo')).toBe('');
      expect(utils.office.getMainOfficeName([])).toBe('');
      expect(utils.office.getMainOfficeName({})).toBe('');
      expect(utils.office.getMainOfficeName([{ otherProp: 'foo' }])).toBe('');
      expect(utils.office.getMainOfficeName([{ name: 'foo' }])).toBe('foo');
      expect(utils.office.getMainOfficeName([{ name: 'foo' }, { name: 'bar' }])).toBe('foo');
    });
  });

  describe('getParent', () => {
    it('should return the office parent', () => {
      expect(utils.office.getParent(null)).toBeUndefined();
      expect(utils.office.getParent(true)).toBeUndefined();
      expect(utils.office.getParent(false)).toBeUndefined();
      expect(utils.office.getParent('foo')).toBeUndefined();
      expect(utils.office.getParent([])).toBeUndefined();
      expect(utils.office.getParent({})).toBeUndefined();
      expect(utils.office.getParent({ otherProp: 'foo' })).toBeUndefined();
      expect(utils.office.getParent({ parent: 'foo' })).toBe('foo');
    });
  });

  describe('getName', () => {
    it('should return name of first office', () => {
      expect(utils.office.getName(null)).toBe('');
      expect(utils.office.getName(true)).toBe('');
      expect(utils.office.getName(false)).toBe('');
      expect(utils.office.getName('foo')).toBe('');
      expect(utils.office.getName([])).toBe('');
      expect(utils.office.getName({})).toBe('');
      expect(utils.office.getName({ otherProp: 'foo' })).toBe('');
      expect(utils.office.getName({ name: 'foo' })).toBe('foo');
    });
  });
});
