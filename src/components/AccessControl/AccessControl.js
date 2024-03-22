import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router';

// app
import featuresPropsCheck from './AccessControl.props';
import { selectUser } from 'stores';
import * as utils from 'utils';

AccessControl.propTypes = {
  feature: featuresPropsCheck('feature'),
  permissions: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOf(['create', 'read', 'update', 'delete'])),
    PropTypes.oneOf(['create', 'read', 'update', 'delete']),
  ]),
  route: featuresPropsCheck('route'),
};

export default function AccessControl({ feature, permissions, route, children }) {
  const user = useSelector(selectUser);

  // missing or invalid props
  if (
    (!feature && !route) || // at least one prop is required
    (feature && route) || // both props are not allowed at the same time
    (feature && !permissions) || // if feature prop, permissions is required
    (route && permissions) || // if route prop, permissions is not allowed
    !children // children is mandatory
  )
    return null;

  // feature
  const isFeature = Boolean(feature);
  const isFeatureAllowed = utils.app.access.feature(feature, permissions, user);

  // route
  const isRoute = Boolean(route);
  const isRouteAllowed = utils.app.access.route(route, user);

  if (isFeature) {
    return isFeatureAllowed ? children : null;
  } else if (isRoute) {
    return isRouteAllowed ? children : <Redirect to="/" />;
  } else {
    return null;
  }
}
