import React, { useState, useEffect } from 'react';

//app
import { RoleAssignmentSummaryView } from './RoleAssignmentSummary.view';

export default function RoleAssignmentSummary() {
  const options = [
    { id: 0, label: 'Ardonagh Sr. Claims Handler', value: 0 },
    { id: 1, label: 'Ardonagh Jr. Claims Handler', value: 1 },
    { id: 2, label: 'Ardonagh Manager', value: 2 },
    { id: 3, label: 'Mphasis Sr. Claims Handler', value: 3 },
    { id: 4, label: 'Mphasis Jr. Claims Handler', value: 4 },
    { id: 5, label: 'Mphasis Manager', value: 5 },
  ];

  /*
  const selectedOptionsFromRedux = [
    { id: 0, label: 'Ardonagh Sr. Claims Handler', value: 0 },
    { id: 1, label: 'Ardonagh Jr. Claims Handler', value: 1 },
  ];*/

  const [selectedOptions, setSelectOption] = useState([]);

  useEffect(() => {
    setSelectOption([]); //selectedOptionsFromRedux
  }, []);

  const currentUser = {
    id: 1,
    name: 'Harry Taylor',
    roles: [],
  };

  return (
    <>
      <RoleAssignmentSummaryView
        currentUser={currentUser}
        options={options}
        setSelectOption={setSelectOption}
        selectedOptions={selectedOptions}
      />
    </>
  );
}
