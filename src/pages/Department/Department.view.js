import React from 'react';
import PropTypes from 'prop-types';

// app
import { Empty, Layout, Loader, Tabs } from 'components';
import { PlacementSummary, DepartmentAccounts, DepartmentMarkets } from 'modules';
import { useMedia } from 'hooks';
import * as utils from 'utils';

// mui
import { Collapse, Fade } from '@material-ui/core';
import { ReactComponent as IconSearchFile } from '../../assets/svg/line-icon-search-file.svg';

DepartmentView.propTypes = {
  isBroker: PropTypes.bool.isRequired,
  tabs: PropTypes.array.isRequired,
  selectedTab: PropTypes.string.isRequired,
  placement: PropTypes.object.isRequired,
  placementSelected: PropTypes.object,
  hasLoader: PropTypes.bool,
  handlers: PropTypes.shape({
    handleSelectTab: PropTypes.func,
  }),
};

export function DepartmentView({ isBroker, tabs, selectedTab, placement, placementSelected, hasLoader, handlers }) {
  const media = useMedia();

  return (
    <Layout testid="department">
      <Layout main padding>
        <Tabs tabs={tabs} value={selectedTab} onChange={(tabName) => handlers.handleSelectTab(tabName)} />

        {selectedTab === 'renewals' && <DepartmentAccounts />}
        {selectedTab === 'markets' && isBroker && <DepartmentMarkets />}
      </Layout>

      {media.tabletUp && selectedTab === 'renewals' && (
        <Layout sidebar padding={false}>
          <>
            <Fade timeout={400} in={!placementSelected || !placementSelected.id}>
              <Collapse timeout={400} in={!placementSelected || !placementSelected.id}>
                <Empty
                  title={utils.string.t('renewals.noPlacement')}
                  text={utils.string.t('renewals.noPlacementHint')}
                  icon={<IconSearchFile />}
                  padding
                />
              </Collapse>
            </Fade>

            {placementSelected && placementSelected.id && (
              <PlacementSummary placement={placementSelected} showActions={true} testid="placement" />
            )}
            <Loader visible={!hasLoader && placement.loadingSelected} panel />
          </>
        </Layout>
      )}
    </Layout>
  );
}
