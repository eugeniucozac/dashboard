import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

//app
import { ClaimsComplexDataView } from './ClaimsComplexData.view';
import { updateComplexStatus } from 'stores';

export default function ClaimsComplexData({
  store,
  control,
  register,
  watch,
  data,
  setData,
  getData,
  resetData,
  columns,
  saveComplexButton,
  selectedPolicyItemsHandler,
  complexityFlag,
  postSaveComplexPolicyHandler,
  enableDisableFlag,
  selectedPoliciesData,
  pageSizeDefault = 10,
  searchBy,
  checkedBy,
  title,
}) {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [rows, setRows] = useState({ items: [] });
  const [pageSize, setPageSize] = useState(pageSizeDefault);

  const getStoreData = ({ size = pageSize, page = 0, term, by = searchBy, dir = 'asc' }) => {
    const items = data
      .filter((item) => item[searchBy].includes(term) || item.insured.includes(term))
      .sort((a, b) => (dir === 'asc' ? a[by].localeCompare(b[by]) : b[by].localeCompare(a[by])));
    setPageSize(size);
    const pageTotal = Math.ceil(items.length / size);
    setRows({ items: items.slice(page * size, page * size + size), itemsTotal: items.length, page, pageSize: size, pageTotal });
  };

  useEffect(() => {
    const query = { size: pageSize, page: 0, term: '', by: searchBy, dir: 'asc' };
    store ? getStoreData(query) : getData(query);
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleReset = () => {
    setSearchTerm('');
  };

  const handleSearch = (query) => {
    setSearchTerm(query);
    return store ? getStoreData({ term: query }) : dispatch(getData({ term: query }));
  };

  const handleChangePage = (newPage) => {
    if (complexityFlag) {
      const page = { page: newPage };
      dispatch(updateComplexStatus(page));
    }
    store ? getStoreData({ page: newPage, term: searchTerm }) : dispatch(getData({ page: newPage, term: searchTerm }));
  };

  const handleChangeRowsPerPage = (rowsPerPage) => {
    if (complexityFlag) {
      const pageSize = { pageSize: rowsPerPage };
      dispatch(updateComplexStatus(pageSize));
    }
    store ? getStoreData({ size: rowsPerPage, term: searchTerm }) : dispatch(getData({ size: rowsPerPage, term: searchTerm }));
  };

  const handleSort = (by, dir) => {
    if (complexityFlag) {
      const sortComplex = {
        sort: {
          by: by,
          direction: dir.toUpperCase(),
        },
      };
      dispatch(updateComplexStatus(sortComplex));
    }
    store ? getStoreData({ by, dir, term: searchTerm }) : dispatch(getData({ sortBy: by, direction: dir.toUpperCase(), term: searchTerm }));
  };

  useEffect(
    () => {
      // cleanup
      //dispatch(getData({ term: '' }));
      return () => {
        !store && dispatch(setData());
        //dispatch(resetData());
      };
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  return (
    <>
      <ClaimsComplexDataView
        cols={columns}
        rows={store ? rows : data}
        sort={{
          ...rows.sort,
          type: 'id',
        }}
        pagination={{
          page: store ? rows.page : data.page,
          rowsTotal: store ? rows.itemsTotal : data.itemsTotal,
          rowsPerPage: store ? rows.pageSize : data.pageSize,
        }}
        control={control}
        watch={watch}
        register={register}
        setData={setData}
        handleSort={handleSort}
        handleSearch={handleSearch}
        handleReset={handleReset}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        saveComplexButton={saveComplexButton}
        selectedPolicyItemsHandler={selectedPolicyItemsHandler}
        complexityFlag={complexityFlag}
        postSaveComplexPolicyHandler={postSaveComplexPolicyHandler}
        enableDisableFlag={enableDisableFlag}
        selectedPoliciesData={selectedPoliciesData}
        title={title}
        searchBy={searchBy}
        checkedBy={checkedBy}
      />
    </>
  );
}
