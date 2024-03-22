import React, { useState } from 'react';
import PropTypes from 'prop-types';

//app
import { LossActionRow } from './LossActionRow';
LossActionLevelThree.prototype = {
  data: PropTypes.array.isRequired,
  columnProps: PropTypes.array.isRequired,
};

export function LossActionLevelThree({ data, columnProps }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <>
      <LossActionRow columnProps={columnProps} data={data} isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} level={3} />
      {isOpen && data?.actionChildItemList
        ? data?.actionChildItemList?.map((itemLevelFourth, index) => {
            return <LossActionRow key={index} columnProps={columnProps} data={itemLevelFourth} level={4} />;
          })
        : null}
    </>
  );
}
