import React from 'react';
import { render, screen, getFormAutocompleteMui, getFormText, getFormDatepicker, getFormTextarea } from 'tests';
import EditLossInformation from './EditLossInformation';

describe('FORMS › EditLossInformation', () => {
  describe('@render', () => {
    it('renders without crashing', () => {
      // arrange
      const { container } = render(<EditLossInformation />);

      // assert
      expect(container).toBeInTheDocument();
    });

    it('renders the form', () => {
      // arrange
      render(<EditLossInformation />);

      // assert
      expect(screen.getByTestId('form-edit-loss-information')).toBeInTheDocument();
    });

    it('renders the form buttons', () => {
      // arrange
      render(<EditLossInformation />);

      // assert
      expect(screen.queryByText('app.cancel')).toBeInTheDocument();
      expect(screen.queryByText('app.save')).toBeInTheDocument();
    });

    it('renders the form inputs', () => {
      // arrange
      const { container } = render(<EditLossInformation />);

      // assert
      expect(screen.getByText('claims.lossInformation.ref')).toBeInTheDocument();
      expect(container.querySelector(getFormText('lossRef'))).toBeInTheDocument();

      expect(screen.getByText('claims.lossInformation.fromDate')).toBeInTheDocument();
      expect(container.querySelector(getFormDatepicker('fromDate'))).toBeInTheDocument();

      expect(screen.getByText('claims.lossInformation.toDate')).toBeInTheDocument();
      expect(container.querySelector(getFormDatepicker('toDate'))).toBeInTheDocument();

      expect(screen.getByText('claims.lossInformation.dateAndTime')).toBeInTheDocument();
      expect(container.querySelector(getFormDatepicker('toDate'))).toBeInTheDocument();

      expect(container.querySelector(getFormTextarea('lossDescription'))).toBeInTheDocument();
    });

    it('renders cat codes options', () => {
      // arrange
      const { container } = render(<EditLossInformation />);

      // assert
      expect(screen.getByText('claims.lossInformation.catCode')).toBeInTheDocument();
      expect(container.querySelector(getFormAutocompleteMui('catCodesID'))).toBeInTheDocument();
    });
  });
});
