import * as utils from 'utils';
import config from 'config';

const utilsDepartments = {
  isPhysicalLoss: (selectedDepartment) => {
    if (!selectedDepartment || !config.departments || !utils.generic.isValidArray(config.departments.physicalLoss)) return false;
    const department = config.departments.physicalLoss.find((department) => department.id === selectedDepartment);
    return !!department;
  },
  getDepartmentList: (departments, departmentIds) => {
    if (!utils.generic.isValidArray(departments) || !utils.generic.isValidArray(departmentIds)) return;
    return departmentIds
      .map((departmentId) => {
        const department = utils.referenceData.departments.getById(departments, departmentId);
        return department && department.name;
      })
      .filter((name) => !!name)
      .join(', ');
  },
};

export default utilsDepartments;
