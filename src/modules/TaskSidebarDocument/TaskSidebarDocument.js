import React from 'react';
import * as Yup from 'yup';

// app
import { TaskSidebarDocumentView } from './TaskSidebarDocument.view';
import * as utils from 'utils';

export default function TaskSidebarDocument() {
  const fileField = {
    type: 'file',
    name: 'file',
    label: utils.string.t('app.document'),
    validation: Yup.mixed().nullable().required(utils.string.t('form.dragDrop.required')),
  };

  const fields = [fileField];

  return <TaskSidebarDocumentView fields={fields} />;
}
