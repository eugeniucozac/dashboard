import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import classnames from 'classnames';

// app
import styles from './FormPopoverMenuRHF.styles';
import { Button, Translate } from 'components';

// mui
import { withStyles, Menu, MenuItem, RootRef } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Controller } from 'react-hook-form';

export class FormPopoverMenuRHF extends PureComponent {
  static propTypes = {
    name: PropTypes.string.isRequired,
    text: PropTypes.string,
    icon: PropTypes.object,
    iconPosition: PropTypes.oneOf(['left', 'right']),
    size: PropTypes.oneOf(['xsmall', 'small', 'medium', 'large']),
    disabled: PropTypes.bool,
    hidden: PropTypes.bool,
    offset: PropTypes.bool,
    placeholder: PropTypes.string,
    data: PropTypes.object,
    anchorOrigin: PropTypes.object,
    transformOrigin: PropTypes.object,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        label: PropTypes.string.isRequired,
        disabled: PropTypes.bool,
        callback: PropTypes.func.isRequired,
      })
    ).isRequired,
    nestedClasses: PropTypes.shape({
      root: PropTypes.string,
      btn: PropTypes.string,
      icon: PropTypes.string,
      label: PropTypes.string,
    }),
    isUseFormHook: PropTypes.bool,
  };

  static defaultProps = {
    icon: MoreVertIcon,
    size: 'xsmall',
    iconPosition: 'left',
    nestedClasses: {},
    isUseFormHook: false,
  };

  constructor(props) {
    super(props);

    this.buttonRef = React.createRef();

    this.state = {
      active: false,
    };
  }

  handleOpen = (event) => {
    event.stopPropagation();

    this.setState({
      active: true,
    });
  };

  handleClose = (event) => {
    event.stopPropagation();

    this.setState({
      active: false,
    });
  };

  handleClick = (callback) => (event) => {
    event.stopPropagation();

    this.handleClose(event);
    callback(this.props.data);
  };

  render() {
    const { active } = this.state;
    const {
      control,
      name,
      text,
      size,
      icon,
      iconPosition,
      disabled,
      offset,
      placeholder,
      items,
      anchorOrigin,
      transformOrigin,
      nestedClasses,
      classes,
      isUseFormHook,
    } = this.props;

    const isPopoverDisabled = !items || items.length <= 0;

    const classesContainer = {
      [classes.root]: true,
      [classes.btnOffset]: text && offset,
      [nestedClasses.root]: Boolean(nestedClasses.root),
    };

    const classesButton = {
      btn: classnames({
        [classes.btn]: Boolean(text),
        [nestedClasses.btn]: Boolean(nestedClasses.btn),
      }),
      icon: classnames({
        [nestedClasses.icon]: Boolean(nestedClasses.icon),
      }),
      label: classnames({
        [classes.label]: Boolean(text),
        [nestedClasses.label]: Boolean(nestedClasses.label),
      }),
    };

    return (
      <span className={classnames(classesContainer)}>
        <RootRef rootRef={this.buttonRef}>
          <Button
            icon={icon}
            iconPosition={iconPosition}
            text={text || placeholder}
            size={size}
            variant="text"
            light
            title={text}
            aria-owns={active ? `${name}-popover` : null}
            aria-haspopup="true"
            disabled={disabled || isPopoverDisabled}
            onClick={this.handleOpen}
            nestedClasses={classesButton}
            data-testid={`${name}-popover-ellipsis`}
          />
        </RootRef>

        {!isPopoverDisabled &&
          (!isUseFormHook ? (
            <Menu
              id={`${name}-popover`}
              anchorEl={this.buttonRef.current}
              getContentAnchorEl={null}
              anchorOrigin={anchorOrigin}
              transformOrigin={transformOrigin}
              open={Boolean(active && this.buttonRef.current)}
              onClose={this.handleClose}
            >
              {items.map((item) => {
                if (item.hidden) return null;
                return (
                  <MenuItem key={item.id} onClick={this.handleClick(item.callback)} disabled={item.disabled}>
                    <Translate label={item.label} variant="inherit" />
                  </MenuItem>
                );
              })}
            </Menu>
          ) : (
            <Controller
              control={control}
              name={name}
              render={() => (
                <Menu
                  id={`${name}-popover`}
                  anchorEl={this.buttonRef.current}
                  getContentAnchorEl={null}
                  anchorOrigin={anchorOrigin}
                  transformOrigin={transformOrigin}
                  open={Boolean(active && this.buttonRef.current)}
                  onClose={this.handleClose}
                >
                  {items.map((item) => {
                    if (item.hidden) return null;
                    return (
                      <MenuItem key={item.id} onClick={this.handleClick(item.callback)} disabled={item.disabled}>
                        <Translate label={item.label} variant="inherit" />
                      </MenuItem>
                    );
                  })}
                </Menu>
              )}
            />
          ))}
      </span>
    );
  }
}

export default compose(withStyles(styles))(FormPopoverMenuRHF);
