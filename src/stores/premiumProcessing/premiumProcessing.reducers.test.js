import reducer from './premiumProcessing.reducers';

describe('STORES › REDUCERS › premium processing', () => {
  const initialState = {
    isMultiSelectEnabled: false,
    loading: false,
    error: [],
    selected: [],
    isCaseTableHidden: false,
    emailSentStatus: false,
    caseTaskViewType: '',
    caseRfiDetails: {},
    casesList: {
      isTaskGridLoading: true,
      isTaskGridDataFetchingError: false,
      selectedTaskType: '',
      items: [],
      itemsTotal: 0,
      page: 1,
      pageSize: 10,
      pageTotal: 0,
      type: 'WL',
      isloadingFilters: false,
      appliedFilters: [],
      isCheckSigning: false,
      query: '',
      searchBy: '',
      sort: {
        by: 'caseCreatedOn',
        type: 'lexical',
        direction: 'desc',
      },
      filters: {},
    },
    assignedTo: {
      assigning: false,
    },
    technicians: {
      items: [],
      loading: false,
    },
    issueDocuments: {
      documentFromLondonTeam: true,
      nonBureau: true,
      bureauInsurer: true,
    },
    rfi: {
      history: [],
      queryCodes: [],
      responseDate: '',
      saveDraft: [],
      newRFI: [],
    },
    caseTeamModule: {
      error: false,
      isCaseTeamModuleLoading: true,
    },
    isCaseRfiSubTabsLoading: false,
    caseRfiSubTabs: [],
    isCaseTeamLoading: false,
    caseDetails: {
      frontEndSendDocs: false,
      caseTeamData: {},
      caseStageDetails: [],
      caseNotes: {
        notesHistory: [],
      },
      caseIssueDocuments: {
        nonBureauList: {
          items: [],
        },
        caseClientList: {
          items: [],
        },
        bureauList: {
          items: [],
        },
      },
      isCheckSigningCaseHistoryLoading: false,
      checkSigningCaseHistory: [],
      caseHistoryDetails: {
        error: false,
        isCaseHistoryDetailsLoading: true,
        rejectDetailsHistory: {},
        resubmitDetailsHistory: [],
        qualityControlHistory: [],
      },
      openRfi: false,
      caseId: null,
      taskId: '',
      processId: '',
      instructionId: '',
      instructionStatusId: '',
      fecId: '',
      policyId: '',
      taskView: '',
      isCheckSigning: false,
      fecEmail: '',
    },
    assignedToUsers: [],
    multiSelectedRows: [],
    postAssignToUser: {},
    bpmFlag: [],
    bordereauType: [],
    bpmStage: [],
    facilityType: [],
    departments: [],
    rejectCase: {},
    rejectCloseCase: {},
    checkSigningCase: {},
    checkSigningCompleteCase: {},
    checkSigningCancelCase: {},
    checkSigningRejectCase: {},
    rfiResolutionCodes: [],
    checkSigningRejectCreateCase: {},
    bureauRfiDetails: {},
  };

  const prevState = {
    isMultiSelectEnabled: false,
    loading: false,
    selected: [],
    isCaseTableHidden: false,
    caseTaskViewType: '',
    casesList: {
      isTaskGridLoading: true,
      isTaskGridDataFetchingError: false,
      isCheckSigning: false,
      selectedTaskType: '',
      items: [
        { id: 1, caseId: 1 },
        { id: 2, caseId: 2 },
        { id: 3, caseId: 3 },
        { id: 4, caseId: 4 },
        { id: 5, caseId: 5 },
        { id: 6, caseId: 6 },
      ],
      itemsTotal: 6,
      page: 2,
      pageSize: 10,
      pageTotal: 2,
      type: 'WL',
      isloadingFilters: false,
      appliedFilters: [],
      query: '',
      searchBy: '',
      sort: {
        by: 'caseCreatedOn',
        type: 'lexical',
        direction: 'desc',
      },
      filters: {},
    },

    assignedTo: {
      assigning: false,
    },
    technicians: {
      items: [
        { id: 1, name: 'one' },
        { id: 2, name: 'two' },
      ],
      loading: false,
    },
    issueDocuments: {
      documentFromLondonTeam: true,
      nonBureau: true,
      bureauInsurer: true,
    },
    rfi: {
      history: [],
      queryCodes: [],
      responseDate: '',
      saveDraft: [],
    },
    caseTeamModule: {},
    caseRfiSubTabs: [],
    caseDetails: {
      frontEndSendDocs: false,
      caseTeamData: {},
      caseStageDetails: [],
      caseNotes: {
        notesHistory: [],
      },
      caseIssueDocuments: {
        nonBureauList: {
          items: [],
        },
        caseClientList: {
          items: [],
        },
        bureauList: {
          items: [],
        },
      },
      checkSigningCaseHistory: [],
      caseHistoryDetails: {
        rejectDetailsHistory: {},
        resubmitDetailsHistory: [],
        qualityControlHistory: [],
      },
      caseId: null,
      taskId: '',
      instructionId: '',
      instructionStatusId: '',
      policyId: '',
      taskView: '',
      isCheckSigning: false,
    },
    multiSelectedRows: [],
    assignedToUsers: [],
    postAssignToUser: {},
    bpmFlag: [],
    bordereauType: [],
    bpmStage: [],
    facilityType: [],
    departments: [],
    rejectCase: {},
    rejectCloseCase: {},
    checkSigningCase: {},
    checkSigningCompleteCase: {},
    checkSigningCancelCase: {},
    checkSigningRejectCase: {},
    checkSigningRejectCreateCase: {},
    bureauRfiDetails: {},
  };

  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  describe('PREMIUM_PROCESSING_CASES_LIST_GET_REQUEST', () => {
    it('should handle to request cases list', () => {
      // arrange
      const action = { type: 'PREMIUM_PROCESSING_CASES_LIST_GET_REQUEST' };

      // assert
      expect(reducer(initialState, action)).toEqual({ ...initialState, loading: true });
      expect(reducer(prevState, action)).toEqual({
        ...prevState,
        loading: true,
      });
    });
  });

  describe('PREMIUM_PROCESSING_CASES_LIST_GET_SUCCESS', () => {
    it('should handle reducer to get cases list', () => {
      // arrange
      const action = {
        type: 'PREMIUM_PROCESSING_CASES_LIST_GET_SUCCESS',
        payload: {
          items: [
            { id: 10, caseId: 10 },
            { id: 11, caseId: 11 },
            { id: 12, caseId: 12 },
          ],
          pagination: {
            page: 1,
            size: 10,
            totalPages: 1,
            totalElements: 3,
            direction: 'desc',
            orderBy: 'qwerty',
            query: 'bar',
          },
          type: 'foo',
        },
      };

      // assert
      expect(reducer(initialState, action)).toEqual({
        ...initialState,
        casesList: {
          isTaskGridLoading: false,
          isTaskGridDataFetchingError: false,
          ...initialState.casesList,
          items: [
            { id: 10, caseId: 10 },
            { id: 11, caseId: 11 },
            { id: 12, caseId: 12 },
          ],
          itemsTotal: 3,
          page: 1,
          pageSize: 10,
          pageTotal: 1,
          type: 'foo',
          query: 'bar',
          sort: {
            ...initialState.casesList.sort,
            by: 'qwerty',
            direction: 'desc',
          },
        },
        selected: [],
      });
      expect(reducer(prevState, action)).toEqual({
        ...prevState,
        casesList: {
          ...prevState.casesList,
          items: [
            { id: 10, caseId: 10 },
            { id: 11, caseId: 11 },
            { id: 12, caseId: 12 },
          ],
          itemsTotal: 3,
          page: 1,
          pageSize: 10,
          pageTotal: 1,
          type: 'foo',
          query: 'bar',
          sort: {
            ...prevState.casesList.sort,
            by: 'qwerty',
            direction: 'desc',
          },
        },

        selected: [],
        isMultiSelectEnabled: false,
      });
    });
  });
});
