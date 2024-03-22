import React from 'react';

//app
import * as utils from 'utils';
import { EditClaimInformationView } from './EditClaimInformation.view';

export default function EditClaimInformation() {
  const fields = [
    {
      name: 'fguNarrative',
      type: 'text',
    },
  ];

  const actions = [
    {
      name: 'cancel',
      label: utils.string.t('app.cancel'),
      handler: () => {},
    },
    {
      name: 'save',
      label: utils.string.t('app.save'),
      handler: () => {},
    },
  ];

  return (
    <>
      <EditClaimInformationView actions={actions} fields={fields} />
    </>
  );
}
