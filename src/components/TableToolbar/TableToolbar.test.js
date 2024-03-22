import React from 'react';
import { render, within } from 'tests';
import { TableToolbar } from './TableToolbar';

describe('COMPONENTS › TableToolbar', () => {
  it('renders the TableToolbar component', () => {
    const { container } = render(<TableToolbar />);

    expect(container).toBeInTheDocument();
  });

  it('renders the children content within the component', () => {
    const { queryByTestId } = render(
      <TableToolbar>
        <p>children content</p>
      </TableToolbar>
    );

    expect(queryByTestId('table-toolbar')).toBeInTheDocument();
    expect(within(queryByTestId('table-toolbar')).queryByText('children content')).toBeInTheDocument();
  });
});
