import React from 'react';
import DmsVersionHistory from './DmsVersionHistory';
import { render, screen } from 'tests';

const props = {
  docData: {
    documentId: 123456789,
    documentName: 'filename.jpeg',
  },
};

const initialState = {
  dms: {
    view: {
      versionHistory: {
        items: [
          {
            id: 1,
            documentName: 'filename1.jpeg',
            documentVersion: '1.0',
            UserName: 'John Smith',
            createdDate: '2020',
          },
          {
            id: 2,
            documentName: 'filename2.jpeg',
            documentVersion: '2.0',
            UserName: 'Jane Smith',
            createdDate: '2021',
          },
        ],
      },
    },
  },
};

describe('COMPONENTS › DmsVersionHistory', () => {
  it('renders the table columns', () => {
    // arrange
    render(<DmsVersionHistory {...props} />);

    // assert
    expect(screen.getByText('dms.view.versionHistory.versionHeader')).toBeInTheDocument();
    expect(screen.getByText('dms.view.versionHistory.uploadedBy')).toBeInTheDocument();
  });

  it('renders the document filename', () => {
    // arrange
    render(<DmsVersionHistory {...props} />, { initialState });

    // assert
    expect(screen.getByText('dms.view.versionHistory.fileName')).toBeInTheDocument();
    expect(screen.getByText('filename.jpeg')).toBeInTheDocument();
  });

  it('renders the document attributes', () => {
    // arrange
    render(<DmsVersionHistory {...props} />, { initialState });

    // assert
    expect(screen.getByText('dms.view.versionHistory.versionCurrent')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('format.date(2021)')).toBeInTheDocument();

    expect(screen.getByText('dms.view.versionHistory.version')).toBeInTheDocument();
    expect(screen.getByText('John Smith')).toBeInTheDocument();
    expect(screen.getByText('format.date(2020)')).toBeInTheDocument();
  });
});
