import React from 'react';
import Warning from './Warning';
import { render } from 'tests';
import AppleIcon from '@material-ui/icons/Apple';

describe('COMPONENTS › Warning', () => {
  describe('@render', () => {
    it('renders without crashing', () => {
      // arrange
      render(<Warning />);
    });

    it("renders nothing if text isn't defined", () => {
      // arrange
      const { container } = render(<Warning />);

      // assert
      expect(container).toBeEmptyDOMElement();
    });

    it('renders the text provided', () => {
      // arrange
      const { getByText } = render(<Warning text="foo" />);

      // assert
      expect(getByText('foo')).toBeInTheDocument();
    });

    it('renders with the "default" type by default', () => {
      // arrange
      const { getByTestId } = render(<Warning text="foo" />);

      // assert
      expect(getByTestId('warning-default')).toBeInTheDocument();
    });

    it('renders the correct types', () => {
      // arrange
      const typeDefault = render(<Warning text="foo" type="default" />);
      const typeInfo = render(<Warning text="foo" type="info" />);
      const typeAlert = render(<Warning text="foo" type="alert" />);
      const typeError = render(<Warning text="foo" type="error" />);
      const typeSuccess = render(<Warning text="foo" type="success" />);
      const getByTestIdDefault = typeDefault.getByTestId;
      const getByTestIdInfo = typeInfo.getByTestId;
      const getByTestIdAlert = typeAlert.getByTestId;
      const getByTestIdError = typeError.getByTestId;
      const getByTestIdSuccess = typeSuccess.getByTestId;

      // assert
      expect(getByTestIdDefault('warning-default')).toBeInTheDocument();
      expect(getByTestIdInfo('warning-info')).toBeInTheDocument();
      expect(getByTestIdAlert('warning-alert')).toBeInTheDocument();
      expect(getByTestIdError('warning-error')).toBeInTheDocument();
      expect(getByTestIdSuccess('warning-success')).toBeInTheDocument();
    });

    it('renders the icon if provided', () => {
      // arrange
      const { container } = render(<Warning text="foo" icon={AppleIcon} />);

      // assert
      expect(container.querySelector('svg')).toBeInTheDocument();
    });
  });
});
