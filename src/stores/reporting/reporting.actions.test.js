import {
  getReportGroupList,
  getReportGroupListRequest,
  getReportGroupListSuccess,
  getReportGroupListFailure,
} from './reporting.actions.reportGroup.get';

describe('list', () => {
  it('should create an action for reporting group fetch started', () => {
    // arrange
    const expectedAction = { type: 'REPORTING_GROUP_LIST_GET_REQUEST' };

    // assert
    expect(getReportGroupListRequest()).toEqual(expectedAction);
  });

  it('should create an action for reporting group fetch failure', () => {
    // arrange
    const errorObject = { status: 404 };
    const expectedAction = { type: 'REPORTING_GROUP_LIST_FAILURE', payload: errorObject };

    // assert
    expect(getReportGroupListFailure(errorObject)).toEqual(expectedAction);
  });
});
