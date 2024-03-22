const utilsDmsSearch = {
  constructSearchableData: (columnsData) => {
    return columnsData?.map((data) => {
      const allValues = utilsDmsSearch.getRowDataAsString(data);
      return { allValues: allValues.toString() };
    });
  },

  getRowDataAsString: (data, allValues) => {
    if (!allValues) allValues = [];
    for (const key in data) {
      if (typeof data[key] === 'object') utilsDmsSearch.getRowDataAsString(data[key], allValues);
      else allValues.push(`${data[key]}' '`);
    }
    return allValues;
  },

  getFilteredTableData: (searchIndexedTableData, search, originalTableData) => {
    let newFilteredTableData = [];
    searchIndexedTableData?.forEach((data, index) => {
      if (data?.allValues?.toLowerCase().indexOf(search.toLowerCase()) >= 0) {
        newFilteredTableData.push(originalTableData.current[index]);
      }
    });
    return newFilteredTableData;
  },
};

export default utilsDmsSearch;
