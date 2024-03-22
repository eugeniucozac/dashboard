import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

// app
import styles from './ClaimsMovementType.styles';
import { FormContainer, FormRadio, FormText, FormLabel, FormToggle } from 'components';
import * as utils from 'utils';

// mui
import { makeStyles, Typography, Box } from '@material-ui/core';

ClaimsMovementTypeView.prototypes = {
  fields: PropTypes.array,
  underWritingGroups: PropTypes.object,
  claimForm: PropTypes.object,
  enforceValueSet: PropTypes.bool,
};

export function ClaimsMovementTypeView({ fields, claimForm, underWritingGroups, enforceValueSet }) {
  const classes = makeStyles(styles, { name: 'ClaimsMovementType' })();

  const { control, errors, setValue, watch } = claimForm;
  const order = watch('order');

  useEffect(() => {
    setValue('orderPercentage', underWritingGroups.percentageOfSelected);
  }, [order, underWritingGroups.percentageOfSelected]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <FormContainer>
      <Box display="flex">
        <Box width="30%" maxWidth="200px">
          <Typography variant="body2" className={classes.title}>
            {utils.string.t('claims.typeOfSettlement.title')}
          </Typography>
          <FormToggle
            control={control}
            buttonGroupProps={{ exclusive: true }}
            {...utils.form.getFieldProps(fields, 'movementType')}
            enforceValueSet={enforceValueSet}
            size="small"
          />
        </Box>
        <Box width="60%" ml={4}>
          <Typography variant="body2" className={classes.title}>
            {utils.string.t('claims.typeOfSettlement.orderBasis')}
          </Typography>
          <Box>
            <FormRadio {...utils.form.getFieldProps(fields, 'order', control)} />
            <Box display="flex" alignItems="center">
              <Box mr={2}>
                <FormLabel label={utils.string.t('claims.typeOfSettlement.order')} />
              </Box>
              <Box width={60}>
                <FormText {...utils.form.getFieldProps(fields, 'orderPercentage', control, errors)} />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </FormContainer>
  );
}
