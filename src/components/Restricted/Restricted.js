import { PureComponent } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import isEmpty from 'lodash/isEmpty';
import difference from 'lodash/difference';

// app
import * as constants from 'consts';

// state
const mapStateToProps = (state) => ({
  userRole: state.user.role,
});

const restrictedPropsCheck = (type) => (props, propName, componentName) => {
  const otherType = type === 'include' ? 'exclude' : 'include';
  const allowed = [constants.ROLE_BROKER, constants.ROLE_COBROKER, constants.ROLE_UNDERWRITER];

  if (!props[propName] && !props[otherType]) {
    return new Error(`One of 'include' or 'exclude' is required by '${componentName}' component.`);
  }

  if (props[propName]) {
    let errorMsg = '';

    if (props['otherType'] && props['otherType'].length > 0) {
      return new Error(`'${componentName}' only expects one of props 'include' and 'exclude'. Please provide a single prop.`);
    }

    if (!Array.isArray(props[propName])) {
      return new Error(`Invalid prop '${propName}' of type '${typeof props[propName]}' supplied to '${componentName}', expected 'array'.`);
    }

    props[propName].forEach((str, index) => {
      if (!allowed.includes(str)) {
        errorMsg = `Invalid prop '${propName}[${index}]' of value '${str}' supplied to '${componentName}', expected one of ${JSON.stringify(
          allowed
        )}.`;
      }
    });

    if (errorMsg) {
      return new Error(errorMsg);
    }
  }
  return null;
};

export class Restricted extends PureComponent {
  static propTypes = {
    include: restrictedPropsCheck('include'),
    exclude: restrictedPropsCheck('exclude'),
  };

  render() {
    let { include, exclude } = this.props;
    const { userRole, children } = this.props;

    let hasInclude = !isEmpty(include);
    let hasExclude = !isEmpty(exclude);

    // if we don't know the user role, we hide the
    // restricted content for safety
    if (!userRole) return null;

    // if there's no include/exclude prop, we display the content
    if (!hasInclude && !hasExclude) return children;

    // if we have both include/exclude, remove the exclude from the allowed (include) list
    if (hasInclude && hasExclude) {
      include = difference(include, exclude);
      exclude = [];
      hasExclude = false;
    }

    // check if user is included or excluded from seeing the content
    if ((hasInclude && include.includes(userRole)) || (hasExclude && !exclude.includes(userRole))) {
      return children;
    }

    return null;
  }
}

export default compose(connect(mapStateToProps, null))(Restricted);
