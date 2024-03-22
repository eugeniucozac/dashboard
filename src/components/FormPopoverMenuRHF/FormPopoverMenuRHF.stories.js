import React from 'react';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { select, withKnobs, text, boolean } from '@storybook/addon-knobs';
import { Box } from '@material-ui/core';
import { FormPopoverMenuRHF } from 'components';

export default {
  title: 'FormPopoverMenuRHF',
  component: FormPopoverMenuRHF,
  decorators: [withKnobs],
};

export const Default = () => {
  const popover = {
    name: 'Menu',
    type: 'SELECT',
    indicative: false,
    group: 'GENERAL',
    label: 'New or Renewal',
    options: [
      {
        id: 'EMAIL',
        label: 'Send Email',
        callback: () => alert('EMAIL selected'),
      },
      {
        id: 'DRAFTS',
        label: 'Drafts',
        callback: () => alert('DRAFTS selected'),
      },
      {
        id: 'INBOX',
        label: 'Inbox',
        callback: () => alert('INBOX selected'),
      },
    ],
  };

  return (
    <Box width={1}>
      <FormPopoverMenuRHF
        name={popover.name}
        text={text('Text', '')}
        placeholder={text('Placeholder', 'Select')}
        size={select('Size', ['xsmall', 'small', 'medium', 'large'], 'small')}
        icon={ArrowDropDownIcon}
        iconPosition={select('Arrow Position', ['left', 'right'], 'right')}
        disabled={boolean('Disabled', false)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        items={popover.options}
      />
    </Box>
  );
};
