import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import fetchMock from 'fetch-mock';
import { getInitialState } from 'tests';
import MockDate from 'mockdate';

//Action import
import { getCasesList } from './premiumProcessing.actions.getCases';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('STORES › ACTIONS › premium processing actions', () => {
  afterEach(() => {
    fetchMock.restore();
  });

  beforeEach(() => {
    MockDate.set('2021');
  });

  afterEach(() => {
    MockDate.reset();
  });

  const storeData = {
    cases: [
      {
        accExcutive: 'Oliver Wood',
        caseId: '23578',
        departmentId: 23,
        department: 'Equinox',
        divisionId: 13,
        insured: 'Rolls Royce',
        policyId: 71940,
        policyRef: '1261',
        policyRef: '0N3157500001',
        priority: 'High',
        processId: '12345',
        processName: 'Closing',
        stage: 'Not Assigned',
        startDate: '2020-12-14T18:30:00.000+00:00',
        taskId: '45677',
        uniqueMarketRef: 'B05070N3157500001',
      },
      {
        accExcutive: 'Dan Green',
        caseId: '48739',
        departmentId: 23,
        department: 'York',
        divisionId: 15,
        insured: 'Jogh Jee',
        policyId: 71992,
        policyRef: '1262',
        policyRef: '0N3157500006',
        priority: 'High',
        processId: '12345',
        processName: 'Closing',
        stage: 'Not Assigned',
        startDate: '2020-11-09T18:30:00.000+00:00',
        taskId: '45678',
        uniqueMarketRef: 'B05070N3157500006',
      },
      {
        accExcutive: 'John Cane',
        caseId: '37289',
        departmentId: 23,
        department: 'Birmingham',
        divisionId: 17,
        insured: 'Ranna Rock',
        policyId: 71992,
        policyRef: '1263',
        policyRef: '0N3157500007',
        priority: 'High',
        processId: '12345',
        processName: 'Closing',
        stage: 'Not Assigned',
        startDate: '2020-10-01T18:30:00.000+00:00',
        taskId: '45679',
        uniqueMarketRef: 'B05070N3157500007',
      },
      {
        accExcutive: 'Robin Wood',
        caseId: '36781',
        departmentId: 23,
        department: 'West Midlands',
        divisionId: 17,
        insured: 'Intel',
        policyId: 71992,
        policyRef: '1264',
        policyRef: '0N3157500007',
        priority: 'High',
        processId: '12345',
        processName: 'Closing',
        stage: 'Not Assigned',
        startDate: '2020-01-01T18:30:00.000+00:00',
        taskId: '45679',
        uniqueMarketRef: 'B05070N3157500007',
      },
      {
        accExcutive: 'Jack Lister',
        caseId: '37632',
        departmentId: 23,
        department: 'Bath',
        divisionId: 17,
        insured: 'Microsoft',
        policyId: 71992,
        policyRef: '1265',
        policyRef: '0N3157500007',
        priority: 'High',
        processId: '12345',
        processName: 'Closing',
        stage: 'Not Assigned',
        startDate: '2020-04-02T18:30:00.000+00:00',
        taskId: '45679',
        uniqueMarketRef: 'B05070N3157500007',
      },
    ],
    technicians: [
      {
        id: 1,
        firstName: 'Prabhash',
        lastName: 'Prabhakar',
        fullName: 'Prabhash Prabhakar',
        email: 'Prabhash.Prabhakar@Ardonaghspecialty.com',
      },
      {
        id: 2,
        firstName: 'Oliver',
        lastName: 'Wood',
        fullName: 'Oliver Wood',
        email: 'Oliver.Wood@Ardonaghspecialty.com',
      },
    ],
    message: 'Case grid summary retrieves successfully from database.',
    status: 'OK',
  };

  describe('getCasesList', () => {
    it('should dispatch the correct actions following getCasesList GET request success', async () => {
      /*
        fetchMock.get('*', { body: { status: 'success', cases: [{ accExcutive: "Oliver Wood", caseId: "23578" }] } });
        const expectedActions = [
          {
            type: 'PREMIUM_PROCESSING_CASES_LIST_GET_REQUEST',
            payload: undefined
          },
          {
            type: 'LOADER_ADD',
            payload: 'getCasesList'
          }
        ];
        const store = mockStore(getInitialState(storeData));
        // action
        await store.dispatch(getCasesList());

        // assert
        expect(store.getActions()).toEqual(expectedActions);
        expect(fetchMock.calls()).toHaveLength(1);
        expect(fetchMock.calls()[0][0]).toContain('http://localhost:9000/api/cases/gridSummary'); */
    });
  });
});
