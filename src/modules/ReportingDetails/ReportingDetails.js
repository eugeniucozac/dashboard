import React, { useState, useEffect } from 'react';
import { useParams, useHistory, useLocation } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet';

import { ReportingDetailsView } from './ReportingDetails.view';
import config from 'config';
import * as utils from 'utils';
import { getReportingDetails, selectReportDetails, selectSelectedGroup } from 'stores';

export default function ReportingDetails() {
  const { id } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const location = useLocation();
  const report = useSelector(selectReportDetails);
  const selectedGroup = useSelector(selectSelectedGroup);
  const [powerBiReport, setPowerBiReport] = useState(null);
  const [breadcrumbs, setBreadCrumbs] = useState([]);
  const brand = useSelector((state) => state.ui.brand);

  const reportTitle = report?.reportTitle || location.state?.reportTitle;
  const groupId = report?.reportgroupId || selectedGroup.id || location.state?.reportGroupId;
  const groupTitle = selectedGroup.name || location.state?.groupTitle;

  useEffect(
    () => {
      dispatch(getReportingDetails(id));
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );
  useEffect(
    () => {
      setPowerBiReport({
        embedUrl: report?.embedUrl,
        accessToken: report?.embedToken,
        id: report?.reportId,
        label: report?.reportTitle,
      });

      setBreadCrumbs([
        {
          name: 'report-group',
          label: utils.string.t('reporting.title'),
          link: `${config.routes.reporting.root}`,
        },
        {
          name: 'report',
          label: groupTitle,
          link: `${config.routes.reporting.root}/${groupId}`,
          active: false,
        },
        {
          name: 'report-details',
          label: reportTitle,
          link: `${config.routes.reporting.root}/${groupTitle?.toLowerCase().replace(/\s/g, '-')}/${id}`,
          active: false,
        },
      ]);
    },
    [report, groupTitle, reportTitle] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const setActiveStep = (breadcrumbs) => {
    return breadcrumbs.map((item) => {
      if (
        item.name === 'report-details' &&
        history.location.pathname.includes(`reporting/${groupTitle?.toLowerCase().replace(/\s/g, '-')}/${id}`)
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
      <ReportingDetailsView reportTitle={reportTitle} report={powerBiReport || {}} breadcrumbs={setActiveStep(breadcrumbs) || []} />
    </>
  );
}
