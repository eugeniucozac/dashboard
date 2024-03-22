import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render } from 'tests';

// app
import PDFComments from './PDFComments';

describe('COMPONENTS › PDFComments', () => {
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
      date: '2017-12-22 13:23:38',
      message: 'Du orbi vestibulum, vel pretium iaculis, diam ese platea dictumst. Morbi vestibulum, velit id p. String ends here at 120',
      user: { firstName: '', lastName: null, emailId: null },
    },
    {
      id: '5',
      date: '2000-01-01 12:00:00',
      user: { firstName: 'not', lastName: 'valid', emailId: null },
    },
  ];

  const subjectivities = 'Morbi vesum, velit id pretium iaculis, diam erat fermenis, diam erat fermenis';

  it('renders without crashing', () => {
    const { container } = render(<PDFComments />);
    expect(container).toBeInTheDocument();
  });

  it('does not render comments or subjectivities', () => {
    const { queryByTestId, queryByText } = render(<PDFComments />);
    expect(queryByText('placement.sheet.comments')).not.toBeInTheDocument();
    expect(queryByTestId('pdf-comment-5')).toBeNull();
    expect(queryByText('placement.sheet.subjectivities')).not.toBeInTheDocument();
    expect(queryByTestId('pdf-subjectivities')).toBeNull();
  });

  it('renders comments correctly', () => {
    const { queryByTestId, getByText } = render(<PDFComments comments={comments} />);
    expect(getByText('placement.sheet.comments')).toBeInTheDocument();
    expect(queryByTestId('pdf-comment-0')).toHaveTextContent('lorem - John Smith, format.date(2019-01-28 08:48:34)');
    expect(queryByTestId('pdf-comment-1')).toHaveTextContent('ipsum - Robert, format.date(2018-12-24 17:04:44)');
    expect(queryByTestId('pdf-comment-2')).toHaveTextContent('sit - Simon, format.date(2018-09-12 08:25:12)');
    expect(queryByTestId('pdf-comment-3')).toHaveTextContent('dolor');
    expect(queryByTestId('pdf-comment-4')).toHaveTextContent(
      'Du orbi vestibulum, vel pretium iaculis, diam ese platea dictumst. Morbi vestibulum, velit id p. String ends here at 120'
    );
    expect(queryByTestId('pdf-comment-5')).toBeNull();
  });

  it('renders subjectivities correctly', () => {
    const { getByTestId, getByText } = render(<PDFComments subjectivities={subjectivities} />);
    expect(getByText('placement.sheet.subjectivities')).toBeInTheDocument();
    expect(getByTestId('pdf-subjectivities')).toHaveTextContent(
      'Morbi vesum, velit id pretium iaculis, diam erat fermenis, diam erat fermenis'
    );
  });
});
