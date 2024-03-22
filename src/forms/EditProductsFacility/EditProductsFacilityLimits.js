import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import FormSkeleton from '../AddEditQuoteBind/FormSkeleton';
import { Box } from '@material-ui/core';
// app
import { EditFacilityLimitsView } from './EditFacilityLimits.view';
import {
  selectFacilitiesById,
  getFacilityLimitsDefinition,
  selectFacilityLimits,
  postFacilityLimits,
  getFacilityLimits,
  selectIsLimitsLoading,
  selectFacilitiesLimitsLoading,
} from 'stores';
import * as utils from 'utils';

EditProductsFacilityLimits.propTypes = {
  facility: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
};

EditProductsFacilityLimits.defaultProps = {
  handleClose: () => {},
};

export default function EditProductsFacilityLimits({ facility: facilityItem = {}, handleClose }) {
  const dispatch = useDispatch();
  const facility = useSelector(selectFacilitiesById(facilityItem.id));
  const defaultFacilityLimits = facility && facility.limits ? facility.limits : {};
  const facilityLimitFields = useSelector(selectFacilityLimits);
  const isLimitsLoading = useSelector(selectIsLimitsLoading);
  const isFacilitiesLimitsLoading = useSelector(selectFacilitiesLimitsLoading);

  useEffect(() => {
    dispatch(getFacilityLimits(facilityItem.id));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!utils.generic.isValidArray(defaultFacilityLimits, true)) {
      dispatch(getFacilityLimitsDefinition(facilityItem.id, facility?.productCode));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = (values) => {
    if (values) {
      dispatch(postFacilityLimits(values, facilityItem.id, defaultFacilityLimits?.id));
    }
  };

  const handleCancel = () => {
    if (utils.generic.isFunction(handleClose)) {
      handleClose();
    }
  };

  const actions = [
    {
      name: 'submit',
      label: utils.string.t('products.admin.facilities.update'),
      handler: handleSubmit,
    },
    {
      name: 'cancel',
      label: utils.string.t('app.cancel'),
      handler: handleCancel,
    },
  ];

  if (isLimitsLoading || isFacilitiesLimitsLoading)
    return (
      <Box margin={5}>
        <FormSkeleton />
      </Box>
    );
  else
    return (
      <EditFacilityLimitsView actions={actions} facilityLimitFields={facilityLimitFields} defaultFacilityLimits={defaultFacilityLimits} />
    );
}
