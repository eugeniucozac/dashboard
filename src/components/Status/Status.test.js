import React from 'react';
import { render } from 'tests';
import Status from './Status';

describe('COMPONENTS › Status', () => {
  it('renders without crashing', () => {
    // assert
    render(<Status />);
  });

  it('renders the text content', () => {
    // arrange
    const { getByText } = render(<Status text="foo" />);

    // assert
    expect(getByText('foo')).toBeInTheDocument();
  });

  it('renders UNKNOWN type', () => {
    const { getByTestId, rerender } = render(<Status text="foo" />);

    // assert
    expect(getByTestId('status-unknown')).toBeInTheDocument();

    rerender(<Status status="any-type-that-doesnt-match" />);
    expect(getByTestId('status-unknown')).toBeInTheDocument();

    rerender(<Status status="na" />);
    expect(getByTestId('status-unknown')).toBeInTheDocument();

    rerender(<Status status="notstarted" />);
    expect(getByTestId('status-unknown')).toBeInTheDocument();

    rerender(<Status status="open" />);
    expect(getByTestId('status-unknown')).toBeInTheDocument();

    rerender(<Status status="other" />);
    expect(getByTestId('status-unknown')).toBeInTheDocument();

    rerender(<Status status="unknown" />);
    expect(getByTestId('status-unknown')).toBeInTheDocument();
  });

  it('renders SUCCESS type', () => {
    const { getByTestId, rerender } = render(<Status status="success" text="foo" />);

    // assert
    expect(getByTestId('status-success')).toBeInTheDocument();

    rerender(<Status status="allbound" />);
    expect(getByTestId('status-success')).toBeInTheDocument();

    rerender(<Status status="approved" />);
    expect(getByTestId('status-success')).toBeInTheDocument();

    rerender(<Status status="bound" />);
    expect(getByTestId('status-success')).toBeInTheDocument();

    rerender(<Status status="done" />);
    expect(getByTestId('status-success')).toBeInTheDocument();

    rerender(<Status status="quoted" />);
    expect(getByTestId('status-success')).toBeInTheDocument();

    rerender(<Status status="signeddown" />);
    expect(getByTestId('status-success')).toBeInTheDocument();
  });

  it('renders ERROR type', () => {
    const { getByTestId, rerender } = render(<Status status="error" text="foo" />);

    // assert
    expect(getByTestId('status-error')).toBeInTheDocument();

    rerender(<Status status="autontu" />);
    expect(getByTestId('status-error')).toBeInTheDocument();

    rerender(<Status status="cancelled" />);
    expect(getByTestId('status-error')).toBeInTheDocument();

    rerender(<Status status="declined" />);
    expect(getByTestId('status-error')).toBeInTheDocument();

    rerender(<Status status="expired" />);
    expect(getByTestId('status-error')).toBeInTheDocument();

    rerender(<Status status="nottakenup" />);
    expect(getByTestId('status-error')).toBeInTheDocument();

    rerender(<Status status="ntu" />);
    expect(getByTestId('status-error')).toBeInTheDocument();
  });

  it('renders ALERT type', () => {
    const { getByTestId, rerender } = render(<Status status="alert" text="foo" />);

    // assert
    expect(getByTestId('status-alert')).toBeInTheDocument();

    rerender(<Status status="awaitingapproval" />);
    expect(getByTestId('status-alert')).toBeInTheDocument();

    rerender(<Status status="partbound" />);
    expect(getByTestId('status-alert')).toBeInTheDocument();

    rerender(<Status status="pending" />);
    expect(getByTestId('status-alert')).toBeInTheDocument();

    rerender(<Status status="referred" />);
    expect(getByTestId('status-alert')).toBeInTheDocument();

    rerender(<Status status="review" />);
    expect(getByTestId('status-alert')).toBeInTheDocument();

    rerender(<Status status="started" />);
    expect(getByTestId('status-alert')).toBeInTheDocument();
  });

  it('renders NEW type', () => {
    const { getByTestId, rerender } = render(<Status status="new" text="foo" />);

    // assert
    expect(getByTestId('status-new')).toBeInTheDocument();

    rerender(<Status status="enquiry" />);
    expect(getByTestId('status-new')).toBeInTheDocument();
  });

  it('renders INFO type', () => {
    const { getByTestId, rerender } = render(<Status status="info" text="foo" />);

    // assert
    expect(getByTestId('status-info')).toBeInTheDocument();

    rerender(<Status status="inprogress" />);
    expect(getByTestId('status-info')).toBeInTheDocument();
  });

  it('renders LIGHT type', () => {
    const { getByTestId } = render(<Status status="light" text="foo" />);

    // assert
    expect(getByTestId('status-light')).toBeInTheDocument();
  });
});
