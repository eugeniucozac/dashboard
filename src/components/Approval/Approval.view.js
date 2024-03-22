import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// app
import styles from './Approval.styles';
import { Info, Button, FormAutocomplete } from 'components';
import PersonIcon from '@material-ui/icons/Person';
import * as utils from 'utils';
import config from 'config';

// mui
import { makeStyles, Typography } from '@material-ui/core';

ApprovalView.propTypes = {
  title: PropTypes.string.isRequired,
  user: PropTypes.object,
  userKey: PropTypes.string.isRequired,
  approvedDate: PropTypes.string,
  approvedDateKey: PropTypes.string.isRequired,
  isApproved: PropTypes.bool,
  isApprovedKey: PropTypes.string.isRequired,
  users: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  disabled: PropTypes.bool,
  disableApproval: PropTypes.bool,
};

export function ApprovalView({
  users,
  title,
  onChange,
  isSubmitting,
  disabled,
  disableApproval,
  user,
  userKey,
  approvedDate,
  approvedDateKey,
  isApproved,
  isApprovedKey,
}) {
  const classes = makeStyles(styles, { name: 'Approval' })();
  const [value, setValue] = useState({});
  const [allowUserChange, setAllowUserChange] = useState(false);

  useEffect(
    () => {
      setValue(user || {});
      setAllowUserChange(users && !isApproved);
    },
    [isApproved, user, users] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const searchField = {
    name: 'user',
    placeholder: utils.string.t('app.searchForProperty', { property: utils.string.t('app.user') }),
    optionLabel: 'fullName',
    muiComponentProps: {
      'data-testid': 'fullName-search',
      disabled,
    },
    innerComponentProps: {
      isDisabled: disabled,
      isClearable: false,
      blurInputOnSelect: true,
      noOptionsFoundMessage: utils.string.t('app.propertyNotFound', { property: utils.string.t('app.user') }),
      customStyles: {
        size: 'xs',
      },
    },
  };

  const ApprovalBox = () => {
    return (
      <div className={classes.box}>
        {allowUserChange && (
          <div className={classes.autocomplete}>
            <FormAutocomplete
              {...searchField}
              options={users || []}
              value={[value]}
              handleUpdate={(id, value) => {
                if (value[0] && typeof value[0] === 'object') {
                  setValue(value[0]);
                  onChange({ [userKey]: value[0] });
                }
              }}
            />
          </div>
        )}

        {!isApproved && (
          <Button
            nestedClasses={{ btn: classes.button }}
            text={utils.string.t('app.approve')}
            onClick={() => onChange({ [isApprovedKey]: true, [approvedDateKey]: new Date() })}
            disabled={isSubmitting || disableApproval || !user}
            color="primary"
            size="medium"
            data-testid="approval-confirmation-button"
          />
        )}

        {isApproved && (
          <Typography data-testid="approval-date" variant="body2" color="textSecondary" className={classes.date}>
            {`${utils.string.t('app.approved')}: ${utils.string.t('format.date', {
              value: { date: approvedDate, format: config.ui.format.date.text },
            })}`}
          </Typography>
        )}
      </div>
    );
  };

  return (
    <Info
      title={title}
      description={!allowUserChange ? value.fullName : undefined}
      content={<ApprovalBox />}
      avatarIcon={PersonIcon}
      nestedClasses={{
        details: classes.info,
      }}
      data-testid="approval-info"
    />
  );
}
