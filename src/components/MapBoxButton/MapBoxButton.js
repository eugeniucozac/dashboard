import React, { Component } from 'react';
import { compose } from 'redux';

// app
import styles from './MapBoxButton.styles';

// mui
import { Button } from 'components';
import { withStyles } from '@material-ui/core';

export class MapBoxButton extends Component {
  render() {
    const { classes, ...newProps } = this.props;

    return <Button {...newProps} nestedClasses={{ btn: classes.root }} />;
  }
}

export default compose()(withStyles(styles))(MapBoxButton);
