import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render } from 'tests';
import StatusIcon from './StatusIcon';

describe('COMPONENTS › StatusIcon', () => {
  const list = [
    { id: 1, code: 'foo', type: 'success' },
    { id: 2, code: 'bar', type: 'alert' },
    { id: 3, code: 'baz', type: 'error' },
  ];

  it('renders nothing if not passed any props', () => {
    render(<StatusIcon />);
  });

  it('render a for type `success`', () => {
    const props = {
      list,
      id: 1,
      translationPath: 'mockPath',
    };

    const { getByTitle } = render(<StatusIcon {...props} />);

    expect(getByTitle('mockPath.foo')).toBeInTheDocument();
  });

  it('render a for type `alert`', () => {
    const props = {
      list,
      id: 2,
      translationPath: 'mockPath',
    };

    const { getByTitle } = render(<StatusIcon {...props} />);

    expect(getByTitle('mockPath.bar')).toBeInTheDocument();
  });

  it('render a for type `error`', () => {
    const props = {
      list,
      id: 3,
      translationPath: 'mockPath',
    };

    const { getByTitle } = render(<StatusIcon {...props} />);

    expect(getByTitle('mockPath.baz')).toBeInTheDocument();
  });
});
