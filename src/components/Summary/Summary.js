import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import classnames from 'classnames';

// app
import styles from './Summary.styles';
import { Button, Comments, Status, Translate } from 'components';
import * as utils from 'utils';

// mui
import { withStyles, withTheme, Typography, Collapse, Fade } from '@material-ui/core';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

export class Summary extends PureComponent {
  static propTypes = {
    status: PropTypes.string,
    statusOverrides: PropTypes.object,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.element, PropTypes.arrayOf(PropTypes.element)]),
    subtitle: PropTypes.oneOfType([PropTypes.string, PropTypes.element, PropTypes.arrayOf(PropTypes.element)]),
    description: PropTypes.oneOfType([PropTypes.string, PropTypes.element, PropTypes.arrayOf(PropTypes.element)]),
    actions: PropTypes.object,
    actionContent: PropTypes.node,
    infos: PropTypes.object,
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

  static defaultProps = {
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

  constructor(props) {
    super(props);

    this.state = {
      expanded: typeof props.expanded !== 'undefined' ? props.expanded : true,
    };
  }

  handleClick = (event) => {
    const { expandToggle, handleClickExpand } = this.props;
    const expanded = this.getCollapsedStatus();

    if (expandToggle === 'card') {
      this.handleToggle();
    }

    if (utils.generic.isFunction(handleClickExpand) && !expanded) {
      handleClickExpand();
    }
  };

  handleToggle = () => {
    const { handleExpand } = this.props;

    if (utils.generic.isFunction(handleExpand)) {
      handleExpand();
    } else {
      this.setState({
        expanded: !this.state.expanded,
      });
    }
  };

  handleStopPropagation = (event) => {
    event.stopPropagation();
  };

  getCollapsedStatus = () => {
    const { expanded, handleExpand } = this.props;

    return utils.generic.isFunction(handleExpand) ? expanded : this.state.expanded;
  };

  render() {
    const {
      status,
      statusOverrides,
      title,
      subtitle,
      description,
      actions,
      actionContent,
      infos,
      commentsOptions,
      showToggle,
      expandToggle,
      collapseActions,
      collapseTitle,
      collapseSubtitle,
      collapseDescription,
      collapseContent,
      children,
      testid,
      classes,
      theme,
    } = this.props;

    const expanded = this.getCollapsedStatus();
    const mobile = utils.media.down.xs(theme);

    return (
      <div className={classnames(classes.root)} onClick={this.handleClick} data-testid={`summary${testid ? '-' + testid : ''}`}>
        {(status || actions) && (
          <div className={classnames(classes.header, { [classes.headerCollapsed]: !expanded })}>
            <div className={classes.headerContent}>
              {status && (
                <Status
                  text={<Translate label={`status.${status}`} />}
                  status={status}
                  statusOverrides={statusOverrides}
                  size={mobile ? 'sm' : 'md'}
                  data-testid="summary-status"
                />
              )}
            </div>

            <div className={classes.headerActions}>
              {actions && (
                <Fade in={!collapseActions || expanded} timeout={theme.transitions.duration.shortest}>
                  <div className={classnames({ [classes.headerActionsCollapsed]: !expanded })}>{actions}</div>
                </Fade>
              )}
              {showToggle && (expandToggle === 'btn' || (expandToggle === 'card' && expanded)) && (
                <Button
                  icon={KeyboardArrowUpIcon}
                  size="small"
                  variant="text"
                  light
                  onClick={this.handleToggle}
                  tooltip={{
                    title: utils.string.t(expanded ? 'app.collapse' : 'app.expand'),
                  }}
                  nestedClasses={{
                    icon: classnames(classes.toggleIcon, { [classes.toggleIconCollapsed]: !expanded }),
                  }}
                />
              )}
            </div>
          </div>
        )}

        {(title || actionContent) && (
          <Collapse in={!collapseTitle || expanded} timeout="auto">
            <div className={classnames(classes.title, { [classes.titleCollapsed]: !expanded })}>
              <Typography variant="h2" className={classes.titleContent} data-testid="summary-title">
                {title}
              </Typography>
              {actionContent && <div className={classes.titleAction}>{actionContent}</div>}
            </div>
          </Collapse>
        )}

        {subtitle && (
          <Collapse in={!collapseSubtitle || expanded} timeout="auto">
            <Typography
              variant="h5"
              className={classnames(classes.subtitle, { [classes.subtitleCollapsed]: !expanded })}
              data-testid="summary-subtitle"
            >
              {subtitle}
            </Typography>
          </Collapse>
        )}

        {description && (
          <Collapse in={!collapseDescription || expanded} timeout="auto">
            <Typography variant="caption" className={classes.description} data-testid="summary-description">
              {description}
            </Typography>
          </Collapse>
        )}

        <Collapse in={!collapseContent || expanded} timeout="auto">
          <Fragment>
            {infos && <div className={classes.info}>{infos}</div>}

            {/* we're preventing clicks on content/comments form to toggle (close) the card */}
            <div onClick={this.handleStopPropagation}>
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
          </Fragment>
        </Collapse>
      </div>
    );
  }
}

export default compose(withStyles(styles), withTheme)(Summary);
