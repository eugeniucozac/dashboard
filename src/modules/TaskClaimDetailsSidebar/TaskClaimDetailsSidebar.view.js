import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// app
import styles from './TaskClaimDetailsSidebar.styles';
import { Info, Translate, Link } from 'components';
import { selectClaimsProcessingItem } from 'stores';

import * as utils from 'utils';
import config from 'config';

// mui
import { makeStyles, Box } from '@material-ui/core';

TaskClaimDetailsSidebarView.propTypes = {
  claimPreviewInfo: PropTypes.object.isRequired,
  taskDetails: PropTypes.object,
};

export function TaskClaimDetailsSidebarView({ claimPreviewInfo, taskDetails }) {
  const dispatch = useDispatch();
  const classes = makeStyles(styles, { name: 'TaskClaimDetailsSidebar' })();
  const dateFrom = utils.date.timestamp(claimPreviewInfo?.createdDate);

  useEffect(() => {
    if (claimPreviewInfo?.claimID) {
      const claimDetails = {
        ...claimPreviewInfo,
        claimRef: claimPreviewInfo.claimReference,
        lossRef: claimPreviewInfo.lossDetailID,
        sourceId: claimPreviewInfo.sourceID,
        policyId: claimPreviewInfo.policyID,
        processID: taskDetails?.processId,
        caseIncidentID: taskDetails?.caseIncidentID,
      };
      dispatch(selectClaimsProcessingItem(claimDetails, true));
    }
  }, [claimPreviewInfo?.claimID]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <div className={classnames(classes.info)}>
        <Info
          title={utils.string.t('claims.claimDetailsSidebar.coloum.client')}
          description={taskDetails?.client || 'NA'}
          nestedClasses={{ root: classnames(classes.boxes) }}
          data-testid="claim-details-client"
        />
        <Info
          title={utils.string.t('claims.claimDetailsSidebar.coloum.coverHolder')}
          description={taskDetails?.coverHolder || 'NA'}
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
                  date: dateFrom,
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
          description={taskDetails?.lossDetails || 'NA'}
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
        {claimPreviewInfo?.claimID && (
          <Link
            to={`${config.routes.claimsProcessing.claim}/${claimPreviewInfo?.claimID}`}
            text={utils.string.t('claims.claimDetailsSidebar.coloum.viewDetails')}
            color="secondary"
          />
        )}
      </Box>
    </div>
  );
}
