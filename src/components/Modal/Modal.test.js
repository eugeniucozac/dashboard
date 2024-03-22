import React from 'react';
import { render, screen, within } from 'tests';
import Modal from './Modal';
import { mockClasses } from 'setupMocks';
import userEvent from '@testing-library/user-event';

describe('COMPONENTS › Modal', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  const hideModal = jest.fn(() => {});

  const mockUiWithSomeProperties = [
    {
      visible: true,
      type: 'FOO',
      props: { children: <div>Children</div> },
      actions: [],
    },
  ];

  const cancelCallback = jest.fn(() => 'cancel');
  const okCallback = jest.fn(() => 'ok');
  const dummyCallback = jest.fn(() => 'dummy');

  const mockUiWithAllProps = [
    {
      visible: true,
      type: 'FOO',
      props: {
        title: 'title',
        hint: 'hint text',
        children: <div>Children</div>,
      },
      actions: [
        {
          type: 'cancel',
          label: 'app.cancel',
          callback: cancelCallback,
        },
        {
          type: 'ok',
          label: 'app.ok',
          variant: 'contained',
          color: 'primary',
          callback: okCallback,
        },
        {
          type: 'dummy',
          label: 'dummy',
          callback: dummyCallback,
        },
      ],
    },
  ];

  it('renders without crashing', () => {
    const { container } = render(<Modal uiModal={mockUiWithAllProps} classes={mockClasses} />);

    expect(container).toBeInTheDocument();
  });

  it('renders correctly with no props received', () => {
    render(<Modal classes={mockClasses} hideModal={jest.fn} />, {
      initialState: { ui: { modal: mockUiWithSomeProperties, fullScreen: true } },
    });
    expect(screen.getByTestId('modal-dialog')).toBeInTheDocument();
    expect(screen.queryByTestId('modal-title')).not.toBeInTheDocument();
    expect(screen.queryByTestId('modal-hint')).not.toBeInTheDocument();
    expect(screen.queryByTestId('modal-actions')).not.toBeInTheDocument();
  });

  it('renders correctly with all props', () => {
    render(<Modal classes={mockClasses} hideModal={hideModal} />, {
      initialState: { ui: { modal: mockUiWithAllProps, fullScreen: true } },
    });

    expect(screen.getByTestId('modal-dialog')).toBeInTheDocument();
    expect(screen.queryByTestId('modal-title')).toBeInTheDocument();
    expect(screen.queryByTestId('modal-hint')).toBeInTheDocument();
    const { getByText } = within(screen.getByTestId('modal-hint'));
    expect(getByText('hint text')).toBeInTheDocument();
    // expect(screen.queryByTestId('modal-actions')).toBeInTheDocument();
    // expect(screen.getAllByRole('button')).toHaveLength(4);
    expect(screen.queryByTestId('modal-close-button')).toBeInTheDocument();
    expect(screen.queryByTestId('modal-btn-cancel')).toBeInTheDocument();
    expect(screen.queryByTestId('modal-btn-ok')).toBeInTheDocument();
    expect(screen.queryByTestId('modal-btn-dummy')).toBeInTheDocument();

    userEvent.click(screen.getByTestId('modal-btn-dummy'));
    expect(dummyCallback.mock.calls.length).toBe(1);

    userEvent.click(screen.getByTestId('modal-btn-cancel'));
    expect(cancelCallback.mock.calls.length).toBe(1);
    expect(screen.queryByTestId('modal-dialog')).not.toBeInTheDocument();
  });

  it('close the modal when ok button is clicked', () => {
    render(<Modal classes={mockClasses} hideModal={hideModal} />, {
      initialState: { ui: { modal: mockUiWithAllProps, fullScreen: true } },
    });

    userEvent.click(screen.getByTestId('modal-btn-dummy'));
    expect(dummyCallback.mock.calls.length).toBe(1);

    userEvent.click(screen.getByTestId('modal-btn-ok'));
    expect(okCallback.mock.calls.length).toBe(1);
    expect(screen.queryByTestId('modal-dialog')).not.toBeInTheDocument();
  });
});
