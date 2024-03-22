import React from 'react';
import { render, within, getFormAutocomplete, getFormDatepicker, getFormHidden, getFormTextarea } from 'tests';
import EditPlacement from './EditPlacement';

describe('FORMS › EditPlacement', () => {
  const props = {
    handleClose: () => {},
  };

  describe('@render', () => {
    const placement = {
      id: 1,
      users: [
        { id: 1, firstName: 'Albert', role: 'BROKER' },
        { id: 2, firstName: 'Ben', role: 'BROKER' },
        { id: 3, firstName: 'Chris', role: 'COBROKER' },
        { id: 4, firstName: 'Dave', role: 'COBROKER' },
        { id: 5, firstName: 'Eric', role: null },
        { id: 6, firstName: 'Frank', role: '' },
      ],
      statusId: 2,
    };

    it('renders without crashing', () => {
      // arrange
      const { container } = render(<EditPlacement {...props} />);

      // assert
      expect(container).toBeInTheDocument();
    });

    it('renders the form', () => {
      // arrange
      const { getByTestId } = render(<EditPlacement {...props} />);

      // assert
      expect(getByTestId('form-editPlacement')).toBeInTheDocument();
    });

    it('renders the form buttons', () => {
      // arrange
      const { queryByText } = render(<EditPlacement {...props} />);

      // assert
      expect(queryByText('app.cancel')).toBeInTheDocument();
      expect(queryByText('app.submit')).toBeInTheDocument();
    });

    it('renders the form inputs', () => {
      // arrange
      const { container, getByText, getByLabelText } = render(<EditPlacement {...props} />);

      // assert
      expect(getByText('form.brokers.label', { selector: 'label' })).toBeInTheDocument();
      expect(container.querySelector(getFormAutocomplete('brokers'))).toBeInTheDocument();

      expect(getByText('placement.form.coBrokers.label', { selector: 'label' })).toBeInTheDocument();
      expect(container.querySelector(getFormAutocomplete('cobrokers'))).toBeInTheDocument();

      expect(getByText('form.clients.label', { selector: 'label' })).toBeInTheDocument();
      expect(container.querySelector(getFormAutocomplete('clients'))).toBeInTheDocument();

      expect(getByText('form.insureds.label', { selector: 'label' })).toBeInTheDocument();
      expect(container.querySelector(getFormAutocomplete('insureds'))).toBeInTheDocument();

      expect(getByLabelText('form.description.label')).toBeInTheDocument();
      expect(container.querySelector(getFormTextarea('description'))).toBeInTheDocument();

      expect(getByLabelText('form.inceptionDate.label')).toBeInTheDocument();
      expect(container.querySelector(getFormDatepicker('inceptionDate'))).toBeInTheDocument();

      expect(container.querySelector(getFormHidden('placementId'))).toBeInTheDocument();
    });

    it('renders the pre-selected brokers chips', async () => {
      // arrange
      const { container } = render(<EditPlacement {...props} placement={placement} />);
      const elem = container.querySelector('[name="brokers"]');

      // assert
      expect(within(elem).getByText('Albert')).toBeInTheDocument();
      expect(within(elem).getByText('Ben')).toBeInTheDocument();
      expect(within(elem).queryByText('Chris')).not.toBeInTheDocument();
      expect(within(elem).queryByText('Dave')).not.toBeInTheDocument();
      expect(within(elem).queryByText('Eric')).not.toBeInTheDocument();
      expect(within(elem).queryByText('Frank')).not.toBeInTheDocument();
    });

    it('renders the pre-selected cobrokers chips', async () => {
      // arrange
      const { container } = render(<EditPlacement {...props} placement={placement} />);
      const elem = container.querySelector('[name="cobrokers"]');

      // assert
      expect(within(elem).queryByText('Albert')).not.toBeInTheDocument();
      expect(within(elem).queryByText('Ben')).not.toBeInTheDocument();
      expect(within(elem).getByText('Chris')).toBeInTheDocument();
      expect(within(elem).getByText('Dave')).toBeInTheDocument();
      expect(within(elem).queryByText('Eric')).not.toBeInTheDocument();
      expect(within(elem).queryByText('Frank')).not.toBeInTheDocument();
    });

    it('renders the readonly list of GXB brokers', () => {
      // arrange
      const { getByText } = render(<EditPlacement {...props} placement={placement} />);

      // assert
      expect(getByText('placement.form.gxbBrokers.label:')).toBeInTheDocument();
      expect(getByText('Eric, Frank')).toBeInTheDocument();
    });

    it('renders the readonly list of office cobrokers', () => {
      // arrange
      const placementOfficeCobrokers = {
        id: 1,
        clients: [
          {
            id: 1,
            type: 'client',
            cobrokers: [{ id: 1, firstName: 'Albert', role: 'COBROKER' }],
          },
          {
            id: 2,
            type: 'office',
            cobrokers: [
              { id: 1, firstName: 'Albert', role: 'COBROKER' },
              { id: 2, firstName: 'Ben', role: 'COBROKER' },
              { id: 3, firstName: 'Chris', role: 'COBROKER' },
            ],
          },
        ],
      };
      const { getByText } = render(<EditPlacement {...props} placement={placementOfficeCobrokers} />);

      // assert
      expect(getByText('placement.form.assignedCobrokers.label:')).toBeInTheDocument();
      expect(getByText('Albert, Ben, Chris')).toBeInTheDocument();
    });
  });
});
