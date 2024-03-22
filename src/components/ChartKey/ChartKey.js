import React, { useState } from 'react';
import PropTypes from 'prop-types';

// app
import * as utils from 'utils';
import { ChartKeyView } from './ChartKey.view';

ChartKey.propTypes = {
  onToggle: PropTypes.func,
  onToggleAll: PropTypes.func,
  title: PropTypes.string,
  colorMode: PropTypes.oneOf(['light', 'dark']),
  size: PropTypes.oneOf(['xsmall', 'small']),
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      label: PropTypes.string.isRequired,
      color: PropTypes.string,
      avatarText: PropTypes.string,
      checked: PropTypes.bool,
    })
  ).isRequired,
  nestedClasses: PropTypes.shape({
    root: PropTypes.string,
  }),
  isCollapsed: PropTypes.bool,
  allowCollapse: PropTypes.bool,
  avatarSize: PropTypes.number,
  onAvatarClick: PropTypes.func,
  hint: PropTypes.string,
  testid: PropTypes.string,
};

ChartKey.defaultProps = {
  nestedClasses: {},
  isCollapsed: false,
  allowCollapse: false,
  colorMode: 'light',
  size: 'small',
  avatarSize: 15,
  noBorder: false,
};

export function ChartKey({
  items,
  title,
  onToggle,
  colorMode,
  size,
  avatarSize,
  nestedClasses,
  isCollapsed,
  allowCollapse,
  onToggleAll,
  onAvatarClick,
  hint,
  testid,
  noBorder,
}) {
  const [collapsed, setCollapsed] = useState(isCollapsed);

  if (!utils.generic.isValidArray(items, true)) return null;

  return (
    <ChartKeyView
      handleToggle={onToggle}
      handleToggleAll={onToggleAll}
      items={items}
      title={title}
      collapsed={collapsed}
      setCollapsed={setCollapsed}
      colorMode={colorMode}
      size={size}
      avatarSize={avatarSize}
      nestedClasses={nestedClasses}
      allowCollapse={allowCollapse}
      onAvatarClick={onAvatarClick}
      hint={hint}
      testid={testid}
      noBorder={noBorder}
    />
  );
}

export default ChartKey;
