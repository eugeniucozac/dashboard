import React from 'react';
import PropTypes from 'prop-types';

//app
import { Summary, FormMultiSelect } from 'components';
import styles from './RoleAssignmentSummary.styles';

//mui
import { makeStyles, Grid } from '@material-ui/core';

RoleAssignmentSummaryView.propTypes = {
  currentUser: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    roles: PropTypes.array.isRequired,
  }),
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ),
  handlers: PropTypes.object,
};

export function RoleAssignmentSummaryView({ currentUser, options, setSelectOption, selectedOptions }) {
  const classes = makeStyles(styles, { name: 'RoleAssignmentSummary' })();

  return (
    <Summary title={currentUser.name}>
      <Grid item m={4} xs={12} sm={12} md={9}>
        <FormMultiSelect
          label="Assign Role"
          placeholder="Choose Role"
          tagType="quantity" ///"primary"  quantity
          options={options}
          setSelectOption={setSelectOption}
          selectedOptions={selectedOptions}
          nestedClasses={{
            wrapper: classes.multiSelect,
          }}
        />
      </Grid>
    </Summary>
  );
}
