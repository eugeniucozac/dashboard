import React from 'react';
import { render, screen } from 'tests';
import { ChartTooltip } from './ChartTooltip';
import { mockClasses } from 'setupMocks';

describe('COMPONENTS › ChartTooltip', () => {
  const defaultProps = {
    classes: mockClasses,
  };

  it('renders without crashing', () => {
    render(<ChartTooltip {...defaultProps} />);
  });

  it("dosen't renders the title if prop not exits", () => {
    const { container } = render(<ChartTooltip {...defaultProps} />);

    expect(container.firstChild).toBeNull();
  });

  it('renders the title if prop exits', () => {
    const title = 'Foo';
    render(<ChartTooltip {...defaultProps} title={title} />);

    expect(screen.getByText(title)).toBeInTheDocument();
  });
  it('renders the children if prop exits', () => {
    const result = '<div><span>1</span><span>2</span></div>';
    const { container } = render(
      <ChartTooltip {...defaultProps}>
        <span>1</span>
        <span>2</span>
      </ChartTooltip>
    );

    expect(container).toContainHTML(result);
  });

  it('renders title and children', () => {
    const title = 'Foo';
    const { container } = render(
      <ChartTooltip {...defaultProps} title={title}>
        <div>Bar</div>
      </ChartTooltip>
    );

    expect(screen.getByText(title)).toBeInTheDocument();

    expect(container).toContainHTML('<div><div>Bar</div></div>');
  });
});
