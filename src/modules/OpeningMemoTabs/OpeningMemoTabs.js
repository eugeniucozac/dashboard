import React, { useContext } from 'react';

// app
import { OpeningMemoTabsView } from './OpeningMemoTabs.view';
import { StickyContext } from 'components';

export default function OpeningMemoTabs({ tabs, onChange }) {
  const context = useContext(StickyContext);

  return <OpeningMemoTabsView tabs={tabs} onChange={onChange} sticky={context.sticky} />;
}
