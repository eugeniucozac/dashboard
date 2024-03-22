import React from 'react';
import { render, screen, waitFor, within } from 'tests';
import MockDate from 'mockdate';
import fetchMock from 'fetch-mock';
import ClaimsTasksReporting from './ClaimsTasksReporting';

describe('MODULES › ClaimsTasksReporting', () => {
  beforeEach(() => {
    fetchMock.get('glob:*/workflow/process/getClaimsTasksStats*', {
      body: {
        data: {
          complexClaimsProcess: 10,
          nonComplexClaimsProcess: 11,
          unClassifiedClaimsProcess: 12,
          complexTaskAssignedProcess: 20,
          complexTaskUnAssignedProcess: 21,
          nonComplexTaskAssignedProcess: 30,
          nonComplexTaskUnAssignedProcess: 31,
          totalActiveClaimsProcess: 10000,
          totalActiveTasksProcess: 20000,
        },
        status: 'OK',
      },
    });
    // fetchMock.get('glob:*/workflow/process/getClaimsTasksStats*', { body: { status: 'OK', data: { id: 1 } } });
  });

  afterEach(() => {
    jest.clearAllMocks();
    fetchMock.restore();
  });

  describe('@render', () => {
    it('renders the toggle button', async () => {
      // arrange
      render(<ClaimsTasksReporting />);

      await waitFor(() => {
        screen.getByTestId('reporting-claims-tasks');
        // assert
        expect(screen.getByText('claims.processing.reportingView.title')).toBeInTheDocument();
      });
    });

    it("renders today's date", async () => {
      // arrange
      MockDate.set('2021-12-30');
      render(<ClaimsTasksReporting />);

      await waitFor(() => {
        screen.getByTestId('reporting-claims-tasks');
        // assert
        expect(screen.getByText('time.today: 30 Dec 2021')).toBeInTheDocument();
      });
    });

    it('renders the charts', async () => {
      // arrange
      render(<ClaimsTasksReporting />);

      await waitFor(() => {
        screen.getByTestId('reporting-claims-tasks');
        // assert
        expect(screen.getByTestId('chart-claims')).toBeInTheDocument();
        expect(screen.getByTestId('chart-tasks')).toBeInTheDocument();
      });
    });

    it('renders the data', async () => {
      // arrange
      render(<ClaimsTasksReporting />);

      await waitFor(() => {
        screen.getByTestId('reporting-claims-tasks');
        const claimsWrapper = screen.getByTestId('reporting-claims');
        const tasksWrapper = screen.getByTestId('reporting-tasks');

        // assert
        expect(within(claimsWrapper).getByText('claims.processing.reportingView.totalActiveClaims')).toBeInTheDocument();
        expect(within(claimsWrapper).getByText('claims.processing.reportingView.nonComplex')).toBeInTheDocument();
        // expect(within(claimsWrapper).getByText('10')).toBeInTheDocument();
        expect(within(claimsWrapper).getByText('claims.processing.reportingView.complex')).toBeInTheDocument();
        // expect(within(claimsWrapper).getByText('11')).toBeInTheDocument();
        expect(within(claimsWrapper).getByText('claims.processing.reportingView.unclassified')).toBeInTheDocument();
        // expect(within(claimsWrapper).getByText('12')).toBeInTheDocument();

        expect(within(tasksWrapper).getByText('claims.processing.reportingView.totalActiveTasks')).toBeInTheDocument();
        expect(within(tasksWrapper).getByText('claims.processing.reportingView.complex')).toBeInTheDocument();
        // expect(within(tasksWrapper).getByText('20')).toBeInTheDocument();
        // expect(within(tasksWrapper).getByText('21')).toBeInTheDocument();
        expect(within(tasksWrapper).getByText('claims.processing.reportingView.nonComplex')).toBeInTheDocument();
        // expect(within(tasksWrapper).getByText('30')).toBeInTheDocument();
        // expect(within(tasksWrapper).getByText('31')).toBeInTheDocument();
      });
    });
  });
});
