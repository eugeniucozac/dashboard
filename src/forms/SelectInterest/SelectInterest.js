import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

//app
import * as utils from 'utils';
import { SelectInterestView } from './SelectInterest.view';
import { setInterestValue, hideModal, selectClaimsInterest, getInterest } from 'stores';

export default function SelectInterest() {
  const dispatch = useDispatch();
  const interest = useSelector(selectClaimsInterest);
  const [selectedInterest, setSelectedInterest] = useState(interest.selectedInterest); //later we need to remove it

  const cols = [
    { id: 'actions', empty: true, narrow: true },
    { id: 'code', label: utils.string.t('claims.claimInformation.code') },
    { id: 'rate', label: utils.string.t('claims.claimInformation.rate') },
    { id: 'description', label: utils.string.t('claims.claimInformation.description') },
  ];

  useEffect(() => {
    dispatch(getInterest());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const interestValue = interest.items.find((item) => item.policyInterestID.toString() === selectedInterest)?.code || '';
  const actions = [
    {
      name: 'cancel',
      label: utils.string.t('app.cancel'),
      handler: () => dispatch(hideModal()),
    },
    {
      name: 'submit',
      label: utils.string.t('app.submit'),
      handler: () => {
        dispatch(setInterestValue(interestValue));
        dispatch(hideModal());
      },
    },
  ];

  return (
    <SelectInterestView
      cols={cols}
      interestList={interest.items}
      actions={actions}
      selectedInterest={selectedInterest}
      setSelectedInterest={setSelectedInterest}
    />
  );
}
