import React from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import classnames from 'classnames';

// app
import styles from './Breadcrumb.styles';

// mui
import { makeStyles, Link, Typography } from '@material-ui/core';

BreadcrumbView.propTypes = {
  links: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      label: PropTypes.string,
      link: PropTypes.string,
      active: PropTypes.bool,
    })
  ),
  path: PropTypes.string,
  testid: PropTypes.string,
};

export function BreadcrumbView({ links, path, testid }) {
  const classes = makeStyles(styles, { name: 'Breadcrumb' })();

  return (
    <ul className={classes.list} data-testid={`breadcrumb${testid ? `-${testid}` : ''}`}>
      {links.map((item, index) => {
        return (
          <li className={classes.item} key={`${item.name}-${index}`}>
            {item.active && item.link === path ? (
              <Typography
                variant="body2"
                className={classnames(classes.text, { [classes.active]: item.active, [classes.largeFont]: item.largeFont })}
                data-testid={`${item.label}-Tab`}
              >
                {item.label}
              </Typography>
            ) : (
              <Link
                component={RouterLink}
                to={item.link}
                variant="body2"
                className={classnames(classes.text, classes.link, { [classes.active]: item.active })}
              >
                {item.label}
              </Link>
            )}
            {index < links.length - 1 && <span className={classes.separator} />}
          </li>
        );
      })}
    </ul>
  );
}
