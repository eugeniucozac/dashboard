import React, { useRef, useEffect, useState } from 'react';
import * as pbi from 'powerbi-client';
import { useDispatch } from 'react-redux';

// app
import * as utils from 'utils';
import { getReportByPlacement } from 'stores';
import { PowerBiReportView } from './PowerBiReport.view';

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
  type: 'report',
  tokenType: model.TokenType.Embed,
  pageView: model.DisplayOption.FitToPage,
  settings: {
    background: model.BackgroundType.Default,
    filterPaneEnabled: false,
  },
};

export function PowerBiReport({ placementId }) {
  const dispatch = useDispatch();
  const containerRef = useRef(null);
  const [powerbi, setPowerbi] = useState();
  const [selectedReport, setSelectedReport] = useState({});
  const [reports, setReports] = useState([]);

  useEffect(
    () => {
      if (!placementId) return;
      const fetchReport = async () => {
        const reports = await dispatch(getReportByPlacement(placementId));
        if (!utils.generic.isValidArray(reports, true)) return;
        setReports(reports);
        loadReport(reports[0]);
      };
      fetchReport();
    },
    [placementId] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const loadReport = (report) => {
    setSelectedReport(report);
    const powerbiInstance = new pbi.service.Service(pbi.factories.hpmFactory, pbi.factories.wpmpFactory, pbi.factories.routerFactory);
    powerbiInstance.embed(containerRef.current, {
      ...embedConfiguration,
      ...report,
    });
    setPowerbi(powerbiInstance);
  };

  const onSelectReport = (name, id) => {
    const report = reports.find((report) => report.id === id);
    if (!report) return;
    powerbi.reset(containerRef.current);
    loadReport(report);
  };

  const setFullscreen = () => {
    const report = powerbi.get(containerRef.current);
    report.fullscreen();
  };

  return (
    <PowerBiReportView
      selectedReport={selectedReport}
      reports={reports}
      reportExists={!!utils.generic.isValidArray(reports, true)}
      setFullscreen={setFullscreen}
      containerRef={containerRef}
      onSelectReport={onSelectReport}
    />
  );
}

export default PowerBiReport;
