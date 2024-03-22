export const coverages = [
  {
    id: 1,
    name: 'Coverage Option 1',
    patchData: {
      coverageType: 'ALL_WIND_AND_HAIL',
      limitType: 'PER_OCCURRENCE',
      stateOfFiling: 'ALABAMA',
      timeCoverageIncluded: true,
      deductibleType: 'Difference between % and %',
      overlyingDeductiblePercentage: 5,
      underlyingDeductiblePercentage: 9,
    },
    summaryQuotes: [
      {
        currency: 'USD ',
        premium: 216249,
        carrierName: 'Satinwood',
        hasReferrals: false,
        quoted: true,
        quoteValues: {
          tiv: 6.012289341e7,
          maxPayableExcess: 601229,
          limitWording: 'any one occurrence',
          stateOfFiling: 'California',
          notices: 'LMA9098B (California Surplus Lines Post Bind)',
          maxPayable: 2404916,
          coverType: 'All Wind and Hail',
          overlyingWording: '5%',
          rate: 8.99,
          excess: 601229,
          limit: 2404916,
          underlyingWording: '1%',
        },
        summaryValues: [
          {
            title: 'Limit',
            value: 'USD 146,023',
          },
          {
            title: 'Deductible',
            value: '7% to 1% any one occurrence',
          },
          {
            title: 'Rate',
            value: '6.83%',
          },
        ],
      },
      {
        currency: 'USD ',
        premium: 216249,
        carrierName: 'Second Carrier',
        hasReferrals: true,
        quoted: true,
        quoteValues: {
          tiv: 6.012289341e7,
          maxPayableExcess: 601229,
          limitWording: 'any one occurrence',
          stateOfFiling: 'California',
          notices: 'LMA9098B (California Surplus Lines Post Bind)',
          maxPayable: 2404916,
          coverType: 'All Wind and Hail',
          overlyingWording: '5%',
          rate: 8.99,
          excess: 601229,
          limit: 2404916,
          underlyingWording: '1%',
        },
        summaryValues: null,
      },
    ],
    riskId: '6193bba586ecd94529f69f33',
    createdAt: 2,
    active: true,
  },
  // second option
  {
    id: 2,
    name: 'Coverage Option 2',
    patchData: {
      coverageType: 'NAMED_WIND_ONLY',
      limitType: 'PER_LOCATION',
      stateOfFiling: 'ALABAMA',
      timeCoverageIncluded: false,
      deductibleType: 'Difference between % and %',
      overlyingDeductiblePercentage: 5,
      underlyingDeductiblePercentage: 8,
    },
    summaryQuotes: [
      {
        currency: 'USD ',
        premium: 216249,
        carrierName: 'Satinwood',
        hasReferrals: false,
        quoted: true,
        quoteValues: {
          tiv: 6.012289341e7,
          maxPayableExcess: 601229,
          limitWording: 'any one occurrence',
          stateOfFiling: 'California',
          notices: 'LMA9098B (California Surplus Lines Post Bind)',
          maxPayable: 2404916,
          coverType: 'All Wind and Hail',
          overlyingWording: '5%',
          rate: 8.99,
          excess: 601229,
          limit: 2404916,
          underlyingWording: '1%',
        },
        summaryValues: [
          {
            title: 'Limit',
            value: 'USD 146,023',
          },
          {
            title: 'Deductible',
            value: '7% to 1% any one occurrence',
          },
          {
            title: 'Rate',
            value: '6.83%',
          },
        ],
      },
      {
        currency: 'USD ',
        premium: 216249,
        carrierName: 'Second Carrier',
        hasReferrals: true,
        quoted: true,
        quoteValues: {
          tiv: 6.012289341e7,
          maxPayableExcess: 601229,
          limitWording: 'any one occurrence',
          stateOfFiling: 'California',
          notices: 'LMA9098B (California Surplus Lines Post Bind)',
          maxPayable: 2404916,
          coverType: 'All Wind and Hail',
          overlyingWording: '5%',
          rate: 8.99,
          excess: 601229,
          limit: 2404916,
          underlyingWording: '1%',
        },
      },
    ],
    riskId: '6193bba586ecd94529f69f33',
    createdAt: 2,
    active: false,
  },
];

export const coverageDefinitions = {
  loading: false,
  WIND_HAIL_DBB: [
    {
      name: 'coverageType',
      type: 'SELECT',
      indicative: false,
      group: 'COVER',
      label: 'Coverage Type',
      options: [
        {
          label: 'All Wind and Hail',
          value: 'ALL_WIND_AND_HAIL',
        },
        {
          label: 'Named Wind Only',
          value: 'NAMED_WIND_ONLY',
        },
      ],
      validation: {
        required: true,
      },
    },
    {
      name: 'limitType',
      type: 'SELECT',
      indicative: false,
      group: 'COVER',
      label: 'Limit Type',
      options: [
        {
          label: 'Any one occurrence',
          value: 'PER_OCCURRENCE',
        },
        {
          label: 'Any one location',
          value: 'PER_LOCATION',
        },
        {
          label: 'Any one building',
          value: 'PER_BUILDING',
        },
      ],
      validation: {
        required: true,
      },
    },
    {
      name: 'stateOfFiling',
      type: 'SELECT',
      autocomplete: true,
      indicative: false,
      group: 'COVER',
      label: 'State of Filing',
      options: [
        {
          label: 'Alabama',
          value: 'ALABAMA',
        },
        {
          label: 'Alaska',
          value: 'ALASKA',
        },
        {
          label: 'Arizona',
          value: 'ARIZONA',
        },
      ],
      validation: {
        required: true,
      },
    },
    {
      name: 'timeCoverageIncluded',
      type: 'BOOLEAN',
      indicative: false,
      group: 'COVER',
      label: 'Is time coverage included?',
      validation: {
        required: true,
      },
    },
    {
      name: 'deductibleType',
      type: 'SELECT',
      indicative: false,
      group: 'COVER',
      value: 'Difference between % and %',
      label: 'Application of Overlying Deductible',
      header: 'Deductible',
      options: [
        {
          label: 'Difference between % and %',
          value: 'Difference between % and %',
        },
        {
          label: 'Difference between % and $',
          value: 'Difference between % and $',
        },
        {
          label: 'Difference between $ and $',
          value: 'Difference between $ and $',
        },
      ],
      validation: {
        required: true,
      },
    },
    {
      name: 'overlyingDeductiblePercentage',
      type: 'DOUBLE',
      indicative: false,
      group: 'COVER',
      label: 'Overlying Deductible (%)',
      conditional: 'deductibleType!=Difference between $ and $',
      validation: {
        required: true,
        min: 1,
        max: 10,
      },
    },
    {
      name: 'overlyingDeductibleDollar',
      type: 'DOUBLE',
      indicative: false,
      group: 'COVER',
      label: 'Overlying Deductible ($)',
      conditional: 'deductibleType=Difference between $ and $',
      validation: {
        required: true,
        min: 0,
      },
    },
    {
      name: 'underlyingDeductibleDollar',
      type: 'DOUBLE',
      indicative: false,
      group: 'COVER',
      label: 'Underlying Deductible ($)',
      conditional: 'deductibleType!=Difference between % and %',
      validation: {
        required: true,
        min: 0,
      },
    },
    {
      name: 'underlyingDeductiblePercentage',
      type: 'DOUBLE',
      indicative: false,
      group: 'COVER',
      label: 'Underlying Deductible (%)',
      conditional: 'deductibleType=Difference between % and %',
      validation: {
        required: true,
        min: 1,
        max: 10,
      },
    },
  ],
};
