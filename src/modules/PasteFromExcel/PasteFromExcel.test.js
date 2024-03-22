import React from 'react';
import { render, waitFor, within, fireEvent, getFormTextarea, getFormSelect } from 'tests';
import PasteFromExcel from './PasteFromExcel';

describe('MODULES › PasteFromExcel', () => {
  const headers = [
    { key: 'name', value: '' },
    { key: 'city', value: '' },
    { key: 'age', value: '' },
  ];

  const text = `Name	City
Adam	Atlanta
Ben	Boston
Chris	Chicago`;

  it('renders without crashing', () => {
    // arrange
    const { container, getByTestId } = render(<PasteFromExcel />);

    // assert
    expect(container).toBeInTheDocument();
    expect(getByTestId('paste-from-excel')).toBeInTheDocument();
  });

  describe('layout', () => {
    describe('@render', () => {
      it('renders 3 Accordions by default', () => {
        // arrange
        const { getByTestId, queryByTestId } = render(<PasteFromExcel />);

        // assert
        expect(getByTestId('accordion-step1')).toBeInTheDocument();
        expect(getByTestId('accordion-step2')).toBeInTheDocument();
        expect(getByTestId('accordion-step3')).toBeInTheDocument();
        expect(queryByTestId('accordion-step4')).not.toBeInTheDocument();
      });

      it('renders an extra 4th Accordion if steps prop is 4', () => {
        // arrange
        const { getByTestId } = render(<PasteFromExcel steps={4} />);

        // assert
        expect(getByTestId('accordion-step1')).toBeInTheDocument();
        expect(getByTestId('accordion-step2')).toBeInTheDocument();
        expect(getByTestId('accordion-step3')).toBeInTheDocument();
        expect(getByTestId('accordion-step4')).toBeInTheDocument();
      });

      it('renders the upload button in the 3rd Accordion by default', () => {
        // arrange
        const { getByTestId } = render(<PasteFromExcel />);

        // assert
        expect(within(getByTestId('accordion-step3')).getByText('app.submit')).toBeInTheDocument();
      });

      it('renders the upload button in the 4th Accordion if there is 4 steps', () => {
        // arrange
        const { getByTestId } = render(<PasteFromExcel steps={4} />);

        // assert
        expect(within(getByTestId('accordion-step3')).getByText('app.confirm')).toBeInTheDocument();
        expect(within(getByTestId('accordion-step4')).getByText('app.submit')).toBeInTheDocument();
      });

      it('renders the default titles', () => {
        // arrange
        const { getByTestId } = render(<PasteFromExcel steps={4} />);

        // assert
        expect(within(getByTestId('accordion-step1')).getByText('products.pasteFromExcel.step1.title')).toBeInTheDocument();
        expect(within(getByTestId('accordion-step2')).getByText('products.pasteFromExcel.step2.title')).toBeInTheDocument();
        expect(within(getByTestId('accordion-step3')).getByText('products.pasteFromExcel.step3.title')).toBeInTheDocument();
        expect(within(getByTestId('accordion-step4')).getByText('products.pasteFromExcel.step4.title')).toBeInTheDocument();
      });

      it('renders the custom titles', () => {
        // arrange
        const labels = {
          step1: {
            title: 'custom title 1',
          },
          step2: {
            title: 'custom title 2',
          },
          step3: {
            title: 'custom title 3',
          },
          step4: {
            title: 'custom title 4',
          },
        };
        const { getByTestId } = render(<PasteFromExcel steps={4} labels={labels} />);

        // assert
        expect(within(getByTestId('accordion-step1')).getByText('custom title 1')).toBeInTheDocument();
        expect(within(getByTestId('accordion-step2')).getByText('custom title 2')).toBeInTheDocument();
        expect(within(getByTestId('accordion-step3')).getByText('custom title 3')).toBeInTheDocument();
        expect(within(getByTestId('accordion-step4')).getByText('custom title 4')).toBeInTheDocument();
      });

      it('renders the default hints/errors', () => {
        // arrange
        const { getByTestId } = render(<PasteFromExcel steps={4} />);

        // assert
        expect(within(getByTestId('accordion-step1')).getByText('products.pasteFromExcel.step1.hint')).toBeInTheDocument();
        expect(within(getByTestId('accordion-step2')).getByText('products.pasteFromExcel.step2.error')).toBeInTheDocument();
        expect(within(getByTestId('accordion-step3')).getByText('products.pasteFromExcel.step3.hint')).toBeInTheDocument();
        expect(within(getByTestId('accordion-step4')).getByText('products.pasteFromExcel.step4.hint')).toBeInTheDocument();
      });

      it('renders the custom hints/errors', () => {
        // arrange
        const labels = {
          step1: {
            hint: 'custom hint 1',
          },
          step2: {
            error: 'custom error 2',
          },
          step3: {
            hint: 'custom hint 3',
          },
          step4: {
            hint: 'custom hint 4',
          },
        };
        const { getByTestId } = render(<PasteFromExcel steps={4} labels={labels} />);

        // assert
        expect(within(getByTestId('accordion-step1')).getByText('custom hint 1')).toBeInTheDocument();
        expect(within(getByTestId('accordion-step2')).getByText('custom error 2')).toBeInTheDocument();
        expect(within(getByTestId('accordion-step3')).getByText('custom hint 3')).toBeInTheDocument();
        expect(within(getByTestId('accordion-step4')).getByText('custom hint 4')).toBeInTheDocument();
      });
    });

    describe('@actions', () => {
      it("renders the 2nd accordion error if copy-pasted text isn't valid", async () => {
        // arrange
        const { getByTestId } = render(<PasteFromExcel />);
        const textarea = document.querySelector(getFormTextarea('excelExtract'));
        const submit = getByTestId('accordion-step1').querySelector('button[type="submit"]');

        // act
        fireEvent.change(textarea, { target: { value: 'just a string' } });
        fireEvent.click(submit);

        // assert
        expect(within(getByTestId('accordion-step2')).getByText('products.pasteFromExcel.step2.error')).toBeInTheDocument();
        expect(within(getByTestId('accordion-step2')).queryByText('products.pasteFromExcel.step2.hint')).not.toBeInTheDocument();
      });

      it('renders the 2nd accordion hint if copy-pasted text is valid', async () => {
        // arrange
        const { getByText, getByTestId } = render(<PasteFromExcel headers={headers} />);
        const textarea = document.querySelector(getFormTextarea('excelExtract'));
        const submit = getByTestId('accordion-step1').querySelector('button[type="submit"]');

        // act
        fireEvent.change(textarea, { target: { value: text } });
        fireEvent.click(submit);

        // assert
        await waitFor(() => getByText('products.pasteFromExcel.step2.hint'));
        expect(within(getByTestId('accordion-step2')).queryByText('products.pasteFromExcel.step2.error')).not.toBeInTheDocument();
        expect(within(getByTestId('accordion-step2')).getByText('products.pasteFromExcel.step2.hint')).toBeInTheDocument();
      });

      it('renders the matching column fields after valid text is submitted', async () => {
        // arrange
        const { container, getByText, getByTestId } = render(<PasteFromExcel headers={headers} />);
        const textarea = document.querySelector(getFormTextarea('excelExtract'));
        const submit = getByTestId('accordion-step1').querySelector('button[type="submit"]');

        // act
        fireEvent.change(textarea, { target: { value: text } });
        fireEvent.click(submit);

        // assert
        await waitFor(() => getByText('products.pasteFromExcel.step2.hint'));
        expect(container.querySelector(getFormSelect('name'))).toBeInTheDocument();
        expect(container.querySelector(getFormSelect('city'))).toBeInTheDocument();
      });

      it('renders the summary table after matching columns', async () => {
        // arrange
        const { getByText, getByTestId } = render(<PasteFromExcel headers={headers} />);
        const textarea = document.querySelector(getFormTextarea('excelExtract'));
        const submit1 = getByTestId('accordion-step1').querySelector('button[type="submit"]');

        // act
        fireEvent.change(textarea, { target: { value: text } });
        fireEvent.click(submit1);
        await waitFor(() => getByText('products.pasteFromExcel.step2.hint'));
        const submit2 = getByTestId('accordion-step2').querySelector('button[type="submit"]');

        // act
        fireEvent.click(submit2);
        await waitFor(() => getByTestId('accordion-step3').querySelector('table'));
        const table = getByTestId('accordion-step3').querySelector('table');

        // assert
        expect(within(table.querySelector('thead')).getByText('Name')).toBeInTheDocument();
        expect(within(table.querySelector('thead')).getByText('City')).toBeInTheDocument();
        expect(within(table.querySelector('tbody tr:nth-child(1)')).getByText('Adam')).toBeInTheDocument();
        expect(within(table.querySelector('tbody tr:nth-child(1)')).getByText('Atlanta')).toBeInTheDocument();
        expect(within(table.querySelector('tbody tr:nth-child(2)')).getByText('Ben')).toBeInTheDocument();
        expect(within(table.querySelector('tbody tr:nth-child(2)')).getByText('Boston')).toBeInTheDocument();
        expect(within(table.querySelector('tbody tr:nth-child(3)')).getByText('Chris')).toBeInTheDocument();
        expect(within(table.querySelector('tbody tr:nth-child(3)')).getByText('Chicago')).toBeInTheDocument();
      });

      it('renders a custom summary if passed through props', async () => {
        // arrange
        const childrenRender = (rows) => {
          return (
            <div data-testid="custom-summary">
              {rows.map((row) => {
                return <p>{Object.values(row).filter(Boolean).join(' - ')}</p>;
              })}
            </div>
          );
        };
        const { getByText, getByTestId } = render(<PasteFromExcel headers={headers} children={childrenRender} />);
        const textarea = document.querySelector(getFormTextarea('excelExtract'));
        const submit1 = getByTestId('accordion-step1').querySelector('button[type="submit"]');

        // act
        fireEvent.change(textarea, { target: { value: text } });
        fireEvent.click(submit1);
        await waitFor(() => getByText('products.pasteFromExcel.step2.hint'));
        const submit2 = getByTestId('accordion-step2').querySelector('button[type="submit"]');

        // act
        fireEvent.click(submit2);
        await waitFor(() => getByTestId('accordion-step3').querySelector('table'));
        const accordion = getByTestId('accordion-step3');
        const summary = getByTestId('custom-summary');

        // assert
        expect(accordion.querySelector('thead')).not.toBeInTheDocument();
        expect(accordion.querySelector('tbody')).not.toBeInTheDocument();
        expect(within(summary.querySelector('p:nth-child(1)')).getByText('Adam - Atlanta')).toBeInTheDocument();
        expect(within(summary.querySelector('p:nth-child(2)')).getByText('Ben - Boston')).toBeInTheDocument();
        expect(within(summary.querySelector('p:nth-child(3)')).getByText('Chris - Chicago')).toBeInTheDocument();
      });
    });
  });
});
