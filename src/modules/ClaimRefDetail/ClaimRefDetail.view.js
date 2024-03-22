import React from 'react';
import PropTypes from 'prop-types';
import styles from './ClaimRefDetail.styles';

//app
import { ClaimsEnterLossCardInformation, ClaimsInformationPreview, ClaimsEnterPolicyCardInformation } from 'modules';
import { Layout } from 'components';

//mui
import { makeStyles } from '@material-ui/core';

ClaimRefDetailView.propTypes = {
  claimInformation: PropTypes.object.isRequired,
  lossInformation: PropTypes.object.isRequired,
  catCodes: PropTypes.array.isRequired,
  lossQualifiers: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
};

export default function ClaimRefDetailView({ claimInformation, lossInformation, catCodes, lossQualifiers, columns, setCheckPage }) {
  const classes = makeStyles(styles, { name: 'ClaimRefDetail' })();
  const claimRefDetailsStatus = true;
  const isEditLossHidden = false;
  return (
    <div className={classes.wrapper}>
      <Layout main padding>
        <ClaimsEnterLossCardInformation
          lossInformation={lossInformation}
          catCodes={catCodes}
          lossQualifiers={lossQualifiers}
          claimRefDetailsStatus={isEditLossHidden}
          claimId={claimInformation?.claimId}
          setCheckPage={setCheckPage}
        />
        <ClaimsEnterPolicyCardInformation />
        <ClaimsInformationPreview
          claimInformation={claimInformation}
          columns={columns}
          claimRefDetailsStatus={claimRefDetailsStatus}
          isAssignedToHidden={false}
          isWorkflowStatusHidden={false}
        />
      </Layout>
    </div>
  );
}
