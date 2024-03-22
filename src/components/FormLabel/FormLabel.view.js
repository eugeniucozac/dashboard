import React from 'react';
import { Typography } from '@material-ui/core';
// app

export function FormLabelView({ label, variant, align, parseDangerousHtml, nestedClasses }) {
  let content = label;

  if (parseDangerousHtml) {
    content = <span dangerouslySetInnerHTML={{ __html: label }} />;
  }

  return (
    <Typography variant={variant} align={align} classes={nestedClasses}>
      {content}
    </Typography>
  );
}
