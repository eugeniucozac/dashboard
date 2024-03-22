import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';

//app
import * as utils from 'utils';
import styles from './PremiumProcessingCaseRejectDetails.styles';
import { ContentHeader, Warning, Tooltip, Info, ErrorMessage } from 'components';

//mui
import { makeStyles, Box } from '@material-ui/core';
import ReportProblemOutlinedIcon from '@material-ui/icons/ReportProblemOutlined';

PremiumProcessingCaseRejectDetailsView.propTypes = {
  caseRejectDetails: PropTypes.object,
  isCaseRejectDetailsLoading: PropTypes.bool.isRequired,
  isAPIErrorMsg: PropTypes.bool.isRequired,
};

export default function PremiumProcessingCaseRejectDetailsView({ caseRejectDetails, isCaseRejectDetailsLoading, isAPIErrorMsg }) {
  const classes = makeStyles(styles, { name: 'PremiumProcessingCaseRejectDetails' })();

  return (
    <Box>
      <ContentHeader title={utils.string.t('premiumProcessing.rejectDetails.title')} marginBottom={0} />
      {get(caseRejectDetails, 'rcDate') ? (
        <section className={classes.details}>
          <Box display="flex" width={1}>
            <Info
              showSkeleton={isCaseRejectDetailsLoading}
              title={utils.string.t(`premiumProcessing.rejectDetails.fields.rpDate`)}
              description={caseRejectDetails.rpDate}
              nestedClasses={{ root: classes.description }}
            />
            <Box className={classes.description}>
              <Tooltip title={caseRejectDetails?.rejectPendingEmail} placement={'top'} arrow={true}>
                <Info
                  showSkeleton={isCaseRejectDetailsLoading}
                  title={utils.string.t(`premiumProcessing.rejectDetails.fields.rejectPending`)}
                  description={`${caseRejectDetails.rejectPending} ( ${caseRejectDetails.rejectPendingRole} )`}
                  nestedClasses={{ root: classes.description }}
                />
              </Tooltip>
            </Box>
            <Info
              showSkeleton={isCaseRejectDetailsLoading}
              title={utils.string.t(`premiumProcessing.rejectDetails.fields.rcDate`)}
              description={caseRejectDetails.rcDate}
              nestedClasses={{ root: classes.description }}
            />
            <Box className={classes.description}>
              <Tooltip title={caseRejectDetails?.rejectClosedEmail} placement={'top'} arrow={true}>
                <Info
                  showSkeleton={isCaseRejectDetailsLoading}
                  title={utils.string.t(`premiumProcessing.rejectDetails.fields.rejectClosed`)}
                  description={`${caseRejectDetails.rejectClosed} ( ${caseRejectDetails.rejectClosedRole} )`}
                  nestedClasses={{ root: classes.description }}
                />
              </Tooltip>
            </Box>
            <Info
              showSkeleton={isCaseRejectDetailsLoading}
              title={utils.string.t(`premiumProcessing.rejectDetails.fields.rejectClosedAtStage`)}
              description={caseRejectDetails.rejectClosedStage}
              nestedClasses={{ root: classes.description }}
            />
          </Box>
        </section>
      ) : (
        <>
          {!isAPIErrorMsg &&
            <Box display="flex" width={1} pt={2}>
              <Info
                showSkeleton={isCaseRejectDetailsLoading}
                description={null}
                nestedClasses={{ root: classes.description }}
                title={utils.string.t(`premiumProcessing.rejectDetails.fields.rpDate`)}
              />
              <Info
                showSkeleton={isCaseRejectDetailsLoading}
                description={null}
                nestedClasses={{ root: classes.description }}
                title={utils.string.t(`premiumProcessing.rejectDetails.fields.rejectPending`)}
              />
              <Info
                showSkeleton={isCaseRejectDetailsLoading}
                description={null}
                nestedClasses={{ root: classes.description }}
                title={utils.string.t(`premiumProcessing.rejectDetails.fields.rcDate`)}
              />
              <Info
                showSkeleton={isCaseRejectDetailsLoading}
                description={null}
                nestedClasses={{ root: classes.description }}
                title={utils.string.t(`premiumProcessing.rejectDetails.fields.rejectClosed`)}
              />
              <Info
                showSkeleton={isCaseRejectDetailsLoading}
                description={null}
                nestedClasses={{ root: classes.description }}
                title={utils.string.t(`premiumProcessing.rejectDetails.fields.rejectClosedAtStage`)}
              />
            </Box>
          }
          {!isAPIErrorMsg && !isCaseRejectDetailsLoading &&
            <Box p={2}>
              <Warning text={utils.string.t('premiumProcessing.noRejectDetails')} type="info" align="left" size="small" icon />
            </Box>
          }
          {isAPIErrorMsg &&
            <Box p={2} display="flex">
              <ReportProblemOutlinedIcon className={classes.apiFetchErrorIcon} />
              <ErrorMessage size="md" bold error={{ message: utils.string.t('premiumProcessing.apiErrorMsg') }} />
            </Box>
          }
        </>
      )}
    </Box>
  );
}
