import React, { useState, useRef, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import get from 'lodash/get';

// app
import styles from './HeaderNav.styles';
import { AdvancedSearch, Button, Logo, Restricted, Search, Avatar, Translate, HeaderNotifications } from 'components';
import { useMedia } from 'hooks';
import { selectUser, selectIsBroker, selectUserIsExtended, getNotifications } from 'stores';
import * as constants from 'consts';
import * as utils from 'utils';
import classnames from 'classnames';

// mui
import { makeStyles, Collapse, ClickAwayListener, Fab, Grid, Hidden, List, Box, Popover } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import AddIcon from '@material-ui/icons/Add';
import SearchIcon from '@material-ui/icons/Search';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';

HeaderNavView.propTypes = {
  isDev: PropTypes.bool,
  isSidebarExpanded: PropTypes.bool,
  isFabVisible: PropTypes.bool,
  isMagnifierVisible: PropTypes.bool,
  isSearchMobileVisible: PropTypes.bool,
  isSearchResultsVisible: PropTypes.bool,
  pathname: PropTypes.string.isRequired,
  handlers: PropTypes.shape({
    searchMobileToggle: PropTypes.func,
    searchSubmit: PropTypes.func,
    searchReset: PropTypes.func,
    toggleNav: PropTypes.func,
    clickNewEnquiry: PropTypes.func,
    handleClickUserMenu: PropTypes.func,
    handleCloseUserMenu: PropTypes.func,
  }),
  displayUserMenu: PropTypes.object,
  context: PropTypes.object.isRequired,
};

export function HeaderNavView({
  resetKey,
  isDev,
  isSidebarExpanded,
  isFabVisible,
  isMagnifierVisible,
  isSearchMobileVisible,
  isSearchResultsVisible,
  handlers,
  displayUserMenu,
  context,
}) {
  const classes = makeStyles(styles, { name: 'HeaderNav' })({});
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isBroker = utils.user.isBroker(user);
  const fullname = utils.user.fullname(user);
  const initials = utils.user.initials(user);
  const userIsExtended = useSelector(selectUserIsExtended);
  const userIsBroker = useSelector(selectIsBroker);
  const notifications = useSelector((state) => get(state, 'notifications.notificationList'));
  const notificationsError = useSelector((state) => get(state, 'notifications.error'));
  const [openPopover, setOpenPopover] = useState(false);
  const { mobile, tablet } = useMedia();
  const [anchorEl, setAnchorEl] = useState(null);
  const [badgeCount, setBadgeCount] = useState(0);
  const popoverButtonRef = useRef(null);
  const userId = user?.id;

  useEffect(() => {
    if (userIsExtended) {
      dispatch(getNotifications(userId));
    }
  }, [dispatch, userId, userIsExtended]);

  useEffect(() => {
    setBadgeCount(notifications?.length);
  }, [notifications]);

  // Callback function to fetch the updated notifications for logged in user
  const onSuccessfulNotificationReadOrDelete = () => {
    dispatch(getNotifications(userId));
  };

  const toggleOpenPopover = useCallback(
    (event) => {
      if (!openPopover) dispatch(getNotifications(userId));
      setOpenPopover(!openPopover);
      setAnchorEl(event?.currentTarget);
    },
    [userId, openPopover, setOpenPopover, setAnchorEl] // eslint-disable-line react-hooks/exhaustive-deps
  );

  return (
    <>
      <Grid container spacing={3} alignItems="center" wrap="nowrap" justifyContent="space-between">
        <Grid item container wrap="nowrap" spacing={3} md={2} alignItems="center">
          <Grid item className={classes.gridMenu}>
            <Button
              icon={MenuIcon}
              variant="text"
              light
              size="medium"
              onClick={handlers.toggleNav}
              nestedClasses={{ btn: classes.hamburger }}
              data-testid="hamburger-menu"
            />
          </Grid>

          <Grid item className={classes.gridLogo}>
            <Logo height={48} className={classes.logo} />
          </Grid>
        </Grid>

        {userIsExtended && (
          <Hidden smUp>
            <Grid item className={classes.gridNotifications}>
              <Button
                icon={NotificationsNoneIcon}
                badgeContent={notificationsError ? '!' : badgeCount !== 0 ? `${badgeCount}+` : ' '}
                badgeVariant={badgeCount === 0 ? 'dot' : 'standard'}
                refProp={popoverButtonRef}
                aria-owns={openPopover ? `notification-popover` : null}
                aria-haspopup="true"
                onClick={toggleOpenPopover}
                variant="text"
                color="primary"
                badgeColor={notificationsError || badgeCount === 0 ? 'error' : 'primary'}
                light
                size="large"
                nestedClasses={{
                  icon: classes.notificationsIcon,
                }}
                data-testid="mobile-notifications-btn"
              />
              <Popover
                id={`select-popover-modal-notification`}
                open={Boolean(openPopover)}
                anchorEl={anchorEl}
                onClose={toggleOpenPopover}
                classes={{ paper: classes.popoverFrame }}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
              >
                <div className={classes.popoverBoxTop}></div>
                <HeaderNotifications
                  notifications={notifications}
                  userId={userId}
                  handlers={{
                    onSuccessfulNotificationReadOrDelete: onSuccessfulNotificationReadOrDelete,
                    setOpenPopover: setOpenPopover,
                  }}
                />
              </Popover>
            </Grid>
          </Hidden>
        )}

        {!userIsExtended && isDev && isBroker && isMagnifierVisible && (
          <Hidden smUp>
            <Grid item className={classes.gridMagnifier}>
              <Button
                icon={SearchIcon}
                variant="text"
                light
                size="medium"
                onClick={handlers.searchMobileToggle}
                nestedClasses={{
                  btn: classes.magnifierBtn,
                  icon: classes.magnifierIcon,
                }}
                data-testid="mobile-search-btn"
              />
            </Grid>
          </Hidden>
        )}

        {/* Tablet/Desktop */}
        <Hidden xsDown>
          {isDev && isBroker && !userIsExtended ? (
            <Grid item className={classes.gridSearch}>
              <ClickAwayListener
                onClickAway={isSearchResultsVisible && utils.generic.isFunction(handlers.searchReset) ? handlers.searchReset : () => {}}
              >
                <div>
                  <Search
                    key={resetKey}
                    text=""
                    placeholder={utils.string.t('advancedSearch.placeholder')}
                    submitButton={false}
                    handlers={{
                      search: handlers.searchSubmit,
                      reset: handlers.searchReset,
                    }}
                    nestedClasses={{
                      root: classes.search,
                    }}
                  />

                  {isSearchResultsVisible && (
                    <AdvancedSearch
                      handlers={{
                        onClick: handlers.searchReset,
                      }}
                      nestedClasses={{ root: classes.searchResults }}
                    />
                  )}
                </div>
              </ClickAwayListener>
            </Grid>
          ) : (
            <div className={classes.gridSearchDummy} />
          )}
          {/* dummy div to take up space if advanced search is not present */}
          {(!isDev || !userIsBroker) && <div className={classes.gridSearchDummy} />}

          {userIsExtended && (
            <Grid item className={classes.gridNotifications}>
              <Button
                icon={NotificationsNoneIcon}
                badgeContent={notificationsError ? '!' : badgeCount !== 0 ? `${badgeCount}+` : ' '}
                badgeVariant={badgeCount === 0 ? 'dot' : 'standard'}
                refProp={popoverButtonRef}
                aria-owns={openPopover ? `notification-popover` : null}
                aria-haspopup="true"
                onClick={toggleOpenPopover}
                variant="text"
                color="primary"
                badgeColor={notificationsError || badgeCount === 0 ? 'error' : 'primary'}
                light
                size="large"
                nestedClasses={{
                  icon: classes.notificationsIcon,
                }}
                data-testid="desktop-notifications-btn"
              />
              <Popover
                id={`select-popover-modal-notification`}
                open={Boolean(openPopover)}
                anchorEl={anchorEl}
                onClose={toggleOpenPopover}
                classes={{ paper: classes.popoverFrame }}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
              >
                <div className={classes.popoverBoxTop}></div>
                <HeaderNotifications
                  notifications={notifications}
                  notificationsError={notificationsError}
                  userId={userId}
                  handlers={{
                    onSuccessfulNotificationReadOrDelete: onSuccessfulNotificationReadOrDelete,
                    setOpenPopover: setOpenPopover,
                  }}
                />
              </Popover>
            </Grid>
          )}

          {/* the include needs to match with the isSubmissionBtnVisible conditions in HeaderNav.js */}
          {!userIsExtended && (
            <Restricted include={[constants.ROLE_BROKER, constants.ROLE_COBROKER]}>
              <Grid item className={classes.gridActions}>
                <Button
                  icon={AddIcon}
                  size="medium"
                  text={<Translate label={mobile || tablet ? 'submission.newShort' : 'submission.new'} />}
                  variant="contained"
                  color="primary"
                  onClick={handlers.clickNewEnquiry}
                  data-testid="new-enquiry"
                />
              </Grid>
            </Restricted>
          )}
        </Hidden>
        <Grid padding={0} data-testid="menu-user">
          <Avatar text={initials} size={32} avatarClasses={classes.avatar} onAvatarClick={handlers.handleClickUserMenu} />
          <Menu
            id="user-menu"
            getContentAnchorEl={null}
            anchorEl={displayUserMenu}
            keepMounted
            open={Boolean(displayUserMenu)}
            onClose={handlers.handleCloseUserMenu}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            MenuListProps={{ disablePadding: true }}
            PaperProps={{
              style: {
                minWidth: 170,
                width: 'auto',
              },
            }}
            disableAutoFocusItem
          >
            <List className={classnames(classes.listUser)} data-testid="menu-item-name">
              <li className={classes.user}>
                <Box display="flex" paddingBottom={1}>
                  <Avatar text={initials} size={32} avatarClasses={classes.avatar} />
                  <Box fontWeight="fontWeightMedium" padding={1} fontSize="14px" whiteSpace="nowrap">
                    {fullname}
                  </Box>
                </Box>
              </li>
            </List>
            <div>
              <Box data-testid="menu-item-logout">
                <MenuItem className={classes.logoutMenu} onClick={context && context['logout']}>
                  <ListItemIcon>
                    <ExitToAppIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={utils.string.t('app.logout')} />
                </MenuItem>
              </Box>
            </div>
          </Menu>
        </Grid>
      </Grid>
      {/* Mobile */}
      {!userIsExtended && isFabVisible && !isSidebarExpanded && (
        <Restricted include={[constants.ROLE_BROKER, constants.ROLE_COBROKER]}>
          <Hidden smUp>
            <Fab
              color="primary"
              size="medium"
              className={classes.floatingButton}
              onClick={handlers.clickNewEnquiry}
              data-testid="fab-new-enquiry"
            >
              <AddIcon />
            </Fab>
          </Hidden>
        </Restricted>
      )}

      {!userIsExtended && isDev && isBroker && (
        <Hidden smUp>
          <Collapse in={isSearchMobileVisible} className={classes.searchMobileContainer}>
            <ClickAwayListener onClickAway={utils.generic.isFunction(handlers.searchReset) ? handlers.searchReset : () => {}}>
              <div className={classes.searchMobile}>
                <Search
                  key={resetKey}
                  text=""
                  placeholder={utils.string.t('advancedSearch.placeholder')}
                  submitButton={false}
                  handlers={{
                    search: handlers.searchSubmit,
                    reset: handlers.searchReset,
                  }}
                  nestedClasses={{
                    root: classes.search,
                  }}
                />

                {isSearchResultsVisible && (
                  <AdvancedSearch
                    handlers={{
                      onClick: handlers.searchReset,
                    }}
                    nestedClasses={{ root: classes.searchResults }}
                  />
                )}
              </div>
            </ClickAwayListener>
          </Collapse>
        </Hidden>
      )}
    </>
  );
}
