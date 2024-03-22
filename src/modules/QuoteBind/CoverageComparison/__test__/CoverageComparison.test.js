import { render, screen, waitForElementToBeRemoved } from 'tests';
import { CoverageComparison } from '../CoverageComparison';
import userEvent from '@testing-library/user-event';
import fetchMock from 'fetch-mock';

import { coverages, coverageDefinitions } from './_data';

const initialState = {
  risk: {
    products: { selected: { id: '1' } },
    coverages: {
      loading: false,
      selected: coverages,
    },
    coverageDefinitions,
  },
};

const handleOpenCoverageComparison = jest.fn();

describe('MODULES › QuoteBind › CoverageComparison', () => {
  it('should render', async () => {
    render(<CoverageComparison />);
  });

  it('should render when open', async () => {
    render(<CoverageComparison open handleOpenCoverageComparison={handleOpenCoverageComparison} />);

    expect(screen.getByText('products.coverageComparison')).toBeInTheDocument();
    userEvent.click(screen.getByTestId('drawer-close-button'));
    expect(handleOpenCoverageComparison).toHaveBeenCalled();
  });

  it('render with all props', async () => {
    const riskId = '6193bba586ecd94529f69f33';
    const riskType = 'WIND_HAIL_DBB';
    const coverageDefinitionFields = coverageDefinitions[riskType];
    window.HTMLElement.prototype.scrollIntoView = jest.fn();

    render(
      <CoverageComparison
        open
        riskId={riskId}
        riskType={riskType}
        coverageDefinitionFields={coverageDefinitionFields}
        handleOpenCoverageComparison={handleOpenCoverageComparison}
      />,
      {
        initialState,
      }
    );

    expect(screen.getByText('products.coverageComparison')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /coverage option 1/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /coverage option 2/i })).toBeInTheDocument();
    expect(screen.getByText('Satinwood')).toBeInTheDocument();
    expect(screen.getByText('Second Carrier')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /products.addCoverage/i })).toBeInTheDocument();

    userEvent.click(screen.getByRole('button', { name: /products.addCoverage/i }));
  });

  it('render with all props, activate option', async () => {
    const riskId = '6193bba586ecd94529f69f33';
    const riskType = 'WIND_HAIL_DBB';
    const coverageDefinitionFields = coverageDefinitions[riskType];
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
    fetchMock.put('glob:*/api/v1/risks/6193bba586ecd94529f69f33/coverages/2', { ...coverages[1], id: 3 });

    render(
      <CoverageComparison
        open
        riskId={riskId}
        riskType={riskType}
        coverageDefinitionFields={coverageDefinitionFields}
        handleOpenCoverageComparison={handleOpenCoverageComparison}
      />,
      {
        initialState,
      }
    );
    userEvent.click(screen.getByTestId('edit-coverage-button-2'));
    userEvent.click(screen.getByTestId('activate-coverage-button-2'));
  });

  it('render with all props, delete option', async () => {
    const riskId = '6193bba586ecd94529f69f33';
    const riskType = 'WIND_HAIL_DBB';
    const coverageDefinitionFields = coverageDefinitions[riskType];
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
    fetchMock.delete('glob:*/api/v1/risks/6193bba586ecd94529f69f33/coverages/2', { ...coverages[1], id: 3 });

    render(
      <CoverageComparison
        open
        riskId={riskId}
        riskType={riskType}
        coverageDefinitionFields={coverageDefinitionFields}
        handleOpenCoverageComparison={handleOpenCoverageComparison}
      />,
      {
        initialState,
      }
    );
    userEvent.click(screen.getByTestId('delete-coverage-button-2'));

    waitForElementToBeRemoved(screen.queryByRole('heading', { name: /coverage option 2/i })).catch((err) => console.log(err));
  });
});
