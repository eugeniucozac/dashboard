import React, { Fragment } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

// app
import styles from './ClaimsInformation.styles';
import { Accordion, Info } from 'components';
import * as utils from 'utils';

// mui
import { makeStyles, Typography } from '@material-ui/core';

ClaimsInformationView.propTypes = {
  title: PropTypes.string.isRequired,
  details: PropTypes.array.isRequired,
  editLinkInfo: PropTypes.array.isRequired,
};

export function ClaimsInformationView({ title, details, editLinkInfo }) {
  const classes = makeStyles(styles, { name: 'ClaimsInformation' })();
  const actions = [{ id: 'CL12345', ...editLinkInfo[0] }];

  return (
    <section className={classes.caseAccordion}>
      <Accordion title={title} actions={actions}>
        {details && (
          <section className={classes.info}>
            {details.length
              ? details.map((claim) => (
                  <Fragment key={claim.id}>
                    <Typography variant="h4">{claim.id}</Typography>
                    <section className={classes.details}>
                      <Info
                        title={utils.string.t('claims.claimInformation.type')}
                        description={claim.type}
                        nestedClasses={{ root: classnames(classes.description) }}
                      />
                      <Info
                        title={utils.string.t('claims.claimInformation.status')}
                        description={claim.status}
                        nestedClasses={{ root: classnames(classes.description) }}
                      />
                      <Info
                        title={utils.string.t('claims.claimInformation.claimant')}
                        description={claim.team}
                        nestedClasses={{ root: classnames(classes.description) }}
                      />
                      <Info
                        title={utils.string.t('claims.claimInformation.client')}
                        description={claim.insured}
                        nestedClasses={{ root: classnames(classes.description) }}
                      />
                      <Info
                        title={utils.string.t('claims.claimInformation.policyRiskDetails')}
                        description="lorem ipsum lorem"
                        nestedClasses={{ root: classnames(classes.description) }}
                      />
                      <Info
                        title={utils.string.t('claims.claimInformation.inceptionDate')}
                        description={claim.inceptionDate}
                        nestedClasses={{ root: classnames(classes.description) }}
                      />
                      <Info
                        title={utils.string.t('claims.claimInformation.expertId')}
                        description="ID Number"
                        nestedClasses={{ root: classnames(classes.description) }}
                      />
                      <Info
                        title={utils.string.t('claims.claimInformation.expiryDate')}
                        description={claim.expiryDate}
                        nestedClasses={{ root: classnames(classes.description) }}
                      />
                      <Info
                        title={utils.string.t('claims.claimInformation.adjustorRef')}
                        description="Reference Number"
                        nestedClasses={{ root: classnames(classes.description) }}
                      />
                      <Info
                        title={utils.string.t('claims.claimInformation.adjustorName')}
                        description={claim.assignedTo}
                        nestedClasses={{ root: classnames(classes.description) }}
                      />
                    </section>
                  </Fragment>
                ))
              : utils.string.t('claims.claimInformation.noClaims')}
          </section>
        )}
      </Accordion>
    </section>
  );
}
