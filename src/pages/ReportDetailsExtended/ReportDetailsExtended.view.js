import React from 'react';
import PropTypes from 'prop-types';
import { PowerBIEmbed } from 'powerbi-client-react';

// app
import styles from './ReportDetailsExtended.styles';
import * as utils from 'utils';
import { Layout, Breadcrumb, Warning } from 'components';

// mui
import { Divider, makeStyles, Box } from '@material-ui/core';

ReportDetailsExtendedView.propTypes = {
  reportDetails: PropTypes.object.isRequired,
  breadcrumbs: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired,
      active: PropTypes.bool,
    })
  ).isRequired,
  reportTitle: PropTypes.string.isRequired,
  isReportDetailsLoading: PropTypes.bool.isRequired,
};

export function ReportDetailsExtendedView({ reportDetails, breadcrumbs, reportTitle, isReportDetailsLoading }) {
  const classes = makeStyles(styles, { name: 'ReportDetailsExtended' })();

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

  const embedConfiguration = {
    type: 'report', // Supported types: report, dashboard, tile, visual and qna
    id: reportDetails?.id,
    embedUrl: reportDetails?.embedUrl,
    accessToken: reportDetails?.accessToken, // Keep as empty string, null or undefined
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

  const hasReportAccessTokenAndEmbedUrl = reportDetails?.accessToken && reportDetails?.embedUrl;

  return (
    <>
      <Breadcrumb links={breadcrumbs} />
      <Divider />
      <Layout isCentered>
        <Layout main>
          {hasReportAccessTokenAndEmbedUrl && <PowerBIEmbed embedConfig={embedConfiguration} cssClassName={classes.reportDetails} />}
          {!hasReportAccessTokenAndEmbedUrl && !isReportDetailsLoading && (
            <Box display="flex" justifyContent="center" mt={3} mb={1}>
              <Warning
                type="alert"
                icon
                border
                text={utils.string.t('reportingExtended.reportingDetails.getReport.notFound', {
                  reportTitle: reportTitle,
                })}
              />
            </Box>
          )}
        </Layout>
      </Layout>
    </>
  );
}
