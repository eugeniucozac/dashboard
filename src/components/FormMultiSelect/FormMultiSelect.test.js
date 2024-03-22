import React from 'react';
import FormMultiSelect from './FormMultiSelect';
import { render, screen } from 'tests';
import userEvent from '@testing-library/user-event';

const defaultProps = {
  label: 'Assign Role',
  placeholder: 'Choose Role',
  color: 'primary',
  tagType: 'primary',
  nestedClasses: {
    wrapper: {},
  },
  options: [
    { id: 0, label: 'Ardonagh Sr. Claims Handler', value: 0 },
    { id: 1, label: 'Ardonagh Jr. Claims Handler', value: 1 },
    { id: 2, label: 'Ardonagh Manager', value: 2 },
    { id: 3, label: 'Mphasis Sr. Claims Handler', value: 3 },
    { id: 4, label: 'Mphasis Jr. Claims Handler', value: 4 },
    { id: 5, label: 'Mphasis Manager', value: 5 },
  ],
};

const renderFormMultiSelect = (props) => {
  return render(<FormMultiSelect {...defaultProps} {...props} />);
};

describe('COMPONENTS › MultiSelect', () => {
  describe('@render', () => {
    it('renders component with default label and placeholder', () => {
      // arrange
      const { container } = renderFormMultiSelect();

      // assert
      expect(screen.getByText(defaultProps.label, { selector: 'label' })).toBeInTheDocument();
      expect(container.querySelector(`input[placeholder="${defaultProps.placeholder}"]`)).toBeInTheDocument();
    });

    it('renders component for checkbox actions', () => {
      // arrange
      const { container } = renderFormMultiSelect();

      // assert
    });
  });

  describe('@render for tagType primary', () => {
    it('renders MultiSelect with primary tag type', () => {
      // arrange
      const { container } = renderFormMultiSelect();

      // assert
    });

    it('renders component with selected options', () => {
      // arrange
      const selectedOptions = [
        { id: 0, label: 'Ardonagh Sr. Claims Handler', value: 0 },
        { id: 1, label: 'Ardonagh Jr. Claims Handler', value: 1 },
      ];
      renderFormMultiSelect({ selectedOptions });

      // assert
      expect(screen.getByText(`${selectedOptions[0].label}`)).toBeInTheDocument();
      expect(screen.getByText(`${selectedOptions[1].label}`)).toBeInTheDocument();
    });
  });

  describe('@render for tagType quantity', () => {
    it('renders MultiSelect with quantity tag type', () => {
      // arrange
      const { container } = renderFormMultiSelect({ tagType: 'quantity' });

      // assert
    });

    it('renders component with selected options', () => {
      // arrange
      const selectedOptions = [
        { id: 0, label: 'Ardonagh Sr. Claims Handler', value: 0 },
        { id: 1, label: 'Ardonagh Jr. Claims Handler', value: 1 },
      ];
      renderFormMultiSelect({ tagType: 'quantity', selectedOptions });

      // assert
      expect(screen.getByText(`${selectedOptions.length} Selected`)).toBeInTheDocument();
    });
  });
});
