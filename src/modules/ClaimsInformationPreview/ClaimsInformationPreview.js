import React from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

// app
import * as utils from 'utils';
import { ClaimsInformationPreviewView } from './ClaimsInformationPreview.view';
import { showModal } from 'stores';

ClaimsInformationPreview.prototype = {
  isUcrHidden: PropTypes.bool,
  isAssignedToHidden: PropTypes.bool,
  isWorkflowStatusHidden: PropTypes.bool,
};

ClaimsInformationPreview.defaultProps = {
  isUcrHidden: false,
  isAssignedToHidden: true,
  isWorkflowStatusHidden: true,
};

export default function ClaimsInformationPreview(props) {
  const dispatch = useDispatch();
  const { claimInformation, columns } = props;
  const handleEditClaimClick = (id) => {
    dispatch(
      showModal({
        component: 'EDIT_CLAIM_INFORMATION',
        props: {
          title: utils.string.t('claims.claimInformation.title'),
          fullWidth: true,
          maxWidth: 'xl',
          disableAutoFocus: true,
          componentProps: id,
        },
      })
    );
  };

  return (
    <ClaimsInformationPreviewView
      {...props}
      data={claimInformation}
      columns={columns}
      handleEditClaimClick={handleEditClaimClick}
      isUcrHidden={props.isUcrHidden}
    />
  );
}
