import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import isNumber from 'lodash/isNumber';
import isString from 'lodash/isString';

// app
import { Avatar, Skeleton } from 'components';
import styles from './Info.styles';

// mui
import { makeStyles, Box, Typography } from '@material-ui/core';

const avatarSizeMap = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64,
};

InfoView.propTypes = {
  avatarText: PropTypes.string,
  avatarImage: PropTypes.string,
  avatarIcon: PropTypes.object,
  avatarBg: PropTypes.string,
  avatarBorder: PropTypes.bool,
  avatarSize: PropTypes.number,
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  title: PropTypes.node,
  content: PropTypes.node,
  subtitle: PropTypes.node,
  description: PropTypes.node,
  ellipsis: PropTypes.bool,
  verticalAlign: PropTypes.bool,
  showSkeleton: PropTypes.bool,
  nestedClasses: PropTypes.shape({
    root: PropTypes.string,
    avatar: PropTypes.string,
    details: PropTypes.string,
    content: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
  }),
  'data-testid': PropTypes.string,
  link: PropTypes.string,
  tooltip: PropTypes.string.isRequired,
  subTitleTooltip: PropTypes.string,
  descriptionTooltip: PropTypes.string,
};

export function InfoView({
  avatarText,
  avatarImage,
  avatarIcon,
  avatarBg,
  avatarBorder,
  avatarSize,
  size,
  title,
  subtitle,
  content,
  description,
  ellipsis,
  verticalAlign,
  showSkeleton,
  nestedClasses,
  link,
  handleLinkClick,
  dataTestId,
  tooltip,
  subTitleTooltip,
  descriptionTooltip,
}) {
  const classes = makeStyles(styles, { name: 'Info' })();

  const verticalAlignClasses = {
    [classes.singleLine]: (!description && !isNumber(description) && !content) || verticalAlign,
  };

  const rootClasses = {
    [classes.ellipsis]: ellipsis,
  };

  const contentClasses = {
    [classes.ellipsis]: ellipsis,
  };

  const avatarClasses = {
    [classes.avatarXs]: size === 'xs',
    [classes.avatarSm]: size === 'sm',
    [classes.avatarMd]: size === 'md',
    [classes.avatarLg]: size === 'lg',
    [classes.avatarXl]: size === 'xl',
  };

  const textClasses = {
    [classes.textFontSizeXs]: size === 'xs',
    [classes.textFontSizeSm]: size === 'sm',
    [classes.textFontSizeMd]: size === 'md',
    [classes.textFontSizeLg]: size === 'lg',
    [classes.textFontSizeXl]: size === 'xl',
  };

  const subtitleClasses = {
    [classes.subtitleFontSizeXs]: size === 'xs',
    [classes.subtitleFontSizeSm]: size === 'sm',
    [classes.subtitleFontSizeMd]: size === 'md',
    [classes.subtitleFontSizeLg]: size === 'lg',
    [classes.subtitleFontSizeXl]: size === 'xl',
  };

  const showSkeletonContent = showSkeleton && typeof content !== 'undefined';
  const showSkeletonDescription = showSkeleton && typeof description !== 'undefined';

  return (
    <div className={classnames(classes.root, rootClasses, nestedClasses.root)} data-testid={`info-${dataTestId}`}>
      <Avatar
        onClick={handleLinkClick}
        size={avatarSize || avatarSizeMap[size]}
        text={avatarText ? avatarText.substring(0, 2) : undefined}
        icon={avatarIcon}
        src={avatarImage}
        bg={avatarBg}
        border={typeof avatarBorder === 'boolean' ? avatarBorder : !!avatarIcon}
        avatarClasses={classnames(classes.avatar, avatarClasses, nestedClasses.avatar, { [classes.isLink]: !!link })}
        data-testid={`info-${dataTestId}-avatar`}
      />

      {(title || subtitle || description || isNumber(description)) && (
        <div
          className={classnames(classes.content, verticalAlignClasses, contentClasses, nestedClasses.details)}
          data-testid={`info-${dataTestId}-content`}
        >
          <Typography
            variant="body2"
            noWrap={ellipsis}
            title={!tooltip ? (isString(title) ? title : null) : tooltip}
            className={classnames(classes.title, textClasses, nestedClasses.title)}
            data-testid={`info-${dataTestId}-title`}
          >
            <span className={classnames({ [classes.isLink]: !!link })} onClick={handleLinkClick}>
              {title}
            </span>

            {subtitle && (
              <Typography
                variant="body2"
                component="span"
                title={!subTitleTooltip ? (isString(subtitle) ? subtitle : null) : subTitleTooltip}
                className={classnames(classes.subtitle, subtitleClasses)}
                data-testid={`info-${dataTestId}-subtitle`}
              >
                {subtitle}
              </Typography>
            )}
          </Typography>

          {showSkeletonDescription ? (
            <Box mt={-0.5}>
              <Skeleton height={28} animation="wave" displayNumber={1} />
            </Box>
          ) : (
            (description || isNumber(description)) && (
              <Typography
                variant="body2"
                noWrap={ellipsis}
                title={!descriptionTooltip ? (isString(description) ? description : null) : descriptionTooltip}
                className={classnames(classes.description, textClasses, nestedClasses.description)}
                data-testid={`info-${dataTestId}-data`}
              >
                {description}
              </Typography>
            )
          )}

          {showSkeletonContent ? (
            <Box mt={-0.5}>
              <Skeleton height={32} animation="wave" displayNumber={1} />
            </Box>
          ) : (
            content && <div className={nestedClasses.content}>{content}</div>
          )}
        </div>
      )}
    </div>
  );
}
