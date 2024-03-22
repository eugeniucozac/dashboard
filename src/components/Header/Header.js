import React, { PureComponent } from 'react';
import { compose } from 'redux';

// app
import styles from './Header.styles';
import { HeaderNav } from 'components';

// mui
import { withStyles, AppBar, Toolbar } from '@material-ui/core';

export class Header extends PureComponent {
  render() {
    const { classes } = this.props;

    return (
      <AppBar elevation={1} id="header" data-testid="header">
        <Toolbar className={classes.toolbar}>
          <HeaderNav />
        </Toolbar>
      </AppBar>
    );
  }
}

export default compose(withStyles(styles))(Header);
