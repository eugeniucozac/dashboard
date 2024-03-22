import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render } from 'tests';
import AvatarGroup from './AvatarGroup';

describe('COMPONENTS › AvatarGroup', () => {
  const singleUser = [{ id: 1, firstName: 'foo', lastName: 'bar' }];

  const twoUsers = [
    { id: 1, firstName: 'foo', lastName: 'bar' },
    { id: 2, firstName: 'lorem', lastName: 'ipsum' },
  ];

  const fourUsers = [
    { id: 1, firstName: 'foo', lastName: 'bar' },
    { id: 2, firstName: 'lorem', lastName: 'ipsum' },
    { id: 3, firstName: 'sit', lastName: 'dolor' },
    { id: 4, firstName: 'amet', lastName: 'eit' },
  ];

  const sixUsers = [
    { id: 1, firstName: 'foo', lastName: 'bar' },
    { id: 2, firstName: 'lorem', lastName: 'ipsum' },
    { id: 3, firstName: 'sit', lastName: 'dolor' },
    { id: 4, firstName: 'amet', lastName: 'eit' },
    { id: 5, firstName: 'quis', lastName: 'repellendus' },
    { id: 6, firstName: 'totam', lastName: 'voluptate' },
  ];

  it('renders nothing if not passed any props', () => {
    const { container } = render(<AvatarGroup />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing if users array is empty', () => {
    const { queryByTestId } = render(<AvatarGroup users={[]} />);
    expect(queryByTestId('avatar-group')).toBeNull();
  });

  it("renders nothing if users array doesn't have valid users", () => {
    const { queryByTestId } = render(<AvatarGroup users={[{ id: 1, emailId: 'foo@bar.com' }]} />);
    expect(queryByTestId('avatar-group')).toBeNull();
  });

  it('renders a single avatar with the initials and first name', () => {
    const { queryAllByTestId, getByText } = render(<AvatarGroup users={singleUser} />);
    expect(queryAllByTestId('avatar')).toHaveLength(1);
    expect(getByText('FB')).toBeInTheDocument();
    expect(getByText('foo')).toBeInTheDocument();
  });

  it('renders a single avatar with the full name', () => {
    const { getByText } = render(<AvatarGroup users={singleUser} showFullname />);
    expect(getByText('foo bar')).toBeInTheDocument();
  });

  it('renders multiple avatars (2)', () => {
    const { queryAllByTestId, queryByText, getByText } = render(<AvatarGroup users={twoUsers} />);
    expect(queryAllByTestId('avatar')).toHaveLength(2);
    expect(getByText('FB')).toBeInTheDocument();
    expect(getByText('LI')).toBeInTheDocument();
    expect(queryByText('foo')).toBeNull();
    expect(queryByText('lorem')).toBeNull();
  });

  it('renders multiple avatars (4) below the max allowed', () => {
    const { queryAllByTestId, getByText } = render(<AvatarGroup users={fourUsers} max={5} />);
    expect(queryAllByTestId('avatar')).toHaveLength(4);
    expect(getByText('FB')).toBeInTheDocument();
    expect(getByText('LI')).toBeInTheDocument();
    expect(getByText('SD')).toBeInTheDocument();
    expect(getByText('AE')).toBeInTheDocument();
  });

  it('renders multiple avatars (4) exactly at the max allowed', () => {
    const { queryAllByTestId, getByText } = render(<AvatarGroup users={fourUsers} max={4} />);
    expect(queryAllByTestId('avatar')).toHaveLength(4);
    expect(getByText('FB')).toBeInTheDocument();
    expect(getByText('LI')).toBeInTheDocument();
    expect(getByText('SD')).toBeInTheDocument();
    expect(getByText('AE')).toBeInTheDocument();
  });

  it('renders multiple avatars (4) one above the max allowed', () => {
    const { queryAllByTestId, queryByText, getByText } = render(<AvatarGroup users={fourUsers} max={3} />);
    expect(queryAllByTestId('avatar')).toHaveLength(4);
    expect(getByText('FB')).toBeInTheDocument();
    expect(getByText('LI')).toBeInTheDocument();
    expect(getByText('SD')).toBeInTheDocument();
    expect(getByText('AE')).toBeInTheDocument();
    expect(queryByText('+1')).toBeNull();
    expect(queryByText('+2')).toBeNull();
  });

  it('renders multiple avatars (4) and the +N when above the max allowed', () => {
    const { queryAllByTestId, getByText } = render(<AvatarGroup users={fourUsers} max={2} />);
    expect(queryAllByTestId('avatar')).toHaveLength(3);
    expect(getByText('FB')).toBeInTheDocument();
    expect(getByText('LI')).toBeInTheDocument();
    expect(getByText('+2')).toBeInTheDocument();
  });

  it('renders +N when above the max allowed', () => {
    const { queryAllByTestId, getByText } = render(<AvatarGroup users={sixUsers} max={3} />);
    expect(queryAllByTestId('avatar')).toHaveLength(4);
    expect(getByText('+3')).toBeInTheDocument();
  });
});
