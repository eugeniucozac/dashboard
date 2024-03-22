import { render, screen } from 'tests';
import RiskData from './RiskData';

const riskDataProps = {
  riskIsLoading: false,
  riskValues: {
    clientId: 1,
    coverType: 'DIRECT',
    inceptionDate: '2023-01-01',
    coverValue: 1000,
    coverPercentage: 5,
    windOnly: false,
    windAndHail: true,
    windAndSolar: false,
    freeText: 'Free text',
    distanceToCoast: 10,
    multiSelect: 'OPTION_1',
    multiSelectArray: ['OPTION_1', 'OPTION_2'],
    hiddenField: 'hidden',
    reinsuredId: null,
    reinsuredDirectId: 3,
    buildings: [
      {
        buildingTitle: 'Building 1',
        city: 'London',
      },
      {
        buildingTitle: 'Building 2',
        city: 'Paris',
      },
    ],
  },

  groups: ['GENERAL', 'COVER', 'BUILDINGS'],

  definitionsFields: [
    { group: 'GENERAL', name: 'clientId', label: 'Client', type: 'ID' },
    {
      group: 'GENERAL',
      label: 'Direct or Reinsurance',
      name: 'coverType',
      options: [
        { label: 'Direct', value: 'DIRECT' },
        { label: 'Reinsurance', value: 'REINSURANCE' },
      ],
      type: 'SELECT',
    },
    {
      name: 'reinsuredId',
      type: 'ID',
      group: 'GENERAL',
      label: 'Reinsured',
      conditional: 'coverType=REINSURANCE',
    },

    {
      name: 'reinsuredDirectId',
      type: 'ID',
      group: 'GENERAL',
      label: 'Reinsured Direct',
      conditional: 'coverType=DIRECT',
    },
    { group: 'GENERAL', label: 'Inception Date', name: 'inceptionDate', type: 'DATE' },
    { group: 'COVER', label: 'Cover Value', name: 'coverValue', type: 'DOUBLE' },
    { group: 'COVER', label: 'Cover Percentage', name: 'coverPercentage', type: 'DOUBLE', validation: { percent: true } },
    { group: 'COVER', label: 'Wind Only', name: 'windOnly', type: 'BOOLEAN' },
    { group: 'COVER', label: 'Wind and Hail', name: 'windAndHail', type: 'BOOLEAN' },
    { group: 'COVER', label: 'Wind and Solar', name: 'windAndSolar', type: 'RADIO' },
    { group: 'COVER', label: 'Free Text', name: 'freeText', type: 'TEXT' },
    { group: 'COVER', label: 'Distance to Coast', name: 'distanceToCoast', type: 'TEXT' },
    { group: 'COVER', label: 'Hidden Field', name: 'hiddenField', type: 'HIDDEN' },
    {
      group: 'COVER',
      label: 'Multi Select',
      name: 'multiSelect',
      autocomplete: true,
      options: [
        { label: 'Option 1', value: 'OPTION_1' },
        { label: 'Option 2', value: 'OPTION_2' },
      ],
      type: 'SELECT',
    },
    {
      group: 'COVER',
      label: 'Multi Select Array',
      name: 'multiSelectArray',
      autocomplete: true,
      options: [
        { label: 'Option 1', value: 'OPTION_1' },
        { label: 'Option 2', value: 'OPTION_2' },
      ],
      type: 'SELECT',
    },
    {
      name: 'buildings',
      type: 'ARRAY',
      indicative: false,
      display: 'MULTICARD',
      group: 'BUILDINGS',
      itemTitle: 'Building',
      itemTitleField: 'buildingTitle',
      startEmpty: true,
      componentRestrictions: {
        country: ['us', 'pr', 'vi', 'gu', 'mp'],
      },
      arrayItemDef: [
        {
          name: 'buildingTitle',
          type: 'HIDDEN',
          indicative: false,
          group: 'BUILDINGS',
          isTitle: true,
          validation: {
            required: true,
          },
        },
        {
          name: 'city',
          type: 'TEXT',
          indicative: false,
          group: 'BUILDINGS',
          disabled: true,
          label: 'City',
          excelHidden: true,
          validation: {
            required: true,
          },
        },
      ],
    },
  ],

  valuesByID: {
    clientId: {
      id: 1,
      name: 'Client Name',
    },
    reinsuredId: {
      id: 2,
      name: 'Reinsured Name',
    },
    reinsuredDirectId: {
      id: 3,
      name: 'Reinsured Direct Name',
    },
  },

  countryOfOrigin: [
    {
      label: 'United State',
      value: 'US',
    },
  ],
};

describe('MODULES › RiskData', () => {
  describe('@render', () => {
    it('should render the RiskData component, rendering loading', () => {
      render(<RiskData />);
      expect(screen.getByTestId('risk-data')).toBeInTheDocument();
      expect(screen.getByTestId('risk-data-loading')).toBeInTheDocument();
    });

    it('should render the RiskData component, rendering with riskDataProps', () => {
      render(<RiskData {...riskDataProps} />);

      const general = screen.getByTestId('risk-data-GENERAL');
      expect(screen.getByTestId('risk-data')).toBeInTheDocument();
      expect(screen.queryByTestId('risk-data-loading')).not.toBeInTheDocument();
      expect(general).toBeInTheDocument();
      expect(screen.getByTestId('risk-data-COVER')).toBeInTheDocument();

      expect(screen.getByText(/Client Name/i)).toBeInTheDocument();
      expect(screen.queryByText(/Hidden Field/i)).not.toBeInTheDocument();
    });
  });
});
