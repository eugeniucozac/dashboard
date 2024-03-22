import { selectReportGroupList, selectReportList, selectReportAdminList, selectReportDetails, selectSelectedGroup } from 'stores';

describe('STORES › SELECTORS › reporting', () => {
  it('selectReportGroupList', () => {
    // assert
    expect(selectReportGroupList({})).toBeUndefined();
    expect(selectReportGroupList({ reporting: {} })).toBeUndefined();
    expect(selectReportGroupList({ reporting: { reportGroupList: {} } })).toEqual({});
    expect(selectReportGroupList({ reporting: { reportGroupList: { items: [] } } })).toEqual({ items: [] });
    expect(selectReportGroupList({ reporting: { reportGroupList: { items: [{ id: 1 }, { id: 2 }] } } })).toEqual({
      items: [{ id: 1 }, { id: 2 }],
    });
  });
  it('selectReportList', () => {
    // assert
    expect(selectReportList({})).toBeUndefined();
    expect(selectReportList({ reporting: {} })).toBeUndefined();
    expect(selectReportList({ reporting: { reportList: {} } })).toEqual({});
    expect(selectReportList({ reporting: { reportList: { items: [] } } })).toEqual({ items: [] });
    expect(selectReportList({ reporting: { reportList: { items: [{ id: 1 }, { id: 2 }] } } })).toEqual({ items: [{ id: 1 }, { id: 2 }] });
  });
  it('selectReportAdminList', () => {
    // assert
    expect(selectReportAdminList({})).toBeUndefined();
    expect(selectReportAdminList({ reporting: {} })).toBeUndefined();
    expect(selectReportAdminList({ reporting: { reportList: {} } })).toBeUndefined();
    expect(selectReportAdminList({ reporting: { reportList: { reportingGroupUser: [] } } })).toEqual([]);
    expect(selectReportAdminList({ reporting: { reportList: { reportingGroupUser: [{ id: 1 }, { id: 2 }] } } })).toEqual([
      { id: 1 },
      { id: 2 },
    ]);
  });
  it('selectReportDetails', () => {
    // assert
    expect(selectReportDetails({})).toBeUndefined();
    expect(selectReportDetails({ reporting: {} })).toBeUndefined();
    expect(selectReportDetails({ reporting: { report: {} } })).toEqual({});
    expect(selectReportDetails({ reporting: { report: { id: 1, name: 'Feb BOX Analysis' } } })).toEqual({
      id: 1,
      name: 'Feb BOX Analysis',
    });
  });
  it('selectReportAdminList', () => {
    // assert
    expect(selectSelectedGroup({})).toBeUndefined();
    expect(selectSelectedGroup({ reporting: {} })).toBeUndefined();
    expect(selectSelectedGroup({ reporting: { reportList: {} } })).toBeUndefined();
    expect(selectSelectedGroup({ reporting: { reportList: { selectedGroup: {} } } })).toEqual({});
    expect(selectSelectedGroup({ reporting: { reportList: { selectedGroup: { name: 'BAS', id: 1 } } } })).toEqual({ name: 'BAS', id: 1 });
  });
});
