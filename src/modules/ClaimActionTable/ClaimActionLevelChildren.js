import React, { useState } from 'react';
import PropTypes from 'prop-types';

//app
import { ClaimActionRow } from './ClaimActionRow';
ClaimActionLevelChildren.prototype = {
  data: PropTypes.array.isRequired,
  columnProps: PropTypes.array.isRequired,
};

export function ClaimActionLevelChildren({ data, columnProps }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <>
      <ClaimActionRow columnProps={columnProps} data={data} isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} level={3} />
      {isOpen && data?.actionChildItemList
        ? data?.actionChildItemList?.map((itemLevelFourth, index) => {
            return <ClaimActionRow key={index} columnProps={columnProps} data={itemLevelFourth} level={4} />;
          })
        : null}
    </>
  );
}
