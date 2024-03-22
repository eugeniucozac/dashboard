import React from 'react';
import PropTypes from 'prop-types';
import kebabCase from 'lodash/kebabCase';

// app
import { AvatarGroupView } from './AvatarGroup.view';
import * as utils from 'utils';

AvatarGroup.propTypes = {
  max: PropTypes.number,
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      fullName: PropTypes.string,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      emailId: PropTypes.string,
    })
  ).isRequired,
  showFullname: PropTypes.bool,
  nestedClasses: PropTypes.object,
  testid: PropTypes.string,
};

AvatarGroup.defaultProps = {
  max: 3,
};

export default function AvatarGroup({ users, max, showFullname, nestedClasses, ...rest }) {
  const handleClickTooltip = (event) => {
    event.stopPropagation();
  };

  const usersFiltered = utils.users.getWithName(users);

  // abort
  if (!utils.generic.isValidArray(usersFiltered, true)) return null;

  // instead of rendering the +1, we actually show the last avatar where +1 would have been displayed
  const adjustedMax = usersFiltered.length === max + 1 ? max + 1 : max;

  const usersVisible = usersFiltered.slice(0, adjustedMax);
  const usersHidden = usersFiltered.slice(adjustedMax);

  const usersHiddenText = usersHidden.map((userObj) => {
    const fullname = utils.user.fullname(userObj);
    return <div key={`${userObj.id}-${kebabCase(userObj.emailId)}`}>{fullname}</div>;
  });

  return (
    <AvatarGroupView
      usersVisible={usersVisible}
      usersHidden={usersHidden}
      showFullname={showFullname}
      tooltip={usersHiddenText}
      avatarProps={rest}
      nestedClasses={nestedClasses}
      handleClickTooltip={handleClickTooltip}
    />
  );
}
