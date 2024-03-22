import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import omit from 'lodash/omit';

// app
import styles from './Button.styles';
import { Tooltip } from 'components';

// mui
import { withStyles, Button as MuiButton, Badge } from '@material-ui/core';

export class Button extends PureComponent {
  static propTypes = {
    refProp: PropTypes.object,
    icon: PropTypes.object,
    badgeContent: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    iconWide: PropTypes.bool,
    iconPosition: PropTypes.oneOf(['left', 'right']),
    size: PropTypes.oneOf(['xsmall', 'small', 'medium', 'large']),
    text: PropTypes.node,
    variant: PropTypes.oneOf(['text', 'outlined', 'contained']),
    color: PropTypes.oneOf(['default', 'primary', 'secondary']),
    badgeColor: PropTypes.oneOf(['default', 'primary', 'secondary', 'error']),
    badgeVariant: PropTypes.oneOf(['dot', 'standard', PropTypes.string]),
    light: PropTypes.bool,
    danger: PropTypes.bool,
    to: PropTypes.string,
    tooltip: PropTypes.object,
    nestedClasses: PropTypes.shape({
      btn: PropTypes.string,
      icon: PropTypes.string,
      label: PropTypes.string,
    }),
  };

  static defaultProps = {
    size: 'medium',
    iconPosition: 'left',
    color: 'default',
    variant: 'contained',
    tooltip: {},
    nestedClasses: {},
    badgeColor: 'primary',
    badgeVariant: 'standard',
  };

  render() {
    const {
      refProp,
      icon,
      badgeContent,
      text,
      size,
      variant,
      color,
      to,
      tooltip,
      light,
      danger,
      iconWide,
      iconPosition,
      nestedClasses,
      classes,
      badgeColor,
      badgeVariant,
    } = this.props;
    const IconComponent = icon;

    // remove unwanted props for MUI component
    const defaultProps = {
      ...omit(this.props, [
        'refProp',
        'icon',
        'badgeContent',
        'text',
        'tooltip',
        'light',
        'danger',
        'iconWide',
        'iconPosition',
        'nestedClasses',
        'classes',
        'badgeColor',
        'badgeVariant',
      ]),
      ...(to && { component: Link }),
      size: size === 'xsmall' ? 'small' : size,
      color: danger ? 'primary' : color,
    };

    const iconClasses = {
      [classes.iconXs]: size === 'xsmall',
      [classes.iconSm]: size === 'small',
      [classes.iconMd]: size === 'medium',
      [classes.iconLg]: size === 'large',
      [classes.iconOnly]: icon && !text,
    };

    const btnClasses = {
      [classes.btn]: true,
      [classes.btnXs]: size === 'xsmall',
      [classes.btnSm]: size === 'small',
      [classes.btnMd]: size === 'medium',
      [classes.btnLg]: size === 'large',
      [classes.btnOutlined]: variant === 'outlined',
      [classes.btnIconOnly]: icon && !text,
      [classes.btnIconWide]: iconWide,
      [classes.btnLightPrimary]: light && icon && !text && color === 'primary',
      [classes.btnLightSecondary]: light && icon && !text && color === 'secondary',
      [classes.btnLightDefault]: light && icon && !text && color === 'default',
      [classes.btnDanger]: danger && variant === 'contained',
      [classes.btnDangerText]: danger && variant === 'text',
      [classes.btnDangerOutline]: danger && variant === 'outlined',
      [nestedClasses.btn]: Boolean(nestedClasses.btn),
    };

    let button;

    // icon AND text
    if (icon && text) {
      button = (
        <MuiButton ref={refProp} {...defaultProps} className={classnames(btnClasses)} classes={{ label: nestedClasses.label }}>
          {iconPosition === 'right' && <span>{text}</span>}
          <IconComponent fontSize="inherit" className={classnames(iconClasses, nestedClasses.icon)} />
          {iconPosition === 'left' && <span>{text}</span>}
        </MuiButton>
      );

      // text ONLY
    } else if (!icon && text) {
      button = (
        <MuiButton ref={refProp} {...defaultProps} className={classnames(btnClasses)} classes={{ label: nestedClasses.label }}>
          {text}
        </MuiButton>
      );

      // icon ONLY
    } else if (icon && !text) {
      button = (
        <MuiButton ref={refProp} {...defaultProps} className={classnames(btnClasses)} classes={{ label: nestedClasses.label }}>
          <Badge badgeContent={badgeContent ?? 0} variant={badgeVariant} color={badgeColor}>
            <IconComponent fontSize="inherit" className={classnames(iconClasses, nestedClasses.icon)} />
          </Badge>
        </MuiButton>
      );
    } else {
      return null;
    }

    // with tooltip
    if (tooltip.title && !this.props.disabled) {
      return (
        <Tooltip inlineBlock {...tooltip}>
          {button}
        </Tooltip>
      );
    }

    // without tooltip
    return button;
  }
}

export default compose(withStyles(styles))(Button);
