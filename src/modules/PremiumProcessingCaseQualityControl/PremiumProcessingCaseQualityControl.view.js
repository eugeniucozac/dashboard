import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

//app
import * as utils from 'utils';
import styles from './PremiumProcessingCaseQualityControl.styles';
import { ContentHeader, Warning, Tooltip, Info, ErrorMessage } from 'components';
import * as constants from 'consts';

//mui
import { makeStyles, Box } from '@material-ui/core';
import ReportProblemOutlinedIcon from '@material-ui/icons/ReportProblemOutlined';

PremiumProcessingCaseQualityControlView.propTypes = {
  caseQcList: PropTypes.array,
  caseDetailsObject: PropTypes.object,
  isCaseQualityControlLoading: PropTypes.bool.isRequired,
  isAPIErrorMsg: PropTypes.bool.isRequired,
};

export default function PremiumProcessingCaseQualityControlView({ caseQcList, caseDetailsObject, isCaseQualityControlLoading, isAPIErrorMsg }) {
  const classes = makeStyles(styles, { name: 'PremiumProcessingCaseQualityControlView' })();
  const isFDOEndorsementNonPremium = utils.generic.isValidObject(caseDetailsObject?.caseTeamData)
    ? caseDetailsObject?.caseTeamData?.processName === constants.FDO ||
    caseDetailsObject?.caseTeamData?.processName === constants.ENDORSEMENT_NON_PREMIUM
    : true;
  return (
    <Box>
      <ContentHeader title={utils.string.t('premiumProcessing.qualityControl.title')} marginBottom={0} />
      {caseQcList && caseQcList.length > 0 ? (
        <section className={classes.details}>
          {caseQcList.map((qcValues, key) => {
            const iPass = qcValues.status === 'Pass' ? true : false;
            return (
              <Box display="flex" width={1} key={key}>
                <Info
                  title={key === 0 && utils.string.t(`premiumProcessing.qualityControl.status`)}
                  description={qcValues.status}
                  showSkeleton={isCaseQualityControlLoading}
                  nestedClasses={{
                    description: iPass
                      ? classnames(classes.passColor, classes.description)
                      : classnames(classes.failColor, classes.description),
                  }}
                />
                <Info
                  title={key === 0 && utils.string.t(`premiumProcessing.qualityControl.date`)}
                  showSkeleton={isCaseQualityControlLoading}
                  description={qcValues.qcDate}
                  nestedClasses={{ root: classes.description }}
                />
                <Box className={classes.description}>
                  <Tooltip title={qcValues?.emailId} placement={'top'} arrow={true}>
                    <Info
                      showSkeleton={isCaseQualityControlLoading}
                      title={key === 0 && utils.string.t(`premiumProcessing.qualityControl.reviewer`)}
                      description={qcValues.reviewer}
                      nestedClasses={{ root: classes.description }}
                    />
                  </Tooltip>
                </Box>
              </Box>
            );
          })}
        </section>
      ) : (
        <>
          {!isAPIErrorMsg &&
            <Box display="flex" width={1} pt={2}>
              <Info
                showSkeleton={isCaseQualityControlLoading}
                description={null}
                nestedClasses={{ root: classes.description }}
                title={utils.string.t(`premiumProcessing.qualityControl.status`)}
              />
              <Info
                showSkeleton={isCaseQualityControlLoading}
                description={null}
                nestedClasses={{ root: classes.description }}
                title={utils.string.t(`premiumProcessing.qualityControl.date`)}
              />
              <Info
                showSkeleton={isCaseQualityControlLoading}
                description={null}
                nestedClasses={{ root: classes.description }}
                title={utils.string.t(`premiumProcessing.qualityControl.reviewer`)}
              />
            </Box>
          }
          {isFDOEndorsementNonPremium ? (
            !isAPIErrorMsg && !isCaseQualityControlLoading &&
            <Box p={2}>
              <Warning text={utils.string.t('premiumProcessing.noQcDetailsNotApplicable')} type="info" align="left" size="small" icon />
            </Box>
          ) : (
            !isAPIErrorMsg && !isCaseQualityControlLoading &&
            <Box p={2}>
              <Warning text={utils.string.t('premiumProcessing.noQcDetails')} type="info" align="left" size="small" icon />
            </Box>
          )}
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
