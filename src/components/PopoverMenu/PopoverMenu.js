import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';

// app
import { PopoverMenuView } from './PopoverMenu.view';
import * as utils from 'utils';

// mui
import MoreVertIcon from '@material-ui/icons/MoreVert';

PopoverMenu.propTypes = {
  id: PropTypes.string.isRequired,
  variant: PropTypes.string,
  color: PropTypes.oneOf(['default', 'primary', 'secondary']),
  text: PropTypes.string,
  icon: PropTypes.object,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  size: PropTypes.oneOf(['xsmall', 'small', 'medium', 'large']),
  isButton: PropTypes.bool,
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
      icon: PropTypes.object,
      label: PropTypes.string.isRequired,
      linkTo: PropTypes.string,
      tooltip: PropTypes.string,
      disabled: PropTypes.bool,
      callback: PropTypes.func,
    })
  ).isRequired,
  handlers: PropTypes.shape({
    clickEllipsis: PropTypes.func,
  }),
  nestedClasses: PropTypes.shape({
    root: PropTypes.string,
    btn: PropTypes.string,
    icon: PropTypes.string,
    label: PropTypes.string,
  }),
};

PopoverMenuView.defaultProps = {
  icon: MoreVertIcon,
  size: 'xsmall',
  variant: 'text',
  iconPosition: 'left',
  isButton: false,
  handlers: {},
  nestedClasses: {},
};

export default function PopoverMenu({ data, handlers, ...rest }) {
  const btnRef = useRef(null);
  const [active, setActive] = useState(false);

  const handleOpen = (event) => {
    event.stopPropagation();
    setActive(true);

    if (utils.generic.isFunction(handlers?.clickEllipsis)) {
      handlers.clickEllipsis(data);
    }
  };

  const handleClose = (event) => {
    event.stopPropagation();
    setActive(false);
  };

  const handleClick = (callback) => (event) => {
    event.stopPropagation();

    handleClose(event);
    if (utils.generic.isFunction(callback)) {
      callback(data);
    }
  };

  return (
    <PopoverMenuView
      {...rest}
      active={active}
      refs={{
        btn: btnRef,
      }}
      handlers={{
        open: handleOpen,
        close: handleClose,
        click: handleClick,
      }}
    />
  );
}
