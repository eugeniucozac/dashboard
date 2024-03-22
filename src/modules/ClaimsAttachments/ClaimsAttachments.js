import React from 'react';
import PropTypes from 'prop-types';

// app
import { ClaimsAttachmentsView } from './ClaimsAttachments.view';
import * as utils from 'utils';

ClaimsAttachments.prototype = {
  details: PropTypes.array.isRequired,
};

export default function ClaimsAttachments({ details }) {
  return (
    <>
      <ClaimsAttachmentsView title={utils.string.t('claims.attachments.attachments')} details={details} />
    </>
  );
}
