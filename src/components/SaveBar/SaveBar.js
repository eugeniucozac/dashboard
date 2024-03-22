import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// app
import styles from './SaveBar.styles';

// mui
import { makeStyles, Slide } from '@material-ui/core';

SaveBar.propTypes = {
  show: PropTypes.bool.isRequired,
  nestedClasses: PropTypes.shape({
    root: PropTypes.string,
  }),
  children: PropTypes.node.isRequired,
};

SaveBar.defaultProps = {
  show: false,
  nestedClasses: {},
};

export default function SaveBar({ show, nestedClasses, children }) {
  const classes = makeStyles(styles, { name: 'SaveBar' })();

  return (
    <Slide direction="up" in={show} mountOnEnter unmountOnExit>
      <div className={classnames({ [classes.root]: true }, { [nestedClasses.root]: Boolean(nestedClasses.root) })}>{children}</div>
    </Slide>
  );
}
