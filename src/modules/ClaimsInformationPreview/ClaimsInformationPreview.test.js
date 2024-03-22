import React from 'react';
import { render, screen } from 'tests';
import ClaimsInformationPreview from './ClaimsInformationPreview';
import * as utils from 'utils';

const data = { claimRef: '1000', claimant: 'Price Forbes', ucr: '1231', status: 'approved' };

const renderClaimsInformationPreviewWithRequiredProps = (columns = []) => {
  return render(<ClaimsInformationPreview columns={[]} claimInformation={data} />);
};

describe('Claims table >  Claims view Modal', () => {
  it('renders without crashing', () => {
    // arrange
    renderClaimsInformationPreviewWithRequiredProps();
    // assert
    expect(screen.getByText(utils.string.t('claims.claimInformation.claimPreviewTitle', data.claimRef))).toBeInTheDocument();
    expect(screen.getByText('claims.claimInformation.title')).toBeInTheDocument();
    expect(screen.getByText(utils.string.t('claims.claimInformation.claimant', data.claimant))).toBeInTheDocument();
    expect(screen.getByText(utils.string.t('claims.claimInformation.claimRef', data.claimRef))).toBeInTheDocument();
    expect(screen.getByText(utils.string.t('claims.claimInformation.ucr', data.ucr))).toBeInTheDocument();
    expect(screen.getByText(utils.string.t('claims.claimInformation.status', data.status))).toBeInTheDocument();
  });
});
