import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

//app
import styles from './PremiumProcessingCaseNonBureau.styles';
import { EmailManagementService, TableCell, TableHead, Button, Warning, Tooltip } from 'components';
import { useFlexiColumns, useSort } from 'hooks';
import * as utils from 'utils';
import * as constants from 'consts';

//mui
import { Box, makeStyles, Table, TableBody, TableRow, TableContainer, Hidden } from '@material-ui/core';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';

PremiumProcessingCaseNonBureauView.propTypes = {
  accountName: PropTypes.string.isRequired,
  columnsData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.node.isRequired,
    })
  ).isRequired,
  nonBureauInsurers: PropTypes.array.isRequired,
  openEms: PropTypes.bool.isRequired,
  nonBureauDetails: PropTypes.object.isRequired,
  caseDetailsObject: PropTypes.object,
  isSendEmailAllowed: PropTypes.bool.isRequired,
  hasViewOrEditAccess: PropTypes.bool.isRequired,
  handlers: PropTypes.shape({
    sendEmail: PropTypes.func.isRequired,
  }).isRequired,
  isNotMyTaskView: PropTypes.bool.isRequired,
};

export default function PremiumProcessingCaseNonBureauView({
  accountName,
  columnsData,
  nonBureauInsurers,
  isSendEmailAllowed,
  openEms,
  nonBureauDetails,
  caseDetailsObject,
  hasViewOrEditAccess,
  handlers,
  isNotMyTaskView,
}) {
  const classes = makeStyles(styles, { name: 'PremiumProcessingCaseNonBureau' })();
  const { columns: columnsArray, columnProps } = useFlexiColumns(columnsData);
  const { cols } = useSort(columnsArray, {});
  const isValidRpFlag = caseDetailsObject?.bpmFlag === constants.BPM_STAGE_REJECTED_PENDING_ACTION ? true : false;
  const caseId = caseDetailsObject?.caseId;

  return (
    <>
      {openEms && caseId ? (
        <EmailManagementService
          accountName={accountName}
          caseDetailsObject={caseDetailsObject}
          objectId={caseId}
          objectCode={constants.EMS_CONTEXT_CASE}
          emailType={constants.EMS_EMAIL_TYPE_NON_BUREAU}
          accountLabel={utils.string.t('ems.nonBureauInsurerName')}
          accountDetails={nonBureauDetails}
          handlers={{
            goBack: handlers.goBack,
          }}
        />
      ) : (
        <TableContainer>
          <Table size="small">
            {columnsArray && <TableHead columns={cols} />}
            <TableBody data-testid="non-bureau-list">
              {utils.generic.isValidArray(nonBureauInsurers, true) &&
                nonBureauInsurers.map((insurer) => {
                  return (
                    <TableRow key={insurer.underWriterAccountName}>
                      <TableCell {...columnProps('nonBureauInsurer')}>
                        <Hidden xsDown>
                          <Tooltip
                            disableFocusListener={!hasViewOrEditAccess || isNotMyTaskView}
                            disableHoverListener={!hasViewOrEditAccess || isNotMyTaskView}
                            disableTouchListener={!hasViewOrEditAccess || isNotMyTaskView}
                            title={
                              <span
                                className={classnames(classes.toolTipTitle)}
                              >{`NBI Name: ${insurer.underWriterAccountName} \n Address: ${insurer.uwAddress}`}</span>
                            }
                            placement="top"
                            nestedClasses={{ tooltip: classnames(classes.toolTip) }}
                          >
                            {insurer.underWriterAccountName.substr(0, 30)}
                          </Tooltip>
                        </Hidden>
                      </TableCell>
                      <TableCell {...columnProps('status')}>
                        <CheckCircleOutlineIcon className={insurer.status ? classes.enabled : classes.disabled} />
                      </TableCell>
                      <TableCell {...columnProps('sentDate')}>{insurer.sendDate}</TableCell>
                      <TableCell {...columnProps('emailDocument')}>
                        {
                          <Button
                            onClick={() => {
                              handlers.sendEmail(insurer);
                            }}
                            size="xsmall"
                            tooltip={{
                              title: insurer.sendEmailDocument
                                ? utils.string.t('premiumProcessing.nonBureauColumns.viewEmail')
                                : utils.string.t('premiumProcessing.nonBureauColumns.sendEmail'),
                            }}
                            variant="outlined"
                            color="default"
                            text={
                              insurer.sendEmailDocument
                                ? utils.string.t('premiumProcessing.nonBureauColumns.viewEmail')
                                : utils.string.t('premiumProcessing.nonBureauColumns.sendEmail')
                            }
                            light
                            disabled={isValidRpFlag || !isSendEmailAllowed || isNotMyTaskView}
                          />
                        }
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
          {!utils.generic.isValidArray(nonBureauInsurers, true) && (
            <Box p={2}>
              <Warning text={utils.string.t('premiumProcessing.noNonBureauDetails')} type="info" align="left" size="small" icon />
            </Box>
          )}
        </TableContainer>
      )}
    </>
  );
}
