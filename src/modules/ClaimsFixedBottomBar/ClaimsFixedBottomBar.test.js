import React from 'react';
import { render, screen } from 'tests';
import ClaimsFixedBottomBar from './ClaimsFixedBottomBar';

const renderClaimsFixedBottomBar = (props, renderOptions) => {
  const componentProps = {
    ...props,
    policyRef: 'PN22222',
    isAllStepsCompleted: false,
    handleCancel: jest.fn(),
    handleFinish: jest.fn(),
    handleNext: jest.fn(),
    handleBack: jest.fn(),
    handleSave: jest.fn(),
  };

  render(<ClaimsFixedBottomBar {...componentProps} />, renderOptions);
};

describe('MODULES › ClaimsFixedBottomBar', () => {
  describe('@render', () => {
    it('renders without crashing', () => {
      expect(renderClaimsFixedBottomBar({})).toMatchInlineSnapshot(`undefined`);
    });

    it('renders with default props', () => {
      // arrange
      renderClaimsFixedBottomBar({});

      // assert
      expect(screen.getByRole('button', { name: 'app.cancel' })).toBeEnabled();
      expect(screen.getByRole('button', { name: 'app.save' })).not.toBeEnabled();
    });

    it('renders button cancel', () => {
      // arrange
      renderClaimsFixedBottomBar({});

      // assert
      expect(screen.getByRole('button', { name: 'app.cancel' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'app.cancel' })).toBeEnabled();
    });

    it('renders button save', () => {
      // arrange
      renderClaimsFixedBottomBar({
        save: true,
      });

      // assert
      expect(screen.getByRole('button', { name: 'app.save' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'app.save' })).toBeEnabled();
    });

    it('renders button back', () => {
      // arrange
      renderClaimsFixedBottomBar({
        activeStep: true,
      });

      // assert
      expect(screen.getByRole('button', { name: 'app.back' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'app.back' })).toBeEnabled();
    });

    it('renders button finish', () => {
      // arrange
      renderClaimsFixedBottomBar({
        lastStep: true,
      });

      // assert
      expect(screen.getByRole('button', { name: 'Finish' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Finish' })).toBeEnabled();
    });

    it('renders button submit', () => {
      // arrange
      renderClaimsFixedBottomBar({
        activeStep: 3,
      });

      // assert
      expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Submit' })).not.toBeEnabled();
    });

    it('renders button next', () => {
      // arrange
      renderClaimsFixedBottomBar({
        activeStep: 1,
      });

      // assert
      expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Next' })).not.toBeEnabled();
    });
  });
});
