// app
import * as utils from 'utils';

const initialState = {
  folders: [],
  documents: [],
  selected: {},
  loading: false,
};

const documentReducers = (state = initialState, action) => {
  switch (action.type) {
    case 'REPORTING_DOCS_GET_REQUEST':
      return {
        ...state,
        loading: true,
      };

    case 'DOCUMENT_SET_FOLDER_STRUCTURE':
      return {
        ...state,
        folders: utils.generic.getLabels(action.payload, 'documents.folders'),
      };
    case 'REPORTING_DOCS_GET_FAILURE':
      return {
        ...state,
        loading: false,
      };
    case 'DOCUMENT_UPLOAD_SUCCESS_REPORTING':
      const folder = [
        {
          id: action.payload?.id,
          reportGroupId: action.payload?.reportGroupId,
          folderName: action.payload?.folderName,
          label: action.payload?.folderName,
        },
      ];
      return {
        ...state,
        folders: folder,
      };

    case 'DOCUMENT_SET_FOLDER_STRUCTURE_REPORTING':
      const folders = action.payload?.map((f) => ({
        id: f?.id,
        reportGroupId: f?.reportGroupId,
        folderName: f?.folderName,
        label: f?.folderName,
      }));

      return {
        ...state,
        folders: folders,
        loading: false,
      };

    case 'DOCUMENTS_SET_FOR_PLACEMENT':
      return {
        ...state,
        documents: action.payload,
        loading: false,
      };

    case 'DOCUMENT_UPLOAD_POST_SUCCESS':
      return {
        ...state,
        documents: [...state.documents, ...action.payload.data],
        selected: action.payload.data,
      };

    case 'DOCUMENT_DESELECT':
      return {
        ...state,
        folders: [],
        documents: [],
      };

    case 'DELETE_DOCUMENT_SUCCESS':
      return {
        ...state,
        documents: state.documents.filter((document) => document.id !== action.payload.id),
      };

    default:
      return state;
  }
};

export default documentReducers;
