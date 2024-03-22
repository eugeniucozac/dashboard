import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';

// app
import styles from './PolicyDocuments.styles';
import { Tabs, Loader, Warning } from 'components';
import { PolicyDocumentsUpload, PolicyDocumentsSearch } from 'forms';
import * as utils from 'utils';

// mui
import { Box, makeStyles } from '@material-ui/core';

PolicyDocumentsView.propTypes = {
  files: PropTypes.array.isRequired,
  rejectedFiles: PropTypes.array,
  data: PropTypes.object,
  dataLoading: PropTypes.bool,
  dataLoaded: PropTypes.bool,
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  selectedTab: PropTypes.string.isRequired,
  handleSelectTab: PropTypes.func.isRequired,
};

export function PolicyDocumentsView({ files, rejectedFiles, data, dataLoading, dataLoaded, tabs, selectedTab, handleSelectTab }) {
  const classes = makeStyles(styles, { name: 'PolicyDocuments' })();

  const isDataLoading = dataLoading;
  const isDataError = !dataLoading && dataLoaded && isEmpty(data);
  const isDataOk = !dataLoading && dataLoaded && !isEmpty(data);

  return (
    <div className={classes.root}>
      <Tabs
        tabs={tabs}
        value={selectedTab}
        onChange={(tabName) => handleSelectTab(tabName)}
        nestedClasses={{ root: classes.container, tabs: { root: classes.tabs, content: classes.content } }}
      >
        {isDataLoading && (
          <div className={classes.root}>
            <Box>
              <Loader visible absolute label={utils.string.t('fileUpload.loading')} />
            </Box>
          </div>
        )}
        {isDataError && (
          <div className={classes.root}>
            <Box className={classes.error}>
              <Warning type="error" text={utils.string.t('fileUpload.missingGuiData')} />
            </Box>
          </div>
        )}
        {isDataOk && selectedTab === 'upload' && (
          <Box className={classes.tab} data-testid="tab-content-upload">
            <PolicyDocumentsUpload files={files} rejectedFiles={rejectedFiles} />
          </Box>
        )}
        {isDataOk && selectedTab === 'search' && (
          <Box className={classes.tab} data-testid="tab-content-search">
            <PolicyDocumentsSearch />
          </Box>
        )}
      </Tabs>
    </div>
  );
}
