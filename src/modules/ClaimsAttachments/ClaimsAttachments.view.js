import React, { Fragment } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

// app
import styles from './ClaimsAttachments.styles';
import { Accordion, Info } from 'components';
import * as utils from 'utils';

// mui
import { makeStyles } from '@material-ui/core';

ClaimsAttachmentsView.prototype = {
  title: PropTypes.string.isRequired,
  details: PropTypes.array.isRequired,
};

export function ClaimsAttachmentsView({ title, details }) {
  const classes = makeStyles(styles, { name: 'ClaimsAttachments' })();

  return (
    <section className={classes.caseAccordion}>
      <Accordion title={title}>
        <section className={classes.details}>
          {details.length
            ? details.map((attachment) => (
                <Fragment key={attachment.id}>
                  <Info
                    title={utils.string.t('claims.attachments.attachmentId')}
                    description={attachment.id}
                    nestedClasses={{ root: classnames(classes.description) }}
                  />
                  <Info
                    title={utils.string.t('claims.attachments.type')}
                    description={attachment.type}
                    nestedClasses={{ root: classnames(classes.description) }}
                  />
                </Fragment>
              ))
            : utils.string.t('claims.attachments.noAttachmentFound')}
        </section>
      </Accordion>
    </section>
  );
}
