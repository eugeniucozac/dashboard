import React, { useState } from 'react';
import PropTypes from 'prop-types';

//app
import { LossActionLevelThree } from './LossActionLevelThree';
import { TableRowHeader } from 'modules';
LossActionLevelClaim.prototype = {
  data: PropTypes.array.isRequired,
  columnProps: PropTypes.array.isRequired,
};

export function LossActionLevelClaim({ data, columnProps }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <TableRowHeader
      title={`Claim ${data.claimRef}`}
      subtitle={`${data.department} - ${data.insured}`}
      isOpen={isOpen}
      onClick={() => setIsOpen(!isOpen)}
      claimInformation={data}
    >
      {isOpen &&
        data?.actionChildItemList?.map((itemLevelThree, index) => {
          return <LossActionLevelThree key={index} data={itemLevelThree} columnProps={columnProps} />;
        })}
    </TableRowHeader>
  );
}
