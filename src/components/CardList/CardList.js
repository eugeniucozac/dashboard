import React from 'react';
import PropTypes from 'prop-types';

// app
import { CardListView } from './CardList.view';

CardList.propTypes = {
  title: PropTypes.string,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string,
      subheader: PropTypes.string,
      onClick: PropTypes.func,
      spacing: PropTypes.bool,
      disabled: PropTypes.bool,
    })
  ),
  scrollable: PropTypes.bool,
  scrollButtons: PropTypes.oneOf(['auto', 'desktop', 'on', 'off']),
  nestedClasses: PropTypes.object,
};

CardList.defaultProps = {
  scrollButtons: 'on',
  scrollable: true,
  nestedClasses: {},
};

export default function CardList({ title, data, scrollable, scrollButtons, nestedClasses }) {
  const hasValidData = (data) => {
    return data.some((card) => {
      return card.title || card.subheader || card.text || card.children;
    });
  };

  // abort
  if (!data || !data.length > 0 || !hasValidData(data)) return null;

  return (
    <CardListView
      title={title}
      data={data}
      scrollable={scrollable}
      scrollButtons={scrollButtons}
      hasValidData={hasValidData}
      nestedClasses={nestedClasses}
    />
  );
}
