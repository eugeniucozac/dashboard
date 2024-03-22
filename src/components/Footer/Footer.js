import React from 'react';
import { useSelector } from 'react-redux';
import get from 'lodash/get';

// app
import { FooterView } from './Footer.view';
import * as utils from 'utils';

export default function Footer() {
  const configVars = useSelector((state) => get(state, 'config.vars', {}));
  const uiBrand = useSelector((state) => get(state, 'ui.brand'));

  return <FooterView build={configVars.build} brand={uiBrand} isDev={utils.app.isDevelopment(configVars)} />;
}
