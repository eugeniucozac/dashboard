import reducer from './document.reducers';

describe('STORES › REDUCERS › document', () => {
  const initialState = {
    folders: [],
    documents: [],
    selected: {},
    loading: false,
  };

  it('should return the initial state', () => {
    // arrange
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('should handle DOCUMENT_SET_FOLDER_STRUCTURE', () => {
    // arrange
    const expectedPayload = [
      { id: 'VALUES', label: 'Values' },
      { id: 'SLIPS', label: 'Slips' },
      { id: 'ENDORSEMENTS', label: 'Endorsements' },
    ];
    const action = {
      type: 'DOCUMENT_SET_FOLDER_STRUCTURE',
      payload: expectedPayload,
    };
    const expectedState = {
      ...initialState,
      folders: [
        { id: 'VALUES', label: 'documents.folders.values' },
        { id: 'SLIPS', label: 'documents.folders.slips' },
        { id: 'ENDORSEMENTS', label: 'documents.folders.endorsements' },
      ],
    };

    // assert
    expect(reducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle DOCUMENTS_SET_FOR_PLACEMENT', () => {
    // arrange
    const expectedPayload = [{ foo: 1 }];
    const action = {
      type: 'DOCUMENTS_SET_FOR_PLACEMENT',
      payload: expectedPayload,
    };
    const expectedState = {
      ...initialState,
      documents: expectedPayload,
    };

    // assert
    expect(reducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle DOCUMENT_UPLOAD_POST_SUCCESS ', () => {
    // arrange
    const expectedPayload = {
      data: [
        {
          createdAt: '2021-11-08T12:48:39.966+0000',
          fileName: 'State and Limits.xlsx',
          folder: 'MODELLING',
          fullPath: 'Modelling/bc398672-63f5-40dc-9a5d-7178e54673da/State and Limits.xlsx',
          id: 749,
          modellingId: null,
          placementId: '234',
          placementName: 'Strata Plan NWS 1282 - Hemlock Valley',
          placementYear: '2021',
          teamId: 'unknown',
          teamName: 'unknown',
          uploaderEmail: 'anindita.de@ardonaghspecialty.com',
        },
      ],
    };
    const action = {
      type: 'DOCUMENT_UPLOAD_POST_SUCCESS',
      payload: expectedPayload,
    };
    const expectedState = {
      ...initialState,
      documents: [...expectedPayload.data],
      selected: expectedPayload.data,
    };

    // assert
    expect(reducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle DOCUMENT_DESELECT', () => {
    // arrange
    const action = { type: 'DOCUMENT_DESELECT' };

    const previousState = {
      ...initialState,
      folders: [{ id: 1 }],
      documents: [{ id: 2 }],
    };

    // assert
    expect(reducer(previousState, action)).toEqual(initialState);
  });

  it('should handle DELETE_DOCUMENT_SUCCESS', () => {
    // arrange
    const action = {
      type: 'DELETE_DOCUMENT_SUCCESS',
      payload: { id: 2 },
    };
    const previousState = {
      ...initialState,
      documents: [{ id: 1 }, { id: 2 }, { id: 3 }],
    };
    const expectedState = {
      ...initialState,
      documents: [{ id: 1 }, { id: 3 }],
    };

    // assert
    expect(reducer(previousState, action)).toEqual(expectedState);
  });
});
