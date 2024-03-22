import React from 'react';

import { PDFComments } from 'components';
import { withKnobs, text } from '@storybook/addon-knobs';
import { Box } from '@material-ui/core';

export default {
  title: 'PDFComments',
  component: PDFComments,
  decorators: [withKnobs],
};

const comments = [
  {
    id: '0',
    date: '2019-01-28 08:48:34',
    message: 'lorem',
    user: { firstName: 'John', lastName: 'Smith', emailId: 'js@domain.com' },
  },
  {
    id: '1',
    date: '2018-12-24 17:04:44',
    message: 'ipsum',
    user: { firstName: 'Robert', lastName: null, emailId: 'r@domain.com' },
  },
  {
    id: '2',
    date: '2018-09-12 08:25:12',
    message: 'sit',
    user: { firstName: null, lastName: 'Simon', emailId: 's@domain.com' },
  },
  {
    id: '3',
    date: '2018-05-10 08:45:25',
    message: 'dolor',
    user: { firstName: null, lastName: null, emailId: 'asapey9@domain.edu' },
  },
  {
    id: '4',
    date: '2017-12-22 13:23:38',
    message: 'Du orbi vestibulum, vel pretium iaculis, diam ese platea dictumst. Morbi vestibulum, velit id p. String ends here at 120',
    user: { firstName: '', lastName: null, emailId: null },
  },
  {
    id: '5',
    date: '2000-01-01 12:00:00',
    user: { firstName: 'not', lastName: 'valid', emailId: null },
  },
];
export const Default = () => {
  return (
    <Box m={4}>
      <PDFComments
        comments={comments}
        subjectivities={text('Subjectivities', 'Lorem ipsum dolor sit amet')}
        title={text('Title', 'Title goes here')}
      ></PDFComments>
    </Box>
  );
};
