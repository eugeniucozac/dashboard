import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import get from 'lodash/get';

// app
import { OpeningMemoSummaryView } from './OpeningMemoSummary.view';
import { selectRefDataDepartmentBrokers, patchOpeningMemo, updateOpeningMemo, selectOpeningMemo } from 'stores';

export default function OpeningMemoSummary() {
  const dispatch = useDispatch();
  const openingMemo = useSelector(selectOpeningMemo);
  const openingMemoDirty = useSelector((state) => state.openingMemo.dirty);
  const brokers = useSelector(selectRefDataDepartmentBrokers);
  const disableAll =
    openingMemoDirty && !(get(openingMemo, 'isAccountHandlerApproved') && get(openingMemo, 'isAuthorisedSignatoryApproved'));
  const disableHandler =
    !!get(openingMemo, 'accountHandler') && !get(openingMemo, 'isAccountHandlerApproved') && !get(openingMemo, 'authorisedSignatory');
  const disableSignatory =
    !!get(openingMemo, 'authorisedSignatory') && !get(openingMemo, 'isAuthorisedSignatoryApproved') && !get(openingMemo, 'accountHandler');

  const handleChange = (changes) => {
    dispatch(updateOpeningMemo(changes, openingMemo.id));
  };

  const handleResetApprovals = () => {
    dispatch(
      patchOpeningMemo(
        {
          isAccountHandlerApproved: false,
          isAuthorisedSignatoryApproved: false,
        },
        openingMemo.id
      )
    );
  };

  return (
    <OpeningMemoSummaryView
      disableAll={disableAll}
      disableHandler={disableHandler}
      disableSignatory={disableSignatory}
      users={brokers}
      openingMemo={openingMemo}
      onChange={handleChange}
      onReset={handleResetApprovals}
    />
  );
}
