const featuresPropsCheck = (type) => (props, propName, componentName) => {
  const otherType = type === 'feature' ? 'route' : 'feature';

  if (!props[propName] && !props[otherType]) {
    return new Error(`Prop 'feature' or 'route' is required by '${componentName}' component.`);
  }

  if (props[propName]) {
    let errorMsg = '';

    if (props[otherType]) {
      return new Error(
        `'${componentName}' only expects one of props 'feature' and 'route'. Please only assign prop 'feature' or 'route', not both.`
      );
    }

    if (typeof props[propName] !== 'string') {
      return new Error(`Invalid prop '${propName}' of type '${typeof props[propName]}' supplied to '${componentName}', expected 'string'.`);
    }

    if (type === 'feature' && !props['permissions']) {
      return new Error(`Prop 'permissions' is required by '${componentName}' component when prop 'feature' is defined.`);
    }

    if (type === 'route' && props['permissions']) {
      return new Error(`Prop 'permissions' is not required by '${componentName}' component when prop 'route' is defined.`);
    }

    if (errorMsg) {
      return new Error(errorMsg);
    }
  }
  return null;
};

export default featuresPropsCheck;
