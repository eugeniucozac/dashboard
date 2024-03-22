import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import isString from 'lodash/isString';

// app
import styles from './RowDetails.styles';
import { Link } from 'components';

// mui
import { makeStyles, Typography } from '@material-ui/core';

RowDetailsView.propTypes = {
  title: PropTypes.node,
  details: PropTypes.string,
  textAlign: PropTypes.string,
  link: PropTypes.string,
  handleClick: PropTypes.func,
  nestedClasses: PropTypes.shape({
    root: PropTypes.string,
    title: PropTypes.string,
    details: PropTypes.string,
  }),
};

export function RowDetailsView({ title, details, textAlign, nestedClasses, link, handleClick }) {
  const classes = makeStyles(styles, { name: 'RowDetails' })({ textAlign });

  return (
    <div className={classnames(classes.root, nestedClasses.root)}>
      <Typography className={classes.title} variant="subtitle2" color="secondary" title={isString(title) ? title : null}>
        {title}
      </Typography>
      <Typography className={classes.details} variant="body2" title={details ? details : null}>
        {details}
        {link && <Link title={link} text={link} color="secondary" nestedClasses={{ link: classes.link }} handleClick={handleClick} />}
      </Typography>
    </div>
  );
}
