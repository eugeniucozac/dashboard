import React from 'react';
import { render } from 'tests';
import Breadcrumb from './Breadcrumb';

describe('COMPONENTS › Breadcrumb', () => {
  it('renders without crashing', () => {
    // assert
    render(<Breadcrumb />);
  });

  it('renders nothing if no links are defined', () => {
    // arrange
    const { container } = render(<Breadcrumb />);

    // assert
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the correct number of links', () => {
    // arrange
    const { container } = render(
      <Breadcrumb
        links={[
          { name: 'a', label: 'Aaa', link: '/a' },
          { name: 'b', label: 'Bbb', link: '/b' },
          { name: 'c', label: 'Ccc', link: '/c' },
        ]}
      />
    );

    // assert
    expect(container.querySelectorAll('li')).toHaveLength(3);
  });

  it('renders the links labels', () => {
    // arrange
    const { queryByText, getByText } = render(
      <Breadcrumb
        links={[
          { name: 'a', label: 'Aaa', link: '/a' },
          { name: 'b', label: 'Bbb', link: '/b' },
        ]}
      />
    );

    // assert
    expect(getByText('Aaa')).toBeInTheDocument();
    expect(getByText('Bbb')).toBeInTheDocument();
    expect(queryByText('Ccc')).not.toBeInTheDocument();
  });

  it('renders the links href', () => {
    // arrange
    const { queryByText, getByText } = render(
      <Breadcrumb
        links={[
          { name: 'a', label: 'Aaa', link: '/a' },
          { name: 'b', label: 'Bbb', link: '/b' },
          { name: 'c', label: 'Ccc', link: '/c/foo' },
        ]}
      />
    );

    // assert
    expect(getByText('Aaa')).toHaveAttribute('href', '/a');
    expect(getByText('Bbb')).toHaveAttribute('href', '/b');
    expect(queryByText('Ccc')).toHaveAttribute('href', '/c/foo');
  });
});
