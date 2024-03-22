import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

//app
import * as utils from 'utils';
import { ClaimsEnterLossCardInformationView } from './ClaimsEnterLossCardInformation.view';
import { showModal, hideModal, selectClaimAssociateWithLoss } from 'stores';

ClaimsEnterLossCardInformation.propTypes = {
  lossInformation: PropTypes.object,
  catCodes: PropTypes.array,
  claimRefDetailsStatus: PropTypes.bool,
  claimId: PropTypes.string,
  setCheckPage: PropTypes.func,
  setCurrentContextActive: PropTypes.func,
};

ClaimsEnterLossCardInformation.defaultProps = {
  setCurrentContextActive: () => {},
};

export default function ClaimsEnterLossCardInformation({
  lossInformation,
  catCodes,
  claimRefDetailsStatus,
  claimId,
  setCheckPage,
  setCurrentContextActive,
}) {
  const dispatch = useDispatch();
  const claimsAssociateWithLoss = useSelector(selectClaimAssociateWithLoss);
  const catCode = catCodes.find((item) => Number(item.id) === lossInformation.catCodesID);

  const handleEditLossClick = async () => {
    setCurrentContextActive(false);
    await dispatch(
      showModal({
        component: 'EDIT_LOSS_INFORMATION',
        props: {
          title: utils.string.t('claims.lossInformation.title'),
          hideCompOnBlur: false,
          fullWidth: true,
          maxWidth: 'xl',
          disableAutoFocus: true,
          componentProps: {
            clickOutSideHandler: () => clickOutSideHandler(),
            submitHandler: () => {
              setCurrentContextActive(true);
            },
          },
        },
      })
    );
  };

  const clickOutSideHandler = () => {
    dispatch(
      showModal({
        component: 'CONFIRM',
        props: {
          title: utils.string.t('status.alert'),
          hint: utils.string.t('navigation.title'),
          fullWidth: true,
          maxWidth: 'xs',
          componentProps: {
            cancelLabel: utils.string.t('app.no'),
            confirmLabel: utils.string.t('app.yes'),
            submitHandler: () => {
              setCurrentContextActive(true);
              dispatch(hideModal());
            },
            cancelHandler: () => {},
          },
        },
      })
    );
  };

  return (
    <ClaimsEnterLossCardInformationView
      handleEditLossClick={handleEditLossClick}
      data={lossInformation}
      catCode={catCode}
      claimId={claimId}
      claimRefDetailsStatus={claimRefDetailsStatus}
      claimsAssociateWithLoss={claimsAssociateWithLoss}
      setCheckPage={setCheckPage}
    />
  );
}
