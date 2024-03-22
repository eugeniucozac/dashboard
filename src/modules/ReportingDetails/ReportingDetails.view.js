import React from 'react';
import PropTypes from 'prop-types';
import { PowerBIEmbed } from 'powerbi-client-react';

import styles from './ReportingDetails.styles';
// app
import { Layout, SectionHeader, Breadcrumb } from 'components';

// mui
import { Divider, makeStyles } from '@material-ui/core';

ReportingDetailsView.propTypes = {
  reportTitle: PropTypes.string.isRequired,
  report: PropTypes.object.isRequired,
  breadcrumbs: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired,
      active: PropTypes.bool,
    })
  ).isRequired,
};

const model = {
  BackgroundType: {
    Default: 0,
    Transparent: 1,
  },
  TokenType: {
    Add: 0,
    Embed: 1,
  },
  DisplayOption: {
    ActualSize: 2,
    FitToPage: 0,
    FitToWidth: 1,
  },
};

export function ReportingDetailsView({ reportTitle, breadcrumbs, report }) {
  const classes = makeStyles(styles, { name: 'PowerBiReport' })();

  const embedConfiguration = {
    type: 'report', // Supported types: report, dashboard, tile, visual and qna
    id: report?.id,
    embedUrl: report?.embedUrl,
    accessToken: report?.accessToken, // Keep as empty string, null or undefined
    tokenType: model.TokenType.Embed,
    pageView: model.DisplayOption.FitToPage,
    settings: {
      background: model.BackgroundType.Default,
      filterPaneEnabled: false,
      panes: {
        filters: {
          expanded: true,
          visible: true,
        },
      },
    },
  };
  return (
    <>
      <Breadcrumb links={breadcrumbs} />
      <Divider />
      <Layout isCentered testid="reporting">
        <Layout main>
          <SectionHeader title={reportTitle} testid="reporting_header"></SectionHeader>
          {report?.accessToken && report?.embedUrl ? <PowerBIEmbed embedConfig={embedConfiguration} cssClassName={classes.report} /> : null}
        </Layout>
      </Layout>
    </>
  );
}
