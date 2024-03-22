import React, { useState } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';

// app
import { TabsView } from './Tabs.view';
import * as utils from 'utils';

Tabs.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      errors: PropTypes.number,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      total: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      complete: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      disabled: PropTypes.bool,
    })
  ).isRequired,
  overrideTab: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  defaultTab: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  light: PropTypes.bool,
  compact: PropTypes.bool,
  swipeable: PropTypes.bool,
  componentProps: PropTypes.object,
  nestedClasses: PropTypes.object,
  onChange: PropTypes.func,
};

Tabs.defaultProps = {
  tabs: [],
  componentProps: {},
  nestedClasses: {},
};

export default function Tabs({
  tabs,
  overrideTab,
  defaultTab,
  light,
  compact,
  swipeable,
  componentProps,
  nestedClasses,
  onChange,
  ...props
}) {
  const [selectedTab, setSelectedTab] = useState();

  const getSelectedTab = () => {
    const values = tabs.map((tab) => tab.value);

    if (values.length && !values.includes(selectedTab)) {
      setSelectedTab(values[0]);
      return values[0];
    }
    return selectedTab;
  };

  const handleChange = (e, newValue) => {
    setSelectedTab(newValue);

    if (utils.generic.isFunction(onChange)) {
      onChange(newValue);
    }
  };

  // abort
  if (!utils.generic.isValidArray(tabs, true)) return null;

  return (
    <TabsView
      tabs={tabs}
      value={overrideTab || (selectedTab === undefined ? defaultTab || get(tabs, '[0].value') : getSelectedTab())}
      light={light}
      compact={compact}
      swipeable={swipeable}
      componentProps={componentProps}
      nestedClasses={nestedClasses}
      onChange={handleChange}
      {...props}
    />
  );
}
