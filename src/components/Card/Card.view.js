import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// app
import styles from './Card.styles';

// mui
import { makeStyles, Card, CardHeader, CardContent, Typography } from '@material-ui/core';

CardView.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  text: PropTypes.string,
  variant: PropTypes.string,
  compact: PropTypes.bool,
  active: PropTypes.bool,
  disabled: PropTypes.bool,
  fullwidth: PropTypes.bool,
  clickable: PropTypes.bool,
  handleClick: PropTypes.func,
  muiCardProps: PropTypes.object,
  nestedClasses: PropTypes.object,
  cardRef: PropTypes.func,
};

CardView.defaultProps = {
  muiCardProps: {},
  nestedClasses: {},
};

export function CardView({
  title,
  subheader,
  text,
  variant,
  compact,
  active,
  disabled,
  fullwidth,
  clickable,
  muiCardProps,
  handleClick,
  children,
  nestedClasses,
  cardRef,
}) {
  const classes = makeStyles(styles, { name: 'Card' })({ compact, active, disabled, fullwidth, clickable });
  const classesContainer = {
    [nestedClasses.root]: Boolean(nestedClasses.root),
  };

  return (
    <Card
      ref={cardRef}
      className={classes.root}
      variant={muiCardProps.variant || 'outlined'}
      classes={{ root: classnames(classesContainer) }}
      onClick={handleClick}
      {...muiCardProps}
    >
      {/* 1st method: */}
      {/* Content is rendered using title, subheader and text props. */}
      {/* Any additional children content is rendered within the CardContent */}
      {/* after the text prop content. */}
      {(title || subheader || text) && (
        <>
          {(title || subheader) && <CardHeader title={title || undefined} subheader={subheader || undefined} />}

          {(text || children) && (
            <CardContent>
              {text && (
                <Typography variant="body2" color="textSecondary" component="p">
                  {text}
                </Typography>
              )}
              {children}
            </CardContent>
          )}
        </>
      )}

      {/* 2nd method: */}
      {/* Content is rendered using children. */}
      {/* If none of the 3 main props are used, it is assumed that the */}
      {/* content is using the correct CardHeader, CardContent, etc components */}
      {!title && !subheader && !text && children && <>{children}</>}
    </Card>
  );
}
