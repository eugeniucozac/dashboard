import React from 'react';

//app
import * as utils from 'utils';
import { ClaimsMovementInformationView } from './ClaimsMovementInformation.view';

export default function ClaimsMovementInformation({ movementInfoDetails }) {
  const sampleOptions = [
    { id: '1', label: 'option 1' },
    { id: '2', label: 'option 2' },
    { id: '3', label: 'option 3' },
  ]; //Remove this sample options once real data available

  const fields = [
    {
      name: 'movementType',
      options: sampleOptions,
      label: utils.string.t('claims.movementInformation.type'),
      type: 'select',
    },
    {
      name: 'qualifier',
      options: sampleOptions,
      label: utils.string.t('claims.movementInformation.qualifier'),
      type: 'select',
    },
  ];

  return (
    <>
      <ClaimsMovementInformationView movementInfoDetails={movementInfoDetails} fields={fields} />
    </>
  );
}
