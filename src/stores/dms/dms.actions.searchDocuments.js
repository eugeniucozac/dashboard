import { authLogout, enqueueNotification } from 'stores';
import * as utils from 'utils';
import moment from 'moment';
import * as constants from 'consts';

export const searchDmsDocuments = (context, obj, formData) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint } } } = getState();
  const isOnlyFiltering = formData?.requestType === constants.CLAIM_PROCESSING_REQ_TYPES.filter;
  const defaultError = {
    file: 'stores/dms.actions.searchDmsDocuments',
  };

  const constructFilter = (filtersObj) => {
    if (!filtersObj) return;
    const filteredArray = [];
    for (const [key, value] of Object.entries(filtersObj)) {
      if (value?.length > 0) {
        filteredArray.push({
          column: key,
          filterValue: value,
        });
      }
    }
    return filteredArray;
  };

  const getAdvancedSearchFields = (docType) => {
    if (!docType) return null;

    // filter form fields matching the selected document type
    // return an array of objects without the document type prefix:
    // { Payment_date: 2021 }  --->  { data: 2021 }
    // { Payment_lossRef: 'abc' }  --->  { lossRef: 'abc }
    return Object.entries(formData)
      .filter(([key, value]) => {
        return key.split('_')[0] === docType.documentTypeDescription;
      })
      .map(([key, value]) => {
        return {
          prop: key.split('_')[1],
          value,
        };
      });
  };

  !isOnlyFiltering && dispatch(searchDmsDocumentsRequest(context, obj, formData));

  if (!context || !obj || !formData) {
    dispatch(searchDmsDocumentsFailure({ ...defaultError, message: 'Missing params' }));
    return;
  }

  const apiParams = {
    sectionType: context,
    referenceId: obj.id,
    policyId: formData?.policyId,
    documentTypeId: formData?.documentType?.documentTypeID || '',
    divisionIds: formData?.divisionIds || [],
    year: formData?.year ? moment(formData?.year).format('YYYY') : '',
    lossId: formData?.lossId,
    claimId: formData?.claimId,
    insuredName: formData?.insuredName,
    metadataFields: getAdvancedSearchFields(formData?.documentType),
    pageNumber: formData?.page || 0,
    pageSize: formData?.pageSize || constants.DMS_SEARCH_TABLE_DEFAULT_ROWS,
    requestType: formData?.requestType || constants.CLAIM_PROCESSING_REQ_TYPES.search,
    documentName: formData?.documentName,
    departmentName: formData?.division,
  };

  // used for sorting on search, requestType(is only sent for filtering purposes)
  if (formData?.requestType === 'search') {
    apiParams.sorts = {
      dir: formData?.dir || 'desc',
      prop: formData?.by || 'uploadedDate',
    };
  }

  if (formData?.filterRequest) {
    apiParams.filter = constructFilter(formData?.filterRequest);
  }

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.dmsService,
      path: 'dms/search/document',
      data: apiParams,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      if (formData?.requestType && isOnlyFiltering) {
        dispatch(filterDmsDocumentsSuccess(data));
      } else {
        dispatch(searchDmsDocumentsSuccess(data));
      }
      return data;
    })
    .catch((err) => {
      utils.api.handleError(err, defaultError);
      dispatch(enqueueNotification('dms.search.notifications.failedSearch', 'error'));
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(searchDmsDocumentsFailure(err));
      return err;
    });
};

export const searchDmsDocumentsRequest = (context, obj, formData) => {
  return {
    type: 'DMS_SEARCH_DOCUMENTS_REQUEST',
    payload: { context, obj, formData },
  };
};

export const searchDmsDocumentsSuccess = (data) => {
  return {
    type: 'DMS_SEARCH_DOCUMENTS_SUCCESS',
    payload: data,
  };
};

export const searchDmsDocumentsFailure = (error) => {
  return {
    type: 'DMS_SEARCH_DOCUMENTS_FAILURE',
    payload: error,
  };
};

export const filterDmsDocumentsSuccess = (data) => {
  return {
    type: 'DMS_FILTER_DOCUMENTS_SUCCESS',
    payload: data,
  };
};
