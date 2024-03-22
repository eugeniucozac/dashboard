import React from 'react';
import { render, within } from 'tests';
import { Info } from './Info';
import ListIcon from '@material-ui/icons/List';

describe('COMPONENTS › Info', () => {
  const defaultProps = {
    'data-testid': '123',
  };

  it('renders without crashing', () => {
    render(<Info {...defaultProps} />);
  });

  it('renders the title component', () => {
    // arrange
    const props = { ...defaultProps, title: 'foo' };
    const { getByTestId, queryByTestId } = render(<Info {...props} />);
    const title = getByTestId('info-123-title');
    const subTitle = queryByTestId('info-123-subtitle');

    // assert
    expect(within(title).getByText('foo')).toBeInTheDocument();
    expect(subTitle).not.toBeInTheDocument();
  });

  it('renders the sub title component', () => {
    // arrange
    const props = { ...defaultProps, title: 'foo', subtitle: 'bar' };
    const { getByTestId } = render(<Info {...props} />);
    const subTitle = getByTestId('info-123-subtitle');

    // assert
    expect(within(subTitle).getByText('bar')).toBeInTheDocument();
  });

  it('renders the description component', () => {
    // arrange
    const props = {
      ...defaultProps,
      description: 'qwerty',
    };
    const { getByTestId } = render(<Info {...props} />);
    const data = getByTestId('info-123-data');

    // assert
    expect(within(data).getByText('qwerty')).toBeInTheDocument();
  });

  it('renders content', () => {
    // arrange
    const props = {
      ...defaultProps,
      title: 'foo',
      content: 'content here',
    };
    const { getByText } = render(<Info {...props} />);

    // assert
    expect(getByText('content here')).toBeInTheDocument();
  });

  it('renders avatar', () => {
    // arrange
    const props = {
      ...defaultProps,
      avatarIcon: ListIcon,
    };
    const { getByTestId } = render(<Info {...props} />);

    // assert
    expect(getByTestId('avatar')).toBeInTheDocument();
  });
});
