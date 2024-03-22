import { selectAllTopics, selectArticlePagination } from 'stores';

describe('STORES › SELECTORS › articles', () => {
  const initialState = {
    articles: {
      list: {
        items: [],
        topics: [],
        page: 0,
        pageSize: 25,
        itemsTotal: 100,
      },
      initialLoad: false,
      isLoading: false,
    },
    referenceData: {
      departments: [
        { id: 1, name: 'one' },
        { id: 2, name: 'two' },
        { id: 3, name: 'three' },
        { id: 4, name: 'four' },
      ],
    },
  };

  it('selectAllTopics', () => {
    // assert
    expect(selectAllTopics(initialState)).toEqual([
      { label: 'Agriculture', slipcaseId: 92, value: '_92' },
      { label: 'Cyber', slipcaseId: 16, value: '_16' },
      { label: 'Directors & Officers', slipcaseId: 17, value: '_17' },
      { label: 'Financial Institutions', slipcaseId: 97, value: '_97' },
      { label: 'Intellectual Property', slipcaseId: 162, value: '_162' },
      { label: 'Kidnap & Ransom', slipcaseId: 23, value: '_23' },
      { label: 'Motor (Commercial)', slipcaseId: 27, value: '_27' },
      { label: 'P I (E&O)', slipcaseId: 34, value: '_34' },
      { label: 'Political Risk & War', slipcaseId: 32, value: '_32' },
      { label: 'Private Client / Fine art', slipcaseId: 20, value: '_20' },
      { label: 'Product Recall', slipcaseId: 33, value: '_33' },
      { label: 'Renewables', slipcaseId: 35, value: '_35' },
      { label: 'Superyachts', slipcaseId: 77, value: '_77' },
      { label: 'Supply Chain / Business Interruption', slipcaseId: 95, value: '_95' },
      { label: 'Takaful', slipcaseId: 88, value: '_88' },
      { label: 'Technology', slipcaseId: 40, value: '_40' },
      { label: 'Trade Credit', slipcaseId: 91, value: '_91' },
      { label: 'four', value: 4 },
      { label: 'one', value: 1 },
      { label: 'three', value: 3 },
      { label: 'two', value: 2 },
    ]);
  });

  it('selectArticlePagination', () => {
    // assert
    expect(selectArticlePagination(initialState)).toEqual({
      page: 0,
      rowsPerPage: 25,
      rowsTotal: 100,
    });
  });
});
