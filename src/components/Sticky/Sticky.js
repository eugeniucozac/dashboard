import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// app
import styles from './Sticky.styles';

// mui
import { makeStyles } from '@material-ui/core';

// context
export const StickyContext = React.createContext({});

Sticky.propTypes = {
  parent: PropTypes.object,
  top: PropTypes.number,
  zIndex: PropTypes.number,
  border: PropTypes.bool,
  shadow: PropTypes.bool,
  nestedClasses: PropTypes.object,
};

Sticky.defaultProps = {
  top: 0,
  zIndex: 3,
  shadow: true,
  nestedClasses: {},
};

export default function Sticky({ parent, top, zIndex, border, shadow, children, nestedClasses }) {
  const classes = makeStyles(styles, { name: 'Sticky' })();

  const [sticky, setSticky] = useState(false);
  const refObserver = useRef(null);

  useEffect(
    () => {
      addObserver();

      // cleanup
      return () => {
        refObserver.current.disconnect();
      };
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  useEffect(
    () => {
      if (top) {
        addObserver();
      }
    },
    [top] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const addObserver = () => {
    const options = {
      root: parent || null,
      threshold: 1,
    };

    // disconnect any previous observer
    if (refObserver.current) {
      refObserver.current.disconnect();
    }

    refObserver.current = new IntersectionObserver(([entry]) => {
      if (entry.intersectionRatio < 1) {
        setSticky(true);
      } else {
        setSticky(false);
      }
    }, options);

    refObserver.current.observe(document.querySelector('.sticky-observer'));
  };

  const elemStyles = {
    top: top,
    zIndex: zIndex,
  };

  const classesSticky = {
    [classes.root]: true,
    [classes.shadow]: sticky && shadow,
    [nestedClasses.root]: Boolean(nestedClasses.root),
    [nestedClasses.rootSticky]: sticky && Boolean(nestedClasses.rootSticky),
  };

  const classesBorder = {
    [classes.border]: true,
    [classes.borderVisible]: border && sticky,
  };

  return (
    <StickyContext.Provider value={{ sticky }}>
      <div className={classnames(classesSticky)} style={elemStyles}>
        <div className={classnames(['sticky-observer', classes.observer])} style={{ top: -(top + 2) }} />
        {children}
        {border && <div className={classnames(classesBorder)} />}
      </div>
    </StickyContext.Provider>
  );
}
