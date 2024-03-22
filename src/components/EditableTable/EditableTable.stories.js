import React, { useEffect } from 'react';

import { EditableTable } from 'components';
import { withKnobs, text } from '@storybook/addon-knobs';

import { Box } from '@material-ui/core';
import { useState } from 'react';
export default {
  title: 'EditableTable',
  component: EditableTable,
  decorators: [withKnobs],
};

export const Default = () => {
  const NofRows = text('No of Rows', '10');
  let fields = {
    arrayItemDef: [
      { id: 'id', type: 'label', value: '', width: 10, label: '', visable: false },
      { id: 'taskRef2', type: 'text', value: '', width: 120, label: 'Facility Reference	', disabled: true },
      { id: 'taskRef3', type: 'text', value: '', width: 120, ellipsis: true, label: 'Gross Premium (100%)' },
      { id: 'taskRef4', type: 'text', value: '', width: 80, label: 'Slip Order' },
      { id: 'taskRef5', type: 'text', value: '', width: 80, label: 'Total Brokerage' },
      { id: 'taskRef6', type: 'text', value: '', width: 120, label: 'Client Discount (%)' },
      { id: 'taskRef7', type: 'text', value: '', width: 120, label: 'Third Party Commission Sharing (%)' },
      { id: 'taskRef8', type: 'text', value: '', width: 120, label: 'Third party name' },
      { id: 'taskRef9', type: 'text', value: '', width: 120, label: 'PF Internal Commission Sharing (%)' },
      { id: 'taskRef10', type: 'text', value: '', width: 120, label: 'PF Internal Department' },
      { id: 'taskRef11', type: 'text', value: '', width: 120, label: 'Retained Brokerage' },
      { id: 'total', type: 'label', value: '', width: 80, label: 'Total' },
      { id: 'taskRef13', type: 'text', value: '', width: 80, label: 'Fees' },
      { id: 'taskRef14', type: 'text', value: '', width: 80, label: 'Other Deductions (eg. Taxes)' },
      { id: 'taskRef15', type: 'text', value: '', width: 120, label: 'Settlement Currency' },
      { id: 'taskRef16', type: 'text', value: '', width: 80, label: 'Payment Basis' },
      { id: 'taskRef17', type: 'text', value: '', width: 80, label: 'PPW/PPC' },
      { id: 'copyAction', type: 'copyIcon', value: '', width: 80, label: '' },
    ],
    fieldData: [],
  };
  const [tableRows, setTableRows] = useState(fields?.fieldData);

  const handleTableTextboxChange = (e, column, row, name) => {
    e.preventDefault();
    setTableRows((prevState) => prevState.map((dd) => (dd.id === row.id ? { ...dd, [name]: e?.target?.value } : dd)));
  };

  useEffect(() => {
    let dataObject = [];
    for (let index = 0; index < NofRows || 0; index++) {
      dataObject.push({
        id: index + 1,
        isRowSelected: false,
        taskRef2: `Reference-${index + 1}`,
        taskRef3: '',
        taskRef4: '',
        taskRef5: '',
        taskRef6: '',
        taskRef7: '',
        taskRef8: '',
        taskRef9: '',
        taskRef10: '',
        taskRef11: '',
        taskRef12: '',
        taskRef13: '',
        taskRef14: '',
        taskRef15: '',
        taskRef16: '',
        taskRef17: '',
        taskRef18: '',
      });
    }
    setTableRows(dataObject);
  }, [NofRows]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleTableRowClick = (e, row) => {
    e.preventDefault();
    if (!row.isRowSelected) {
      setTableRows((prevState) =>
        prevState.map((dd) => (dd.id === row.id ? { ...dd, isRowSelected: true } : { ...dd, isRowSelected: false }))
      );
    }
  };
  return (
    <Box width={1}>
      <EditableTable
        tableRows={tableRows}
        fields={fields}
        handlers={{
          handleTableTextboxChange: handleTableTextboxChange,
          handleTableRowClick: handleTableRowClick,
        }}
      />
    </Box>
  );
};
