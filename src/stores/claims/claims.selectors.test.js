import { selectAllClaimDetails, selectPriorityInfo } from 'stores';

describe('STORES › SELECTORS › claims', () => {
  const allClaimDetailList = {};

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
    allClaimDetails: allClaimDetailList,
    claimDetailInformation: {},
    claimDetailInformationSuccess: {},
    beAdjuster: { items: [], selectedbeAdjuster: null },
    priorities: [],
  };

  it('selectAllClaimDetails', () => {
    //assert
    expect(selectAllClaimDetails(initialState)).toEqual(allClaimDetailList);
  });

  it('select 1', () => {});

  it('select 2', () => {});

  it('select 3', () => {});

  // it('selectPriorityInfo', () => {
  //   const expectedResult = {
  //     levels: [
  //       { id: 1, name: 'High', description: 'High' },
  //       { id: 2, name: 'Medium', description: 'Medium' },
  //       { id: 3, name: 'Low', description: 'Low' },
  //     ],
  //     selectedLevel: { id: 2, name: 'Medium', description: 'Medium' },
  //   };
  //   expect(selectPriorityInfo(initialState)).toEqual(expectedResult);
  // });
});
