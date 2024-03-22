import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import get from 'lodash/get';

// app
import { PremiumProcessingView } from './PremiumProcessing.view';
import { selectTechnicians, getCasesList, changeCaseType, selectUser } from 'stores';
import * as utils from 'utils';
import * as constants from 'consts';

export default function PremiumProcessing() {
  const dispatch = useDispatch();
  const uiBrand = useSelector((state) => get(state, 'ui.brand'));
  const technicians = useSelector(selectTechnicians);
  const technicianAssigning = true;
  const [isDataloaded, setIsDataloaded] = useState(false);
  const loggedUserDetails = useSelector(selectUser);
  const userRoleDetails = loggedUserDetails?.userRole;
  useEffect(() => {
    const getCaseDetails = async () => {
      let tabType = constants.WORKLIST;
      if (userRoleDetails?.length > 0 && (utils.user.isSeniorManager(userRoleDetails[0]) || utils.user.isAdminUser(userRoleDetails[0]))) {
        tabType = constants.WORKBASKET;
        dispatch(changeCaseType(constants.WORKBASKET));
      }
      const response = await dispatch(getCasesList({ type: tabType, filters: {} }));
      if (response) {
        setIsDataloaded(true);
      }
    };
    getCaseDetails();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSelectType = (event) => {
    dispatch(changeCaseType(event));
    dispatch(getCasesList());
  };

  return (
    <>
      <Helmet>
        <title>{`${utils.string.t('premiumProcessing.title')} - ${utils.app.getAppName(uiBrand)}`}</title>
      </Helmet>
      {isDataloaded && (
        <PremiumProcessingView
          technicians={technicians}
          technicianAssigning={technicianAssigning}
          handleSelectType={handleSelectType}
          userRoleDetails={userRoleDetails}
        />
      )}
    </>
  );
}
