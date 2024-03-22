import React from 'react';

// app
import { FormGridView } from './FormGrid.view';
import { useMedia } from 'hooks';

export function FormGrid(props) {
  const media = useMedia();
  const spacing = props.spacing ? props.spacing : props.container ? (media.mobile ? 2 : media.tablet ? 3 : 4) : 0;

  return props.container ? <FormGridView spacing={spacing} {...props} /> : <FormGridView {...props} />;
}

export default FormGrid;
