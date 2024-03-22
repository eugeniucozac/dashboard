import React from 'react';
import { render, screen } from 'tests';

import ClaimSummaryActions from './ClaimSummaryActions';

describe('MODULES › ClaimSummaryActions', () => {
  describe('@render', () => {
    describe('buttons', () => {
      it('are enabled', () => {
        // arrange
        render(<ClaimSummaryActions claim={{ processState: 'foo' }} />);

        // assert
        expect(screen.getByRole('button', { name: 'claims.processing.summary.buttons.createTask' })).toBeEnabled();
        expect(screen.getByRole('button', { name: 'claims.processing.summary.buttons.createNewRFI' })).toBeEnabled();
        expect(screen.getByRole('button', { name: 'claims.modals.claimFunctions.setClaimPriority' })).toBeEnabled();
        expect(screen.getByRole('button', { name: 'claims.processing.summary.buttons.releaseQueue' })).toBeEnabled();
      });
    });

    describe('button reassign', () => {
      it('is not enabled if claim is new', () => {
        // arrange
        render(<ClaimSummaryActions claim={{ processState: 'New' }} />);

        // assert
        expect(screen.getByRole('button', { name: 'app.reAssign' })).not.toBeEnabled();
      });

      it('is not enabled if claim is in-progress', () => {
        // arrange
        render(<ClaimSummaryActions claim={{ processState: 'In-Progress' }} />);

        // assert
        expect(screen.getByRole('button', { name: 'app.reAssign' })).not.toBeEnabled();
      });

      it('is disabled if claim is another status', () => {
        // arrange
        render(<ClaimSummaryActions claim={{ processState: 'Foo' }} />);

        // assert
        expect(screen.getByRole('button', { name: 'app.reAssign' })).toBeDisabled();
      });
    });

    describe('button reopen', () => {
      it('is disabled if claim status is not closed', () => {
        // arrange
        render(<ClaimSummaryActions claim={{ processState: 'Open' }} />);

        // assert
        expect(screen.getByRole('button', { name: 'claims.claimRef.popOverItems.reopenClaim' })).toBeDisabled();
      });

      it('is enabled if claim status is closed', () => {
        // arrange
        render(<ClaimSummaryActions claim={{ processState: 'Closed' }} />);

        // assert
        expect(screen.getByRole('button', { name: 'claims.claimRef.popOverItems.reopenClaim' })).toBeEnabled();
      });
    });
  });
});
