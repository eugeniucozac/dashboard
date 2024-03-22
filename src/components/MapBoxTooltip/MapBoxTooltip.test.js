import React from 'react';
import { render, within } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

// app
import MapBoxTooltip from './MapBoxTooltip';
import { Android, Apple } from '@material-ui/icons';

describe('COMPONENTS › MapBoxTooltip', () => {
  it('renders nothing if not passed any props', () => {
    const { container } = render(<MapBoxTooltip />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders only the title', () => {
    const { queryByTestId, getByTestId } = render(<MapBoxTooltip title="foo" />);
    expect(getByTestId('mapbox-tooltip-title')).toHaveTextContent('foo');
    expect(queryByTestId('mapbox-tooltip-text')).toBeNull();
    expect(queryByTestId('mapbox-tooltip-content')).toBeNull();
  });

  it('renders only the items text', () => {
    const { queryByTestId, queryAllByTestId } = render(<MapBoxTooltip list={[{ title: 'bar' }]} />);
    expect(queryByTestId('mapbox-tooltip-title')).toBeNull();
    expect(queryAllByTestId('mapbox-tooltip-item')).toHaveLength(1);
    expect(queryByTestId('mapbox-tooltip-content')).toBeNull();
  });

  it('renders multiple item elements', () => {
    const { queryAllByTestId } = render(<MapBoxTooltip list={[{ title: 'foo' }, { title: 'bar' }]} />);
    expect(queryAllByTestId('mapbox-tooltip-item')).toHaveLength(2);
  });

  it('renders item text and icon', () => {
    const { queryAllByTestId } = render(
      <MapBoxTooltip list={[{ title: 'Android', icon: <Android /> }, { title: 'Apple', icon: <Apple /> }, { title: 'Microsoft' }]} />
    );

    const android = queryAllByTestId('mapbox-tooltip-item')[0];
    const apple = queryAllByTestId('mapbox-tooltip-item')[1];
    const microsoft = queryAllByTestId('mapbox-tooltip-item')[2];

    expect(within(android).getByText('Android')).toBeInTheDocument();
    expect(within(apple).getByText('Apple')).toBeInTheDocument();
    expect(within(microsoft).getByText('Microsoft')).toBeInTheDocument();

    expect(android.querySelector('svg')).toBeInTheDocument();
    expect(apple.querySelector('svg')).toBeInTheDocument();
    expect(microsoft.querySelector('svg')).not.toBeInTheDocument();
  });

  it('should skip render of item missing title prop', () => {
    const { queryAllByTestId } = render(<MapBoxTooltip list={[{ title: 'foo' }, { oops: 'missing' }]} />);
    expect(queryAllByTestId('mapbox-tooltip-item')).toHaveLength(1);
  });

  it('renders only the children content', () => {
    const { queryByTestId, getByTestId } = render(
      <MapBoxTooltip>
        <span>content</span>
      </MapBoxTooltip>
    );
    expect(queryByTestId('mapbox-tooltip-title')).toBeNull();
    expect(queryByTestId('mapbox-tooltip-item')).toBeNull();
    expect(getByTestId('mapbox-tooltip-content')).toHaveTextContent('content');
  });

  it('renders everything if passed all props', () => {
    const { getByTestId, queryAllByTestId } = render(
      <MapBoxTooltip title="foo" list={[{ title: 'Android', icon: <Android /> }, { title: 'Apple' }]}>
        <span>content</span>
      </MapBoxTooltip>
    );

    const android = queryAllByTestId('mapbox-tooltip-item')[0];
    const apple = queryAllByTestId('mapbox-tooltip-item')[1];

    expect(getByTestId('mapbox-tooltip-title')).toHaveTextContent('foo');
    expect(getByTestId('mapbox-tooltip-content')).toHaveTextContent('content');

    expect(queryAllByTestId('mapbox-tooltip-item')).toHaveLength(2);
    expect(within(android).getByText('Android')).toBeInTheDocument();
    expect(within(apple).getByText('Apple')).toBeInTheDocument();
    expect(android.querySelector('svg')).toBeInTheDocument();
    expect(apple.querySelector('svg')).not.toBeInTheDocument();
  });
});
