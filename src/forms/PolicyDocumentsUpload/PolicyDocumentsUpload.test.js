import React from 'react';
import { render, getFormAutocompleteMui, getFormText, getFormHidden } from 'tests';
import PolicyDocumentsUpload from './PolicyDocumentsUpload';

describe('FORMS › PolicyDocumentsUpload', () => {
  describe('@render', () => {
    const files = [
      { id: 1, name: 'one', file: { name: 'file-one.pdf' } },
      { id: 2, name: 'two', file: { name: 'file-two.pdf' } },
      { id: 3, name: 'three', file: { name: 'file-three.pdf' } },
    ];

    it('renders the search form', () => {
      const { container, getByTestId, getByText } = render(<PolicyDocumentsUpload />);

      // assert
      // form
      expect(getByTestId('form-PolicyDocumentsUpload')).toBeInTheDocument();

      // form buttons
      expect(getByText('app.cancel')).toBeInTheDocument();
      expect(getByText('fileUpload.saveDocuments')).toBeInTheDocument();

      // risk reference search input
      expect(getByText('fileUpload.fields.riskRef.label')).toBeInTheDocument();
      expect(getByText('fileUpload.hint')).toBeInTheDocument();
      expect(container.querySelector(getFormAutocompleteMui('riskReference'))).toBeInTheDocument();

      // reference fetch button
      expect(getByText('fileUpload.fetch')).toBeInTheDocument();
    });

    it('renders the list of files passed in props', () => {
      // arrange
      const { container } = render(<PolicyDocumentsUpload files={files} />);

      // assert
      expect(container.querySelector(getFormText('files.0.name'))).toBeInTheDocument();
      expect(container.querySelector(getFormAutocompleteMui('files.0.type'))).toBeInTheDocument();
      expect(container.querySelector(getFormHidden('files.0.file'))).toBeInTheDocument();
      expect(container.querySelector(getFormText('files.1.name'))).toBeInTheDocument();
      expect(container.querySelector(getFormAutocompleteMui('files.1.type'))).toBeInTheDocument();
      expect(container.querySelector(getFormHidden('files.1.file'))).toBeInTheDocument();
      expect(container.querySelector(getFormText('files.2.name'))).toBeInTheDocument();
      expect(container.querySelector(getFormAutocompleteMui('files.2.type'))).toBeInTheDocument();
      expect(container.querySelector(getFormHidden('files.2.file'))).toBeInTheDocument();
    });

    it('renders warning if too many files are passed in props', () => {
      // arrange
      const { getByText } = render(<PolicyDocumentsUpload files={files} maxFiles={2} />);

      // assert
      expect(getByText('fileUpload.messages.tooManyFiles')).toBeInTheDocument();
    });

    it("doesn't render warning if number of files don't exceed maxFiles props", () => {
      // arrange
      const { queryByText } = render(<PolicyDocumentsUpload files={files} maxFiles={4} />);

      // assert
      expect(queryByText('fileUpload.messages.tooManyFiles')).not.toBeInTheDocument();
    });
  });
});
