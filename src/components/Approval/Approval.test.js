import React from 'react';

// app
import { Approval } from './Approval';
import { render } from 'tests';

describe('COMPONENTS › Approval', () => {
  const defaultProps = {
    title: 'mock title',
    onChange: jest.fn(),
    approvedDate: '2020-01-14',
    approvedDateKey: 'mockDateKey',
    user: {
      fullName: 'Joe Smith',
    },
    userKey: 'mockUserKey',
    isApproved: false,
    isApprovedKey: 'mockIsApprovedKey',
  };

  const defaultPropsApproved = {
    ...defaultProps,
    isApproved: true,
  };

  it('renders without crashing', () => {
    render(<Approval {...defaultProps} />);
  });

  describe('@render', () => {
    it('renders title', () => {
      // arrange
      const { getByTestId } = render(<Approval {...defaultPropsApproved} />);

      // assert
      expect(getByTestId('info-approval-info-title')).toHaveTextContent('mock title');
    });

    describe('isApproved: true', () => {
      it("renders user's name", () => {
        // arrange
        const { getByTestId } = render(<Approval {...defaultPropsApproved} />);

        // assert
        expect(getByTestId('info-approval-info-data')).toHaveTextContent('Joe Smith');
      });

      it("doesn't render user search field", () => {
        // arrange
        const props = { ...defaultPropsApproved, users: [{ fullName: 'Joe Smith' }] };
        const { queryByTestId } = render(<Approval {...props} />);

        // assert
        expect(queryByTestId('fullName-search')).toBeNull();
      });

      it('renders approval date', () => {
        // arrange
        const { getByTestId } = render(<Approval {...defaultPropsApproved} />);

        // assert
        expect(getByTestId('approval-date')).toHaveTextContent('2020-01-14');
      });

      it("doesn't render approve button", () => {
        // arrange
        const { queryByTestId } = render(<Approval {...defaultPropsApproved} />);

        // assert
        expect(queryByTestId('approval-confirmation-button')).not.toBeInTheDocument();
      });
    });

    describe('isApproved: false', () => {
      it("doesn't render user's name", () => {
        // arrange
        const props = { ...defaultProps, users: [{ fullName: 'Foo Bar' }] };
        const { queryByTestId } = render(<Approval {...props} />);

        // assert
        expect(queryByTestId('info-approval-info-data')).not.toBeInTheDocument();
      });

      it("doesn't render approval date", () => {
        // arrange
        const { queryByTestId } = render(<Approval {...defaultProps} />);

        // assert
        expect(queryByTestId('approval-date')).not.toBeInTheDocument();
      });

      it('renders user search field', () => {
        // arrange
        const props = { ...defaultProps, users: [{ fullName: 'Foo Bar' }] };
        const { getByTestId } = render(<Approval {...props} />);

        // assert
        expect(getByTestId('fullName-search')).toBeInTheDocument();
      });

      it("doesn't render user search field if users are not passed", () => {
        // arrange
        const { queryByTestId } = render(<Approval {...defaultProps} />);

        // assert
        expect(queryByTestId('fullName-search')).toBeNull();
      });

      it('renders approve button', () => {
        // arrange
        const { getByTestId } = render(<Approval {...defaultProps} />);

        // assert
        expect(getByTestId('approval-confirmation-button')).toBeInTheDocument();
      });
    });
  });
});
