import React, { useState } from 'react';
import PropTypes from 'prop-types';

//app
import { ClaimActionLevelChildren } from './ClaimActionLevelChildren';
import { TableRowHeader } from 'modules';
ClaimActionLevelClaim.prototype = {
  data: PropTypes.array.isRequired,
  columnProps: PropTypes.array.isRequired,
};

export function ClaimActionLevelClaim({ data, columnProps, handlers }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <TableRowHeader
      title={`Claim ${data.claimRef}`}
      subtitle={`${data.department} - ${data.insured}`}
      isOpen={isOpen}
      handlers={handlers}
      onClick={() => setIsOpen(!isOpen)}
      claimInformation={data}
    >
      {isOpen &&
        data.actionChildItemList.map((itemLevelThree, index) => {
          return <ClaimActionLevelChildren key={index} data={itemLevelThree} columnProps={columnProps} />;
        })}
    </TableRowHeader>
  );
}
