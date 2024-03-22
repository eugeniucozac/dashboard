import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useHistory } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet';

// app
import { ReportDetailsExtendedView } from './ReportDetailsExtended.view';
import config from 'config';
import * as utils from 'utils';
import * as constants from 'consts';
import {
  selectSelectedReportGroupExtended,
  getReportDetailsExtended,
  selectReportDetailsExtended,
  selectReportDetailsExtendedLoading,
} from 'stores';

export default function ReportDetailsExtended() {
  const { groupId, reportId } = useParams();
  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();

  const brand = useSelector((state) => state.ui.brand);
  const selectedReportGroup = useSelector(selectSelectedReportGroupExtended);
  const reportDetails = useSelector(selectReportDetailsExtended);
  const isReportDetailsLoading = useSelector(selectReportDetailsExtendedLoading);

  const [powerBiReportDetails, setPowerBiReportDetails] = useState({});
  const [breadcrumbs, setBreadCrumbs] = useState([]);

  const groupTitle = selectedReportGroup?.name || location?.state?.reportGroupTitle;
  const reportTitle = reportDetails?.reportTitle || location?.state?.reportTitle;

  useEffect(() => {
    dispatch(getReportDetailsExtended(reportId));
  }, [dispatch]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(
    () => {
      if (reportDetails) {
        setPowerBiReportDetails({
          embedUrl: reportDetails?.embedUrl,
          accessToken: reportDetails?.embedToken,
          id: reportDetails?.reportId,
          label: reportDetails?.reportTitle,
        });
      }

      setBreadCrumbs([
        {
          name: 'report-group',
          label: utils.string.t('reportingExtended.title'),
          link: `${config.routes.reportingExtended.root}`,
        },
        {
          name: 'report',
          label: groupTitle,
          link: `${config.routes.reportingExtended.root}/${groupId}`,
          active: false,
        },
        {
          name: 'report-details',
          label: reportTitle,
          link: `${config.routes.reportingExtended.root}/${groupId}/${reportId}`,
          active: false,
        },
      ]);
    },
    [reportDetails, groupTitle, reportTitle] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const setActiveBreadCrumbStep = (breadcrumbs) => {
    // abort
    if (!utils.generic.isValidArray(breadcrumbs, true)) return [];

    return breadcrumbs?.map((item) => {
      if (
        item.name === constants.REPORTING_EXTENDED_BREADCRUMB_REPORT_DETAILS &&
        history.location.pathname.includes(`reporting-extended/${groupId}/${reportId}`)
      ) {
        item.active = true;
      } else {
        item.active = history.location.pathname === item.link;
      }
      return item;
    });
  };

  return (
    <>
      <Helmet>
        <title>{`${groupTitle} - ${reportTitle} - ${utils.app.getAppName(brand)}`}</title>
      </Helmet>
      <ReportDetailsExtendedView
        reportDetails={powerBiReportDetails}
        breadcrumbs={setActiveBreadCrumbStep(breadcrumbs)}
        reportTitle={reportTitle}
        isReportDetailsLoading={isReportDetailsLoading}
      />
    </>
  );
}
