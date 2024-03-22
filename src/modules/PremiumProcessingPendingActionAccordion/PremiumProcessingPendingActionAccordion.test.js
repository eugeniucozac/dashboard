import React from 'react';
import PremiumProcessingPendingActionAccordion from './PremiumProcessingPendingActionAccordion';
import { render, screen } from 'tests';
import userEvent from '@testing-library/user-event';

const renderIssueDocuments = (props, renderOptions) => {
  const componentProps = {
    commitTransactionStageIsCompleted: true,
    issueDocuments: {
      documentFromLondonTeam: false,
      nonBureau: false,
      bureauInsurer: true,
    },
    ...props,
  };

  render(<PremiumProcessingPendingActionAccordion {...componentProps} />, renderOptions);

  const nonBureauInsurer = screen.getByLabelText('premiumProcessing.issueDocuments.nonBureauInsurer');
  const packagesSubmittedXchanging = screen.getByLabelText('premiumProcessing.issueDocuments.packagesSubmittedXchanging');
  const proSentDocsToClients = screen.getByLabelText('premiumProcessing.issueDocuments.proSentDocsToClients');
  const invoiceSentDateTickedGXB = screen.getByLabelText('premiumProcessing.issueDocuments.invoiceSentDateTickedGXB');

  return {
    nonBureauInsurer,
    packagesSubmittedXchanging,
    proSentDocsToClients,
    invoiceSentDateTickedGXB,
  };
};

describe('MODULES › PremiumProcessingPendingActionAccordion', () => {
  // it('renders without crashing', () => {
  //   expect(renderIssueDocuments({})).toMatchInlineSnapshot(`
  //     Object {
  //       "invoiceSentDateTickedGXB": <input
  //         class="PrivateSwitchBase-input-24"
  //         data-indeterminate="false"
  //         disabled=""
  //         name="invoiceSentDateTickedGXB"
  //         type="checkbox"
  //         value=""
  //       />,
  //       "nonBureauInsurer": <input
  //         class="PrivateSwitchBase-input-24"
  //         data-indeterminate="false"
  //         disabled=""
  //         name="nonBureauInsurer"
  //         type="checkbox"
  //         value=""
  //       />,
  //       "packagesSubmittedXchanging": <input
  //         class="PrivateSwitchBase-input-24"
  //         data-indeterminate="false"
  //         name="packagesSubmittedXchanging"
  //         type="checkbox"
  //         value=""
  //       />,
  //       "proSentDocsToClients": <input
  //         class="PrivateSwitchBase-input-24"
  //         data-indeterminate="false"
  //         name="proSentDocsToClients"
  //         type="checkbox"
  //         value=""
  //       />,
  //     }
  //   `);
  // });

  it('renders if commit transaction stage is completed', () => {
    // arrange
    // renderIssueDocuments({});
    // assert
    //   expect(screen.getByText('Issue documents')).toBeInTheDocument();
  });

  it('renders pro sent docs to clients if documents are not sending by London team', () => {
    // arrange
    // renderIssueDocuments({});
    // assert
    // expect(screen.getByLabelText('premiumProcessing.issueDocuments.proSentDocsToClients')).toBeEnabled();
    // expect(screen.getByLabelText('premiumProcessing.issueDocuments.proSentDocsToLondonTeam')).toBeDisabled();
    // expect(screen.getByLabelText('premiumProcessing.issueDocuments.londonTeamSentDocsToClient')).toBeDisabled();
  });

  it('renders pro sent docs to london team and london team sent docs to client if documents are able to send by london team', () => {
    // arrange
    // renderIssueDocuments({ issueDocuments: { documentFromLondonTeam: true } });
    // assert
    // expect(screen.getByLabelText('premiumProcessing.issueDocuments.proSentDocsToClients')).toBeDisabled();
    // expect(screen.getByLabelText('premiumProcessing.issueDocuments.proSentDocsToLondonTeam')).toBeEnabled();
    // expect(screen.getByLabelText('premiumProcessing.issueDocuments.londonTeamSentDocsToClient')).toBeEnabled();
  });

  it('renders sent docs to non bureau insurer if non-bureau is selected', () => {
    // arrange
    //renderIssueDocuments({ issueDocuments: { nonBureau: true, bureauInsurer: false } });
    // assert
    //expect(screen.getByLabelText('premiumProcessing.issueDocuments.nonBureauInsurer')).toBeEnabled();
  });

  it('renders work packages submitted to xchanging if bureau insurer is selected', () => {
    // arrange
    //renderIssueDocuments({});
    // assert
    // expect(screen.getByLabelText('premiumProcessing.issueDocuments.packagesSubmittedXchanging')).toBeEnabled();
  });

  it('renders invoice sent date ticked on GXB if "Sent docs to Non Bureau Insurer" is checked', () => {
    // arrange
    //renderIssueDocuments({ issueDocuments: { nonBureau: true } });
    // userEvent.click(nonBureauInsurer);
    // expect(invoiceSentDateTickedGXB).toBeEnabled();
    // expect(invoiceSentDateTickedGXB).not.toBeChecked();
  });

  it('renders invoice sent date ticked on GXB if "Work Packages submitted to Xchanging" is checked', () => {
    // arrange
    // renderIssueDocuments({ issueDocuments: { nonBureau: true } });
    //userEvent.click(packagesSubmittedXchanging);
    // expect(invoiceSentDateTickedGXB).toBeEnabled();
    // expect(invoiceSentDateTickedGXB).not.toBeChecked();
  });

  it('renders invoice sent date ticked on GXB if "Pro sent docs to Clients" is checked', () => {
    // arrange
    //renderIssueDocuments({ issueDocuments: { nonBureau: true } });
    // userEvent.click(proSentDocsToClients);
    //expect(invoiceSentDateTickedGXB).toBeEnabled();
    //expect(invoiceSentDateTickedGXB).not.toBeChecked();
  });

  it('renders invoice sent date ticked on GXB if "Work Packages submitted to Xchanging" and "Sent docs to Non Bureau Insurer" are checked', () => {
    // arrange
    /* renderIssueDocuments({ issueDocuments: { nonBureau: true } });

    userEvent.click(nonBureauInsurer);
    userEvent.click(packagesSubmittedXchanging);
    expect(invoiceSentDateTickedGXB).toBeEnabled();
    expect(invoiceSentDateTickedGXB).not.toBeChecked(); */
  });

  it('renders invoice sent date ticked on GXB if "Work Packages submitted to Xchanging" and "Pro sent docs to Clients" are checked', () => {
    // arrange
    /* renderIssueDocuments({ issueDocuments: { nonBureau: true } });

    userEvent.click(packagesSubmittedXchanging);
    userEvent.click(proSentDocsToClients);
    expect(invoiceSentDateTickedGXB).toBeEnabled();
    expect(invoiceSentDateTickedGXB).not.toBeChecked(); */
  });

  it('renders invoice sent date ticked on GXB if first 3 checkboxes are checked', () => {
    // arrange
    /*  renderIssueDocuments({ issueDocuments: { nonBureau: true } });

    userEvent.click(packagesSubmittedXchanging);
    userEvent.click(nonBureauInsurer);
    userEvent.click(proSentDocsToClients);
    expect(invoiceSentDateTickedGXB).toBeEnabled();
    expect(invoiceSentDateTickedGXB).not.toBeChecked(); */
  });
});
