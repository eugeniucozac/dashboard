import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { selectPolicyMarket } from './market.actions';
import { getInitialState } from 'tests';

let store;
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const mockStoreState = {
  placement: {
    selected: {
      id: 1,
      policies: [
        {
          policyId: 1,
          markets: [{ id: '1a' }, { id: '1b' }, { id: '1c' }],
        },
        {
          policyId: 2,
          markets: [{ id: '2a' }, { id: '2b' }],
        },
      ],
    },
  },
};

describe('STORES › ACTIONS › market', () => {
  it('should create an action for market list fetch failure', () => {
    // arrange
    store = mockStore(getInitialState(mockStoreState));
    const expectedAction = [
      {
        type: 'MARKET_POLICY_SELECT',
        payload: { id: '2b' },
      },
    ];

    // act
    store.dispatch(selectPolicyMarket('2b'));

    // assert
    expect(store.getActions()).toEqual(expectedAction);
  });
});
