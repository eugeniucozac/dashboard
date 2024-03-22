import React from 'react';
import PropTypes from 'prop-types';

// app
import styles from './Claims.styles';
import { AccessControl, Button, Layout, PopoverMenu, SectionHeader, Translate } from 'components';
import { LossClaimsTasksDashboard } from 'modules';
import * as utils from 'utils';

// mui
import { makeStyles } from '@material-ui/core';
import DescriptionIcon from '@material-ui/icons/Description';
import SettingsIcon from '@material-ui/icons/Settings';

ClaimsView.propTypes = {
  handleComplexityRulesManagement: PropTypes.func.isRequired,
  handleRegisterNewLoss: PropTypes.func.isRequired,
};

export function ClaimsView({ handleRegisterNewLoss, handleComplexityRulesManagement }) {
  const classes = makeStyles(styles, { name: 'Claims' })();

  const popoverItems = [
    {
      id: 'complexityRulesMgmt',
      label: utils.string.t('claims.actions.complexityRulesManagement'),
      callback: handleComplexityRulesManagement,
    },
  ];

  return (
    <Layout testid="claims">
      <Layout main>
        <SectionHeader
          title={<Translate label={utils.string.t('claims.loss.title')} />}
          icon={DescriptionIcon}
          nestedClasses={{ children: classes.headerButtons }}
          testid="claims"
        >
          <div className={classes.headerContent}>
            <Button
              onClick={handleRegisterNewLoss}
              nestedClasses={{ btn: classes.button }}
              color="primary"
              variant="outlined"
              text={utils.string.t('claims.actions.registerNewLoss')}
            />
            <AccessControl feature="claimsFNOL.complexityRulesManagement" permissions={['read', 'create', 'update', 'delete']}>
              <PopoverMenu
                id="claimsPopover"
                nestedClasses={{ btn: classes.button }}
                color="primary"
                variant="outlined"
                text={utils.string.t('admin.title')}
                size="medium"
                isButton
                icon={SettingsIcon}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                items={popoverItems}
              />
            </AccessControl>
          </div>
        </SectionHeader>
        <LossClaimsTasksDashboard />
      </Layout>
    </Layout>
  );
}
