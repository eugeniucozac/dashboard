import React from 'react';

// app
import { Loader } from 'components';
import * as utils from 'utils';

export function LogoutView() {
  return <Loader visible label={utils.string.t('app.loggingOut')} />;
}
