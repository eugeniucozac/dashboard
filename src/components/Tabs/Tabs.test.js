import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent, within } from 'tests';
import Tabs from './Tabs';

describe('COMPONENTS › Tabs', () => {
  const tabs = [
    { value: 'foo', label: 'Tab Foo' },
    { value: 'bar', label: 'Tab Bar' },
  ];

  const tabsWithCount = [
    { value: 'one', label: 'Tab One', complete: 0, total: 0 },
    { value: 'two', label: 'Tab Two', complete: 0, total: 2 },
    { value: 'three', label: 'Tab Three', complete: 3, total: 8 },
    { value: 'four', label: 'Tab Four', complete: 'four', total: 8 },
    { value: 'five', label: 'Tab Five', complete: 3, total: null, errors: 0 },
    { value: 'six', label: 'Tab Six', complete: 3, errors: 1 },
    { value: 'seven', label: 'Tab Seven', total: 8, errors: 2 },
    { value: 'eight', label: 'Tab Eight', errors: 3 },
  ];

  it('renders nothing if not passed any props', () => {
    const { container } = render(<Tabs />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the tabs', () => {
    const { getByTestId, queryAllByTestId } = render(<Tabs tabs={tabs} />);
    const tabsElem = getByTestId('tabs');

    expect(queryAllByTestId('tabs-mui-item')).toHaveLength(2);
    expect(within(tabsElem).getByText('Tab Foo')).toBeInTheDocument();
    expect(within(tabsElem).getByText('Tab Bar')).toBeInTheDocument();
  });

  it('should select the first tab by default', () => {
    const { queryAllByTestId } = render(<Tabs tabs={tabs} />);
    expect(queryAllByTestId('tabs-mui-item')[0]).toHaveClass('Mui-selected');
  });

  it('should select the default tab', () => {
    const { queryAllByTestId } = render(<Tabs tabs={tabs} defaultTab="bar" />);
    expect(queryAllByTestId('tabs-mui-item')[1]).toHaveClass('Mui-selected');
  });

  it('renders the label & count values on the tabs', () => {
    const { queryAllByTestId } = render(<Tabs tabs={tabsWithCount} />);
    expect(queryAllByTestId('tabs-mui-item')[0]).toHaveTextContent('Tab One (0/0)');
    expect(queryAllByTestId('tabs-mui-item')[1]).toHaveTextContent('Tab Two (0/2)');
    expect(queryAllByTestId('tabs-mui-item')[2]).toHaveTextContent('Tab Three (3/8)');
    expect(queryAllByTestId('tabs-mui-item')[3]).toHaveTextContent('Tab Four');
    expect(queryAllByTestId('tabs-mui-item')[4]).toHaveTextContent('Tab Five');
    expect(queryAllByTestId('tabs-mui-item')[5]).toHaveTextContent('Tab Six');
    expect(queryAllByTestId('tabs-mui-item')[6]).toHaveTextContent('Tab Seven');
    expect(queryAllByTestId('tabs-mui-item')[7]).toHaveTextContent('Tab Eight');
  });

  it('renders the error svg icons on the tabs with errors', () => {
    const { queryAllByTestId } = render(<Tabs tabs={tabsWithCount} />);
    expect(queryAllByTestId('tabs-mui-item')[0].querySelector('svg')).toBeFalsy();
    expect(queryAllByTestId('tabs-mui-item')[1].querySelector('svg')).toBeFalsy();
    expect(queryAllByTestId('tabs-mui-item')[2].querySelector('svg')).toBeFalsy();
    expect(queryAllByTestId('tabs-mui-item')[3].querySelector('svg')).toBeFalsy();
    expect(queryAllByTestId('tabs-mui-item')[4].querySelector('svg')).toBeFalsy();
    expect(queryAllByTestId('tabs-mui-item')[5].querySelector('svg')).toBeTruthy();
    expect(queryAllByTestId('tabs-mui-item')[6].querySelector('svg')).toBeTruthy();
    expect(queryAllByTestId('tabs-mui-item')[7].querySelector('svg')).toBeTruthy();
  });

  it('renders a custom child component', () => {
    const { getByTestId } = render(
      <Tabs tabs={tabs}>
        <div data-testid="mock-component">mock component</div>
      </Tabs>
    );
    expect(getByTestId('mock-component')).toBeInTheDocument();
  });

  it('renders tab child component when given values', () => {
    const { getByTestId } = render(
      <Tabs tabs={tabs}>
        <div data-testid="mock-component-1" value="foo">
          mock component 1
        </div>
        <div data-testid="mock-component-2" value="bar">
          mock component 2
        </div>
        <div data-testid="mock-component-3" value="xyz">
          mock component 3
        </div>
      </Tabs>
    );

    expect(getByTestId('mock-component-1')).toBeInTheDocument();
    expect(getByTestId('mock-component-2')).toBeInTheDocument();
    expect(getByTestId('mock-component-3')).toBeInTheDocument();

    expect(getByTestId('mock-component-1')).toBeVisible();
    expect(getByTestId('mock-component-2')).not.toBeVisible();
    expect(getByTestId('mock-component-3')).not.toBeVisible();
  });

  it('should toggle tab content on tab click', () => {
    const { getByTestId, getByText, queryAllByTestId } = render(
      <Tabs tabs={tabs}>
        <div data-testid="mock-component-1" value="foo">
          mock component 1
        </div>
        <div data-testid="mock-component-2" value="bar">
          mock component 2
        </div>
        <div data-testid="mock-component-3" value="xyz">
          mock component 3
        </div>
      </Tabs>
    );

    expect(queryAllByTestId('tabs-mui-item')[0]).toHaveClass('Mui-selected');
    expect(queryAllByTestId('tabs-mui-item')[1]).not.toHaveClass('Mui-selected');
    expect(getByTestId('mock-component-1')).toBeVisible();
    expect(getByTestId('mock-component-2')).not.toBeVisible();
    expect(getByTestId('mock-component-3')).not.toBeVisible();

    fireEvent.click(getByText('Tab Bar'));

    expect(queryAllByTestId('tabs-mui-item')[0]).not.toHaveClass('Mui-selected');
    expect(queryAllByTestId('tabs-mui-item')[1]).toHaveClass('Mui-selected');
    expect(getByTestId('mock-component-1')).not.toBeVisible();
    expect(getByTestId('mock-component-2')).toBeVisible();
    expect(getByTestId('mock-component-3')).not.toBeVisible();
  });

  it('should render and behave the same when given swipeable props', () => {
    const { getByTestId, getByText, queryAllByTestId } = render(
      <Tabs tabs={tabs} swipeable defaultTab="bar">
        <div data-testid="mock-component-1" value="foo">
          mock component 1
        </div>
        <div data-testid="mock-component-2" value="bar">
          mock component 2
        </div>
      </Tabs>
    );

    expect(queryAllByTestId('tabs-mui-item')[1]).toHaveClass('Mui-selected');
    expect(getByTestId('mock-component-2')).toBeVisible();

    fireEvent.click(getByText('Tab Foo'));

    expect(queryAllByTestId('tabs-mui-item')[0]).toHaveClass('Mui-selected');
    expect(getByTestId('mock-component-1')).toBeVisible();
  });
});
