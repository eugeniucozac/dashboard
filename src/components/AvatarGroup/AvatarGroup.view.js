import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// app
import styles from './AvatarGroup.styles';
import { Avatar, Tooltip } from 'components';
import * as utils from 'utils';

// mui
import { Typography, makeStyles } from '@material-ui/core';

AvatarGroupView.propTypes = {
  usersVisible: PropTypes.array.isRequired,
  usersHidden: PropTypes.array.isRequired,
  showFullname: PropTypes.bool,
  tooltip: PropTypes.node,
  avatarProps: PropTypes.object,
  nestedClasses: PropTypes.shape({
    root: PropTypes.string,
    name: PropTypes.string,
  }),
  handleClickTooltip: PropTypes.func.isRequired,
};

AvatarGroupView.defaultProps = {
  nestedClasses: {},
};

export function AvatarGroupView({ usersVisible, usersHidden, showFullname, tooltip, avatarProps, nestedClasses, handleClickTooltip }) {
  const classes = makeStyles(styles, { name: 'AvatarGroup' })({ single: usersVisible.length <= 1 });
  const { size = 24, testid, ...rest } = avatarProps;

  return (
    <div className={classnames(classes.root, nestedClasses.root)} data-testid={`avatar-group${testid ? `-${testid}` : ''}`}>
      {usersVisible.map((userObj, index) => {
        const fullname = utils.user.fullname(userObj);
        const firstname = utils.user.firstname(userObj);
        const initials = utils.user.initials(userObj);

        if (!fullname || !initials) return null;

        return (
          <span key={`${userObj.id}-${userObj.emailId}`} className={classes.wrapper} style={{ zIndex: usersVisible.length - index }}>
            <Tooltip title={fullname} placement="top" enterDelay={150} disableTouchListener={true} onClick={handleClickTooltip}>
              <Avatar size={size} {...rest} text={initials} avatarClasses={classes.avatar} />
            </Tooltip>

            {usersVisible.length === 1 && usersHidden.length <= 0 && (
              <Typography variant="body2" display="inline" className={nestedClasses.name}>
                {showFullname ? fullname : firstname}
              </Typography>
            )}
          </span>
        );
      })}

      {usersHidden.length > 0 && (
        <Tooltip
          title={tooltip}
          placement="top"
          enterDelay={150}
          disableTouchListener={true}
          onClick={handleClickTooltip}
          key="avatar-group-plus"
        >
          <Avatar size={size} {...rest} text={`+${usersHidden.length}`} avatarClasses={classnames(classes.avatar, classes.avatarPlus)} />
        </Tooltip>
      )}
    </div>
  );
}
