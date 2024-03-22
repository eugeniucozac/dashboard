import {
  selectTechnicians,
  selectCasesList,
  selectCasesListItems,
  selectCasesListType,
  selectCaseByTaskId,
  selectCaseStatusByDays,
} from 'stores';

describe('STORES › SELECTORS › premiumProcessing', () => {
  it('selectTechnicians', () => {
    // assert
    expect(selectTechnicians({})).toEqual([]);
    expect(selectTechnicians({ premiumProcessing: {} })).toEqual([]);
    expect(selectTechnicians({ premiumProcessing: { technicians: {} } })).toEqual([]);
    expect(selectTechnicians({ premiumProcessing: { technicians: { items: [{ id: 1 }] } } })).toEqual([{ id: 1 }]);
  });

  it('selectCasesList', () => {
    // assert
    expect(selectCasesList({})).toEqual({});
    expect(selectCasesList({ premiumProcessing: {} })).toEqual({});
    expect(selectCasesList({ premiumProcessing: { casesList: {} } })).toEqual({});
    expect(selectCasesList({ premiumProcessing: { casesList: { foo: 1 } } })).toEqual({ foo: 1 });
  });

  it('selectCasesListItems', () => {
    // assert
    expect(selectCasesListItems({})).toEqual([]);
    expect(selectCasesListItems({ premiumProcessing: {} })).toEqual([]);
    expect(selectCasesListItems({ premiumProcessing: { casesList: {} } })).toEqual([]);
    expect(selectCasesListItems({ premiumProcessing: { casesList: { items: null } } })).toEqual([]);
    expect(selectCasesListItems({ premiumProcessing: { casesList: { items: [1] } } })).toEqual([1]);
    expect(selectCasesListItems({ premiumProcessing: { casesList: { items: [1, 2, 3] } } })).toEqual([1, 2, 3]);
  });

  it('selectCasesListType', () => {
    // assert
    expect(selectCasesListType({})).toBeUndefined();
    expect(selectCasesListType({ premiumProcessing: {} })).toBeUndefined();
    expect(selectCasesListType({ premiumProcessing: { casesList: {} } })).toBeUndefined();
    expect(selectCasesListType({ premiumProcessing: { casesList: { type: null } } })).toBeNull();
    expect(selectCasesListType({ premiumProcessing: { casesList: { type: 'foo' } } })).toEqual('foo');
  });

  it('selectCaseByTaskId', () => {
    // arrange
    const casesList = {
      items: [
        { taskId: 1, name: 'one' },
        { taskId: 2, name: 'two' },
        { taskId: 3, name: 'three' },
        { taskId: 4, name: 'four' },
      ],
    };

    // assert
    expect(selectCaseByTaskId()({})).toBeUndefined();
    expect(selectCaseByTaskId()({ premiumProcessing: {} })).toBeUndefined();
    expect(selectCaseByTaskId()({ premiumProcessing: { casesList: [] } })).toBeUndefined();

    expect(selectCaseByTaskId(1)({})).toBeUndefined();
    expect(selectCaseByTaskId(1)({ premiumProcessing: {} })).toBeUndefined();
    expect(selectCaseByTaskId(1)({ premiumProcessing: { casesList: [] } })).toBeUndefined();
    expect(selectCaseByTaskId(1)({ premiumProcessing: { casesList } })).toEqual({ taskId: 1, name: 'one' });

    expect(selectCaseByTaskId(2)({})).toBeUndefined();
    expect(selectCaseByTaskId(2)({ premiumProcessing: {} })).toBeUndefined();
    expect(selectCaseByTaskId(2)({ premiumProcessing: { casesList: [] } })).toBeUndefined();
    expect(selectCaseByTaskId(2)({ premiumProcessing: { casesList } })).toEqual({ taskId: 2, name: 'two' });

    expect(selectCaseByTaskId(999)({})).toBeUndefined();
    expect(selectCaseByTaskId(999)({ premiumProcessing: {} })).toBeUndefined();
    expect(selectCaseByTaskId(999)({ premiumProcessing: { casesList: [] } })).toBeUndefined();
    expect(selectCaseByTaskId(999)({ premiumProcessing: { casesList } })).toBeUndefined();
  });

  it('select caseStatuses by number of days that you want them for', () => {
    // given
    const caseProgressByType = {
      1: { whatever: 'you want' },
    };

    // then
    expect(selectCaseStatusByDays(3)({})).toBeUndefined();
    expect(selectCaseStatusByDays(3)({ premiumProcessing: {} })).toBeUndefined();
    expect(selectCaseStatusByDays(3)({ premiumProcessing: { caseProgressByType: {} } })).toBeUndefined();
    expect(selectCaseStatusByDays(3)({ premiumProcessing: { caseProgressByType: caseProgressByType } })).toBeUndefined();
    expect(selectCaseStatusByDays(1)({ premiumProcessing: { caseProgressByType: caseProgressByType } })).toBe(caseProgressByType[1]);
  });
});
