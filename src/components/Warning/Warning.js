import React from 'react';
import PropTypes from 'prop-types';

// app
import { WarningView } from './Warning.view';

// mui
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import ReportProblemOutlinedIcon from '@material-ui/icons/ReportProblemOutlined';
import CheckCircleOutlinedIcon from '@material-ui/icons/CheckCircleOutlined';

Warning.propTypes = {
  type: PropTypes.oneOf(['default', 'info', 'alert', 'error', 'success']).isRequired,
  text: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  align: PropTypes.oneOf(['left', 'center', 'right']),
  icon: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  border: PropTypes.bool,
  hasboxShadowColor: PropTypes.bool,
  backGround: PropTypes.string,
};

Warning.defaultProps = {
  type: 'default',
  size: 'small',
  align: 'center',
  border: false,
  hasboxShadowColor: false,
};

export default function Warning({ type, text, size, align, icon, border, backGround, hasboxShadowColor }) {
  let IconComponent;

  // abort
  if (!text || !text.trim()) return null;

  if (type && icon) {
    switch (type) {
      case 'info':
        IconComponent = InfoOutlinedIcon;
        break;
      case 'success':
        IconComponent = CheckCircleOutlinedIcon;
        break;
      case 'alert':
      case 'error':
        IconComponent = ReportProblemOutlinedIcon;
        break;
      default:
        IconComponent = icon;
    }
  }

  return (
    <WarningView
      type={type}
      text={text}
      size={size}
      align={align}
      icon={IconComponent}
      border={border}
      backGround={backGround}
      hasboxShadowColor={hasboxShadowColor}
    />
  );
}
