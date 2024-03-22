import React from 'react';

// app
import * as utils from 'utils';
import { ClaimsLossInformationView } from './ClaimsLossInformation.view';

export default function ClaimsLossInformation({ details }) {
  const actions = [
    {
      id: details.id,
      text: utils.string.t('app.edit'),
      color: 'secondary',
      onClick: (e, id) => {
        e.stopPropagation();
      },
    },
  ];

  return (
    <>
      <ClaimsLossInformationView title={utils.string.t('claims.lossInformation.title')} details={details} actions={actions} />
    </>
  );
}
