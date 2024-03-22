import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';

// app
import styles from './TrafficLights.styles';
import { Badge, Tooltip, Translate } from 'components';

// mui
import { withStyles } from '@material-ui/core';

export class TrafficLights extends PureComponent {
  static propTypes = {
    green: PropTypes.number,
    yellow: PropTypes.number,
    red: PropTypes.number,
    tooltip: PropTypes.bool,
    tooltipContent: PropTypes.element,
    tooltipProps: PropTypes.object,
  };

  static defaultProps = {
    green: 0,
    yellow: 0,
    red: 0,
  };

  render() {
    const { green, yellow, red, tooltip, tooltipContent, tooltipProps, classes } = this.props;

    const badges = (
      <div>
        <Badge type="success" standalone badgeContent={green} showZero={true} className={classes.item} data-testid="success-badge" />
        <Badge type="alert" standalone badgeContent={yellow} showZero={true} className={classes.item} data-testid="alert-badge" />
        <Badge type="error" standalone badgeContent={red} showZero={true} className={classes.item} data-testid="error-badge" />
      </div>
    );

    const tooltipText = tooltipContent || (
      <Translate
        parseDangerousHtml
        label="placement.generic.trafficLights.tooltip"
        options={{ quoted: green, pending: yellow, declined: red }}
      />
    );

    return (
      <div className={classes.root}>
        {/* with tooltip */}
        {tooltip && (
          <Tooltip title={tooltipText} {...tooltipProps}>
            {badges}
          </Tooltip>
        )}

        {/* without tooltip */}
        {!tooltip && badges}
      </div>
    );
  }
}

export default compose(withStyles(styles))(TrafficLights);
