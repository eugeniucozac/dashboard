import reducer from './claims.reducers';

describe('STORES › REDUCERS › claims', () => {
  const initialState = {
    isChoosing: false,
    catCodes: [],
    claimantNames: [],
    lossQualifiers: [],
    lossInformation: {},
    claimsInformation: [],
    settlementCurrencies: [],
    policyData: {
      policyID: null,
    },
    policyInformation: {},
    policies: {
      items: null,
      itemsTotal: 0,
      page: 1,
      pageSize: 5,
      pageTotal: 0,
      query: '',
      sort: {
        by: 'policyRef',
        direction: 'DESC',
      },
    },
    interest: {
      items: [],
      selectedInterest: '',
    },
    underWritingGroups: {
      items: [],
      percentageOfSelected: null,
    },
    allClaimDetails: {},
    claimDetailInformation: {},
    claimDetailInformationSuccess: {},
    beAdjuster: { items: [], selectedbeAdjuster: null },
    priorities: [],
  };

  it('should return the initial state', () => {
    // arrange
    //expect(reducer(undefined, {})).toEqual(initialState);
  });

  describe('get', () => {
    it('should handle CLAIMS_DETAILS_SUCCESS', () => {
      const action = {
        type: 'CLAIMS_DETAILS_SUCCESS',
        payload: {
          policyUnderWritingGroupDtoList: null,
          claimID: 0,
          lossQualifierID: 0,
          policyID: 35963,
          lossDetailID: 1003,
          claimStatusID: 0,
          sourceID: 1,
          policyInterestID: 0,
          claimReference: null,
          claimantName: null,
          processNotes: null,
          settlementCurrencyCodeID: 0,
          settlementCurrencyCode: null,
          location: null,
          claimExpertID: null,
          adjusterID: 0,
          adjusterName: null,
          adjusterReference: null,
          isEscalated: 0,
          isUrgent: 0,
          movementType: null,
          claimStatus: 'DRAFT',
          basisOfOrder: 0,
          orderPercentage: 0,
          submittedDate: null,
          fromDate: '2021-05-24T14:48:00Z',
          toDate: '2021-05-26T14:48:00Z',
          createdBy: null,
          createdDate: null,
          updatedBy: null,
          updatedDate: null,
          isActive: 0,
          lossQualifierName: null,
          fgunarrative: null,
        },
      };

      const expectedState = {
        ...initialState,
        allClaimDetails: action.payload,
      };

      // assert
      expect(reducer(initialState, action)).toEqual(expectedState);
    });
  });

  // describe('CLAIMS_CAT_CODES_GET_SUCCESS', () => { });

  // describe('CLAIMS_LOSS_QUALIFIERS_GET_SUCCESS', () => { });

  describe('CLAIMS PRIORITY Suite', () => {
    it('should handle CLAIMS_PRIORITY_LEVELS_GET_SUCCESS', () => {
      const action = {
        type: 'CLAIMS_PRIORITY_LEVELS_GET_SUCCESS',
        payload: [
          { id: 1, name: null, description: 'Low' },
          { id: 2, name: null, description: 'High' },
          { id: 3, name: null, description: 'Medium' },
        ],
      };

      const expectedState = {
        ...initialState,
        priorities: [
          { id: 1, name: null, description: 'Low' },
          { id: 2, name: null, description: 'High' },
          { id: 3, name: null, description: 'Medium' },
        ],
      };
      expect(reducer(initialState, action).priorities).toEqual(expectedState.priorities);
    });
    it('should handle CLAIMS_PRIORITY_LEVELS_GET_FAILURE', () => {
      const action = {
        type: 'CLAIMS_PRIORITY_LEVELS_GET_FAILURE',
        payload: {
          timestamp: '2021-07-06T15:54:07.206+00:00',
          status: 404,
          error: 'Not Found',
          message: '',
          path: '/claims-service/api/data/gui/claims/priority',
        },
      };

      const expectedState = {
        ...initialState,
        error: {
          timestamp: '2021-07-06T15:54:07.206+00:00',
          status: 404,
          error: 'Not Found',
          message: '',
          path: '/claims-service/api/data/gui/claims/priority',
        },
      };
      expect(reducer(initialState, action).error).toEqual(expectedState.error);
    });
  });

  describe('CLAIMS SAVE Suite', () => {
    it('should handle CLAIMS_DETAILS_INFORMATION_POST_SUCCESS', () => {
      const action = {
        type: 'CLAIMS_DETAILS_INFORMATION_POST_SUCCESS',
        payload: '1231',
      };

      const expectedState = {
        ...initialState,
        claimDetailInformationSuccess: '1231',
      };
      expect(reducer(initialState, action).claimDetailInformationSuccess).toEqual(expectedState.claimDetailInformationSuccess);
    });
    it('should handle CLAIMS_DETAILS_INFORMATION_POST_FAILURE', () => {
      const action = {
        type: 'CLAIMS_DETAILS_INFORMATION_POST_FAILURE',
        payload: {
          timestamp: '2021-07-06T15:54:07.206+00:00',
          status: 404,
          error: 'Not Found',
          message: '',
          path: '/claims-service/api/data/claims',
        },
      };

      const expectedState = {
        ...initialState,
        error: {
          timestamp: '2021-07-06T15:54:07.206+00:00',
          status: 404,
          error: 'Not Found',
          message: '',
          path: '/claims-service/api/data/claims',
        },
      };
      expect(reducer(initialState, action).error).toEqual(expectedState.error);
    });
  });

  describe('CLAIMS PREVIEW FETCH Suite', () => {
    it('should handle CLAIMS_PREVIEW_INFORMATION_GET_SUCCESS', () => {
      const action = {
        type: 'CLAIMS_PREVIEW_INFORMATION_GET_SUCCESS',
        payload: {
          policyUnderWritingGroupDtoList: [],
          newClaimants: null,
          claimID: 1253,
          lossQualifierID: 2,
          policyID: 0,
          lossDetailID: 0,
          claimStatusID: 0,
          sourceID: 0,
          policyInterestID: 2995,
          claimReference: null,
          claimantName: 'Lake Oswego Corporation',
          processNotes: 'Process Ninja Notes',
          settlementCurrencyCodeID: 0,
          settlementCurrencyCode: 'USD',
          location: '123 brand budapest Hotel, Paris',
          claimExpertID: null,
          nonBEAdjusterName: null,
          beAdjusterID: 275479,
          priorityID: 0,
          adjusterReference: '',
          isEscalated: 0,
          isUrgent: 0,
          movementType: null,
          claimStatus: 'DRAFT',
          basisOfOrder: 0,
          orderPercentage: 100,
          submittedDate: null,
          lossFromDate: '2021-05-24T14:48:00Z',
          lossToDate: '2021-05-26T14:48:00Z',
          createdBy: null,
          createdDate: null,
          updatedBy: null,
          updatedDate: null,
          isActive: 0,
          lossQualifierName: null,
          priorityDescription: 'Low',
          fgunarrative: 'by self admission',
        },
      };

      const expectedState = {
        ...initialState,
        claimsInformation: {
          policyUnderWritingGroupDtoList: [],
          newClaimants: null,
          claimID: 1253,
          lossQualifierID: 2,
          policyID: 0,
          lossDetailID: 0,
          claimStatusID: 0,
          sourceID: 0,
          policyInterestID: 2995,
          claimReference: null,
          claimantName: 'Lake Oswego Corporation',
          processNotes: 'Process Ninja Notes',
          settlementCurrencyCodeID: 0,
          settlementCurrencyCode: 'USD',
          location: '123 brand budapest Hotel, Paris',
          claimExpertID: null,
          nonBEAdjusterName: null,
          beAdjusterID: 275479,
          priorityID: 0,
          adjusterReference: '',
          isEscalated: 0,
          isUrgent: 0,
          movementType: null,
          claimStatus: 'DRAFT',
          basisOfOrder: 0,
          orderPercentage: 100,
          submittedDate: null,
          lossFromDate: '2021-05-24T14:48:00Z',
          lossToDate: '2021-05-26T14:48:00Z',
          createdBy: null,
          createdDate: null,
          updatedBy: null,
          updatedDate: null,
          isActive: 0,
          lossQualifierName: null,
          priorityDescription: 'Low',
          fgunarrative: 'by self admission',
        },
      };
      expect(reducer(initialState, action).claimsInformation).toEqual(expectedState.claimsInformation);
    });
    it('should handle CLAIMS_PREVIEW_INFORMATION_GET_FAILURE', () => {
      const claimSubmissionId = '1231';
      const action = {
        type: 'CLAIMS_PREVIEW_INFORMATION_GET_FAILURE',
        payload: {
          timestamp: '2021-07-06T15:54:07.206+00:00',
          status: 404,
          error: 'Not Found',
          message: '',
          path: '/claims-service/api/data/claims/1231/detail',
        },
      };

      const expectedState = {
        ...initialState,
        error: {
          timestamp: '2021-07-06T15:54:07.206+00:00',
          status: 404,
          error: 'Not Found',
          message: '',
          path: '/claims-service/api/data/claims/1231/detail',
        },
      };
      expect(reducer(initialState, action).error).toEqual(expectedState.error);
    });
  });
});
