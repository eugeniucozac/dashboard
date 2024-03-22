import React from 'react';

import styles from './ComplexManagementInsured.styles';

import ClaimsComplexityManagementInsured from '../../modules/ClaimsComplexityManagementInsured/ClaimsComplexityManagementInsured';

//mui
import { makeStyles, Grid } from '@material-ui/core';

export function ComplexManagementInsuredView({
  columns,
  rows,
  control,
  register,
  watch,
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
  const classes = makeStyles(styles, { name: 'ComplexManagementInsured' })();

  return (
    <div className={classes.wrapper} data-testid="addInsuredModal">
      <Grid container>
        <ClaimsComplexityManagementInsured
          columns={columns}
          rows={rows}
          control={control}
          register={register}
          watch={watch}
          complexPolicyFlag={true}
          selectedInsuredItemsHandler={selectedInsuredItemsHandler}
          handleReset={handleReset}
          handleSearch={handleSearch}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          handleSort={handleSort}
          enableDisableFlag={enableDisableFlag}
          claimsSelectedInsured={claimsSelectedInsured}
          postSaveComplexInsuredHandler={postSaveComplexInsuredHandler}
          resetKey={resetKey}
        />
      </Grid>
    </div>
  );
}
