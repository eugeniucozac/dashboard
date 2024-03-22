import React, { Component } from 'react';

// app
import theme from 'theme';

// mui
import { createTheme } from '@material-ui/core/styles';
import { MuiThemeProvider } from '@material-ui/core';

export class Theme extends Component {
  render() {
    const muiTheme = createTheme(theme);

    return <MuiThemeProvider theme={muiTheme}>{this.props.children}</MuiThemeProvider>;
  }
}

export default Theme;
