import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classnames from 'classnames';

// app
import styles from './Menu.styles';
import { FormFileDrop, Info, PopoverMenu, Restricted, Tooltip } from 'components';
import * as utils from 'utils';
import * as constants from 'consts';

// mui
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

import {
  makeStyles,
  Box,
  Collapse,
  Divider,
  Hidden,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListSubheader,
  Typography,
} from '@material-ui/core';

MenuView.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      text: PropTypes.string,
      icon: PropTypes.object,
      link: PropTypes.string,
      include: PropTypes.arrayOf(PropTypes.string),
    })
  ).isRequired,
  user: PropTypes.object.isRequired,
  context: PropTypes.object.isRequired,
  deptSelected: PropTypes.string.isRequired,
  deptList: PropTypes.array.isRequired,
  isExpanded: PropTypes.bool,
  isMobile: PropTypes.bool,
  isFileUploadVisible: PropTypes.bool,
  hasMultipleDept: PropTypes.bool,
  toggleNav: PropTypes.func.isRequired,
  userIsExtended: PropTypes.bool,
  userIsCurrentEdge: PropTypes.bool,
  handlers: PropTypes.shape({
    click: PropTypes.func.isRequired,
    fileUpload: PropTypes.func.isRequired,
  }),
};

export default function MenuView({
  items,
  user,
  context,
  deptSelected,
  deptList,
  isExpanded,
  isMobile,
  isFileUploadVisible,
  hasMultipleDept,
  toggleNav,
  handlers,
  userIsCurrentEdge,
}) {
  const classes = makeStyles(styles, { name: 'Menu' })({ isExpanded, hasMultipleDept });

  const departmentSelect = (
    <PopoverMenu
      id="department-select"
      text={deptSelected || ''}
      size="medium"
      items={deptList}
      icon={ArrowDropDownIcon}
      iconPosition="right"
      nestedClasses={{ label: classes.departmentTitle }}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
    />
  );
  const departmentSelectIcon = (
    <ListItemIcon onClick={toggleNav} className={classnames(classes.icon, classes.deptIcon)}>
      <AccountBalanceIcon fontSize="small" />
    </ListItemIcon>
  );

  return (
    <>
      {userIsCurrentEdge && (
        <Box className={classes.listDeptBox}>
          <List className={classnames(classes.list, classes.listDept)} data-testid="menu-department">
            <ListItem>
              {isExpanded ? (
                departmentSelectIcon
              ) : (
                <Tooltip title={utils.string.t('department.title')} placement="right" block>
                  {departmentSelectIcon}
                </Tooltip>
              )}
              {isExpanded ? (
                <Info
                  description={userIsCurrentEdge ? (hasMultipleDept ? departmentSelect : deptSelected) : null}
                  ellipsis
                  verticalAlign
                  size={isMobile ? 'md' : 'sm'}
                  nestedClasses={{
                    description: classnames(classes.text, classes.info),
                  }}
                />
              ) : null}
            </ListItem>
          </List>
        </Box>
      )}
      <List className={classes.list} data-testid="menu-list">
        {isFileUploadVisible && (
          <>
            <li
              onClick={() => {
                handlers.fileUpload();
              }}
            >
              <form>
                <FormFileDrop
                  name="menu-file-upload"
                  dragLabel={utils.string.t('menu.uploadFiles')}
                  showButton={false}
                  showUploadPreview={false}
                  showMaxFilesError={false}
                  componentProps={{
                    multiple: constants.POLICY_FILE_UPLOAD_ALLOW_MULTIPLE,
                    maxFiles: constants.POLICY_FILE_UPLOAD_MAX_FILES,
                    maxSize: constants.POLICY_FILE_UPLOAD_MAX_FILE_SIZE,
                    accept: constants.POLICY_FILE_UPLOAD_ALLOWED_FILE_EXT,
                    noClick: true,
                  }}
                  onChange={(files, rejectedFiles) => {
                    handlers.fileUpload(files, rejectedFiles);
                  }}
                  nestedClasses={{
                    dragArea: classes.fileUploadDragArea,
                    dragLabel: classes.fileUploadDragLabel,
                    icon: classes.fileUploadIcon,
                  }}
                />
              </form>
            </li>
            <Divider className={classnames([classes.divider, classes.dividerCollapsed])} />
          </>
        )}

        {items.map((item) => {
          if (item.divider) {
            return <Divider className={classes.divider} key={item.name} data-testid="menu-list-divider" />;
          }

          if (item.title) {
            return (
              <Collapse in={isExpanded} timeout={'auto'} key={item.name}>
                <ListSubheader className={classes.subheader}>{item.text}</ListSubheader>
              </Collapse>
            );
          }

          const IconComponent = item.icon;

          const itemContent = (
            <>
              <ListItemIcon className={classnames(classes.icon, item.selected ? classes.iconActive : null)}>
                <IconComponent />
              </ListItemIcon>
              <ListItemText className={classes.text}>
                <Typography noWrap title={item.text} className={item.selected ? classes.listActive : null}>
                  {item.text}
                </Typography>
              </ListItemText>
            </>
          );

          const listLink = (
            <ListItem
              button
              component={Link}
              to={item.link}
              target={item.isOpenInNewTab ? '_blank' : '_self'}
              onClick={handlers.click(item.action)}
              data-testid={`menu-item-${item.name}`}
            >
              {itemContent}
            </ListItem>
          );

          const listButton = (
            <ListItem button onClick={handlers.click(context[item.action])} data-testid={`menu-item-${item.name}`}>
              {itemContent}
            </ListItem>
          );

          const listItem = item.link ? listLink : listButton;

          const listItemContent = (
            <>
              {isExpanded && listItem}

              {!isExpanded && (
                <>
                  <Hidden xsDown>
                    <Tooltip title={utils.string.t(item.text)} placement="right" block>
                      {listItem}
                    </Tooltip>
                  </Hidden>
                  <Hidden smUp>{listItem}</Hidden>
                </>
              )}
            </>
          );

          if (item.include) {
            return (
              <Restricted include={item.include} key={item.name}>
                <li>{listItemContent}</li>
              </Restricted>
            );
          }

          return (
            <li key={item.name} data-testid={`menu-list${item.link ? '-link' : '-button'}`}>
              {listItemContent}
            </li>
          );
        })}
      </List>
    </>
  );
}
