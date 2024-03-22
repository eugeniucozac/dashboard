import React from 'react';
import Assign from './Assign';
import { render, screen, waitFor, debugElem } from 'tests';
import userEvent from '@testing-library/user-event';

const users = [
  {
    userId: 1,
    userName: 'User 1',
  },
  {
    userId: 2,
    userName: 'User 2',
  },
];

const selectedUser = users[1];

const defaultProps = {
  selectedUser,
  users,
  onAssign: jest.fn(),
};

const renderAssign = (props) => {
  return render(<Assign {...defaultProps} {...props} />);
};

describe('COMPONENTS › Assign', () => {
  describe('@render', () => {
    it('renders the default label, placeholder and button texts', () => {
      // arrange
      const { container } = renderAssign();

      // assert
      // expect(screen.getByText('app.assignTo', { selector: 'label' })).toBeInTheDocument();
      expect(container.querySelector('input[placeholder="app.chooseTechnician"]')).toBeInTheDocument();
      expect(screen.getByText('app.assign', { selector: 'button > span' })).toBeInTheDocument();
    });

    it('renders custom label, placeholder and button texts if passed in props', () => {
      // arrange
      const { container } = renderAssign({ label: 'Foo', placeholder: 'Bar', button: 'Qwe' });

      // assert
      expect(screen.getByText('Foo', { selector: 'label' })).toBeInTheDocument();
      expect(container.querySelector('input[placeholder="Bar"]')).toBeInTheDocument();
      expect(screen.getByText('Qwe', { selector: 'button > span' })).toBeInTheDocument();
    });
  });
});
