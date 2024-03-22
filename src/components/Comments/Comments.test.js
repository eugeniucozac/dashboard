import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import fetchMock from 'fetch-mock';
import { render, fireEvent } from 'tests';

// app
import Comments from './Comments';

describe('COMPONENTS › Comments', () => {
  const comments = [
    {
      id: '0',
      date: '2019-01-28 08:48:34',
      message: 'lorem',
      user: { firstName: 'John', lastName: 'Smith', emailId: 'js@domain.com' },
    },
    {
      id: '1',
      date: '2018-12-24 17:04:44',
      message: 'ipsum',
      user: { firstName: 'Robert', lastName: null, emailId: 'r@domain.com' },
    },
    {
      id: '2',
      date: '2018-09-12 08:25:12',
      message: 'sit',
      user: { firstName: null, lastName: 'Simon', emailId: 's@domain.com' },
    },
    {
      id: '3',
      date: '2018-05-10 08:45:25',
      message: 'dolor',
      user: { firstName: null, lastName: null, emailId: 'asapey9@domain.edu' },
    },
    {
      id: '4',
      date: '2018-05-10 08:45:25',
      message: 'amet',
      user: { firstName: 'Tom', lastName: 'Hardy', emailId: 'th@domain.com' },
    },
    {
      id: '5',
      date: '2017-12-22 13:23:38',
      message: 'Du orbi vestibulum, vel pretium iaculis, diam ese platea dictumst. Morbi vestibulum, velit id p. String ends here at 120',
      user: { firstName: '', lastName: null, emailId: null },
    },
    {
      id: '6',
      date: '2017-12-22 13:23:38',
      message:
        'Dese platea dictumst. Morbi vesum, velit id pretium iaculis, diam erat fermenis, diam erat fermenis, diam erat fermentum justo. String exceeds limit at 155',
      user: { firstName: 'Thomas', lastName: 'Burton', emailId: null },
    },
    {
      id: '7',
      message: 'not valid',
      user: { firstName: 'not', lastName: 'valid', emailId: null },
    },
    {
      id: '8',
      date: '2000-01-01 12:00:00',
      user: { firstName: 'not', lastName: 'valid', emailId: null },
    },
    {
      id: '9',
      date: '2000-01-01 12:00:00',
      message: 'not valid',
    },
  ];

  const initialState = {
    comment: {
      items: {
        foo: comments,
      },
    },
  };

  beforeEach(() => {
    fetchMock.get('*', {
      body: {
        status: 'success',
        data: [{ id: 1, message: 'foo bar', user: { id: 1, firstName: 'John' }, date: '2020-03-25' }],
      },
    });
  });

  afterEach(() => {
    fetchMock.restore();
  });

  it('renders without crashing', () => {
    const { container } = render(<Comments id="foo" />);
    expect(container).toBeInTheDocument();
  });

  it('renders nothing without required props', () => {
    const { container } = render(<Comments />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the correct number of comments', () => {
    const { queryByTestId } = render(<Comments id="foo" />, { initialState });
    expect(queryByTestId('info-comment-0')).toBeInTheDocument();
    expect(queryByTestId('info-comment-1')).toBeInTheDocument();
    expect(queryByTestId('info-comment-2')).toBeInTheDocument();
    expect(queryByTestId('info-comment-3')).toBeInTheDocument();
    expect(queryByTestId('info-comment-4')).toBeInTheDocument();
    expect(queryByTestId('info-comment-5')).toBeInTheDocument();
    expect(queryByTestId('info-comment-6')).toBeInTheDocument();
    expect(queryByTestId('info-comment-7')).toBeNull();
    expect(queryByTestId('info-comment-8')).toBeNull();
    expect(queryByTestId('info-comment-9')).toBeNull();
  });

  it('renders the name correctly', () => {
    const { getByTestId } = render(<Comments id="foo" />, { initialState });
    expect(getByTestId('info-comment-0-title')).toHaveTextContent('John');
    expect(getByTestId('info-comment-1-title')).toHaveTextContent('Robert');
    expect(getByTestId('info-comment-2-title')).toHaveTextContent('Simon');
    expect(getByTestId('info-comment-3-title')).toHaveTextContent('app.na');
    expect(getByTestId('info-comment-4-title')).toHaveTextContent('Tom');
    expect(getByTestId('info-comment-5-title')).toHaveTextContent('app.na');
    expect(getByTestId('info-comment-6-title')).toHaveTextContent('Thomas');
  });

  it('renders the avatar initials correctly', () => {
    const { getByTestId } = render(<Comments id="foo" />, { initialState });
    expect(getByTestId('info-comment-0').querySelector('[data-testid="avatar"]')).toHaveTextContent('JS');
    expect(getByTestId('info-comment-1').querySelector('[data-testid="avatar"]')).toHaveTextContent('R');
    expect(getByTestId('info-comment-2').querySelector('[data-testid="avatar"]')).toHaveTextContent('S');
    expect(getByTestId('info-comment-3').querySelector('[data-testid="avatar"]')).toHaveTextContent('A');
    expect(getByTestId('info-comment-4').querySelector('[data-testid="avatar"]')).toHaveTextContent('TH');
    expect(getByTestId('info-comment-5').querySelector('[data-testid="avatar"]')).toHaveTextContent('');
    expect(getByTestId('info-comment-6').querySelector('[data-testid="avatar"]')).toHaveTextContent('TB');
  });

  it('renders the message correctly', () => {
    const { getByTestId } = render(<Comments id="foo" />, { initialState });
    expect(getByTestId('info-comment-0-data')).toHaveTextContent(initialState.comment.items.foo[0].message);
    expect(getByTestId('info-comment-1-data')).toHaveTextContent(initialState.comment.items.foo[1].message);
    expect(getByTestId('info-comment-2-data')).toHaveTextContent(initialState.comment.items.foo[2].message);
    expect(getByTestId('info-comment-3-data')).toHaveTextContent(initialState.comment.items.foo[3].message);
    expect(getByTestId('info-comment-4-data')).toHaveTextContent(initialState.comment.items.foo[4].message);
    expect(getByTestId('info-comment-5-data')).toHaveTextContent(initialState.comment.items.foo[5].message);
    expect(getByTestId('info-comment-6-data')).toHaveTextContent(initialState.comment.items.foo[6].message);
  });

  it('truncates messages exceeding the maximum characters defined', () => {
    const { getByTestId } = render(<Comments id="foo" truncate={120} />, { initialState });
    expect(getByTestId('info-comment-0-data')).toHaveTextContent(initialState.comment.items.foo[0].message);
    expect(getByTestId('info-comment-1-data')).toHaveTextContent(initialState.comment.items.foo[1].message);
    expect(getByTestId('info-comment-2-data')).toHaveTextContent(initialState.comment.items.foo[2].message);
    expect(getByTestId('info-comment-3-data')).toHaveTextContent(initialState.comment.items.foo[3].message);
    expect(getByTestId('info-comment-4-data')).toHaveTextContent(initialState.comment.items.foo[4].message);
    expect(getByTestId('info-comment-5-data')).toHaveTextContent(initialState.comment.items.foo[5].message);
    expect(getByTestId('info-comment-6-data')).toHaveTextContent(
      `${initialState.comment.items.foo[6].message.slice(0, 100)}...app.seeMore`
    );
  });

  it('display the whole messages when user clicks "see more"', () => {
    const { getByTestId } = render(<Comments id="foo" truncate={120} />, { initialState });

    expect(getByTestId('info-comment-6-data')).toHaveTextContent(
      `${initialState.comment.items.foo[6].message.slice(0, 100)}...app.seeMore`
    );
    fireEvent.click(getByTestId('comment-expand-6'));
    expect(getByTestId('info-comment-6-data')).toHaveTextContent(initialState.comment.items.foo[6].message);
  });
});
