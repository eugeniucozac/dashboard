import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// app
import styles from './SummaryTop.styles';
import { Button, Comments, Status, Translate } from 'components';
import * as utils from 'utils';
import { useMedia } from 'hooks';

// mui
import { makeStyles, Box, Typography, Fade, Slide, Paper } from '@material-ui/core';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import EditIcon from '@material-ui/icons/Edit';

export default function SummaryTop(props) {
  const {
    status,
    statusOverrides,
    title,
    subtitle,
    description,
    actions,
    infos,
    headerInfo,
    commentsOptions,
    showToggle,
    expandToggle,
    collapseActions,
    children,
    testid,
    theme,
    isOpen,
    handleSummaryTop,
    handleEditPlacement,
  } = props;

  const [expandedState, setExpandedState] = useState(false);
  const media = useMedia();
  const classes = makeStyles(styles, { name: 'SummaryTop' })({ expandedState });

  useEffect(() => {
    setExpandedState(isOpen ? true : false);
  }, [isOpen]);

  const handleClick = (event) => {
    const { expandToggle, handleClickExpand } = props;
    const expanded = getCollapsedStatus();

    if (expandToggle === 'card') {
      handleToggle();
    }

    if (utils.generic.isFunction(handleClickExpand) && !expanded) {
      handleClickExpand();
    }
  };

  const handleToggle = () => {
    setExpandedState((prev) => !prev);
    handleSummaryTop();
  };

  const handleStopPropagation = (event) => {
    event.stopPropagation();
  };

  const getCollapsedStatus = () => {
    const { expanded, handleExpand } = props;

    return utils.generic.isFunction(handleExpand) ? expanded : expandedState;
  };

  const expanded = getCollapsedStatus();
  const handleEditPlacementClick = () => handleEditPlacement();

  return (
    <>
      <div className={classnames(classes.root)} onClick={handleClick} data-testid={`summary${testid ? '-' + testid : ''}`}>
        {(status || actions) && (
          <div className={classnames(classes.header, { [classes.headerCollapsed]: !expandedState })}>
            <div className={classes.headerContent}>
              {status && (
                <Status
                  text={<Translate label={`status.${status}`} />}
                  status={status}
                  statusOverrides={statusOverrides}
                  size={media.mobile ? 'sm' : 'md'}
                  data-testid="summary-status"
                />
              )}
              {title && (
                <Box flexBasis="fit-content">
                  <Typography variant="h2" className={classnames(classes.headerTitle)} data-testid="summary-title">
                    {title}
                  </Typography>
                </Box>
              )}
              {description && expandedState && (
                <Fade in={expandedState}>
                  <Box flex="1" justifyContent="end" display={{ xs: 'none', lg: 'block' }}>
                    <Typography variant="caption" className={classes.description} data-testid="summary-description">
                      {description}
                    </Typography>
                  </Box>
                </Fade>
              )}
              {headerInfo && !expandedState ? (
                <Box flex="1" justifyContent="end" display={{ xs: 'none', lg: 'block' }}>
                  {headerInfo}
                </Box>
              ) : null}
            </div>

            <Box className={classes.headerActions}>
              {actions && (
                <Fade in={!collapseActions || expandedState} timeout={theme.transitions.duration.shortest}>
                  <div className={classnames({ [classes.headerActionsCollapsed]: !expandedState })}>{actions}</div>
                </Fade>
              )}
              {showToggle && (expandToggle === 'btn' || (expandToggle === 'card' && expandedState)) && (
                <>
                  <Button icon={EditIcon} size="small" variant="text" light onClick={handleEditPlacementClick} />
                  <Button
                    icon={KeyboardArrowUpIcon}
                    size="small"
                    variant="text"
                    light
                    onClick={handleToggle}
                    tooltip={{
                      title: utils.string.t(expandedState ? 'app.collapse' : 'app.expand'),
                    }}
                    nestedClasses={{
                      icon: classnames(classes.toggleIcon, { [classes.toggleIconCollapsed]: !expandedState }),
                    }}
                  />
                </>
              )}
            </Box>
          </div>
        )}
      </div>
      <Slide direction="down" in={expandedState} mountOnEnter unmountOnExit>
        <Paper elevation={2} className={classes.paper}>
          {subtitle && (
            <Typography
              variant="h5"
              className={classnames(classes.subtitle, { [classes.subtitleCollapsed]: !expanded })}
              data-testid="summary-subtitle"
            >
              {subtitle}
            </Typography>
          )}
          {infos && <div className={classes.info}>{infos}</div>}

          {/* we're preventing clicks on content/comments form to toggle (close) the card */}
          <div onClick={(e) => handleStopPropagation(e)}>
            {children}

            {commentsOptions.id && expanded && (
              <Comments
                id={commentsOptions.id}
                title={commentsOptions.title}
                divider={commentsOptions.divider}
                placeholder={commentsOptions.placeholder}
              />
            )}
          </div>
        </Paper>
      </Slide>
    </>
  );
}

SummaryTop.propTypes = {
  status: PropTypes.string,
  statusOverrides: PropTypes.object,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element, PropTypes.arrayOf(PropTypes.element)]),
  subtitle: PropTypes.oneOfType([PropTypes.string, PropTypes.element, PropTypes.arrayOf(PropTypes.element)]),
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.element, PropTypes.arrayOf(PropTypes.element)]),
  actions: PropTypes.object,
  infos: PropTypes.object,
  headerInfo: PropTypes.object,
  commentsOptions: PropTypes.shape({
    id: PropTypes.string,
    divider: PropTypes.bool,
    placeholder: PropTypes.string,
    title: PropTypes.string,
    truncate: PropTypes.bool,
  }),
  showToggle: PropTypes.bool,
  expanded: PropTypes.bool,
  expandedToggle: PropTypes.oneOf(['btn', 'card']),
  collapseActions: PropTypes.bool,
  collapseTitle: PropTypes.bool,
  collapseSubtitle: PropTypes.bool,
  collapseDescription: PropTypes.bool,
  collapseContent: PropTypes.bool,
  handleExpand: PropTypes.func,
  handleClickExpand: PropTypes.func,
  testid: PropTypes.string,
};

SummaryTop.defaultProps = {
  expanded: true,
  expandToggle: null,
  collapseActions: true,
  collapseTitle: false,
  collapseSubtitle: true,
  collapseDescription: true,
  collapseContent: true,
  commentsOptions: {},
  statusOverrides: {},
};
