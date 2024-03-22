import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';

// app
import { PopoverFilterView } from './PopoverFilter.view';

PopoverFilter.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['multiSelect', 'multiSelectAsync', 'datepicker']).isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      })
    ),
    PropTypes.string,
  ]).isRequired,
  text: PropTypes.shape({
    label: PropTypes.string.isRequired,
    count: PropTypes.number,
  }),

  placeholder: PropTypes.string,
  content: PropTypes.node.isRequired,
  color: PropTypes.oneOf(['default', 'primary', 'secondary']),
  disabled: PropTypes.bool,
  maxHeight: PropTypes.number,
  nestedClasses: PropTypes.shape({
    root: PropTypes.string,
    btn: PropTypes.string,
    popover: PropTypes.string,
  }),
  handlers: PropTypes.object,
};

PopoverFilter.defaultProps = {
  nestedClasses: {},
  handlers: {},
};

export default function PopoverFilter({ id, type, value, text, anchorOrigin, transformOrigin, handlers, ...props }) {
  const btnRef = useRef(null);
  const [active, setActive] = useState(false);

  const getTextFromMultiSelectValues = (values = []) => {
    if (type === 'datepicker') {
      return { label: '', count: 0 };
    } else {
      return values.reduce(
        (acc, cur, idx) => {
          return idx === 0 ? { label: cur.name, count: 0 } : { label: acc.label, count: idx };
        },
        { label: '', count: 0 }
      );
    }
  };

  const handleOpen = (event) => {
    event.stopPropagation();
    setActive(true);
  };

  const handleClose = (event) => {
    event.stopPropagation();
    setActive(false);
  };

  // abort
  if (!type) return null;

  return (
    <PopoverFilterView
      {...props}
      id={`filter-field-${id}`}
      type={type}
      value={value}
      active={active}
      textObj={text || getTextFromMultiSelectValues(value)}
      refs={{
        btn: btnRef,
      }}
      handlers={{
        ...handlers,
        filterOpen: handleOpen,
        filterClose: handleClose,
      }}
    />
  );
}
