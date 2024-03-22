import React from 'react';

//app
import { RoleAssignmentView } from './RoleAssignmentview';
import { useMedia } from 'hooks';
import * as utils from 'utils';

export default function RoleAssignment() {
  const media = useMedia();

  const roles = [
    { id: 0, label: 'Ardonagh Sr. Claims Handler', value: 1994 },
    { id: 1, label: 'Ardonagh Jr. Claims Handler', value: 1972 },
    { id: 2, label: 'Ardonagh Manager', value: 1974 },
    { id: 3, label: 'Mphasis Sr. Claims Handler', value: 2008 },
    { id: 4, label: 'Mphasis Jr. Claims Handler', value: 1957 },
    { id: 5, label: 'Mphasis Manager', value: 1957 },
  ];

  const fields = [
    {
      gridSize: { xs: 12, sm: 6, md: 8 },
      name: 'search',
      type: 'text',
      placeholder: utils.string.t('search.title'),
      value: '',
      muiComponentProps: {
        'data-testid': 'fullName',
      },
    },
    {
      gridSize: { xs: 12, sm: 6, md: 4 },
      name: 'role',
      type: 'autocomplete',
      placeholder: utils.string.t('admin.role'),
      value: [],
      options: roles,
      optionKey: 'id',
      optionLabel: 'label',
      muiComponentProps: {
        'data-testid': 'department',
      },
    },
  ];

  const actions = [
    {
      name: 'filter',
      label: utils.string.t('app.filter'),
      handler: (values) => {
        // Todo
        // Refer: Admin portal
      },
    },
    {
      name: 'reset',
      label: utils.string.t('app.reset'),
      handler: () => {
        // Todo
        // Refer: Admin portal
        // setParams({});
      },
    },
  ];
  return <RoleAssignmentView fields={fields} actions={actions} media={media} />;
}
