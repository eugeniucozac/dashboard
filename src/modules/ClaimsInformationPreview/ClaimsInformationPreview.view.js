import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

//app
import styles from './ClaimsInformationPreview.styles';
import { TableHead, TableCell, Overflow } from 'components';
import { RowDetails } from 'modules';
import * as utils from 'utils';
import config from 'config';

//mui
import { makeStyles, Typography, Grid, Table, TableBody, TableRow } from '@material-ui/core';

ClaimsInformationPreviewView.propTypes = {
  claimInformation: PropTypes.object.isRequired,
  columns: PropTypes.array.isRequired,
  claimRefDetailsStatus: PropTypes.bool,
  isUcrHidden: PropTypes.bool,
  isAssignedToHidden: PropTypes.bool,
  isWorkflowStatusHidden: PropTypes.bool,
};

export function ClaimsInformationPreviewView({
  data,
  columns,
  claimRefDetailsStatus,
  isUcrHidden,
  isAssignedToHidden,
  isWorkflowStatusHidden,
}) {
  const classes = makeStyles(styles, { name: 'ClaimsInformationPreview' })();
  const claimRef = data?.claimRef;

  return (
    <div className={classes.wrapper}>
      <Grid container direction="row">
        <Grid item>
          {!claimRefDetailsStatus && (
            <Typography className={classes.title}>{utils.string.t('claims.claimInformation.claimPreviewTitle', { claimRef })}</Typography>
          )}
        </Grid>
      </Grid>
      <Grid container direction="row" spacing={2}>
        <Grid item>
          <Typography className={classes.subTitle}>{utils.string.t('claims.claimInformation.title')}</Typography>
        </Grid>
      </Grid>
      <Grid container direction="row" spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <Grid container direction="column">
            <Grid item>
              <RowDetails
                title={utils.string.t('claims.claimInformation.claimant')}
                details={data?.claimant}
                textAlign="right"
                nestedClasses={{ root: classes.claimant }}
              />
              <RowDetails title={utils.string.t('claims.claimInformation.claimRef')} details={data?.claimRef} textAlign="right" />
              {!isUcrHidden && <RowDetails title={utils.string.t('claims.claimInformation.ucr')} details={data?.ucr} textAlign="right" />}
              <RowDetails title={utils.string.t('claims.claimInformation.status')} details={data?.status} textAlign="right" />
              <RowDetails
                title={utils.string.t('claims.claimInformation.claimReceivedDateTime')}
                details={data?.claimReceivedDate && moment(data.claimReceivedDate).format(config.ui.format.date.textTime)}
                textAlign="right"
                nestedClasses={{ root: classes.settlementCurr }}
              />
              <RowDetails title={utils.string.t('claims.lossInformation.qualifier')} details={data?.lossQualifierName} textAlign="right" />
              <RowDetails
                title={utils.string.t('claims.lossInformation.fromDate')}
                details={data?.lossDateFrom && moment(data.lossDateFrom).format(config.ui.format.date.text)}
                textAlign="right"
              />
              <RowDetails
                title={utils.string.t('claims.lossInformation.toDate')}
                details={data?.lossDateTo && moment(data.lossDateTo).format(config.ui.format.date.text)}
                textAlign="right"
              />
              <RowDetails title={utils.string.t('claims.movementInformation.type')} details={data?.movementType || ''} textAlign="right" />
              <RowDetails
                title={utils.string.t('claims.typeOfSettlement.orderBasis')}
                details={data?.basisOfOrder === '0%' ? utils.string.t('claims.typeOfSettlement.ourShare') : data?.basisOfOrder ?? ''}
                textAlign="right"
              />
              <RowDetails
                title={utils.string.t('claims.typeOfSettlement.order')}
                details={data?.orderPercentage || '0'}
                textAlign="right"
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Grid container direction="column">
            <Grid item>
              <RowDetails title={utils.string.t('claims.claimInformation.adjustorType')} details={data?.adjusterType} textAlign="right" />
              <RowDetails title={utils.string.t('claims.claimInformation.adjustorName')} details={data?.adjusterName} textAlign="right" />
              <RowDetails
                title={utils.string.t('claims.claimInformation.adjustorRefShort')}
                details={data?.adjusterRef}
                textAlign="right"
              />
              <RowDetails title={utils.string.t('claims.claimInformation.priority')} details={data?.priority} textAlign="right" />
              <RowDetails
                title={utils.string.t('claims.claimInformation.settlementCurrency')}
                details={data?.settlementCurrency}
                textAlign="right"
                nestedClasses={{ root: classes.settlementCurr }}
              />
              <RowDetails title={utils.string.t('claims.claimInformation.interest')} details={data?.interest} textAlign="right" />

              {!isAssignedToHidden && (
                <RowDetails title={utils.string.t('claims.claimInformation.assignedTo')} details={data?.assignedTo} textAlign="right" />
              )}
              {!isWorkflowStatusHidden && (
                <RowDetails
                  title={utils.string.t('claims.claimInformation.workflowStatus')}
                  details={data?.workflowStatus}
                  textAlign="right"
                />
              )}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Grid container direction="column">
            <Grid item>
              <RowDetails
                title={utils.string.t('claims.claimInformation.complexity')}
                details={data?.complexity}
                textAlign="right"
                nestedClasses={{
                  root: classes.extraWidth,
                }}
              />

              <RowDetails
                title={utils.string.t('claims.claimInformation.complexityBasis')}
                details={data?.complexityBasis}
                textAlign="right"
              />
              <RowDetails
                title={utils.string.t('claims.claimInformation.referral')}
                details={data?.referral !== 'Not Applicable' ? data?.referral : ''}
                textAlign="right"
              />
              <RowDetails
                title={utils.string.t('claims.claimInformation.rfiResponseShort')}
                details={data?.referralResponse !== 'Not Applicable' ? data?.referralResponse : ''}
                textAlign="right"
              />
              <RowDetails title={utils.string.t('claims.claimInformation.location')} details={data?.location} textAlign="right" />
              <RowDetails title={utils.string.t('claims.claimInformation.fguNarrative')} details={data?.fguNarrative} textAlign="right" />
              {data?.isBordereau === 1 && (
                <>
                  <RowDetails
                    title={utils.string.t('claims.claimInformation.certificateNumber')}
                    details={data?.certificateNumber}
                    textAlign="right"
                  />
                  <RowDetails
                    title={utils.string.t('claims.claimInformation.certificateInceptionDate')}
                    details={data?.certificateInceptionDate && moment(data?.certificateInceptionDate).format(config.ui.format.date.text)}
                    textAlign="right"
                  />
                  <RowDetails
                    title={utils.string.t('claims.claimInformation.certificateExpiryDate')}
                    details={data?.certificateExpiryDate && moment(data?.certificateExpiryDate).format(config.ui.format.date.text)}
                    textAlign="right"
                  />
                </>
              )}
              {data?.isBordereau === 1 && data?.bordereauPeriod && (
                <RowDetails
                  title={utils.string.t('claims.claimInformation.bordereauPeriod')}
                  details={data?.bordereauPeriod}
                  textAlign="right"
                />
              )}
            </Grid>
          </Grid>
        </Grid>

        <Grid container className={classes.ugHeaderSection}>
          <Grid item xs={5}>
            <Typography className={classes.subTitle} variant={'h2'}>
              {utils.string.t('claims.underWritingGroups.infoTitle')}
            </Typography>
          </Grid>
          {data?.policySectionDesc && (
            <>
              <Grid item xs={1}>
                <Typography className={classes.sectionDetail} variant={'h5'}>
                  {utils.string.t('claims.underWritingGroups.section')}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography className={classes.sectionDetail} variant={'h5'}>
                  {data?.policySectionDesc}
                </Typography>
              </Grid>
            </>
          )}
        </Grid>
        <Grid item xs={12}>
          <Grid container direction="column">
            <Overflow>
              <Table>
                <TableHead columns={columns} />
                <TableBody>
                  {data.underWritingGroupData?.map((ugRows, index) => (
                    <TableRow key={index}>
                      <TableCell>{ugRows.groupRef}</TableCell>
                      <TableCell>{ugRows.percentage}</TableCell>
                      <TableCell>{ugRows.facility}</TableCell>
                      <TableCell>{ugRows.facilityRef}</TableCell>
                      <TableCell>{ugRows.slipLeader}</TableCell>
                      <TableCell>{ugRows.narrative}</TableCell>
                      <TableCell>{ugRows?.dateValidFrom && moment(ugRows.dateValidFrom).format(config.ui.format.date.text)}</TableCell>
                      <TableCell>{ugRows?.dateValidTo && moment(ugRows.dateValidTo).format(config.ui.format.date.text)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Overflow>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
