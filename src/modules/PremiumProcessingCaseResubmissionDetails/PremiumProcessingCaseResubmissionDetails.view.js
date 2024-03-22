import React from 'react';
import PropTypes from 'prop-types';

//app
import * as utils from 'utils';
import styles from './PremiumProcessingCaseResubmissionDetails.styles';
import { ContentHeader, Warning, Tooltip, Info, ErrorMessage } from 'components';

//mui
import { makeStyles, Box } from '@material-ui/core';
import ReportProblemOutlinedIcon from '@material-ui/icons/ReportProblemOutlined';

PremiumProcessingCaseResubmissionDetailsView.propTypes = {
  caseResubmitDetails: PropTypes.array.isRequired,
  isCaseResubmissionDetailsLoading: PropTypes.bool.isRequired,
  isAPIErrorMsg: PropTypes.bool.isRequired,
};

export default function PremiumProcessingCaseResubmissionDetailsView({ caseResubmitDetails, isCaseResubmissionDetailsLoading, isAPIErrorMsg }) {
  const classes = makeStyles(styles, { name: 'PremiumProcessingCaseResubmissionDetails' })();
  return (
    <Box>
      <ContentHeader title={utils.string.t('premiumProcessing.resubmissionDetails.title')} marginBottom={0} />
      {utils.generic.isValidArray(caseResubmitDetails, true) ? (
        <section className={classes.details}>
          {caseResubmitDetails.map((rsValues, index) => {
            return (
              <Box display="flex" width={1} key={rsValues.id}>
                <Info
                  showSkeleton={isCaseResubmissionDetailsLoading}
                  title={index === 0 && utils.string.t(`premiumProcessing.rejectDetails.fields.rpDate`)}
                  description={rsValues.rpDate}
                  nestedClasses={{ root: classes.description }}
                />
                <Box className={classes.description}>
                  <Tooltip title={rsValues?.rejectPendingEmail} placement={'top'} arrow={true}>
                    <Info
                      showSkeleton={isCaseResubmissionDetailsLoading}
                      title={index === 0 && utils.string.t(`premiumProcessing.rejectDetails.fields.rejectPending`)}
                      description={`${rsValues.rejectPending} ( ${rsValues.rejectPendingRole} )`}
                      nestedClasses={{ root: classes.description }}
                    />
                  </Tooltip>
                </Box>
                <Info
                  showSkeleton={isCaseResubmissionDetailsLoading}
                  title={index === 0 && utils.string.t(`premiumProcessing.resubmissionDetails.fields.rsDate`)}
                  description={rsValues.rsDate}
                  nestedClasses={{ root: classes.description }}
                />
                <Box className={classes.description}>
                  <Tooltip title={rsValues?.resubimittedEmail} placement={'top'} arrow={true}>
                    <Info
                      showSkeleton={isCaseResubmissionDetailsLoading}
                      title={index === 0 && utils.string.t(`premiumProcessing.resubmissionDetails.fields.resubmitted`)}
                      description={`${rsValues.resubimitted} ( ${rsValues.resubimittedRole} )`}
                      nestedClasses={{ root: classes.description }}
                    />
                  </Tooltip>
                </Box>
                <Info
                  showSkeleton={isCaseResubmissionDetailsLoading}
                  title={index === 0 && utils.string.t(`premiumProcessing.resubmissionDetails.fields.resubmittedAtStage`)}
                  description={rsValues.resubmittedAtStage}
                  nestedClasses={{ root: classes.description }}
                />
              </Box>
            );
          })}
        </section>
      ) : (
        <>
          {!isAPIErrorMsg &&
            <Box display="flex" width={1} pt={2}>
              <Info
                showSkeleton={isCaseResubmissionDetailsLoading}
                description={null}
                nestedClasses={{ root: classes.description }}
                title={utils.string.t(`premiumProcessing.rejectDetails.fields.rpDate`)}
              />
              <Info
                showSkeleton={isCaseResubmissionDetailsLoading}
                nestedClasses={{ root: classes.description }}
                description={null}
                title={utils.string.t(`premiumProcessing.rejectDetails.fields.rejectPending`)}
              />
              <Info
                showSkeleton={isCaseResubmissionDetailsLoading}
                description={null}
                nestedClasses={{ root: classes.description }}
                title={utils.string.t(`premiumProcessing.resubmissionDetails.fields.rsDate`)}
              />
              <Info
                showSkeleton={isCaseResubmissionDetailsLoading}
                description={null}
                nestedClasses={{ root: classes.description }}
                title={utils.string.t(`premiumProcessing.resubmissionDetails.fields.resubmitted`)}
              />
              <Info
                showSkeleton={isCaseResubmissionDetailsLoading}
                description={null}
                nestedClasses={{ root: classes.description }}
                title={utils.string.t(`premiumProcessing.resubmissionDetails.fields.resubmittedAtStage`)}
              />
            </Box>
          }
          {!isAPIErrorMsg && !isCaseResubmissionDetailsLoading &&
            <Box p={2}>
              <Warning text={utils.string.t('premiumProcessing.noResubmissionDetails')} type="info" align="left" size="small" icon />
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
