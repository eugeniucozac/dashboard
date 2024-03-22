import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';

// app
import { Info, Layout, Loader, PopoverMenu, SectionHeader, Translate } from 'components';
import { PlacementSummary } from 'modules';
import * as utils from 'utils';
import config from 'config';

// mui
import { Box, Grid } from '@material-ui/core';
import PolicyIcon from '@material-ui/icons/Policy';
import TodayIcon from '@material-ui/icons/Today';
import EventIcon from '@material-ui/icons/Event';

PolicyView.propTypes = {
  id: PropTypes.string.isRequired,
  policy: PropTypes.object,
  placement: PropTypes.object,
  placementLoading: PropTypes.bool,
  popoverItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      callback: PropTypes.func.isRequired,
    })
  ),
};

export function PolicyView({ id, policy, placement, placementLoading, popoverItems }) {
  return (
    <Layout testid="policy">
      <Layout main>
        <SectionHeader title={utils.string.t('policy.title')} icon={PolicyIcon} testid="policy">
          <PopoverMenu
            variant="outlined"
            id="goTo"
            size="medium"
            color="primary"
            isButton
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
        </SectionHeader>

        {policy && (
          <>
            <Box mt={2} data-testid="policy-content">
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                  <Info
                    title={utils.string.t('policy.umr')}
                    avatarIcon={PolicyIcon}
                    description={policy.umrId}
                    data-testid="policy-umrid"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Info
                    title={utils.string.t('app.inceptionDate')}
                    avatarIcon={TodayIcon}
                    description={
                      <Translate
                        label="format.date"
                        options={{ value: { date: policy.inceptionDate, format: config.ui.format.date.text, default: '-' } }}
                      />
                    }
                    data-testid="policy-inception-date"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Info
                    title={utils.string.t('app.expiryDate')}
                    avatarIcon={EventIcon}
                    description={
                      <Translate
                        label="format.date"
                        options={{ value: { date: policy.expiryDate, format: config.ui.format.date.text, default: '-' } }}
                      />
                    }
                    data-testid="risk-summary-expiry-date"
                  />
                </Grid>
              </Grid>
            </Box>

            <Box mt={4}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Info
                    title={utils.string.t('app.department')}
                    description={get(policy, 'department.name')}
                    data-testid="policy-department"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Info
                    title={utils.string.t('app.businessType')}
                    description={get(policy, 'businessType.description')}
                    data-testid="policy-business-type"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Info title={utils.string.t('policy.notes')} description={policy.notes} data-testid="policy-notes" />
                </Grid>
              </Grid>
            </Box>
          </>
        )}
      </Layout>

      <Layout sidebar padding={false}>
        {placement && <PlacementSummary placement={placement} showToggle={false} expanded />}
        <Loader visible={placementLoading} panel />
      </Layout>
    </Layout>
  );
}
