import React from 'react';
import PropTypes from 'prop-types';

// app
import { PowerBiReport, Button, Translate, Pagination, SectionHeader } from 'components';
import { ModellingTable } from 'modules';

// mui
import { Box, Grid } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import AssessmentIcon from '@material-ui/icons/Assessment';

ModellingListView.propTypes = {
  placementId: PropTypes.number,
  popoverActions: PropTypes.array.isRequired,
  modellingList: PropTypes.array.isRequired,
  pagination: PropTypes.shape({
    page: PropTypes.number.isRequired,
    rowsTotal: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
  }).isRequired,
  handleChangePage: PropTypes.func.isRequired,
  handleChangeRowsPerPage: PropTypes.func.isRequired,
  sort: PropTypes.shape({
    by: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    direction: PropTypes.string.isRequired,
  }),
};

export function ModellingListView({
  placementId,
  modellingList = [],
  pagination,
  handleChangePage,
  handleChangeRowsPerPage,
  handleCreateModelTask,
  sort,
  popoverActions,
}) {
  return (
    <>
      <SectionHeader title={<Translate label="placement.modelling.title" />} icon={AssessmentIcon} testid="placement-modelling" />
      {placementId && <PowerBiReport placementId={placementId} />}
      <ModellingTable sort={sort} modellingList={modellingList} popoverActions={popoverActions} />
      <Grid container>
        <Grid item xs={12} sm={4}>
          <Box mt={2}>
            <Button
              icon={AddIcon}
              color="primary"
              size="small"
              text={<Translate label="placement.modelling.create" />}
              data-testid="modelling-create-button"
              onClick={handleCreateModelTask}
            />
          </Box>
        </Grid>
        <Grid item xs={12} sm={8}>
          <Pagination
            page={pagination.page}
            count={pagination.rowsTotal}
            rowsPerPage={pagination.rowsPerPage}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Grid>
      </Grid>
    </>
  );
}
