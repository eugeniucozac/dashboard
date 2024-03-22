import React, { useState } from 'react';
import { StylePicker } from 'components';
import { Box } from '@material-ui/core';

export default {
  title: 'StylePicker',
  component: StylePicker,
};

const defaultItems = [
  { id: 1, color: '#FF6633' },
  { id: 2, color: '#FFB399' },
  { id: 3, color: '#FF33FF' },
];

export const Default = () => {
  const [selectedItem, setSelectedItem] = useState({});
  const [items, setItems] = useState(defaultItems);

  const handleStyleChange = (updatedItem) => {
    if (!updatedItem) {
      setSelectedItem({});
      return;
    }
    const updatedTypes = items.map((type) => {
      if (type.id === updatedItem.id) type = updatedItem;
      return type;
    });
    setSelectedItem({});
    setItems(updatedTypes);
  };

  const launchStylePicker = (e, item) => {
    setSelectedItem({ target: e.target, item });
  };

  return (
    <Box m={4}>
      {items.map((item) => (
        <div style={{ marginBottom: 10, width: 20, height: 20, background: item.color }} onClick={(e) => launchStylePicker(e, item)} />
      ))}
      <StylePicker el={selectedItem.target} item={selectedItem.item} onUpdate={handleStyleChange} />
    </Box>
  );
};

export const PresetColours = () => {
  const [selectedItem, setSelectedItem] = useState({});
  const [items, setItems] = useState(defaultItems);

  const handleStyleChange = (updatedItem) => {
    if (!updatedItem) {
      setSelectedItem({});
      return;
    }
    const updatedTypes = items.map((type) => {
      if (type.id === updatedItem.id) type = updatedItem;
      return type;
    });
    setSelectedItem({});
    setItems(updatedTypes);
  };

  const launchStylePicker = (e, item) => {
    setSelectedItem({ target: e.target, item });
  };

  return (
    <Box m={4}>
      {items.map((item) => (
        <div style={{ marginBottom: 10, width: 20, height: 20, background: item.color }} onClick={(e) => launchStylePicker(e, item)} />
      ))}
      <StylePicker
        el={selectedItem.target}
        item={selectedItem.item}
        onUpdate={handleStyleChange}
        presetColors={['#FF99E6', '#CCFF1A', '#FF1A66']}
      />
    </Box>
  );
};
