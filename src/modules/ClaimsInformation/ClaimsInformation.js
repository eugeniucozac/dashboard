import React from 'react';

// app
import * as utils from 'utils';
import { ClaimsInformationView } from './ClaimsInformation.view';

export default function ClaimInformation({ details }) {
  const editLinkInfo = [
    {
      text: utils.string.t('app.edit'),
      color: 'secondary',
      onClick: (e) => {
        e.stopPropagation();
      },
    },
  ];

  return (
    <>
      <ClaimsInformationView title={utils.string.t('claims.claimInformation.title')} details={details} editLinkInfo={editLinkInfo} />
    </>
  );
}
