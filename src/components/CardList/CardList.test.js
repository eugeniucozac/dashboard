import React from 'react';
import { render } from 'tests';
import CardList from './CardList';

describe('COMPONENTS › CardList', () => {
  it('renders without crashing', () => {
    // arrange
    const { container } = render(<CardList />);

    // assert
    expect(container).toBeInTheDocument();
  });

  it('renders nothing if not given array of cards', () => {
    // arrange
    const { container } = render(<CardList />);

    // assert
    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing if cards don't have required data", () => {
    // arrange
    const cards = [{ id: 1 }, { id: 2, foo: 'bar' }];
    const { container } = render(<CardList data={cards} />);

    // assert
    expect(container).toBeEmptyDOMElement();
  });

  it('renders a Tabs/Cards component if it has valid data', () => {
    // arrange
    const cards = [
      { id: 1, title: 'title 1' },
      { id: 2, subheader: 'subheader 2' },
      { id: 3, text: 'text 3' },
      { id: 4, children: <span>children 4</span> },
      { id: 5, content: 'content 5' }, // not valid
      { id: 6, other: 'other 6' }, // not valid
    ];
    const { getByTestId, getByText, queryByText } = render(<CardList data={cards} />);

    // assert
    expect(getByTestId('cardlist')).toBeInTheDocument();
    expect(getByText('title 1')).toBeInTheDocument();
    expect(getByText('subheader 2')).toBeInTheDocument();
    expect(getByText('text 3')).toBeInTheDocument();
    expect(getByText('children 4')).toBeInTheDocument();
    expect(queryByText('content 5')).not.toBeInTheDocument();
    expect(queryByText('other 6')).not.toBeInTheDocument();
  });
});
