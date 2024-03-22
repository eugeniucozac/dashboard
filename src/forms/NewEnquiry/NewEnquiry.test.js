import React from 'react';
import { render, getFormTextarea, getFormAutocomplete, getFormDatepicker } from 'tests';
import NewEnquiry from './NewEnquiry';

describe('FORMS › NewEnquiry', () => {
  const props = {
    handleClose: () => {},
  };

  describe('@render', () => {
    it('renders without crashing', () => {
      // arrange
      const { container } = render(<NewEnquiry {...props} />);

      // assert
      expect(container).toBeInTheDocument();
    });

    it('renders the form', () => {
      // arrange
      const { getByTestId } = render(<NewEnquiry {...props} />);

      // assert
      expect(getByTestId('form-newEnquiry')).toBeInTheDocument();
    });

    it('renders the form buttons', () => {
      // arrange
      const { queryByText } = render(<NewEnquiry {...props} />);

      // assert
      expect(queryByText('app.cancel')).toBeInTheDocument();
      expect(queryByText('placement.sheet.addDocument')).toBeInTheDocument();
      expect(queryByText('app.create')).toBeInTheDocument();
    });

    it('renders the form inputs', () => {
      // arrange
      const { container, getByText, getByLabelText } = render(<NewEnquiry {...props} />);

      // assert
      expect(getByLabelText('form.description.label')).toBeInTheDocument();
      expect(container.querySelector(getFormTextarea('description'))).toBeInTheDocument();
      expect(getByText('form.clients.label', { selector: 'label' })).toBeInTheDocument();
      expect(container.querySelector(getFormAutocomplete('clients'))).toBeInTheDocument();
      expect(getByText('form.insureds.label', { selector: 'label' })).toBeInTheDocument();
      expect(container.querySelector(getFormAutocomplete('insureds'))).toBeInTheDocument();
      expect(getByLabelText('form.inceptionDate.label')).toBeInTheDocument();
      expect(container.querySelector(getFormDatepicker('inceptionDate'))).toBeInTheDocument();
    });

    it('renders the department autocomplete if user has departments', () => {
      // arrange
      const initialState = {
        referenceData: {
          departments: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
        },
        user: {
          departmentIds: [1, 2, 3],
          departmentSelected: 1,
        },
      };
      const { container, getByText } = render(<NewEnquiry {...props} />, { initialState });

      // assert
      expect(getByText('form.departments.label', { selector: 'label' })).toBeInTheDocument();
      expect(container.querySelector(getFormAutocomplete('department'))).toBeInTheDocument();
    });
  });
});
