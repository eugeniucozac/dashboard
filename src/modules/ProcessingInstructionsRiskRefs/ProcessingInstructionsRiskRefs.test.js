import React from 'react';
import fetchMock from 'fetch-mock';
import { render, waitFor, getFormAutocompleteMui, getFormDatepicker, getFormRadio, getFormSelect } from 'tests';
import ProcessingInstructionsRiskRefs from './ProcessingInstructionsRiskRefs';
import merge from 'lodash/merge';

describe('MODULES › ProcessingInstructionsRiskRefs', () => {
  const instruction = {
    id: 1,
    processTypeId: 1,
    checklist: [],
    riskReferences: [],
  };

  const instructionWithRiskRefs = {
    riskReferences: [{ id: 1, xbPolicyId: 1 }],
  };

  const instructionDraft = {
    statusId: 1,
  };

  const instructionRejectedDraft = {
    statusId: 2,
  };

  const instructionSubmittedAuthorisedSignatory = {
    statusId: 3,
  };

  const instructionSubmittedProcessing = {
    statusId: 4,
  };

  const userWithReadOnlyAccess = {
    id: 1,
    privilege: {
      processingInstructions: {
        processingInstructions: ['read'],
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

  const processTypes = [
    {
      id: 1,
      businessProcessId: 1,
      processType: 'CLOSING',
      sla: 10,
      createdBy: 'MPH-DATA',
      createdDate: '2021-03-08T07:58:39.870+00:00',
      updatedBy: 'MPH-DATA',
      isActive: 1,
    },
  ];

  const initialState = {
    processingInstructions: {
      endorsementNonPremium: {
        1: {
          endorsementIds: [{ id: 1, value: '111' }],
          endorsementNumbers: [{ id: 1, value: '1' }],
          endorsementUids: [{ id: 1, value: 'KJHW-KJHS-QWGS-POIU' }],
          nonPremiums: [{ id: 1, value: 'Yes' }],
          xbpolicyID: 1,
        },
      },
    },
  };

  afterEach(() => {
    fetchMock.restore();
  });

  describe('@renders', () => {
    it('renders the risk references content', async () => {
      // arrange
      const { getByTestId } = render(<ProcessingInstructionsRiskRefs instruction={instruction} />, {
        initialState: { ...initialState, user: userWithFullAccess, processTypes: processTypes },
      });
      await waitFor(() => expect(getByTestId('processing-instructions-form-risk-references')).toBeInTheDocument());

      // assert
      expect(getByTestId('processing-instructions-form-risk-references')).toBeInTheDocument();
    });

    it("doesn't render the maximum risk references warning if count is less than 60", () => {
      // arrange
      const { queryByText } = render(
        <ProcessingInstructionsRiskRefs
          instruction={{ ...instruction, riskReferences: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19] }}
        />,
        {
          initialState: { ...initialState, user: userWithFullAccess, processTypes: processTypes },
        }
      );

      // assert
      expect(queryByText('processingInstructions.maximumRiskRefAdded')).not.toBeInTheDocument();
    });

    it('renders the warning if risk references count is 60', () => {
      // arrange
      const { queryByText } = render(
        <ProcessingInstructionsRiskRefs
          instruction={{
            ...instruction,
            riskReferences: [
              1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34,
              35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60,
            ],
          }}
        />,
        {
          initialState: { ...initialState, user: userWithFullAccess, processTypes: processTypes },
        }
      );

      // assert
      expect(queryByText('processingInstructions.maximumRiskRefAdded')).toBeInTheDocument();
    });

    it('renders the warning if risk references count is more than 60', () => {
      // arrange
      const { queryByText } = render(
        <ProcessingInstructionsRiskRefs
          instruction={{
            ...instruction,
            riskReferences: [
              1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34,
              35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61,
            ],
          }}
        />,
        {
          initialState: { ...initialState, user: userWithFullAccess, processTypes: processTypes },
        }
      );

      // assert
      expect(queryByText('processingInstructions.maximumRiskRefAdded')).toBeInTheDocument();
    });

    it("doesn't render the table and column headers if there's no risk references", () => {
      // arrange
      const { queryByText } = render(<ProcessingInstructionsRiskRefs instruction={instruction} />, {
        initialState: { ...initialState, user: userWithFullAccess, processTypes: processTypes },
      });

      // assert
      expect(queryByText('processingInstructions.gridUmrColumns.chooseLead')).not.toBeInTheDocument();
      expect(queryByText('processingInstructions.gridUmrColumns.riskReferenceId')).not.toBeInTheDocument();
      expect(queryByText('processingInstructions.gridUmrColumns.gxbInstance')).not.toBeInTheDocument();
      expect(queryByText('processingInstructions.gridUmrColumns.insuredOrCoverHolder')).not.toBeInTheDocument();
      expect(queryByText('processingInstructions.gridUmrColumns.yearOfAccounts')).not.toBeInTheDocument();
      expect(queryByText('processingInstructions.gridUmrColumns.clientName')).not.toBeInTheDocument();
      expect(queryByText('processingInstructions.gridUmrColumns.riskStatus')).not.toBeInTheDocument();
      expect(queryByText('processingInstructions.gridUmrColumns.riskDetails')).not.toBeInTheDocument();
      expect(queryByText('processingInstructions.gridUmrColumns.endorsementRef')).not.toBeInTheDocument();
      expect(queryByText('processingInstructions.gridUmrColumns.nonPremium')).not.toBeInTheDocument();
    });

    it("renders the table and column headers if there's a risk references", () => {
      // arrange
      const { queryByText, getByText } = render(<ProcessingInstructionsRiskRefs instruction={instructionWithRiskRefs} />, {
        initialState: { ...initialState, user: userWithFullAccess, processTypes: processTypes },
      });

      // assert
      expect(getByText('processingInstructions.gridUmrColumns.chooseLead')).toBeInTheDocument();
      expect(getByText('processingInstructions.gridUmrColumns.riskReferenceId')).toBeInTheDocument();
      expect(getByText('processingInstructions.gridUmrColumns.gxbInstance')).toBeInTheDocument();
      expect(getByText('processingInstructions.gridUmrColumns.insuredOrCoverHolder')).toBeInTheDocument();
      expect(getByText('processingInstructions.gridUmrColumns.yearOfAccounts')).toBeInTheDocument();
      expect(getByText('processingInstructions.gridUmrColumns.clientName')).toBeInTheDocument();
      expect(getByText('processingInstructions.gridUmrColumns.riskStatus')).toBeInTheDocument();
      expect(getByText('processingInstructions.gridUmrColumns.riskDetails')).toBeInTheDocument();
      expect(queryByText('processingInstructions.gridUmrColumns.endorsementRef')).not.toBeInTheDocument();
      expect(queryByText('processingInstructions.gridUmrColumns.nonPremium')).not.toBeInTheDocument();
    });

    it('renders the extra columns if the instruction process type is Endorsement', () => {
      // arrange
      const { getByText } = render(<ProcessingInstructionsRiskRefs instruction={{ ...instructionWithRiskRefs, processTypeId: 2 }} />, {
        initialState: { ...initialState, user: userWithFullAccess, processTypes: processTypes },
      });

      // assert
      expect(getByText('processingInstructions.gridUmrColumns.endorsementRef')).toBeInTheDocument();
      expect(getByText('processingInstructions.gridUmrColumns.nonPremium')).toBeInTheDocument();
    });

    it('renders the extra columns if the instruction process type is Fee & Amendment', () => {
      // arrange
      const { getByText } = render(<ProcessingInstructionsRiskRefs instruction={{ ...instructionWithRiskRefs, processTypeId: 5 }} />, {
        initialState: { ...initialState, user: userWithFullAccess, processTypes: processTypes },
      });

      // assert
      expect(getByText('processingInstructions.gridUmrColumns.endorsementRef')).toBeInTheDocument();
      expect(getByText('processingInstructions.gridUmrColumns.nonPremium')).toBeInTheDocument();
    });
  });

  describe('@access', () => {
    describe('read', () => {
      it('renders the risk references table', () => {
        // arrange
        const { getByTestId } = render(<ProcessingInstructionsRiskRefs instruction={merge({}, instruction, instructionWithRiskRefs)} />, {
          initialState: { ...initialState, user: userWithReadOnlyAccess },
        });

        // assert
        expect(getByTestId('processing-instruction-risk-ref-table')).toBeInTheDocument();
      });

      it("doesn't render the risk references search form", () => {
        // arrange
        const { container, queryByText, queryByTestId } = render(
          <ProcessingInstructionsRiskRefs instruction={merge({}, instruction, instructionWithRiskRefs, instructionDraft)} />,
          {
            initialState: { ...initialState, user: userWithReadOnlyAccess },
          }
        );

        // assert
        expect(queryByText('processingInstructions.addRiskReference.addByRiskRefId')).not.toBeInTheDocument();
        expect(queryByText('processingInstructions.addRiskReference.advancedSearchLabel')).not.toBeInTheDocument();
        expect(queryByTestId('processing-instruction-risk-ref-add-button')).not.toBeInTheDocument();
        expect(queryByTestId('processing-instruction-risk-ref-search-button')).not.toBeInTheDocument();
        expect(container.querySelector(getFormAutocompleteMui('riskReference'))).not.toBeInTheDocument();
        expect(container.querySelector(getFormAutocompleteMui('insuredCoverHolderName'))).not.toBeInTheDocument();
        expect(container.querySelector(getFormAutocompleteMui('department'))).not.toBeInTheDocument();
        expect(container.querySelector(getFormDatepicker('yearOfAccount'))).not.toBeInTheDocument();
      });

      it("doesn't render the delete icon button in the risk refs table", () => {
        // arrange
        const { queryByTestId } = render(<ProcessingInstructionsRiskRefs instruction={merge({}, instruction, instructionWithRiskRefs)} />, {
          initialState: { ...initialState, user: userWithReadOnlyAccess },
        });

        // assert
        expect(queryByTestId('risk-ref-delete-button')).not.toBeInTheDocument();
      });

      it('disables the editable fields in the risk refs table', () => {
        // arrange
        const { container } = render(
          <ProcessingInstructionsRiskRefs instruction={{ ...merge({}, instruction, instructionWithRiskRefs), processTypeId: 2 }} />,
          {
            initialState: { ...initialState, user: userWithReadOnlyAccess },
          }
        );

        // assert
        expect(container.querySelector(getFormRadio('leadRiskRef'))).toBeDisabled();
        expect(container.querySelector(getFormSelect('endorsementRef')).previousSibling).toHaveAttribute('aria-disabled', 'true');
      });
    });

    describe('create/update/delete', () => {
      describe('draft', () => {
        it('renders the risk references table', () => {
          // arrange
          const { getByTestId } = render(
            <ProcessingInstructionsRiskRefs instruction={merge({}, instruction, instructionWithRiskRefs, instructionDraft)} />,
            {
              initialState: { ...initialState, user: userWithFullAccess, processTypes: processTypes },
            }
          );

          // assert
          expect(getByTestId('processing-instruction-risk-ref-table')).toBeInTheDocument();
        });

        it('renders the risk references search form', () => {
          // arrange
          const { container, getByText, getByTestId } = render(
            <ProcessingInstructionsRiskRefs instruction={merge({}, instruction, instructionWithRiskRefs, instructionDraft)} />,
            {
              initialState: { ...initialState, user: userWithFullAccess, processTypes: processTypes },
            }
          );

          // assert
          expect(getByText('processingInstructions.addRiskReference.addByRiskRefId')).toBeInTheDocument();
          expect(getByText('processingInstructions.addRiskReference.advancedSearchLabel')).toBeInTheDocument();
          expect(getByTestId('processing-instruction-risk-ref-add-button')).toBeInTheDocument();
          expect(getByTestId('processing-instruction-risk-ref-search-button')).toBeInTheDocument();
          expect(container.querySelector(getFormAutocompleteMui('riskReference'))).toBeInTheDocument();
          expect(container.querySelector(getFormAutocompleteMui('insuredCoverHolderName'))).toBeInTheDocument();
          expect(container.querySelector(getFormAutocompleteMui('department'))).toBeInTheDocument();
          expect(container.querySelector(getFormDatepicker('yearOfAccount'))).toBeInTheDocument();
        });

        it('renders the delete icon button in the risk refs table', () => {
          // arrange
          const { getByTestId } = render(
            <ProcessingInstructionsRiskRefs instruction={merge({}, instruction, instructionWithRiskRefs, instructionDraft)} />,
            {
              initialState: { ...initialState, user: userWithFullAccess, processTypes: processTypes },
            }
          );

          // assert
          expect(getByTestId('risk-ref-delete-button')).toBeInTheDocument();
        });

        it('enables the editable fields in the risk refs table', () => {
          // arrange
          const { container } = render(
            <ProcessingInstructionsRiskRefs
              instruction={{ ...merge({}, instruction, instructionWithRiskRefs, instructionDraft), processTypeId: 2 }}
            />,
            {
              initialState: { ...initialState, user: userWithFullAccess, processTypes: processTypes },
            }
          );

          // assert
          expect(container.querySelector(getFormRadio('leadRiskRef'))).toBeEnabled();
          expect(container.querySelector(getFormSelect('endorsementRef')).previousSibling).not.toHaveAttribute('aria-disabled', 'true');
        });
      });

      describe('rejected draft', () => {
        it('renders the risk references table', () => {
          // arrange
          const { getByTestId } = render(
            <ProcessingInstructionsRiskRefs instruction={merge({}, instruction, instructionWithRiskRefs, instructionRejectedDraft)} />,
            {
              initialState: { ...initialState, user: userWithFullAccess, processTypes: processTypes },
            }
          );

          // assert
          expect(getByTestId('processing-instruction-risk-ref-table')).toBeInTheDocument();
        });

        it('renders the risk references search form', () => {
          // arrange
          const { container, getByText, getByTestId } = render(
            <ProcessingInstructionsRiskRefs instruction={merge({}, instruction, instructionWithRiskRefs, instructionRejectedDraft)} />,
            {
              initialState: { ...initialState, user: userWithFullAccess, processTypes: processTypes },
            }
          );

          // assert
          expect(getByText('processingInstructions.addRiskReference.addByRiskRefId')).toBeInTheDocument();
          expect(getByText('processingInstructions.addRiskReference.advancedSearchLabel')).toBeInTheDocument();
          expect(getByTestId('processing-instruction-risk-ref-add-button')).toBeInTheDocument();
          expect(getByTestId('processing-instruction-risk-ref-search-button')).toBeInTheDocument();
          expect(container.querySelector(getFormAutocompleteMui('riskReference'))).toBeInTheDocument();
          expect(container.querySelector(getFormAutocompleteMui('insuredCoverHolderName'))).toBeInTheDocument();
          expect(container.querySelector(getFormAutocompleteMui('department'))).toBeInTheDocument();
          expect(container.querySelector(getFormDatepicker('yearOfAccount'))).toBeInTheDocument();
        });

        it('renders the risk references search form', () => {
          // arrange
          const { container, getByText, getByTestId } = render(
            <ProcessingInstructionsRiskRefs instruction={merge({}, instruction, instructionWithRiskRefs, instructionRejectedDraft)} />,
            {
              initialState: { ...initialState, user: userWithFullAccess, processTypes: processTypes },
            }
          );

          // assert
          expect(getByText('processingInstructions.addRiskReference.addByRiskRefId')).toBeInTheDocument();
          expect(getByText('processingInstructions.addRiskReference.advancedSearchLabel')).toBeInTheDocument();
          expect(getByTestId('processing-instruction-risk-ref-add-button')).toBeInTheDocument();
          expect(getByTestId('processing-instruction-risk-ref-search-button')).toBeInTheDocument();
          expect(container.querySelector(getFormAutocompleteMui('riskReference'))).toBeInTheDocument();
          expect(container.querySelector(getFormAutocompleteMui('insuredCoverHolderName'))).toBeInTheDocument();
          expect(container.querySelector(getFormAutocompleteMui('department'))).toBeInTheDocument();
          expect(container.querySelector(getFormDatepicker('yearOfAccount'))).toBeInTheDocument();
        });

        it('renders the delete icon button in the risk refs table', () => {
          // arrange
          const { getByTestId } = render(
            <ProcessingInstructionsRiskRefs instruction={merge({}, instruction, instructionWithRiskRefs, instructionRejectedDraft)} />,
            {
              initialState: { ...initialState, user: userWithFullAccess, processTypes: processTypes },
            }
          );

          // assert
          expect(getByTestId('risk-ref-delete-button')).toBeInTheDocument();
        });

        it('enables the editable fields in the risk refs table', () => {
          // arrange
          const { container } = render(
            <ProcessingInstructionsRiskRefs
              instruction={{ ...merge({}, instruction, instructionWithRiskRefs, instructionRejectedDraft), processTypeId: 2 }}
            />,
            {
              initialState: { ...initialState, user: userWithFullAccess, processTypes: processTypes },
            }
          );

          // assert
          expect(container.querySelector(getFormRadio('leadRiskRef'))).toBeEnabled();
          expect(container.querySelector(getFormSelect('endorsementRef')).previousSibling).not.toHaveAttribute('aria-disabled', 'true');
        });
      });

      describe('submitted authorised signatory', () => {
        it('renders the risk references table', () => {
          // arrange
          const { getByTestId } = render(
            <ProcessingInstructionsRiskRefs
              instruction={merge({}, instruction, instructionWithRiskRefs, instructionSubmittedAuthorisedSignatory)}
            />,
            {
              initialState: { ...initialState, user: userWithFullAccess, processTypes: processTypes },
            }
          );

          // assert
          expect(getByTestId('processing-instruction-risk-ref-table')).toBeInTheDocument();
        });

        it("doesn't render the risk references search form", () => {
          // arrange
          const { container, queryByText, queryByTestId } = render(
            <ProcessingInstructionsRiskRefs
              instruction={merge({}, instruction, instructionWithRiskRefs, instructionSubmittedAuthorisedSignatory)}
            />,
            {
              initialState: { ...initialState, user: userWithFullAccess, processTypes: processTypes },
            }
          );

          // assert
          expect(queryByText('processingInstructions.addRiskReference.addByRiskRefId')).not.toBeInTheDocument();
          expect(queryByText('processingInstructions.addRiskReference.advancedSearchLabel')).not.toBeInTheDocument();
          expect(queryByTestId('processing-instruction-risk-ref-add-button')).not.toBeInTheDocument();
          expect(queryByTestId('processing-instruction-risk-ref-search-button')).not.toBeInTheDocument();
          expect(container.querySelector(getFormAutocompleteMui('riskReference'))).not.toBeInTheDocument();
          expect(container.querySelector(getFormAutocompleteMui('insuredCoverHolderName'))).not.toBeInTheDocument();
          expect(container.querySelector(getFormAutocompleteMui('department'))).not.toBeInTheDocument();
          expect(container.querySelector(getFormDatepicker('yearOfAccount'))).not.toBeInTheDocument();
        });

        it("doesn't render the delete icon button in the risk refs table", () => {
          // arrange
          const { queryByTestId } = render(
            <ProcessingInstructionsRiskRefs
              instruction={merge({}, instruction, instructionWithRiskRefs, instructionSubmittedAuthorisedSignatory)}
            />,
            {
              initialState: { ...initialState, user: userWithFullAccess, processTypes: processTypes },
            }
          );

          // assert
          expect(queryByTestId('risk-ref-delete-button')).not.toBeInTheDocument();
        });

        it('disables the editable fields in the risk refs table', () => {
          // arrange
          const { container } = render(
            <ProcessingInstructionsRiskRefs
              instruction={{
                ...merge({}, instruction, instructionWithRiskRefs, instructionSubmittedAuthorisedSignatory),
                processTypeId: 2,
              }}
            />,
            {
              initialState: { ...initialState, user: userWithFullAccess, processTypes: processTypes },
            }
          );

          // assert
          expect(container.querySelector(getFormRadio('leadRiskRef'))).toBeDisabled();
          expect(container.querySelector(getFormSelect('endorsementRef')).previousSibling).toHaveAttribute('aria-disabled', 'true');
        });
      });

      describe('submitted processing', () => {
        it('renders the risk references table', () => {
          // arrange
          const { getByTestId } = render(
            <ProcessingInstructionsRiskRefs
              instruction={merge({}, instruction, instructionWithRiskRefs, instructionSubmittedProcessing)}
            />,
            {
              initialState: { ...initialState, user: userWithFullAccess, processTypes: processTypes },
            }
          );

          // assert
          expect(getByTestId('processing-instruction-risk-ref-table')).toBeInTheDocument();
        });

        it("doesn't render the risk references search form", () => {
          // arrange
          const { container, queryByText, queryByTestId } = render(
            <ProcessingInstructionsRiskRefs
              instruction={merge({}, instruction, instructionWithRiskRefs, instructionSubmittedProcessing)}
            />,
            {
              initialState: { ...initialState, user: userWithFullAccess, processTypes: processTypes },
            }
          );

          // assert
          expect(queryByText('processingInstructions.addRiskReference.addByRiskRefId')).not.toBeInTheDocument();
          expect(queryByText('processingInstructions.addRiskReference.advancedSearchLabel')).not.toBeInTheDocument();
          expect(queryByTestId('processing-instruction-risk-ref-add-button')).not.toBeInTheDocument();
          expect(queryByTestId('processing-instruction-risk-ref-search-button')).not.toBeInTheDocument();
          expect(container.querySelector(getFormAutocompleteMui('riskReference'))).not.toBeInTheDocument();
          expect(container.querySelector(getFormAutocompleteMui('insuredCoverHolderName'))).not.toBeInTheDocument();
          expect(container.querySelector(getFormAutocompleteMui('department'))).not.toBeInTheDocument();
          expect(container.querySelector(getFormDatepicker('yearOfAccount'))).not.toBeInTheDocument();
        });

        it("doesn't render the delete icon button in the risk refs table", () => {
          // arrange
          const { queryByTestId } = render(
            <ProcessingInstructionsRiskRefs
              instruction={merge({}, instruction, instructionWithRiskRefs, instructionSubmittedProcessing)}
            />,
            {
              initialState: { ...initialState, user: userWithFullAccess, processTypes: processTypes },
            }
          );

          // assert
          expect(queryByTestId('risk-ref-delete-button')).not.toBeInTheDocument();
        });

        it('disables the editable fields in the risk refs table', () => {
          // arrange
          const { container } = render(
            <ProcessingInstructionsRiskRefs
              instruction={{
                ...merge({}, instruction, instructionWithRiskRefs, instructionSubmittedProcessing),
                processTypeId: 2,
              }}
            />,
            {
              initialState: { ...initialState, user: userWithFullAccess, processTypes: processTypes },
            }
          );

          // assert
          expect(container.querySelector(getFormRadio('leadRiskRef'))).toBeDisabled();
          expect(container.querySelector(getFormSelect('endorsementRef')).previousSibling).toHaveAttribute('aria-disabled', 'true');
        });
      });
    });
  });
});
