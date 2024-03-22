import * as React from 'react';
import { useHistory, useLocation } from 'react-router';

// app
import { AuthContext, Loader } from 'components';
import config from 'config';
import * as utils from 'utils';

export function Authentication({ context }) {
  const history = useHistory();
  const location = useLocation();

  React.useEffect(() => {
    // if we land on this page from Auth0 then handle callback and proceed to parse Auth0 hash
    // if we're not authenticated and tried to manually go to /authentication then redirect /login
    if (location.hash) {
      context.handleCallback(location.hash);
    } else {
      history.push(config.routes.login.root);
    }
  }, [context, history, location.hash]);

  return <Loader visible label={utils.string.t('app.authenticating')} />;
}

function AuthenticationWithContext(props) {
  return <AuthContext.Consumer>{(context) => <Authentication {...props} context={context} />}</AuthContext.Consumer>;
}

export default AuthenticationWithContext;
