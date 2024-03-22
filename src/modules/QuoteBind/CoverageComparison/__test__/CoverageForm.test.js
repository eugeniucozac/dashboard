import { render, screen, getFormSelect, openMuiSelect, waitFor } from 'tests';
import { CoverageForm } from '../CoverageForm';
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

const handleHideForm = jest.fn();

const formData = {
  isEdit: false,
  editCoverage: null,
  coverageId: null,
};

describe('MODULES › QuoteBind › CoverageComparison › CoverageForm', () => {
  const riskId = '6193bba586ecd94529f69f33';
  const riskType = 'WIND_HAIL_DBB';
  const coverageDefinitionFields = [
    {
      name: 'coverageType',
      type: 'SELECT',
      indicative: false,
      group: 'COVER',
      label: 'Coverage Type',
      options: [
        {
          label: 'All Wind and Hail',
          value: 'ALL_WIND_AND_HAIL',
        },
        {
          label: 'Named Wind Only',
          value: 'NAMED_WIND_ONLY',
        },
      ],
      validation: {
        required: true,
      },
    },
  ];

  it('should render', async () => {
    render(
      <CoverageForm
        formData={formData}
        riskId={riskId}
        riskType={riskType}
        coverageDefinitionFields={coverageDefinitionFields}
        handleHideForm={handleHideForm}
      />
    );

    userEvent.click(screen.getByRole('button', { name: /app.cancel/i }));
    expect(handleHideForm).toHaveBeenCalled();
  });

  it('should render and submit form', async () => {
    fetchMock.post('glob:*/api/v1/risks/6193bba586ecd94529f69f33/coverages', {
      ...coverages[0],
      id: 3,
    });
    const { container } = render(
      <CoverageForm
        formData={formData}
        riskId={riskId}
        riskType={riskType}
        coverageDefinitionFields={coverageDefinitionFields}
        handleHideForm={handleHideForm}
      />
    );
    const coverageType = container.querySelector(getFormSelect('coverageType'));
    expect(coverageType).toBeInTheDocument();

    await openMuiSelect(coverageType);
    expect(screen.getByRole('option', { name: /All Wind and Hail/i })).toBeInTheDocument();
    userEvent.click(screen.queryByText('All Wind and Hail'));

    userEvent.click(screen.getByRole('button', { name: /app.submit/i }));
    waitFor(() => expect(screen.getByText('products.coverageSubmitInProgress')).toBeInTheDocument());
    waitFor(() => expect(handleHideForm).toHaveBeenCalled());
  });

  it('should render and submit when editing', async () => {
    fetchMock.post('glob:*/api/v1/risks/6193bba586ecd94529f69f33/coverages/2', {
      ...coverages[0],
      id: 3,
    });
    const formData = {
      isEdit: true,
      editCoverage: { coverageType: 'ALL_WIND_AND_HAIL' },
      coverageId: 2,
    };
    const { container } = render(
      <CoverageForm
        formData={formData}
        riskId={riskId}
        riskType={riskType}
        coverageDefinitionFields={coverageDefinitionFields}
        handleHideForm={handleHideForm}
      />
    );
    const coverageType = container.querySelector(getFormSelect('coverageType'));
    expect(coverageType).toBeInTheDocument();

    expect(coverageType.value).toBe('ALL_WIND_AND_HAIL');

    userEvent.click(screen.getByRole('button', { name: /app.submit/i }));
    waitFor(() => expect(screen.getByText('products.coverageSubmitInProgress')).toBeInTheDocument());
    waitFor(() => expect(handleHideForm).toHaveBeenCalled());

    //
  });
});
