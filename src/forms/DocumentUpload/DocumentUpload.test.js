import React from 'react';
import fetchMock from 'fetch-mock';
import { render, waitFor, getFormHidden } from 'tests';
import DocumentUpload from './DocumentUpload';

describe('FORMS › DocumentUpload', () => {
  beforeEach(() => {
    fetchMock.get('*', {
      body: {
        status: 'success',
        data: ['FOO', 'BAR'],
      },
    });
  });

  afterEach(() => {
    fetchMock.restore();
  });

  describe('@render', () => {
    const defaultProps = { id: 1 };

    it('renders without crashing', () => {
      // arrange
      render(<DocumentUpload {...defaultProps} />);
    });

    it('renders the component (with folder dropdown)', async () => {
      // arrange
      const { getByText } = render(<DocumentUpload {...defaultProps} />);
      await waitFor(() => getByText('app.file'));

      // assert
      expect(getByText('app.file')).toBeInTheDocument();
      expect(getByText('form.dragDrop.dragFileHere')).toBeInTheDocument();
      expect(getByText('app.or')).toBeInTheDocument();
      expect(getByText('form.dragDrop.browseFile')).toBeInTheDocument();
      expect(getByText('app.folder')).toBeInTheDocument();
      expect(getByText('app.cancel')).toBeInTheDocument();
      expect(getByText('app.submit')).toBeInTheDocument();
    });
    it('renders the component (with hidden folder input)', async () => {
      // arrange
      const { getByText, container, queryByText } = render(<DocumentUpload {...defaultProps} documentType="BAZ" />);
      await waitFor(() => getByText('app.file'));

      // assert
      expect(getByText('app.file')).toBeInTheDocument();
      expect(getByText('form.dragDrop.dragFileHere')).toBeInTheDocument();
      expect(getByText('app.or')).toBeInTheDocument();
      expect(getByText('form.dragDrop.browseFile')).toBeInTheDocument();
      expect(container.querySelector(getFormHidden('folder', 'BAZ'))).toBeInTheDocument();
      expect(queryByText('app.folder')).not.toBeInTheDocument();
      expect(getByText('app.cancel')).toBeInTheDocument();
      expect(getByText('app.submit')).toBeInTheDocument();
    });
  });
});
