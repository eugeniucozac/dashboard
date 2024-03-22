import React, { useState } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import moment from 'moment';

// app
import styles from './PremiumProcessingCaseAccordion.styles';
import { Info, Link, Warning, Translate, Button } from 'components';

import * as constants from 'consts';
import * as utils from 'utils';
import { selectRefDataQueryCodes } from 'stores';

// mui
import { Box, makeStyles, Typography } from '@material-ui/core';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';

PremiumProcessingCaseAccordionView.propTypes = {
  caseDetails: PropTypes.object,
  rfiDetails: PropTypes.object.isRequired,
  selectedCase: PropTypes.object.isRequired,
  caseInstructionId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isRfi: PropTypes.bool,
  isCheckSigningCase: PropTypes.bool.isRequired,
  queryCodesRfi: PropTypes.object,
  handlers: PropTypes.shape({
    caseTeamHandler: PropTypes.func.isRequired,
    clickCaseDetails: PropTypes.func.isRequired,
    clickPiLink: PropTypes.func.isRequired,
  }),
};

export function PremiumProcessingCaseAccordionView({
  selectedCase,
  caseDetails,
  caseInstructionId,
  rfiDetails,
  isRfi,
  isCheckSigningCase,
  handlers,
  queryCodesRfi,
}) {
  const classes = makeStyles(styles, { name: 'PremiumProcessingCaseAccordion' })();
  const notesLength = 200;
  const [expanded, setExpanded] = useState([]);
  const queryCodeRefData = useSelector(selectRefDataQueryCodes) || [];
  const queryCodeTypeName =
    (utils.generic.isValidArray(queryCodeRefData, true) &&
      rfiDetails?.queryCode &&
      utils.referenceData.queryCodeTypes.getNameById(queryCodeRefData, rfiDetails?.queryCode)) ||
    '';

    const handleClickExpandCollapse = (id, labelText) => () => {
      if (labelText === 'app.seeMore') {
        setExpanded([...expanded, id]);
      } else {
        setExpanded([...expanded?.filter((item) => item !== id)]);
      }
    };
  
    const toggle_button = (notesData, labelText) => (
      <Button
        size="xsmall"
        variant="text"
        text={<Translate label={labelText} />}
        onClick={handleClickExpandCollapse(notesData?.notesId, labelText)}
        nestedClasses={{ btn: classes.toggle, label: classes.label }}
      />
    );
  
    const rfiNotesTruncated = (noteMsg, notesId) => {
      const isCollapsed = !expanded.includes(notesId);
      const isTruncated = noteMsg?.length > notesLength;
      if (isTruncated && isCollapsed) {
        return (
          <>
            {noteMsg?.slice(0, notesLength - 20).trim()}
            ...
            {toggle_button({noteMsg, notesId}, 'app.seeMore')}
          </>
        );
      } else {
        return (
          <>
            {noteMsg}
            {isTruncated && <>{toggle_button({noteMsg, notesId}, 'app.seeLess')}</>}
          </>
        );
      }
    };

  const isCaseDueDateExpired = moment(caseDetails?.caseDueDate).isBefore(new Date());
  const caseDueDateDiffDays = `${moment(new Date()).diff(moment(caseDetails?.caseDueDate), 'days')}`;

  return (
    <>
      {!isRfi && (
        <>
          <Typography variant="body2" className={classes.title}>
            {utils.string.t('premiumProcessing.caseTeam.caseDetails')}
          </Typography>

          {caseDetails ? (
            <div className={classnames(classes.info)}>
              {Object.keys(caseDetails).map((keyName) => {
                const isQc = keyName === 'qualityControl';
                const isCaseDueDate = Boolean(keyName === 'caseDueDate' && isCaseDueDateExpired);
                const isPass = Boolean(isQc && caseDetails[keyName] === 'Pass');
                const value = caseDetails[keyName] || ' ';
                const excludedProperties = ['departmentId', 'processId', 'xbInstanceId', 'processName', 'primaryCaseID'];

                return (
                  !excludedProperties.includes(keyName) && (
                    <Info
                      key={keyName}
                      title={utils.string.t(`premiumProcessing.caseDetailsSection.${keyName}`)}
                      description={value}
                      descriptionTooltip={
                        isCaseDueDate
                          ? utils.string.t('premiumProcessing.caseDueDateToolTip', {
                              noOfDays: caseDueDateDiffDays,
                            })
                          : ''
                      }
                      nestedClasses={{
                        root: classnames(classes.boxes),
                        description: classnames({
                          [classes.pass]: isPass && isQc,
                          [classes.fail]: !isPass && isQc,
                          [classes.caseDueDateLabel]: isCaseDueDate,
                        }),
                      }}
                    />
                  )
                );
              })}

              {!isCheckSigningCase && (
                <Info
                  title={utils.string.t('premiumProcessing.caseDetailsSection.processingInstruction')}
                  nestedClasses={{ root: classnames(classes.boxes) }}
                  content={
                    <Link
                      text={utils.string.t('premiumProcessing.processingInstructionPI', { caseInstructionId })}
                      color="secondary"
                      underline="always"
                      onClick={handlers.clickPiLink}
                    />
                  }
                />
              )}
            </div>
          ) : (
            <Box pt={2} pb={2}>
              <Warning text={utils.string.t('premiumProcessing.noCaseDetails')} type="info" align="center" size="small" icon />
            </Box>
          )}

          <Box display="flex" justifyContent="flex-end" mt={3}>
            <Link
              text={utils.string.t('premiumProcessing.caseDetailsSection.viewAllDetails')}
              icon={KeyboardArrowRightIcon}
              iconPosition="right"
              underline="always"
              color="secondary"
              onClick={handlers.clickCaseDetails}
            />
          </Box>
        </>
      )}
      {isRfi && (
        <>
          <Typography variant="body2" className={classes.title}>
            {utils.string.t('premiumProcessing.caseTeam.rfiDetails')}
          </Typography>
          <div className={classnames(classes.info)}>
            <Info
              title={utils.string.t(`premiumProcessing.rfi.queryId`)}
              description={rfiDetails?.queryId}
              nestedClasses={{ root: classnames(classes.boxes) }}
            />

            {!(rfiDetails?.rfiType === constants.BUREAU_RFITYPE) && (
              <Info
                title={utils.string.t(`premiumProcessing.rfi.queryCode`)}
                description={queryCodesRfi?.queryCodeDescription}
                nestedClasses={{ root: classnames(classes.boxes) }}
              />
            )}
            {rfiDetails?.rfiType === constants.BUREAU_RFITYPE && (
              <Info
                title={utils.string.t(`premiumProcessing.rfi.queryCode`)}
                description={queryCodeTypeName}
                nestedClasses={{ root: classnames(classes.boxes) }}
              />
            )}
            {rfiDetails?.rfiType === constants.BUREAU_RFITYPE && (
              <Info
                title={utils.string.t(`premiumProcessing.rfi.bureauNames`)}
                description={rfiDetails?.bureauNames}
                nestedClasses={{ root: classnames(classes.boxes) }}
              />
            )}
            {rfiDetails?.rfiType === constants.BUREAU_RFITYPE && (
              <Info
                title={utils.string.t(`premiumProcessing.rfi.workPackageReference`)}
                description={rfiDetails?.workPackageRef}
                nestedClasses={{ root: classnames(classes.boxes) }}
              />
            )}
            {rfiDetails?.rfiType === constants.BUREAU_RFITYPE && (
              <Info
                title={utils.string.t(`premiumProcessing.rfi.riskReference`)}
                description={rfiDetails?.riskReference}
                nestedClasses={{ root: classnames(classes.boxes) }}
              />
            )}
            {rfiDetails?.notes && (
              <Info
                title={utils.string.t(`premiumProcessing.rfi.create`, {
                  createdOn: rfiDetails.createdOn,
                  createdBy: rfiDetails.createdBy,
                  createdByRole: rfiDetails.createdByRole,
                })}
                tooltip={rfiDetails.createdByEmail}
                description={rfiNotesTruncated(rfiDetails?.notes,  rfiDetails.createdOn)}
                nestedClasses={{ root: classnames(classes.boxes) }}
              />
            )}
          </div>
          <div className={classnames(classes.info)}>
            {selectedCase?.type?.split(',')?.includes(constants.RFI_STATUS_RESPONSE) && rfiDetails.responseDescription && (
              <Info
                title={utils.string.t(`premiumProcessing.rfi.response`, {
                  responseDate: rfiDetails.responseDate,
                  responseBy: rfiDetails.responseBy,
                  responseByRole: rfiDetails.responseByRole,
                })}
                tooltip={rfiDetails.responseByEmail}
                description={rfiNotesTruncated(rfiDetails.responseDescription, rfiDetails.responseDate)}
                nestedClasses={{ root: classnames(classes.boxes) }}
              />
            )}
          </div>
        </>
      )}
    </>
  );
}
