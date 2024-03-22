import React from 'react';

//app
import { ClaimsComplexityManagementInsuredView } from './ClaimsComplexityManagementInsured.view';

export default function ClaimsComplexityManagementInsured({
  columns,
  rows,
  control,
  register,
  watch,
  complexPolicyFlag,
  selectedInsuredItemsHandler,
  handleReset,
  handleSearch,
  handleChangePage,
  handleChangeRowsPerPage,
  handleSort,
  enableDisableFlag,
  claimsSelectedInsured,
  postSaveComplexInsuredHandler,
  resetKey,
}) {
  return (
    <ClaimsComplexityManagementInsuredView
      cols={columns}
      rows={rows}
      sort={{
        ...rows?.sort,
        type: 'id',
      }}
      pagination={{
        page: rows?.page,
        rowsTotal: rows?.itemsTotal,
        rowsPerPage: rows?.pageSize,
      }}
      control={control}
      register={register}
      watch={watch}
      handleReset={handleReset}
      handleSearch={handleSearch}
      handleChangePage={handleChangePage}
      handleChangeRowsPerPage={handleChangeRowsPerPage}
      handleSort={handleSort}
      complexPolicyFlag={complexPolicyFlag}
      selectedInsuredItemsHandler={selectedInsuredItemsHandler}
      enableDisableFlag={enableDisableFlag}
      claimsSelectedInsured={claimsSelectedInsured}
      postSaveComplexInsuredHandler={postSaveComplexInsuredHandler}
      resetKey={resetKey}
    />
  );
}
