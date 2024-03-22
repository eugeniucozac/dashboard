import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import get from 'lodash/get';

// app
import styles from './DmsDocDetailsTooltip.styles';
import {
  selectLossInformation,
  selectCatCodes,
  selectClaimAssociateWithLoss,
  selectClaimData,
  selectWidgetMetaData,
  selectRefDataXbInstances,
} from 'stores';
import * as constants from 'consts';
import * as utils from 'utils';
import config from 'config';

// mui
import { makeStyles, Grid, Box } from '@material-ui/core';

DmsDocDetailsTooltip.propTypes = {
  data: PropTypes.object.isRequired,
};

export default function DmsDocDetailsTooltip({ data }) {
  const classes = makeStyles(styles, { name: 'DmsDocDetailsTooltip' })();
  const lossInformation = useSelector(selectLossInformation);
  const associatedClaims = useSelector(selectClaimAssociateWithLoss);
  const documentMetaData = useSelector(selectWidgetMetaData);
  const currentClaimData = useSelector(selectClaimData);
  const refDataXbInstances = useSelector(selectRefDataXbInstances);
  const currentClaimRef = get(currentClaimData, 'claimRef') || get(currentClaimData, 'claimReference');
  const catCodes = useSelector(selectCatCodes);
  const catCode = catCodes.find((item) => Number(item.id) === lossInformation?.catCodesID);
  const catCodeName = catCode?.name && catCode?.description ? `${catCode?.name} - ${catCode?.description?.substring(0, 99)}` : '';
  const claimData =
    currentClaimRef === data.referenceId ? documentMetaData : associatedClaims?.find((item) => item.claimReference === data.referenceId);

  const claimToolTipData = [
    {
      label: utils.string.t('dms.upload.commonInfoSection.department'),
      labelInfo: claimData?.departmentName || claimData?.division,
    },
    {
      label: utils.string.t('dms.upload.claimInfoSection.claimRef'),
      labelInfo: claimData?.claimRef,
    },
    {
      label: utils.string.t('dms.upload.claimInfoSection.umr'),
      labelInfo: claimData?.uniqueMarketRef,
    },
    {
      label: utils.string.t('dms.upload.claimInfoSection.insuredName'),
      labelInfo: claimData?.insuredName || claimData?.insured,
    },
    {
      label: utils.string.t('dms.upload.claimInfoSection.claimant'),
      labelInfo: claimData?.claimantName,
    },
    {
      label: utils.string.t('dms.upload.claimInfoSection.ucr'),
      labelInfo: claimData?.ucr,
    },
    {
      label: utils.string.t('dms.upload.policyInfoSection.policyRef'),
      labelInfo: claimData?.policyRef,
    },
    {
      label: utils.string.t('dms.upload.claimInfoSection.policyId'),
      labelInfo: claimData?.policyID || claimData?.policyId,
    },
    {
      label: utils.string.t('dms.upload.commonInfoSection.yearOfInception'),
      labelInfo: claimData?.yearOfInception || claimData?.year,
    },
  ];

  const toolTipData = [
    { label: utils.string.t('dms.metadata.documentDetails.documentName'), labelInfo: data?.documentName },
    { label: utils.string.t('dms.metadata.documentVersion.documentVersion'), labelInfo: data?.documentVersion },
    { label: utils.string.t('reportingExtended.reporting.columns.createdBy'), labelInfo: data?.createdByName },
    {
      label: utils.string.t('dms.upload.commonInfoSection.uploadOn'),
      labelInfo: `${utils.string.t('format.date', {
        value: { date: data?.createdDate, format: config.ui.format.date.text },
      })}`,
    },
    {
      label: utils.string.t('dms.toolTip.updatedDate'),
      labelInfo: utils.string.t('format.date', { value: { date: data?.updatedDate, format: config.ui.format.date.text } }),
    },
    {
      label: utils.string.t('reportingReport.lastUpdated'),
      labelInfo: utils.string.t('format.date', { value: { date: data?.updatedDate, format: config.ui.format.date.text } }),
    },
    { label: utils.string.t('dms.view.columns.documentType'), labelInfo: data?.documentTypeDescription },
    { label: utils.string.t('dms.toolTip.referenceID'), labelInfo: data?.referenceId },
    { label: utils.string.t('dms.upload.commonInfoSection.sectionType'), labelInfo: data?.sectionType },
    { label: utils.string.t('dms.toolTip.docSource'), labelInfo: data?.srcApplication },
    {
      label: utils.string.t('dms.upload.commonInfoSection.gxbInstance'),
      labelInfo: data?.xbInstanceId
        ? refDataXbInstances?.find((xbInstance) => xbInstance?.sourceID.toString() === data?.xbInstanceId.toString())?.edgeSourceName
        : constants.DMS_DEFAULT_XB_INSTANCE,
    },
    {
      label: utils.string.t('dms.upload.lossInfoSection.lossRef'),
      labelInfo: lossInformation?.lossRef,
    },
    {
      label: utils.string.t('dms.upload.lossInfoSection.dateOfLoss'),
      labelInfo: `${utils.string.t('format.date', {
        value: { date: lossInformation?.createdDate, format: config.ui.format.date.text },
      })}`,
    },
    ...(data.sectionType === 'Claim' ? claimToolTipData : []),
  ];

  return (
    <Box width="100%" mt={2} mb={2}>
      <Grid container>
        {toolTipData.map((data) => {
          return (
            <Grid item xs={6} className={classes.grid} key={data.label}>
              <span className={classes.label}>
                {data.label}
                {':'}
              </span>
              <span className={classes.value}>{data?.labelInfo ?? ''}</span>
            </Grid>
          );
        })}
      </Grid>
      <Grid container>
        <Grid item xs={6} className={classes.grid}>
          <span className={classes.label}>
            {utils.string.t('dms.toolTip.catCode')}
            {':'}
          </span>
          <span className={classes.value}>{catCodeName}</span>
        </Grid>
        <Grid item xs={6} className={classes.grid}>
          <span className={classes.label}>
            {utils.string.t('dms.upload.lossInfoSection.lossDescription')}
            {':'}
          </span>
          <span className={classes.value}>{lossInformation?.lossDescription}</span>
        </Grid>
      </Grid>
    </Box>
  );
}
