import React from 'react';
import fetchMock from 'fetch-mock';
import { render, waitFor, within } from 'tests';
import ProcessingInstructionsList from './ProcessingInstructionsList';

describe('MODULES › ProcessingInstructionsList', () => {
  const userWithReadOnlyAccess = {
    id: 1,
    privilege: {
      processingInstructions: {
        processingInstructions: ['read'],
      },
    },
  };

  const userWithCreateAccess = {
    id: 1,
    privilege: {
      processingInstructions: {
        processingInstructions: ['read', 'create'],
      },
    },
  };

  const userWithUpdateAccess = {
    id: 1,
    privilege: {
      processingInstructions: {
        processingInstructions: ['read', 'update'],
      },
    },
  };

  const userWithFullAccess = {
    id: 1,
    privilege: {
      processingInstructions: {
        processingInstructions: ['read', 'create', 'update', 'delete'],
      },
    },
  };

  afterEach(() => {
    fetchMock.restore();
  });

  describe('@renders', () => {
    it('renders the table column headers', async () => {
      // arrange
      const { getByTestId } = render(<ProcessingInstructionsList />, { initialState: { user: userWithFullAccess } });
      await waitFor(() => expect(getByTestId('processing-instructions-grid')).toBeInTheDocument());

      const gridElem = getByTestId('processing-instructions-grid');
      const labelPath = 'processingInstructions.gridColumns';

      // assert
      expect(within(gridElem.querySelector('th:nth-child(1)')).getByText(`${labelPath}.instructionId`)).toBeInTheDocument();
      expect(within(gridElem.querySelector('th:nth-child(2)')).getByText(`${labelPath}.status`)).toBeInTheDocument();
      expect(within(gridElem.querySelector('th:nth-child(3)')).getByText(`${labelPath}.insuredCoverHolder`)).toBeInTheDocument();
      expect(within(gridElem.querySelector('th:nth-child(4)')).getByText(`${labelPath}.inceptionDate`)).toBeInTheDocument();
      expect(within(gridElem.querySelector('th:nth-child(5)')).getByText(`${labelPath}.department`)).toBeInTheDocument();
      expect(within(gridElem.querySelector('th:nth-child(6)')).getByText(`${labelPath}.gxbInstance`)).toBeInTheDocument();
      expect(within(gridElem.querySelector('th:nth-child(7)')).getByText(`${labelPath}.process`)).toBeInTheDocument();
      expect(within(gridElem.querySelector('th:nth-child(8)')).getByText(`${labelPath}.frontEndContact`)).toBeInTheDocument();
      expect(within(gridElem.querySelector('th:nth-child(9)')).getByText(`${labelPath}.createdDate`)).toBeInTheDocument();
    });
  });

  describe('@access', () => {
    const processTypes = [
      { processTypeID: 1, processTypeDetails: 'CLOSING', primary: true, businessProcessID: 1, sla: 10 },
      { processTypeID: 2, processTypeDetails: 'ENDORSEMENT', primary: true, businessProcessID: 1, sla: 10 },
    ];

    describe('read', () => {
      it("doesn't render the create process buttons", () => {
        // arrange
        const { queryByText } = render(<ProcessingInstructionsList gridData={[]} processTypes={processTypes} />, {
          initialState: { user: userWithReadOnlyAccess },
        });

        // assert
        expect(queryByText('processingInstructions.type.1')).not.toBeInTheDocument();
        expect(queryByText('processingInstructions.type.2')).not.toBeInTheDocument();
      });

      it('renders the table', () => {
        // arrange
        const { getByTestId } = render(<ProcessingInstructionsList />, { initialState: { user: userWithReadOnlyAccess } });

        // assert
        expect(getByTestId('processing-instructions-grid')).toBeInTheDocument();
      });
    });

    describe('create', () => {
      it('renders the create process buttons', () => {
        // arrange
        const { getByText } = render(<ProcessingInstructionsList gridData={[]} processTypes={processTypes} />, {
          initialState: { user: userWithCreateAccess },
        });

        // assert
        expect(getByText('processingInstructions.type.1')).toBeInTheDocument();
        expect(getByText('processingInstructions.type.2')).toBeInTheDocument();
      });

      it('renders the table', () => {
        // arrange
        const { getByTestId } = render(<ProcessingInstructionsList />, { initialState: { user: userWithCreateAccess } });

        // assert
        expect(getByTestId('processing-instructions-grid')).toBeInTheDocument();
      });
    });

    describe('update', () => {
      it("doesn't render the create process buttons", () => {
        // arrange
        const { queryByText } = render(<ProcessingInstructionsList gridData={[]} processTypes={processTypes} />, {
          initialState: { user: userWithUpdateAccess },
        });

        // assert
        expect(queryByText('processingInstructions.type.1')).not.toBeInTheDocument();
        expect(queryByText('processingInstructions.type.2')).not.toBeInTheDocument();
      });

      it('renders the table', () => {
        // arrange
        const { getByTestId } = render(<ProcessingInstructionsList />, { initialState: { user: userWithUpdateAccess } });

        // assert
        expect(getByTestId('processing-instructions-grid')).toBeInTheDocument();
      });
    });
  });
});
