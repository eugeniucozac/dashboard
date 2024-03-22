import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import LossDetailView from './LossDetail.view';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

// app
import * as utils from 'utils';
import {
  getLossInformation,
  getClaimsAssociateWithLoss,
  selectClaimAssociateWithLoss,
  selectLossInformation,
  selectLossInfoIsLoading,
  selectClaimAssociateWithLossLoading,
  selectRefDataCatCodesList,
} from 'stores';
import config from 'config';
import * as constants from 'consts';

LossDetail.propTypes = {
  lossObj: PropTypes.object.isRequired,
};

export default function LossDetail({ lossObj }) {
  const dispatch = useDispatch();
  const claimsAssociateWithLoss = useSelector(selectClaimAssociateWithLoss);
  const catCodes = useSelector(selectRefDataCatCodesList);
  const lossInformation = useSelector(selectLossInformation);
  const isLossInfoLoading = useSelector(selectLossInfoIsLoading);
  const isClaimAssociateWithLossLoading = useSelector(selectClaimAssociateWithLossLoading);
  const catCode = catCodes.find((item) => Number(item.catCodesID) === lossInformation.catCodesID);
  const catCodeName =
    catCode?.catCode && catCode?.catCodeDescription ? `${catCode?.catCode} - ${catCode?.catCodeDescription?.substring(0, 99)}` : '';
  const lossRef = lossObj?.lossRef;
  const isInflightLoss = lossInformation?.isInflighLoss === 1;

  useEffect(() => {
    if (lossInformation?.lossRef && !utils.generic.isValidObject(lossObj, 'lossDetailId')) {
      dispatch(getLossInformation({ lossDetailsId: lossInformation?.lossDetailID, viewLoader: false }));
      dispatch(getClaimsAssociateWithLoss(lossInformation?.lossDetailID, false));
    } else {
      dispatch(getLossInformation({ lossDetailsId: lossObj?.lossDetailId, viewLoader: false }));
      dispatch(getClaimsAssociateWithLoss(lossObj?.lossDetailId, false));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const relatedClaimColumns = [
    {
      id: 'claimReference',
      label: utils.string.t('claims.loss.relatedClaims.columns.claimReference'),
    },
    {
      id: 'claimant',
      label: utils.string.t('claims.loss.relatedClaims.columns.claimant'),
    },
    {
      id: 'policyRef',
      label: utils.string.t('claims.loss.relatedClaims.columns.policyReference'),
    },
    {
      id: 'claimReceived',
      label: utils.string.t('claims.loss.relatedClaims.columns.claimReceived'),
    },
    {
      id: 'division',
      label: utils.string.t('claims.loss.relatedClaims.columns.division'),
    },
    {
      id: 'insured',
      label: utils.string.t('claims.loss.relatedClaims.columns.insured'),
    },
    {
      id: 'riskDetails',
      label: utils.string.t('claims.loss.relatedClaims.columns.riskDetails'),
    },
    {
      id: 'claimStatus',
      label: utils.string.t('claims.loss.relatedClaims.columns.claimStatus'),
    },
  ];

  const lossInfo = [
    {
      title: utils.string.t('claims.lossInformation.ref'),
      value: lossInformation?.lossRef,
      isLoading: isLossInfoLoading,
    },
    {
      title: utils.string.t('claims.lossInformation.name'),
      value: lossInformation?.lossName,
      isLoading: isLossInfoLoading,
    },
    {
      title: utils.string.t('claims.lossInformation.details'),
      value: lossInformation?.lossDescription,
      isLoading: isLossInfoLoading,
    },
    {
      title: utils.string.t('claims.lossInformation.assignedTo'),
      value: lossInformation?.assignedToName || (isInflightLoss ? 'NA' : ''),
      isLoading: isLossInfoLoading,
    },
    {
      title: utils.string.t('claims.lossInformation.fromDate'),
      value:
        (lossInformation?.fromDate && moment(lossInformation?.fromDate).format(config.ui.format.date.text)) ||
        constants.STATUS_NOT_APPLICABLE,
      isLoading: isLossInfoLoading,
    },
    {
      title: utils.string.t('claims.lossInformation.toDate'),
      value:
        (lossInformation?.toDate && moment(lossInformation?.toDate).format(config.ui.format.date.text)) || constants.STATUS_NOT_APPLICABLE,
      isLoading: isLossInfoLoading,
    },
    {
      title: utils.string.t('claims.lossInformation.dateAndTime'),
      value:
        (lossInformation?.firstContactDate && moment(lossInformation?.firstContactDate).format(config.ui.format.date.textTime)) ||
        (isInflightLoss ? 'NA' : ''),
      isLoading: isLossInfoLoading,
    },
    {
      title: utils.string.t('claims.lossInformation.catCode'),
      value: catCodeName,
      isLoading: isLossInfoLoading,
    },
  ];

  return (
    <LossDetailView
      columns={relatedClaimColumns}
      lossInfo={lossInfo}
      lossRef={lossRef || lossInformation?.lossRef || ''}
      claimsAssociateWithLoss={claimsAssociateWithLoss}
      isClaimAssociateWithLossLoading={isClaimAssociateWithLossLoading}
    />
  );
}
