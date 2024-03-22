import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// app
import styles from './ClaimDetailsSidebar.styles';
import { Info, Translate, Link } from 'components';
import * as utils from 'utils';
import config from 'config';

// mui
import { makeStyles, Box } from '@material-ui/core';

ClaimDetailsSidebarView.propTypes = {
  claim: PropTypes.object,
  claimPreviewInfo: PropTypes.object,
};

export function ClaimDetailsSidebarView({ claim, claimPreviewInfo }) {
  const classes = makeStyles(styles, { name: 'ClaimDetailsSidebar' })();

  // abort
  if (!utils.generic.isValidObject(claim)) return null;

  return (
    <div>
      <div className={classnames(classes.info)}>
        <Info
          title={utils.string.t('claims.claimDetailsSidebar.coloum.client')}
          description={claim.client || 'NA'}
          nestedClasses={{ root: classnames(classes.boxes) }}
          data-testid="claim-details-client"
        />
        <Info
          title={utils.string.t('claims.claimDetailsSidebar.coloum.coverHolder')}
          description={claim.coverholder || 'NA'}
          nestedClasses={{ root: classnames(classes.boxes) }}
          data-testid="claim-details-coverHolder"
        />
        <Info
          title={utils.string.t('claims.claimDetailsSidebar.coloum.dateTimeCreated')}
          description={
            <Translate
              label="format.date"
              options={{
                value: {
                  date: utils.date.timestamp(claim.createdDate),
                  format: config.ui.format.date.text,
                  default: '-',
                },
              }}
            />
          }
          nestedClasses={{ root: classnames(classes.boxes) }}
          data-testid="claim-details-date"
        />
        <Info
          title={utils.string.t('claims.claimDetailsSidebar.coloum.lossQualifier')}
          description={claimPreviewInfo?.lossQualifierName || 'Not assigned'}
          nestedClasses={{ root: classnames(classes.boxes) }}
          data-testid="claim-details-lossQualifier"
        />
        <Info
          title={utils.string.t('claims.claimDetailsSidebar.coloum.lossDetails')}
          description={claim.lossDetails || 'NA'}
          nestedClasses={{ root: classnames(classes.boxes) }}
          data-testid="claim-details-lossDetails"
        />
        <Info
          title={utils.string.t('claims.claimDetailsSidebar.coloum.ucr')}
          description={claimPreviewInfo?.ucr || 'NA'}
          nestedClasses={{ root: classnames(classes.boxes) }}
          data-testid="claim-details-ucr"
        />
      </div>
      <Box marginTop={2} display="flex" justifyContent="flex-end">
        {claim.claimID && (
          <Link
            to={`${config.routes.claimsProcessing.claim}/${claim.claimID}`}
            text={utils.string.t('claims.claimDetailsSidebar.coloum.viewDetails')}
            color="secondary"
          />
        )}
      </Box>
    </div>
  );
}
