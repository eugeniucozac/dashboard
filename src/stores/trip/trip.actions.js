export const toggleTripEditing = (isEditing) => {
  return {
    type: 'TRIP_SELECTED_TOGGLE_EDITING',
    payload: isEditing,
  };
};

export const toggleTripVisit = (visit) => {
  return {
    type: 'TRIP_SELECTED_TOGGLE_VISIT',
    payload: visit,
  };
};

export const editTripVisit = (data) => {
  return {
    type: 'TRIP_SELECTED_EDIT_VISIT',
    payload: data,
  };
};

export const editTripDetails = (data) => {
  return {
    type: 'TRIP_SELECTED_EDIT_DETAILS',
    payload: data,
  };
};

export const resetTripSelected = () => {
  return {
    type: 'TRIP_SELECTED_RESET',
  };
};

export const resetTripEditingInProgress = () => {
  return {
    type: 'TRIP_EDITING_IN_PROGRESS_RESET',
  };
};

export const resetTripLeads = () => {
  return {
    type: 'TRIP_LEADS_RESET',
  };
};
