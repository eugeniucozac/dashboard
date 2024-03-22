import * as utils from 'utils';

describe('UTILS › departments', () => {
  it('should return true if department is of type physical loss', () => {
    // assert
    expect(utils.departments.isPhysicalLoss(1)).toBe(true);
  });

  it('should return false if department is not of type physical loss', () => {
    // assert
    expect(utils.departments.isPhysicalLoss(9)).toBe(false);
  });

  describe('getDepartmentList', () => {
    const departments = [
      { id: 1, name: 'Department 1' },
      { id: 2, name: 'Department 2' },
      { id: 3, name: 'Department 3' },
    ];
    const departmentIds = [1, 3];

    it('Should return comma separated list of departments', () => {
      // assert
      expect(utils.departments.getDepartmentList('foo', 'foo')).toBeUndefined();
      expect(utils.departments.getDepartmentList()).toBeUndefined();
      expect(utils.departments.getDepartmentList(departments)).toBeUndefined();
      expect(utils.departments.getDepartmentList(departments, departmentIds)).toBe('Department 1, Department 3');
    });
  });
});
