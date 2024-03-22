import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import classnames from 'classnames';

// app
import styles from './SeparatedList.styles';
import { Tooltip } from 'components';

// mui
import { withStyles, withTheme } from '@material-ui/core';

export class SeparatedList extends PureComponent {
  static propTypes = {
    list: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        name: PropTypes.string,
      })
    ),
    flag: PropTypes.string,
    flagIcon: PropTypes.object,
    flagSize: PropTypes.string,
    flagTooltip: PropTypes.node,
    flagType: PropTypes.oneOf(['alert']),
    hover: PropTypes.bool,
    hoverWeight: PropTypes.oneOf(['regular', 'medium']),
    separator: PropTypes.string,
  };

  static defaultProps = {
    separator: ', ',
    flagSize: '100%',
    flagType: 'alert',
    hoverWeight: 'medium',
  };

  render() {
    const { list, flag, flagIcon, flagSize, flagTooltip, hover, hoverWeight, separator, classes } = this.props;

    // abort
    if (!list || !list.length > 0) return null;

    const IconComponent = flagIcon;

    const classesIconWrapper = {
      [classes.iconWrapper]: true,
      [classes.iconHoverRegular]: hover && hoverWeight === 'regular',
      [classes.iconHoverMedium]: hover && hoverWeight === 'medium',
    };

    const listFiltered = list.filter((item) => item.id && item.name);
    const listElements = listFiltered.map((item) => {
      return (
        <span key={item.id}>
          {item[flag] && (
            <span className={classnames(classesIconWrapper)}>
              {flagTooltip && (
                <Tooltip title={flagTooltip}>
                  <IconComponent className={classes.icon} style={{ fontSize: flagSize }} />
                </Tooltip>
              )}
              {!flagTooltip && <IconComponent className={classes.icon} />}
              &nbsp;
            </span>
          )}
          <span>{item.name}</span>
        </span>
      );
    });

    return <Fragment>{listElements && listElements.length > 0 && listElements.reduce((prev, curr) => [prev, separator, curr])}</Fragment>;
  }
}

export default compose(withStyles(styles), withTheme)(SeparatedList);
