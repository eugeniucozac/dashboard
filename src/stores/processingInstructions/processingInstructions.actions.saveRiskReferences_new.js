import {
  addLoader,
  authLogout,
  removeLoader,
  storeProcessingInstruction,
  updatePiFinancialCheckList,
  storeProcessingInstructionDocuments,
} from 'stores';
import * as utils from 'utils';
import get from 'lodash/get';

export const saveRiskReferences_new = (instruction) => (dispatch, getState) => {
  // prettier-ignore
  const { user, config: { vars: { endpoint }}, processingInstructions} = getState();
  const defaultError = {
    file: 'stores/processingInstructions.actions.saveRiskReferences',
  };

  const documents = get(processingInstructions, 'documents');

  dispatch(saveRiskReferencesRequest(instruction));
  dispatch(addLoader('saveRiskReferences'));

  return utils.api
    .put({
      token: user.auth.accessToken,
      endpoint: endpoint.ppService,
      path: 'instruction/saveRiskReferences',
      data: {
        ...instruction,
        createdBy: user.id,
        updatedBy: user.id,
      },
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      dispatch(saveRiskReferencesSuccess(data.data));
      dispatch(storeProcessingInstruction(data.data));
      const updatedDocuments = {
        ...documents,
        riskReferences: data.data.riskReferences,
      };

      dispatch(storeProcessingInstructionDocuments(updatedDocuments));
      dispatch(
        updatePiFinancialCheckList(
          data.data?.financialChecklistDetails?.map((element, index) => {
            return {
              ...element,
              convertedBrokerage: null,
              ppwOrPpcName: null,
              retainedBrokerageAmount: null,
              retainedBrokerageCurrencyCodeName: null,
              settlementCurrencyName: null,
              paymentBasisName: null,
              total: null,
              id: index,
            };
          })
        )
      );
      return data.data;
    })
    .catch((err) => {
      utils.api.handleError(err, { ...defaultError, message: 'API put error (saveRiskReferences)' });
      dispatch(saveRiskReferencesFailure(err));
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      return err;
    })
    .finally(() => {
      dispatch(removeLoader('saveRiskReferences'));
    });
};

export const saveRiskReferencesRequest = (params) => {
  return {
    type: 'PROCESSING_INSTRUCTIONS_SAVE_RISK_REFS_REQUEST',
    payload: params,
  };
};

export const saveRiskReferencesSuccess = (json) => {
  return {
    type: 'PROCESSING_INSTRUCTIONS_SAVE_RISK_REFS_SUCCESS',
    payload: json,
  };
};

export const saveRiskReferencesFailure = (error) => {
  return {
    type: 'PROCESSING_INSTRUCTIONS_SAVE_RISK_REFS_FAILURE',
    payload: error,
  };
};
