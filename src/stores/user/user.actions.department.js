export const setDepartmentSelected = (id) => {
  localStorage.setItem('edge-department', id);

  return {
    type: 'USER_SET_DEPARTMENT_SELECTED',
    payload: id,
  };
};
