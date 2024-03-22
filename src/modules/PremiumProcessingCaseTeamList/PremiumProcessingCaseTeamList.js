import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// app
import styles from './PremiumProcessingCaseTeamList.styles';
import { ContentHeader, Info, Link, Warning, Skeleton } from 'components';
import * as utils from 'utils';
import config from 'config';
import { selectCaseIsCheckSigning, selectCaseTeamLoadingFlag } from 'stores';

// mui
import { makeStyles, Box } from '@material-ui/core';

PremiumProcessingCaseTeamList.propTypes = {
  caseTeamData: PropTypes.object,
  caseInstructionId: PropTypes.number,
  caseInstructionStatusId: PropTypes.number,
  openUpdatingPopup: PropTypes.func.isRequired,
};

export default function PremiumProcessingCaseTeamList({ caseTeamData, caseInstructionId, caseInstructionStatusId, openUpdatingPopup }) {
  const classes = makeStyles(styles, { name: 'PremiumProcessingCaseTeamList' })();

  const isSubmittedProcessing = utils.processingInstructions.status.isSubmittedProcessing(caseInstructionStatusId);
  const hasCheckSigning = useSelector(selectCaseIsCheckSigning) || false;
  const isCaseDetailsLoading = useSelector(selectCaseTeamLoadingFlag);

  const renderOnStatus = () => {
    if (isSubmittedProcessing) {
      window.open(`${config.routes.processingInstructions.steps}/${caseInstructionId}`, '_blank');
    } else {
      openUpdatingPopup();
    }
  };

  return (
    <Box>
      <ContentHeader title={utils.string.t('premiumProcessing.caseTeam.caseDetails')} marginBottom={0} />
      {caseTeamData && !isCaseDetailsLoading ? (
        <section className={classes.info}>
          <>
            {Object.keys(caseTeamData).map((keyName) => {
              const isQc = keyName === 'qualityControl';
              const isPass = isQc && caseTeamData[keyName] === 'Pass' ? true : false;
              const value = caseTeamData[keyName] || ' ';
              const excludedProperties = ['departmentId', 'processId', 'xbInstanceId', 'processName', 'primaryCaseID'];

              return (
                !excludedProperties.includes(keyName) && (
                  <Info
                    showSkeleton={isCaseDetailsLoading}
                    key={keyName}
                    title={utils.string.t(`premiumProcessing.caseDetailsSection.${keyName}`)}
                    description={value}
                    nestedClasses={{
                      root: classnames(classes.boxes),
                      description: classnames({
                        [classes.passColor]: isPass && isQc,
                        [classes.failColor]: !isPass && isQc,
                      }),
                    }}
                  />
                )
              );
            })}
            {!hasCheckSigning && (
              <Info
                showSkeleton={isCaseDetailsLoading}
                title={utils.string.t('premiumProcessing.caseDetailsSection.processingInstruction')}
                nestedClasses={{ root: classnames(classes.boxes) }}
                content={
                  <Link
                    text={utils.string.t('premiumProcessing.processingInstructionPI', { caseInstructionId })}
                    color="secondary"
                    underline="always"
                    onClick={renderOnStatus}
                  />
                }
              />
            )}
          </>
        </section>
      ) : (
        <>
          {isCaseDetailsLoading ? (
            <Skeleton animation="wave" height={120} displayNumber={1} />
          ) :
            <Box p={5}>
              <Warning text={utils.string.t('premiumProcessing.noCaseDetails')} type="info" align="center" size="small" icon />
            </Box>
          }
        </>
      )}
    </Box>
  );
}
