import { get } from 'lodash';
import types from './types';
import * as utils from 'utils';

const initialState = {
  view: {
    files: [],
    versionHistory: {},
    fileMetaData: {},
    isDmsFileViewGridDataLoading: false,
    isDmsWidgetDocsLoading: false,
  },
  search: {
    files: [],
    isDmsSearchDataLoading: false,
  },
  upload: {
    metaData: {
      requestParams: { referenceId: '', sectionRef: '' },
      data: {},
      isLoading: false,
    },
    documentsUploaded: {},
  },
  contextSubType: {
    type: '',
    caseIncidentID: '',
    caseIncidentNotesID: '',
    refId: '',
  },
  dmsWidgetExpanded: false,
  docViewer: {
    isOpen: false,
  },
  advanceSearchValues: {},
  claimDocsMetaData: {},
  widgetDocDetails: {},
  clientSideUploadFiles: {
    uploadFileDetails: {},
    documentTableList: [],
    documentNameList: [],
    linkedDocumentList: [],
  },
  multipleContextDocs: {
    files: [],
    versionHistory: {},
    fileMetaData: {},
    isLoading: false,
  },
};

const dmsReducers = (state = initialState, action) => {
  switch (action.type) {
    case 'DMS_DOCUMENT_TYPES_GET_SUCCESS':
      return {
        ...state,
        documentTypes: action.payload,
      };

    case 'DMS_SEARCH_DOCUMENTS_REQUEST':
      return {
        ...state,
        search: {
          ...state.search,
          isDmsSearchDataLoading: true,
        },
      };

    case 'DMS_SEARCH_DOCUMENTS_SUCCESS':
      return {
        ...state,
        search: {
          ...state.search,
          files: action.payload,
          itemsTotal: get(action.payload, 'totalElements', 0),
          query: get(action.payload, 'searchBy') || [],
          filters: state?.search?.filters || get(action.payload, 'data.filterValue'),
          isDmsSearchDataLoading: false,
        },
      };

    case 'DMS_FILTER_DOCUMENTS_SUCCESS':
      return {
        ...state,
        search: {
          ...state.search,
          files: state?.search?.files || action.payload,
          query: get(action.payload, 'searchBy') || [],
          filters: Object.keys(action.payload?.data?.filterValue).reduce((options, field) => {
            options[field] = action.payload.data.filterValue[field].sort((a, b) =>
              utils.string.capitalise(a.name) > utils.string.capitalise(b.name) ? 1 : -1
            );
            return options;
          }, {}),
        },
      };

    case 'DMS_SEARCH_DOCUMENTS_FAILURE':
      return {
        ...state,
        search: {
          ...state.search,
          isDmsSearchDataLoading: false,
        },
      };

    case 'DMS_SEARCH_DOCUMENTS_RESET':
      return {
        ...state,
        search: initialState.search,
      };

    case 'DMS_UPLOAD_DOCUMENTS_RESET':
      return {
        ...state,
        upload: initialState.upload,
      };

    case 'DMS_VIEW_TABLE_DOCUMENTS_REQUEST':
      return {
        ...state,
        view: {
          ...state.view,
          isDmsFileViewGridDataLoading: true,
        },
      };
    case 'DMS_WIDGET_DOCUMENT_REQUEST':
      return {
        ...state,
        widgetDocDetails: {
          ...state.widgetDocDetails,
          isDmsWidgetDocsLoading: true,
        },
      };
    case 'DMS_VIEW_TABLE_DOCUMENTS_SUCCESS':
      return {
        ...state,
        view: {
          ...state.view,
          files: action.payload,
          isDmsFileViewGridDataLoading: false,
        },
      };
    case 'DMS_GET_MULTIPLE_CONTEXT_DOCUMENTS_SUCCESS':
      return {
        ...state,
        multipleContextDocs: {
          ...state.multipleContextDocs,
          files: action.payload,
          isLoading: false,
        },
      };
    case 'DMS_GET_MULTIPLE_CONTEXT_DOCUMENTS_REQUEST':
      return {
        ...state,
        multipleContextDocs: {
          ...initialState.multipleContextDocs,
          isLoading: true,
        },
      };
    case 'DMS_GET_MULTIPLE_CONTEXT_DOCUMENTS_FAILURE':
      return {
        ...state,
        multipleContextDocs: {
          ...initialState.multipleContextDocs,
          isLoading: false,
        },
        error: action.payload,
      };
    case 'DMS_WIDGET_DOCUMENTS_SUCCESS':
      const docs = action.payload?.reduce((dmsDocs, doc) => {
        const docRefId = doc?.referenceId;
        const docDetail = dmsDocs?.[docRefId] ? [...dmsDocs?.[docRefId], doc] : [doc];
        dmsDocs[docRefId] = docDetail;
        return dmsDocs;
      }, {});
      return {
        ...state,
        widgetDocDetails: {
          ...state.widgetDocDetails,
          isDmsWidgetDocsLoading: false,
          ...docs,
        },
      };
    case 'DMS_VIEW_TABLE_DOCUMENTS_FAILURE':
      return {
        ...state,
        view: {
          ...state.view,
          isDmsFileViewGridDataLoading: false,
        },
      };
    case 'DMS_WIDGET_DOCUMENTS_FAILURE':
      return {
        ...state,
        widgetDocDetails: {
          ...state.widgetDocDetails,
          isDmsWidgetDocsLoading: false,
        },
      };
    case 'DMS_VIEW_DOCUMENTS_RESET':
      return {
        ...state,
        view: {
          ...initialState.view,
        },
      };

    case types.GET_DMS_VERSION_HISTORY_SUCCESS:
      return {
        ...state,
        view: {
          ...state.view,
          versionHistory: action.payload,
        },
      };

    case 'DMS_HISTORY_DOCUMENTS_RESET':
      return {
        ...state,
        view: {
          ...state.view,
          versionHistory: initialState.view.versionHistory,
        },
      };

    case 'GET_EDIT_DMS_META_DATA_SUCCESS':
      return {
        ...state,
        view: {
          ...state.view,
          fileMetaData: action.payload,
        },
      };
    case 'DMS_EDIT_META_DATA_RESET':
      return {
        ...state,
        view: {
          ...state.view,
          fileMetaData: initialState.view.fileMetaData,
        },
      };

    case 'DMS_METADATA_GET_REQUEST':
      const { referenceId, sectionRef } = action.payload;
      return {
        ...state,
        upload: {
          ...state.upload,
          metaData: {
            ...state.upload.metaData,
            requestParams: { referenceId: referenceId, sectionRef: sectionRef },
            data: initialState.upload.metaData.data,
            isLoading: true,
          },
        },
        claimDocsMetaData: {
          data: initialState.claimDocsMetaData,
        },
      };
    case 'DMS_METADATA_GET_SUCCESS':
      return {
        ...state,
        upload: {
          ...state.upload,
          metaData: { ...state.upload.metaData, data: action.payload, isLoading: false },
        },
        claimDocsMetaData: {
          ...state.claimDocsMetaData,
          data: action.payload?.claimRef ? action.payload : {},
        },
      };
    case 'DMS_METADATA_GET_ERROR':
      return {
        ...state,
        upload: { ...state.upload, metaData: { ...initialState.upload.metaData } },
        claimDocsMetaData: {
          ...state.claimDocsMetaData,
          data: initialState.claimDocsMetaData,
        },
      };

    case 'DMS_POST_DOCUMENTS_REQUEST':
      return {
        ...state,
        upload: { ...state.upload, documentsUploaded: initialState.upload.documentsUploaded },
      };

    case 'DMS_POST_DOCUMENTS_SUCCESS':
      return {
        ...state,
        upload: { ...state.upload, documentsUploaded: action.payload },
      };

    case 'DMS_POST_DOCUMENTS_ERROR':
      return {
        ...state,
        upload: { ...state.upload, documentsUploaded: initialState.upload.documentsUploaded },
      };

    case 'DMS_TASK_CONTEXT_TYPE_SET':
      return {
        ...state,
        contextSubType: {
          ...state.contextSubType,
          ...action.payload,
        },
      };

    case 'DMS_TASK_CONTEXT_TYPE_RESET':
      return {
        ...state,
        contextSubType: initialState.contextSubType,
      };

    case 'DMS_WIDGET_EXPANDED':
      return {
        ...state,
        dmsWidgetExpanded: action.payload,
      };

    case 'DMS_DOC_VIEWER_SET_STATE':
      return {
        ...state,
        docViewer: {
          isOpen: action.payload,
        },
      };

    case 'DMS_ADVANCE_SEARCH_VALUES':
      return {
        ...state,
        advanceSearchValues: action.payload,
      };

    case 'RESET_ADVANCE_SEARCH_VALUES':
      return {
        ...state,
        advanceSearchValues: initialState.advanceSearchValues,
      };

    case 'RESET_WIDGET_CLAIMS_METADATA':
      return {
        ...state,
        claimDocsMetaData: initialState.claimDocsMetaData,
      };

    case 'RESET_DMS_WIDGET_DOCUMENTS':
      return {
        ...state,
        widgetDocDetails: initialState.widgetDocDetails,
      };

    case 'DMS_CLIENT_SIDE_UPLOAD_DOCUMENTS':
      return {
        ...state,
        clientSideUploadFiles: {
          ...state.clientSideUploadFiles,
          uploadFileDetails: action.payload?.fileDetails,
          documentTableList: action.payload?.documentList,
        },
      };

    case 'DMS_CLIENT_SIDE_GET_UPLOADED_DOCUMENT_NAMES':
      return {
        ...state,
        clientSideUploadFiles: {
          ...state.clientSideUploadFiles,
          documentNameList: action.payload?.documentNameList,
        },
      };

    case 'REMOVE_DMS_CLIENT_SIDE_UPLOADED_DOCUMENT':
      return {
        ...state,
        clientSideUploadFiles: action.payload?.uploadedFiles,
      };

    case 'RESET_DMS_CLIENT_SIDE_UPLOADED_DOCUMENT':
      return {
        ...state,
        clientSideUploadFiles: {
          ...state.clientSideUploadFiles,
          uploadFileDetails: initialState.clientSideUploadFiles.uploadFileDetails,
          documentTableList: initialState.clientSideUploadFiles.documentTableList,
          documentNameList: initialState.clientSideUploadFiles.documentNameList,
        },
      };

    case 'DMS_CLIENT_SIDE_LINK_DOCUMENTS':
      return {
        ...state,
        clientSideUploadFiles: {
          ...state.clientSideUploadFiles,
          documentTableList: action.payload?.documentList,
          linkedDocumentList: action.payload?.linkedDocList,
        },
      };

    case 'RESET_DMS_CLIENT_SIDE_LINKED_DOCUMENT':
      return {
        ...state,
        clientSideUploadFiles: {
          ...state.clientSideUploadFiles,
          linkedDocumentList: initialState.clientSideUploadFiles.linkedDocumentList,
          documentTableList: action.payload?.documentTableList,
          documentNameList: action.payload?.documentNameList,
        },
      };

    default:
      return state;
  }
};

export default dmsReducers;
