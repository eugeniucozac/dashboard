import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent } from 'tests';
import Empty from './Empty';
import { ReactComponent as IconSearchFile } from '../../assets/svg/line-icon-search-file.svg';
import AddIcon from '@material-ui/icons/Add';

describe('COMPONENTS › Empty', () => {
  it('renders nothing if not passed any props', () => {
    const { container } = render(<Empty />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the title', () => {
    const { container, getByText } = render(<Empty title="title" />);
    expect(container.querySelectorAll('h2')).toHaveLength(1);
    expect(getByText('title')).toBeInTheDocument();
  });

  it('renders the text', () => {
    const { container, getByText } = render(<Empty text="text" />);
    expect(container.querySelectorAll('p')).toHaveLength(1);
    expect(container.querySelector('p')).toHaveClass('MuiTypography-body2');
    expect(getByText('text')).toBeInTheDocument();
  });

  it('renders the icon', () => {
    const { container } = render(<Empty icon={<IconSearchFile />} />);
    expect(container.querySelectorAll('svg')).toHaveLength(1);
  });

  it('renders the link', () => {
    const { getByText } = render(<Empty title="title" link={{ text: 'link', url: 'foo' }} />);
    expect(getByText('link')).toBeInTheDocument();
    expect(getByText('link')).toHaveAttribute('href', '/foo');
  });

  it("doesn't render the link if missing text props", () => {
    const { queryByText } = render(<Empty title="title" link={{ url: 'foo' }} />);
    expect(queryByText('link')).not.toBeInTheDocument();
  });

  it("doesn't render the link if missing url props", () => {
    const { queryByText } = render(<Empty title="title" link={{ text: 'link' }} />);
    expect(queryByText('link')).not.toBeInTheDocument();
  });

  it('renders the button with only text', () => {
    const { container, getByText } = render(<Empty title="title" button={{ text: 'button', action: () => {} }} />);
    expect(getByText('button')).toBeInTheDocument();
    expect(container.querySelectorAll('svg')).toHaveLength(0);
  });

  it('renders the button with only an icon', () => {
    const { container, queryByText } = render(<Empty title="title" button={{ action: () => {}, icon: AddIcon }} />);
    expect(queryByText('button')).not.toBeInTheDocument();
    expect(container.querySelectorAll('svg')).toHaveLength(1);
  });

  it('renders the button with an icon and text', () => {
    const { container, getByText } = render(<Empty title="title" button={{ text: 'button', action: () => {}, icon: AddIcon }} />);
    expect(getByText('button')).toBeInTheDocument();
    expect(container.querySelectorAll('svg')).toHaveLength(1);
  });

  it('should trigger the button action on click', () => {
    const spyButtonAction = jest.fn();
    const { getByText } = render(<Empty title="title" button={{ text: 'button', action: spyButtonAction }} />);
    const btn = getByText('button');

    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    expect(spyButtonAction).toHaveBeenCalledTimes(1);
    fireEvent.click(btn);
    expect(spyButtonAction).toHaveBeenCalledTimes(2);
  });

  it("doesn't render the button if missing text and icon props", () => {
    const { queryByText } = render(<Empty title="title" button={{ action: 'foo' }} />);
    expect(queryByText('button')).not.toBeInTheDocument();
  });

  it("doesn't render the button if missing action props", () => {
    const { queryByText } = render(<Empty title="title" button={{ text: 'button' }} />);
    expect(queryByText('button')).not.toBeInTheDocument();
  });
});
