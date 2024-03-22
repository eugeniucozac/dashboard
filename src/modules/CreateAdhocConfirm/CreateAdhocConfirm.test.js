import React from 'react';
import { render, screen } from 'tests';
import CreateAdhocConfirm from './CreateAdhocConfirm';
import * as utils from 'utils';

const renderConfrmCreateAdhock = (props = {}) => {
  return render(<CreateAdhocConfirm {...props} />);
};

describe('COMPONENTS › ConfrmCreateAdhock', () => {
  it('renders nothing if not passed all required props', () => {
    renderConfrmCreateAdhock();
    screen.debug();
  });
  it('renders form ', () => {
    renderConfrmCreateAdhock();
    expect(screen.getByText(utils.string.t('claims.processing.taskDetailsLabels.claimRef'))).toBeInTheDocument();
    expect(screen.getByText(utils.string.t('claims.processing.taskDetailsLabels.taskRef'))).toBeInTheDocument();

    expect(screen.getByText(utils.string.t('claims.processing.taskDetailsLabels.taskName'))).toBeInTheDocument();
    expect(screen.getByText(utils.string.t('claims.processing.taskDetailsLabels.priority'))).toBeInTheDocument();
    expect(screen.getByText(utils.string.t('claims.processing.taskDetailsLabels.team'))).toBeInTheDocument();
    expect(screen.getByText(utils.string.t('claims.processing.taskDetailsLabels.assignedTo'))).toBeInTheDocument();
    expect(screen.getByText(utils.string.t('claims.processing.taskDetailsLabels.description'))).toBeInTheDocument();
    expect(screen.getByText(utils.string.t('claims.processing.taskDetailsLabels.targetDueDate'))).toBeInTheDocument();
    expect(screen.getByText(utils.string.t('claims.processing.taskDetailsLabels.reminder'))).toBeInTheDocument();
  });
});
