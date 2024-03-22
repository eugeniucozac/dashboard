import * as utils from 'utils';

export const setLocationUploadWizardExcelExtract =
  ({ headers, rows, columns }) =>
  (dispatch) => {
    dispatch({
      type: 'LOCATION_SET_UPLOAD_WIZARD_GIVEN_LOCATIONS',
      payload: {
        locations: rows,
        headers: columns,
      },
    });

    dispatch(setLocationUploadWizardHeaderMap({ headers }));
  };

export const setLocationUploadWizardHeaderMap =
  ({ headers }) =>
  (dispatch, getState) => {
    dispatch({ type: 'LOCATION_SET_UPLOAD_WIZARD_HEADER_MAP', payload: headers });

    const state = getState();
    const { givenLocations, dollarValues } = state.location;

    const locations = givenLocations.map((gl) => {
      return headers.reduce((l, header) => {
        let val = gl[header.value];
        l[header.key] = dollarValues.includes(header.key) ? utils.currency.cleanDollarString(val) : val;
        return l;
      }, {});
    });

    const validLocations = locations.filter((location) => utils.location.isValidLocation(location) && utils.location.isValidTIV(location));
    const notValidTIVLocations = locations.filter((location) => !utils.location.isValidTIV(location)).length;
    const notValidGeoLocations = locations
      .filter((location) => utils.location.isValidTIV(location))
      .filter((location) => !utils.location.isValidLocation(location)).length;
    console.log('notValidTIVLocations', notValidTIVLocations, notValidGeoLocations);
    dispatch({
      type: 'LOCATION_SET_UPLOAD_WIZARD_INVALID_LOCATIONS',
      payload: {
        invalidTIVLocations: notValidTIVLocations,
        invalidGeoLocations: notValidGeoLocations,
      },
    });

    dispatch({ type: 'LOCATION_SET_UPLOAD_WIZARD_LOCATIONS', payload: validLocations });
  };
