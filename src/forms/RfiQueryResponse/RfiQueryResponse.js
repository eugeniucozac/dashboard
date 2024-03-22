import React, { useState } from 'react';
import * as Yup from 'yup';

// app
import RfiQueryResponseView from './RfiQueryResponse.view';
import * as utils from 'utils';

const RfiQueryResponse = ({ handleClose }) => {
  const rfiType = 'Internal';
  const rfiFrom = 'Joe Blocks';
  const queryCode = 'Document Version Incorrect';
  const expectedResponseDate = '7 Jan 2021';
  const queryId = '11111';
  const documents = [
    {
      id: '1',
      name: 'Slip Document',
      type: 'pdf',
      version: '1.5',
      owner: 'John Wood',
    },
    {
      id: '2',
      name: 'Slip Document',
      type: 'pdf',
      version: '1.7',
      owner: 'John Wood',
    },
  ];
  const [isLoading, setLoading] = useState(false);
  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };
  const fields = [
    {
      name: 'typeYourQueryResponse',
      label: utils.string.t('premiumProcessing.rfi.typeYourQueryResponse'),
      type: 'textarea',
      value: '',
      muiComponentProps: {
        multiline: true,
        rows: 10,
        rowsMax: 4,
        'data-testid': 'typeYourQueryResponse',
      },
      validation: Yup.string().required(utils.string.t('validation.required')),
    },
  ];
  const actions = [
    {
      name: 'cancel',
      label: utils.string.t('app.cancel'),
      handler: handleClose,
    },
    {
      name: 'submit',
      label: utils.string.t('premiumProcessing.rfi.sendRFI'),
      handler: handleSubmit,
    },
  ];

  return (
    <RfiQueryResponseView
      fields={fields}
      actions={actions}
      isLoading={isLoading}
      rfiType={rfiType}
      rfiFrom={rfiFrom}
      queryCode={queryCode}
      expectedResponseDate={expectedResponseDate}
      queryId={queryId}
      documents={documents}
    />
  );
};

export default RfiQueryResponse;
