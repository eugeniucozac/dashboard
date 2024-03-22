import React from 'react';
import { render, getFormCheckbox } from 'tests';
import DownloadFiles from './DownloadFiles';

describe('FORMS › DownloadFiles', () => {
  const props = {
    handleClose: () => {},
  };

  const propsWithUmrs = {
    handleClose: () => {},
    umrIds: ['FOO', 'BAR'],
  };

  describe('@render', () => {
    it('renders without crashing', () => {
      // arrange
      const { container } = render(<DownloadFiles {...props} />);

      // assert
      expect(container).toBeInTheDocument();
    });

    it('renders nothing if umrIds array is empty', () => {
      // arrange
      const { container } = render(<DownloadFiles {...props} umrIds={[]} />);

      // assert
      expect(container).toBeEmptyDOMElement();
    });

    it('renders the form', () => {
      // arrange
      const { getByTestId } = render(<DownloadFiles {...propsWithUmrs} />);

      // assert
      expect(getByTestId('form-download-files')).toBeInTheDocument();
    });

    it('renders the form buttons', () => {
      // arrange
      const { queryByText } = render(<DownloadFiles {...propsWithUmrs} />);

      // assert
      expect(queryByText('app.cancel')).toBeInTheDocument();
      expect(queryByText('app.download')).toBeInTheDocument();
    });

    it('renders the title for the two (2) options', () => {
      // arrange
      const { getByText } = render(<DownloadFiles {...propsWithUmrs} />);

      // assert
      expect(getByText('openingMemo.whitespace.downloadAllUmrs')).toBeInTheDocument();
      expect(getByText('openingMemo.whitespace.downloadSelectUmrs')).toBeInTheDocument();
    });

    it('renders the form inputs', () => {
      // arrange
      const { container, getByLabelText } = render(<DownloadFiles {...propsWithUmrs} />);

      // assert
      expect(getByLabelText('app.all')).toBeInTheDocument();
      expect(container.querySelector(getFormCheckbox('downloadAll'))).toBeInTheDocument();

      expect(getByLabelText('FOO')).toBeInTheDocument();
      expect(container.querySelector(getFormCheckbox('FOO'))).toBeInTheDocument();

      expect(getByLabelText('BAR')).toBeInTheDocument();
      expect(container.querySelector(getFormCheckbox('BAR'))).toBeInTheDocument();
    });
  });
});
