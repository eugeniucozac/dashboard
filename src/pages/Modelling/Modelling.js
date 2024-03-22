import React from 'react';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';

// app
import { ModellingView } from './Modelling.view';
import * as utils from 'utils';

export default function Modelling() {
  const brand = useSelector((state) => state.ui.brand);

  return (
    <>
      <Helmet>
        <title>{`${utils.string.t('modelling.title')} - ${utils.app.getAppName(brand)}`}</title>
      </Helmet>

      <ModellingView />
    </>
  );
}
