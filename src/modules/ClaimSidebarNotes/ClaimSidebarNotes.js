import React from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';

//app
import ClaimSidebarNotesView from './ClaimSidebarNotes.view';
import * as utils from 'utils';
import { CLAIM_STATUS_CLOSE } from 'consts';

ClaimSidebarNotes.propTypes = {
  claim: PropTypes.object.isRequired,
  allowNavigation: PropTypes.func.isRequired,
};

export default function ClaimSidebarNotes({ claim, allowNavigation }) {
  const isNotesDisable = claim?.processState === CLAIM_STATUS_CLOSE;

  const fields = [
    {
      name: 'caseIncidentID',
      type: 'hidden',
      value: claim?.caseIncidentID,
    },
    {
      name: 'addNotes',
      type: 'textarea',
      value: '',
      validation: Yup.string().max(1000, utils.string.t('validation.string.max')).required(utils.string.t('validation.required')),
      muiComponentProps: {
        multiline: true,
        rows: 3,
        rowsMax: 6,
        disabled: isNotesDisable,
      },
    },
  ];

  return <ClaimSidebarNotesView fields={fields} claim={claim} allowNavigation={allowNavigation} />;
}
