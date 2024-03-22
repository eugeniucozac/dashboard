import React from 'react';
import PropTypes from 'prop-types';

// app
import styles from './OpeningMemoSummary.styles';
import { Button, Approval, ErrorMessage, Summary } from 'components';
import * as utils from 'utils';

// mui
import { Grid, makeStyles } from '@material-ui/core';

OpeningMemoSummaryView.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      fullName: PropTypes.string.isRequired,
    })
  ),
  openingMemo: PropTypes.object.isRequired,
  disableAll: PropTypes.bool.isRequired,
  disableHandler: PropTypes.bool.isRequired,
  disableSignatory: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
};

export function OpeningMemoSummaryView({ users, openingMemo, disableAll, disableHandler, disableSignatory, onChange, onReset }) {
  const classes = makeStyles(styles, { name: 'OpeningMemoSummary' })();
  const showReset = openingMemo.isAccountHandlerApproved || openingMemo.isAuthorisedSignatoryApproved;

  const renderSummaryInfos = () => {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12} xl={6}>
          {disableAll && (
            <ErrorMessage nestedClasses={{ root: classes.error }} error={{ message: utils.string.t('openingMemo.saveBeforeApproving') }} />
          )}
          {disableHandler && !disableAll && (
            <ErrorMessage nestedClasses={{ root: classes.error }} error={{ message: utils.string.t('openingMemo.selectSignatoryFirst') }} />
          )}
          {disableSignatory && !disableAll && (
            <ErrorMessage nestedClasses={{ root: classes.error }} error={{ message: utils.string.t('openingMemo.selectHandlerFirst') }} />
          )}
          <Approval
            disabled={disableAll}
            disableApproval={disableAll || disableHandler}
            users={users}
            onChange={onChange}
            title={utils.string.t('placement.openingMemo.approvers.accountHandler')}
            user={openingMemo.accountHandler}
            userKey="accountHandler"
            approvedDate={openingMemo.accountHandlerApprovalDate}
            approvedDateKey="accountHandlerApprovalDate"
            isApproved={openingMemo.isAccountHandlerApproved}
            isApprovedKey="isAccountHandlerApproved"
          />
        </Grid>
        <Grid item xs={12} xl={6}>
          <Approval
            disabled={disableAll}
            disableApproval={disableAll || disableSignatory}
            users={users}
            onChange={onChange}
            title={utils.string.t('placement.openingMemo.approvers.authorisedSignatory')}
            user={openingMemo.authorisedSignatory}
            userKey="authorisedSignatory"
            approvedDate={openingMemo.authorisedSignatoryApprovalDate}
            approvedDateKey="authorisedSignatoryApprovalDate"
            isApproved={openingMemo.isAuthorisedSignatoryApproved}
            isApprovedKey="isAuthorisedSignatoryApproved"
          />
        </Grid>

        {showReset && (
          <Grid container item xs={12} justifyContent="center">
            <Button
              danger
              variant="outlined"
              text={utils.string.t('openingMemo.resetApprovals')}
              size="small"
              onClick={onReset}
              data-testid="approval-reset-button"
              nestedClasses={{ btn: classes.reset }}
            />
          </Grid>
        )}
      </Grid>
    );
  };

  return (
    <>
      <Summary status={utils.string.replaceLowerCase(openingMemo.status)} infos={renderSummaryInfos()} />
    </>
  );
}
