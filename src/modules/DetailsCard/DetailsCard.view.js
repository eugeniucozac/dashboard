import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import isString from 'lodash/isString';

// app
import styles from './DetailsCard.styles';
import { Link, Skeleton } from 'components';

// mui
import { makeStyles, Typography } from '@material-ui/core';
import FileCopyOutlined from '@material-ui/icons/FileCopyOutlined';

DetailCardView.propTypes = {
  title: PropTypes.node,
  details: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isLoading: PropTypes.bool,
  canCopyText: PropTypes.bool,
  link: PropTypes.bool,
  handleClick: PropTypes.func,
  handleClipBoard: PropTypes.func,
  nestedClasses: PropTypes.shape({
    root: PropTypes.string,
    title: PropTypes.string,
    text: PropTypes.string,
  }),
};

export function DetailCardView({ title, details, isLoading, link, width, canCopyText, handleClick, handleClipBoard, nestedClasses }) {
  const showHover = canCopyText && !isLoading;
  const classes = makeStyles(styles, { name: 'DetailsCard' })({ width, showHover });

  return (
    <div className={classnames(classes.root, nestedClasses.root)}>
      <div className={classnames(classes.container)}>
        <div className={classnames(classes.content)}>
          <Typography className={classnames(classes.title, nestedClasses.title)} color="secondary" title={isString(title) ? title : null}>
            {title}
          </Typography>

          <Typography className={classnames(classes.text, nestedClasses.text)} variant="body2" title={details ? details : null}>
            {isLoading ? (
              <Skeleton height={40} animation="wave" displayNumber={1} />
            ) : link === true ? (
              <Link title={link} text={'link'} color="secondary" nestedClasses={{ link: classes.link }} handleClick={handleClick} />
            ) : (
              details
            )}
          </Typography>
        </div>

        {details && canCopyText && !isLoading && <FileCopyOutlined className={classes.clipboard} onClick={handleClipBoard} />}
      </div>
    </div>
  );
}
