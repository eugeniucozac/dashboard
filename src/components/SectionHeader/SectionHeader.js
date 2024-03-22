import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// app
import styles from './SectionHeader.styles';

// mui
import { makeStyles, Typography } from '@material-ui/core';

SectionHeader.propTypes = {
  title: PropTypes.node,
  subtitle: PropTypes.node,
  content: PropTypes.node,
  icon: PropTypes.object,
  testid: PropTypes.string.isRequired,
  nestedClasses: PropTypes.shape({
    root: PropTypes.string,
    children: PropTypes.string,
  }),
};

SectionHeader.defaultProps = {
  nestedClasses: {},
};

export function SectionHeader({ title, subtitle, content, icon, testid, children, nestedClasses }) {
  const classes = makeStyles(styles, { name: 'SectionHeader' })({ hasSubtitle: Boolean(subtitle) });
  const IconComponent = icon;

  // abort
  if (!title && !subtitle && !content) return null;

  return (
    <div className={classnames(classes.root, nestedClasses.root)} data-testid={`page-header-${testid}`}>
      <div className={classes.content}>
        {icon && (
          <div className={classes.icon}>
            <IconComponent fontSize="inherit" data-testid={`page-header-${testid}-icon`} />
          </div>
        )}

        <div className={classes.details}>
          {content}

          {!content && title && (
            <Typography variant="h1" className={classes.title} noWrap data-testid={`page-header-${testid}-title`}>
              {title}
            </Typography>
          )}

          {!content && subtitle && (
            <Typography variant="body2" className={classes.subtitle} data-testid={`page-header-${testid}-subtitle`}>
              {subtitle}
            </Typography>
          )}
        </div>
      </div>

      {children && <div className={classnames(classes.children, nestedClasses.children)}>{children}</div>}
    </div>
  );
}

export default SectionHeader;
