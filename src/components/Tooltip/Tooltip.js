import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import classnames from 'classnames';
import omit from 'lodash/omit';

// app
import styles from './Tooltip.styles';

// mui
import { withStyles, Tooltip as MuiTooltip } from '@material-ui/core';

export class Tooltip extends PureComponent {
  static propTypes = {
    title: PropTypes.node,
    placement: PropTypes.string,
    arrow: PropTypes.bool,
    rich: PropTypes.bool,
    style: PropTypes.object,
    block: PropTypes.bool,
    flex: PropTypes.bool,
    inline: PropTypes.bool,
    inlineBlock: PropTypes.bool,
    inlineFlex: PropTypes.bool,
    nestedClasses: PropTypes.shape({
      tooltip: PropTypes.string,
    }),
    disableFocusListener: PropTypes.bool,
    disableHoverListener: PropTypes.bool,
    disableTouchListener: PropTypes.bool,
  };

  static defaultProps = {
    placement: 'top',
    arrow: true,
    style: {},
    inlineBlock: true,
    nestedClasses: {},
  };

  render() {
    const { title, arrow, rich, placement, style, block, flex, inline, inlineBlock, inlineFlex, children, classes, nestedClasses } =
      this.props;

    // abort
    if (!title) {
      return children;
    }

    // remove unwanted props for MUI Tooltip component
    const muiProps = { ...omit(this.props, ['rich', 'block', 'flex', 'inline', 'inlineBlock', 'inlineFlex', 'nestedClasses']) };

    const classesTooltip = {
      tooltip: classnames({
        [classes.tooltipRich]: rich,
        [classes.top]: placement === 'top',
        [classes.right]: placement === 'right',
        [classes.bottom]: placement === 'bottom',
        [classes.left]: placement === 'left',
        [nestedClasses.tooltip]: Boolean(nestedClasses.tooltip),
      }),
      arrow: classnames({
        [classes.arrowRich]: arrow && rich,
      }),
    };

    const tooltipWrapperStyles = {
      ...(inlineBlock && { display: 'inline-block' }),
      ...(inlineFlex && { display: 'inline-flex' }),
      ...(block && { display: 'block' }),
      ...(flex && { display: 'flex' }),
      ...(inline && { display: 'inline' }),
    };

    return (
      <MuiTooltip {...muiProps} title={title} classes={classesTooltip}>
        <span style={{ ...tooltipWrapperStyles, ...style }}>{children}</span>
      </MuiTooltip>
    );
  }
}

export default compose(withStyles(styles))(Tooltip);
