import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// app
import styles from './Layout.styles';
import { Button, Footer, LayoutContext, Panel } from 'components';

// mui
import { makeStyles, ClickAwayListener, Grid, Hidden, RootRef } from '@material-ui/core';
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';

LayoutView.propTypes = {
  main: PropTypes.bool,
  sidebar: PropTypes.bool,
  isCentered: PropTypes.bool,
  extensiveScreens: PropTypes.bool,
  mobile: PropTypes.bool,
  tablet: PropTypes.bool,
  desktop: PropTypes.bool,
  showDesktopControls: PropTypes.bool,
  disableDesktopControls: PropTypes.bool,
  collapsed: PropTypes.bool,
  hasSidebar: PropTypes.bool,
  hasModal: PropTypes.bool,
  childrenMain: PropTypes.node,
  childrenSidebar: PropTypes.node,
  testid: PropTypes.string,
  handleSidebarClick: PropTypes.func,
  hideScrollBar: PropTypes.bool,
};

export function LayoutView({
  main,
  sidebar,
  isCentered,
  extensiveScreen,
  mobile,
  tablet,
  desktop,
  showDesktopControls,
  disableDesktopControls,
  collapsed,
  hasSidebar,
  hasModal,
  childrenMain,
  childrenSidebar,
  handleSidebarClick,
  testid,
  hideScrollBar,
}) {
  const context = useContext(LayoutContext);

  const classes = makeStyles(styles, { name: 'Layout' })({
    hasSidebar,
    desktopControls: desktop && showDesktopControls,
    disableDesktopControls,
    collapsed,
    isCentered,
    mobile,
    tablet,
  });
  const clickAway = (mobile || tablet) && !collapsed && !hasModal;
  return (
    <>
      <div className={classes.overlay} data-testid="layout-overlay" />

      <div className={classnames(classes.container, { [classes.pageContainer]: extensiveScreen })} data-testid="layout-container">
        {childrenMain.map((c, index) => {
          return (
            <div
              id="layout-main"
              className={classnames(classes.grid, classes.main, { [classes.scrollBarVisiable]: hideScrollBar })}
              key={`main-${index}`}
              data-testid="layout-main"
            >
              <div className={classes.content} data-testid="layout-content">
                <RootRef rootRef={context.refMain}>
                  <Panel padding={c.props.padding}>{c.props.children}</Panel>
                </RootRef>
              </div>

              <Hidden smDown>
                <Footer />
              </Hidden>
            </div>
          );
        })}

        {childrenSidebar.map((c, index) => {
          return (
            <ClickAwayListener onClickAway={clickAway ? handleSidebarClick('collapsed') : () => {}} key={`sidebar-${index}`}>
              <div className={classnames(classes.grid, classes.sidebar)} data-testid="layout-sidebar">
                <div className={classes.handle} onClick={handleSidebarClick()} data-testid="layout-handle">
                  <Button
                    icon={DoubleArrowIcon}
                    variant="text"
                    disabled={disableDesktopControls}
                    light
                    size="medium"
                    nestedClasses={{
                      btn: classes.handleBtn,
                      icon: classes.handleIcon,
                    }}
                  />
                </div>

                <RootRef rootRef={context.refSidebar}>
                  <div className={classes.sidebarScroll}>
                    <Panel sidebar padding={c.props.padding} nestedClasses={{ root: classes.panelSidebar }}>
                      {c.props.children}
                    </Panel>
                  </div>
                </RootRef>
              </div>
            </ClickAwayListener>
          );
        })}

        <Hidden mdUp>
          <Grid item xs={12} className={classnames(classes.footer)}>
            <Footer />
          </Grid>
        </Hidden>
      </div>

      {/* empty div with testid for testing purpose */}
      <div data-testid={testid} style={{ display: 'none' }} />
    </>
  );
}
