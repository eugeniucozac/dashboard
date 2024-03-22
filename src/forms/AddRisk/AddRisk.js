import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

// app
import { AddRiskView } from './AddRisk.view';
import { postRisk } from 'stores';
import { useMedia } from 'hooks';
import * as utils from 'utils';

AddRisk.propTypes = {
  fields: PropTypes.array.isRequired,
  type: PropTypes.string.isRequired,
  handleClose: PropTypes.func.isRequired,
};

AddRisk.defaultProps = {
  handleClose: () => {},
};

export default function AddRisk({ fields, type, handleClose }) {
  const dispatch = useDispatch();
  const media = useMedia();

  const handlePostRisk = (values) => {
    return dispatch(postRisk(values, type, fields));
  };

  return (
    <AddRiskView
      fields={fields}
      defaultValues={utils.form.getInitialValues(fields)}
      validationSchema={utils.form.getValidationSchema(fields)}
      isTablet={media.tablet}
      handleClose={handleClose}
      handlePostRisk={handlePostRisk}
    />
  );
}
