import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import { Helmet } from 'react-helmet';
import get from 'lodash/get';

// app
import { PolicyView } from './Policy.view';
import {
  getPolicy,
  resetPolicy,
  resetPolicyPlacement,
  getPolicyPlacement,
  selectRefDataDepartmentById,
  selectRefDataBusinessTypeById,
} from 'stores';
import * as utils from 'utils';
import config from 'config';

export default function Policy() {
  const policySelected = useSelector((state) => state.policy.selected);
  const policyPlacement = useSelector((state) => state.policy.placement);
  const policyPlacementLoading = useSelector((state) => state.policy.loading.placement);
  const policyDepartment = useSelector(selectRefDataDepartmentById(policySelected && policySelected.departmentId));
  const policyBusinessType = useSelector(
    selectRefDataBusinessTypeById(policySelected && policySelected.departmentId, policySelected && policySelected.businessTypeId)
  );
  const uiBrand = useSelector((state) => get(state, 'ui.brand'));
  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams();

  useEffect(
    () => {
      dispatch(getPolicy(id)).then((response) => {
        const policyParentPlacementId = response && get(response, '[0].parentPlacementId');

        if (policyParentPlacementId) {
          dispatch(getPolicyPlacement(policyParentPlacementId));
        }
      });
      dispatch(resetPolicyPlacement());

      // cleanup
      return () => {
        dispatch(resetPolicy());
      };
    },
    [id] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const goToPlacement = () => {
    if (policyPlacement && policyPlacement.id) {
      history.push(`${config.routes.placement.bound}/${policyPlacement.id}`);
    }
  };

  const goToOpeningMemo = () => {
    if (policySelected && policySelected.openingMemoId) {
      history.push(`${config.routes.checklist.root}/${policySelected.openingMemoId}`);
    }
  };

  const title = `${utils.string.t('policy.title')} - ${id}`;
  const policyObj = {
    ...policySelected,
    department: policyDepartment,
    businessType: policyBusinessType,
  };

  const popoverItems = [
    {
      id: 'goToPlacement',
      label: utils.string.t('policy.goToPlacement'),
      disabled: !policyPlacement || !policyPlacement.id,
      callback: () => goToPlacement(),
    },
    {
      id: 'goToOpeningMemo',
      label: utils.string.t('policy.goToOpeningMemo'),
      disabled: !policySelected || !policySelected.openingMemoId,
      callback: () => goToOpeningMemo(),
    },
  ];

  return (
    <>
      <Helmet>
        <title>{`${title} - ${utils.app.getAppName(uiBrand)}`}</title>
      </Helmet>

      <PolicyView
        id={id}
        policy={policyObj}
        placement={policyPlacement}
        placementLoading={policyPlacementLoading}
        popoverItems={popoverItems}
      />
    </>
  );
}
