import React from 'react';
import PropTypes from 'prop-types';

//app
import { RoleAssignmentTable } from 'modules';
import { FilterBar } from 'components';

//mui
import { Box, Grid } from '@material-ui/core';

RoleAssignmentView.propTypes = {
  fields: PropTypes.array,
  actions: PropTypes.array,
  media: PropTypes.object,
};

export function RoleAssignmentView({ media, fields, actions }) {
  return (
    <Box mt={3} data-testid="user-accounts">
      <Box mb={media.mobile ? 4 : 2}>
        <Grid item m={4} xs={12} sm={12} md={9}>
          <FilterBar id="claimsUserFilter" fields={fields} actions={actions} />
        </Grid>
      </Box>
      <RoleAssignmentTable />
    </Box>
  );
}
