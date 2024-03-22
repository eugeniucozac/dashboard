import React from 'react';
import { render } from 'tests';
import { Overflow } from './Overflow';
import { mockClasses } from 'setupMocks';

describe('COMPONENTS › Overflow', () => {
  it('renders without crashing', () => {
    render(<Overflow classes={mockClasses} />);
  });

  it('renders a single child components', () => {
    const { getByText } = render(
      <Overflow classes={mockClasses}>
        <span>foo</span>
      </Overflow>
    );

    expect(getByText(/foo/i)).toBeInTheDocument();
  });

  it('renders the styles in px if width,height are numbers', () => {
    const { container } = render(
      <Overflow classes={mockClasses} width={200} height={50}>
        <span>foo</span>
      </Overflow>
    );

    expect(container.firstChild.style.width).toEqual('200px');
    expect(container.firstChild.style.height).toEqual('50px');
  });

  it('renders the styles in % if width,height are strings', () => {
    const { container } = render(
      <Overflow classes={mockClasses} width="50%" height="20%">
        <span>foo</span>
      </Overflow>
    );

    expect(container.firstChild.style.width).toEqual('50%');
    expect(container.firstChild.style.height).toEqual('20%');
  });
});
