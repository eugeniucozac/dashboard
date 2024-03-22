import React from 'react';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';

// app
import { selectIsBroker, selectOpeningMemo } from 'stores';
import { OpeningMemoView } from './OpeningMemo.view';
import * as utils from 'utils';

export default function OpeningMemo() {
  const brand = useSelector((state) => state.ui.brand);
  const isBroker = useSelector(selectIsBroker);
  const openingMemo = useSelector(selectOpeningMemo) || {};

  return (
    <>
      <Helmet>
        <title>{`${utils.string.t('openingMemo.title')}${
          openingMemo.uniqueMarketReference ? ` - ${openingMemo.uniqueMarketReference}` : ''
        } - ${utils.app.getAppName(brand)}`}</title>
      </Helmet>

      <OpeningMemoView isBroker={isBroker} />
    </>
  );
}
