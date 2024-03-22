import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router';
import { useSelector } from 'react-redux';

// app
import { Layout } from 'components';
import { OpeningMemo, OpeningMemoSummary } from 'modules';
import config from 'config';
import { selectOpeningMemo } from 'stores';

OpeningMemoView.propTypes = {
  isBroker: PropTypes.bool.isRequired,
};

OpeningMemoView.defaultProps = {
  isBroker: false,
};

export function OpeningMemoView({ isBroker }) {
  const openingMemoSelected = useSelector(selectOpeningMemo);
  return (
    <Layout testid="openingMemo">
      <Layout main>{isBroker && <OpeningMemo origin={{ path: 'department' }} route={config.routes.checklist.root} />}</Layout>
      {openingMemoSelected && Object.keys(openingMemoSelected).length > 0 ? (
        <Layout sidebar padding={false}>
          {isBroker && <Route exact path={`${config.routes.checklist.root}/:openingMemoId`} component={OpeningMemoSummary} />}
        </Layout>
      ) : (
        <></>
      )}
    </Layout>
  );
}
