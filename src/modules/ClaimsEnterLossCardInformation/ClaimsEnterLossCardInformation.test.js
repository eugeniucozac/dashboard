import React from 'react';
import { render, screen } from 'tests';
import ClaimsEnterLossCardInformation from './ClaimsEnterLossCardInformation';

const renderClaimsEnterLossCardInformation = (props, renderOptions) => {
  const componentProps = {
    ...props,
    catCodes: [
      {
        id: '11',
        name: '17H',
      },
      {
        id: '12',
        name: '13H',
      },
      {
        id: '13',
        name: '14H',
      },
    ],
    lossInformation: {
      catCodesID: 11,
      firstContactDate: '2021-06-07T23:00:00.000+00:00',
      isActive: 1,
      lossDescription: '',
      lossDetailID: 1391,
      lossName: 'lossName data',
      lossQualifierId: 2,
    },
  };

  render(<ClaimsEnterLossCardInformation {...componentProps} />, renderOptions);

  return {
    componentProps,
  };
};

describe('MODULES › ClaimsEnterLossCardInformation', () => {
  describe('@render', () => {
    it('renders without crashing', () => {
      // arrange
      renderClaimsEnterLossCardInformation();

      // assert
      expect(screen.getByText('claims.lossInformation.title')).toBeInTheDocument();
    });

    it('renders row labels', () => {
      // arrange
      renderClaimsEnterLossCardInformation();

      // assert
      expect(screen.getByText('claims.lossInformation.ref')).toBeInTheDocument();
      expect(screen.getByText('claims.lossInformation.fromDate')).toBeInTheDocument();
      expect(screen.getByText('claims.lossInformation.toDate')).toBeInTheDocument();
      expect(screen.getByText('claims.lossInformation.name')).toBeInTheDocument();
      expect(screen.getByText('claims.lossInformation.details')).toBeInTheDocument();
      expect(screen.getByText('claims.lossInformation.catCode')).toBeInTheDocument();
    });

    it('renders row values', () => {
      // arrange
      const { componentProps } = renderClaimsEnterLossCardInformation();

      // assert
      expect(screen.getByText(componentProps.lossInformation.lossName)).toBeInTheDocument();
    });
  });
});
