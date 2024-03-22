import { ErrorMessage } from 'components';
import { withKnobs, text, boolean, select } from '@storybook/addon-knobs';
import { Box } from '@material-ui/core';

export default {
  title: 'ErrorMessage',
  component: ErrorMessage,
  decorators: [withKnobs],
};

export const Default = () => {
  const size = select('Size', ['xs', 'sm', 'md', 'lg', 'xl'], 'sm');
  const bold = boolean('Bold', false);
  const error = text('Error', 'Something went wrong');
  const hint = text('Hint', 'Please try again later');

  return <ErrorMessage error={{ message: error }} hint={hint} size={size} bold={bold} />;
};
