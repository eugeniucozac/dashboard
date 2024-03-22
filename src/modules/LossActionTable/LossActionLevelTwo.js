import React, { useState } from 'react';
import PropTypes from 'prop-types';

//app
import { LossActionRow } from './LossActionRow';
import { LossActionLevelClaim } from './LossActionLevelClaim';

LossActionLevelTwo.prototype = {
  data: PropTypes.array.isRequired,
  columnProps: PropTypes.array.isRequired,
};

export function LossActionLevelTwo({ data, columnProps }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      <LossActionRow columnProps={columnProps} data={data} isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} level={1} />
      {isOpen &&
        data?.actionChildItemList?.map((itemLevelTwo, index) => {
          return itemLevelTwo?.isClaim ? (
            <LossActionLevelClaim key={index} data={itemLevelTwo} columnProps={columnProps} />
          ) : (
            <LossActionRow key={index} columnProps={columnProps} data={itemLevelTwo} level={2} />
          );
        })}
    </>
  );
}
