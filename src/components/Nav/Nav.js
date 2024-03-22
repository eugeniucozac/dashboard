import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import classnames from 'classnames';
import get from 'lodash/get';

// app
import styles from './Nav.styles';
import { Menu, HeaderNav } from 'components';
import { expandNav, collapseNav } from 'stores';
import { media } from 'utils';

// mui
import { withStyles, withTheme, AppBar, Toolbar, Hidden, Drawer, SwipeableDrawer } from '@material-ui/core';

// state
const mapStateToProps = (state) => ({
  uiNavExpanded: get(state, 'ui.nav.expanded'),
});

// dispatch
const mapDispatchToProps = {
  expandNav,
  collapseNav,
};

export class Nav extends PureComponent {
  componentWillMount() {
    const { theme, expandNav, collapseNav } = this.props;

    // check if user set his preference to localStorage
    const navPreferenceSaved = JSON.parse(localStorage.getItem('edge-nav-expanded') || '{}');
    const isNavExpanded = typeof navPreferenceSaved === 'boolean' ? navPreferenceSaved : false;

    if (isNavExpanded && media.up.sm(theme)) {
      expandNav();
    } else {
      collapseNav();
    }

    media.match.mobile(theme).addListener(this.handleWindowResize);
  }

  componentWillUnmount() {
    media.match.mobile(this.props.theme).removeListener(this.handleWindowResize);
  }

  handleWindowResize = (event) => {
    // listener event is executed on object like this (for mobile):
    // window.matchMedia((max-width: 600px))

    if (event.matches) {
      this.props.collapseNav();
    }
  };

  toggleNav = () => {
    if (this.props.uiNavExpanded) {
      this.props.collapseNav();
    } else {
      this.props.expandNav();
    }
  };

  render() {
    const { uiNavExpanded, classes } = this.props;

    const drawerOpenCloseClasses = {
      [classes.drawerOpen]: uiNavExpanded,
      [classes.drawerClose]: !uiNavExpanded,
    };

    return (
      <Fragment>
        {/* Mobile Swipeable Drawer */}
        <Hidden smUp>
          <SwipeableDrawer
            open={uiNavExpanded}
            onClose={this.toggleNav}
            onOpen={this.toggleNav}
            paper={classes.paper}
            data-testid="nav-swipeable-drawer"
          >
            <AppBar position="sticky" elevation={1}>
              <Toolbar className={classes.mobileToolbar}>
                <HeaderNav showFloatingButton={false} showMagnifierButton={false} />
              </Toolbar>
            </AppBar>

            <Menu />
          </SwipeableDrawer>
        </Hidden>

        {/* Tablet/Desktop Drawer */}
        <Hidden xsDown>
          <Drawer
            variant="permanent"
            className={classnames(classes.drawer, drawerOpenCloseClasses)}
            classes={{
              paper: classnames(classes.paper, drawerOpenCloseClasses),
            }}
            open={uiNavExpanded}
            data-testid="nav-drawer"
          >
            <Menu />
          </Drawer>
        </Hidden>
      </Fragment>
    );
  }
}

export default compose(connect(mapStateToProps, mapDispatchToProps), withStyles(styles), withTheme)(Nav);
