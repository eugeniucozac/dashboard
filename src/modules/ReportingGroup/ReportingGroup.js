import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useHistory } from 'react-router';
import { Helmet } from 'react-helmet';

import { ReportingGroupView } from './ReportingGroup.view';
import * as utils from 'utils';
import config from 'config';
import {
  showModal,
  selectReportList,
  getReportList,
  selectSelectedGroup,
  deleteReport,
  selectIsReportAdmin,
  getReportingDcouments,
  deselectDocument,
} from 'stores';

export default function Reporting() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const brand = useSelector((state) => state.ui.brand);
  const reportingList = useSelector(selectReportList);
  const selectedGroup = useSelector(selectSelectedGroup);
  const isReportAdmin = useSelector(selectIsReportAdmin);
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const groupTitle = selectedGroup.name;
  const reportGroupId = id;
  const documents = useSelector((state) => state.document.documents);
  const folders = useSelector((state) => state.document.folders);

  useEffect(() => {
    dispatch(getReportList(id));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(
    () => {
      let isSubscribed = true;
      if (!reportGroupId) return;
      if (isSubscribed) {
        dispatch(getReportingDcouments(reportGroupId));
        return () => dispatch(deselectDocument());
      }
      return () => {
        isSubscribed = false;
      };
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  useEffect(
    () => {
      setBreadcrumbs([
        {
          name: 'report-group',
          label: utils.string.t('reporting.title'),
          link: `${config.routes.reporting.root}`,
        },
        {
          name: 'report',
          label: groupTitle || '',
          link: `${config.routes.reporting.root}/${id}`,
          active: false,
        },
      ]);
    },
    [groupTitle] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const filterReportngList = reportingList.items;

  const setActiveStep = (breadcrumbs) => {
    return breadcrumbs.map((item) => {
      if (item.name === 'report' && history.location.pathname.includes(`reporting/${id}`)) {
        item.active = true;
      } else {
        item.active = history.location.pathname === item.link;
      }
      return item;
    });
  };
  const handleClickRow = (report) => (event) => {
    const id = report.id;
    const reportTitle = report.title;
    const route = report.id && `${config.routes.reporting.root}`;
    const slug = groupTitle.toLowerCase().replace(/\s/g, '-');
    history.push(`${route}/${slug}/${id}`, { groupTitle, reportTitle, reportGroupId });
  };

  const handleEdit = (popoverData) => {
    dispatch(
      showModal({
        component: 'EDIT_REPORT_GROUP',
        props: {
          fullWidth: false,
          maxWidth: 'sm',
          title: utils.string.t('reporting.editReport'),
          componentProps: {
            ...popoverData,
            report: popoverData,
          },
        },
      })
    );
  };
  const handleAdd = () => {
    const newPopoverData = { groupId: id };
    dispatch(
      showModal({
        component: 'ADD_REPORT_GROUP',
        props: {
          fullWidth: false,
          maxWidth: 'sm',
          title: utils.string.t('reporting.addReport'),
          componentProps: {
            ...newPopoverData,
            report: newPopoverData,
          },
        },
      })
    );
  };
  const handleDelete = (popoverData) => {
    let submitHandler = () => {
      dispatch(deleteReport(popoverData?.id));
    };

    dispatch(
      showModal({
        component: 'CONFIRM_DELETE',
        props: {
          title: utils.string.t('reporting.deleteReport'),
          subtitle: popoverData.title,
          fullWidth: true,
          maxWidth: 'xs',
          disableAutoFocus: true,
          componentProps: {
            submitHandler,
          },
        },
      })
    );
  };

  const uploadNew = () => {
    dispatch(
      showModal({
        component: 'DOCUMENT_UPLOAD',
        props: {
          title: 'documents.upload.modal.title',
          fullWidth: true,
          maxWidth: 'sm',
          disableAutoFocus: true,
          componentProps: {
            reportGroupId,
            isFolderCreatable: true,
          },
        },
      })
    );
  };

  return (
    <>
      <Helmet>
        <title>{`${groupTitle} - ${groupTitle} - ${utils.app.getAppName(brand)}`}</title>
      </Helmet>
      <ReportingGroupView
        isReportAdmin={isReportAdmin}
        groupTitle={groupTitle || ''}
        groupId={id}
        list={filterReportngList}
        handleClickRow={handleClickRow}
        handleAdd={handleAdd}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        breadcrumbs={setActiveStep(breadcrumbs) || []}
        uploadNew={uploadNew}
        documents={documents}
        folders={folders}
      />
    </>
  );
}
