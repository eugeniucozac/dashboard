import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

// app
import { StylePickerView } from './StylePicker.view';
import config from 'config';

StylePicker.propTypes = {
  item: PropTypes.shape({
    color: PropTypes.string,
  }),
  presetColors: PropTypes.array.isRequired,
  onUpdate: PropTypes.func.isRequired,
  colorType: PropTypes.string,
  el: PropTypes.object,
};

StylePicker.defaultProps = {
  item: {},
  presetColors: config.colorPicker.colors,
  colorType: 'hex',
};

export default function StylePicker({ item, onUpdate, colorType, el, presetColors }) {
  const [styleConfig, setStyleConfig] = useState({});

  useEffect(
    () => {
      if (!item) return;
      const { color } = item;
      setStyleConfig({ color });
    },
    [item] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handleChange = (styleUpdate) => {
    setStyleConfig({ ...styleConfig, ...styleUpdate });
  };

  const handleUpdate = () => {
    onUpdate({ ...item, ...styleConfig });
  };

  const handleCancel = () => {
    onUpdate();
  };

  return (
    <StylePickerView
      presetColors={presetColors}
      styleConfig={styleConfig}
      colorType={colorType}
      onSave={handleUpdate}
      onCancel={handleCancel}
      onStyleChange={handleChange}
      el={el}
    />
  );
}
