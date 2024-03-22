import React from 'react';
import { render } from 'tests';
import { useForm } from 'react-hook-form';
import AddRiskObjectAddress from './AddRiskObjectAddress';
import * as utils from 'utils';

export function AddRiskObjectComponent({ field }) {
  const { control, register, watch, errors, setValue, trigger } = useForm({
    defaultValues: utils.form.getInitialValues([field]),
  });

  return <AddRiskObjectAddress field={field} formProps={{ control, register, watch, errors, setValue, trigger }} />;
}

describe('MODULES › AddRiskObjectAddress', () => {
  const fields = [
    {
      name: 'field-address',
      type: 'ADDRESS',
      group: 'TAB',
      label: 'Address',
      objectDef: [
        { name: 'dummy', type: 'TEXT', group: 'TAB', label: 'Dummy' },
        { name: 'street', type: 'TEXT', group: 'TAB', label: 'Street' },
        { name: 'streetNumber', type: 'TEXT', group: 'TAB', label: 'Street Number' },
        { name: 'city', type: 'TEXT', group: 'TAB', label: 'City' },
        { name: 'state', type: 'TEXT', group: 'TAB', label: 'State' },
        { name: 'zipCode', type: 'TEXT', group: 'TAB', label: 'Zip Code' },
        { name: 'distanceToCoast', type: 'TEXT', group: 'TAB', label: 'Distance to Coast' },
      ],
    },
  ];

  const fieldParsed = utils.risk.parseFields(fields)[0];

  describe('@render', () => {
    it('renders without crashing', () => {
      // arrange
      const { container } = render(<AddRiskObjectAddress />);

      // assert
      expect(container).toBeInTheDocument();
    });

    it('renders nothing if not passed required props', () => {
      // arrange
      const { container } = render(<AddRiskObjectAddress />);

      // assert
      expect(container).toBeEmptyDOMElement();
    });

    it('renders only the valid address fields', () => {
      // arrange
      const { container } = render(<AddRiskObjectComponent field={fieldParsed} />);

      // assert
      expect(container.querySelector('#field-address\\.dummy')).not.toBeInTheDocument();
      expect(container.querySelector('#field-address\\.streetNumber')).not.toBeInTheDocument();

      expect(container.querySelector('#field-address\\.street')).toBeInTheDocument();
      expect(container.querySelector('#field-address\\.city')).toBeInTheDocument();
      expect(container.querySelector('#field-address\\.state')).toBeInTheDocument();
      expect(container.querySelector('#field-address\\.zipCode')).toBeInTheDocument();
      expect(container.querySelector('#field-address\\.distanceToCoast')).toBeInTheDocument();
    });

    it('renders the address map', () => {
      // arrange
      const { container } = render(<AddRiskObjectComponent field={fieldParsed} />);

      // assert
      expect(container.querySelector('#map-risk-object-address-field-address')).toBeInTheDocument();
    });
  });
});
