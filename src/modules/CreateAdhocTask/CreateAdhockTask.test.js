import React from 'react';
import { render, screen } from 'tests';
import CreateAdhocTask from './CreateAdhocTask';
import * as utils from 'utils';

const renderCreateAdhocTask = (props) => {
  return render(<CreateAdhocTask {...props} />);
};

describe('COMPONENTS › CreateAdhocTask LinearStepper', () => {
  it('renders nothing if not passed all required props', () => {
    renderCreateAdhocTask();
  });
  it('renders the stepper properly', () => {
    renderCreateAdhocTask();
    expect(screen.getByText(utils.string.t('claims.processing.adHocTask.adHocDetails'))).toBeInTheDocument();
    expect(screen.getByText(utils.string.t('claims.processing.adHocTask.uploadDocuments'))).toBeInTheDocument();
    expect(screen.getByText(utils.string.t('claims.processing.adHocTask.confirmTask'))).toBeInTheDocument();
  });
});
