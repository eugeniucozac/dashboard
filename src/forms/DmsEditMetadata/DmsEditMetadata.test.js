import React from 'react';
import { render, screen } from 'tests';
import DmsMetadataView from './DmsEditMetadata.view';

const props = {
  fields: [],
  control: {},
  errors: {},
  actions: [
    {
      name: 'secondary',
      label: 'cancel',
      handler: () => {},
    },
    {
      name: 'submit',
      label: 'save',
      handler: () => {},
    },
  ],
  reset: {},
  handleSubmit: () => {},
  formState: {},
  dmsContext: '',
  isDoc_Pending: false,
  docInfo: {},
  documentData: {},
  existedMetaData: {},
  isPaymentAllowed: false,
};
describe('FORMS › DmsMetadataView', () => {
  describe('@render', () => {
    it('renders without crashing', () => {
      // arrange
      const { container } = render(<DmsMetadataView {...props} />);

      // assert
      expect(container).toBeInTheDocument();
    });

    it('renders the form', () => {
      // arrange
      render(<DmsMetadataView {...props} />);

      // assert
      expect(screen.getByTestId('form-edit-meta-data')).toBeInTheDocument();
    });

    it('renders the form buttons', () => {
      // arrange
      render(<DmsMetadataView {...props} />);

      // assert
      expect(screen.queryByText('save')).toBeInTheDocument();
      expect(screen.queryByText('cancel')).toBeInTheDocument();
    });
  });
});
