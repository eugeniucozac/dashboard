import { hideModal } from 'stores';

export const setRiskRefsUploadWizardExcelExtract =
  ({ headers, rows, columns }) =>
  (dispatch) => {
    dispatch({
      type: 'PROCESSING_INSTRUCTIONS_SET_UPLOAD_WIZARD_GIVEN_RISKREFS',
      payload: {
        givenRiskRefs: rows,
        headers: columns,
      },
    });

    dispatch(setRiskRefsUploadWizardHeaderMap({ headers }));
  };

export const setRiskRefsUploadWizardHeaderMap =
  ({ headers }) =>
  (dispatch, getState) => {
    dispatch({ type: 'PROCESSING_INSTRUCTIONS_SET_UPLOAD_WIZARD_HEADER_MAP', payload: headers });

    const state = getState();
    const { givenRiskRefs } = state.processingInstructions;

    const riskRefsUploadedFromExcel = givenRiskRefs.map((gl) => {
      return headers.reduce((l, header) => {
        let val = gl[header.value];
        l[header.key] = val;
        return l;
      }, {});
    });

    dispatch({ type: 'PROCESSING_INSTRUCTIONS_SET_UPLOAD_WIZARD_RISKREFS', payload: riskRefsUploadedFromExcel });
  };

export const submitExcelUploadedRiskRefs = () => (dispatch, getState) => {
  const state = getState();
  const { riskRefsUploadedFromExcel } = state.processingInstructions;

  dispatch({ type: 'PROCESSING_INSTRUCTIONS_SUBMIT_UPLOAD_EXCEL_RISKREFS', payload: riskRefsUploadedFromExcel });
  dispatch({ type: 'PROCESSING_INSTRUCTIONS_SET_UPLOAD_WIZARD_HEADER_MAP_RESET' });
  dispatch(hideModal());
};
