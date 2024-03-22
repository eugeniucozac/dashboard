import React from 'react';
import PropTypes from 'prop-types';

// app
import { Form, Loader } from 'components';
import * as utils from 'utils';

// mui
import { Fade, Collapse } from '@material-ui/core';

CreateInWhitespaceView.propTypes = {
  fields: PropTypes.array.isRequired,
  actions: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
};

export function CreateInWhitespaceView({ fields, actions, loading }) {
  return (
    <div>
      <Fade in={!loading}>
        <div>
          <Collapse in={!loading}>
            <Form
              id="create-in-whitespace"
              type="dialog"
              fields={fields}
              actions={actions}
              validationSchema={utils.form.getValidationSchema(fields)}
              defaultValues={utils.form.getInitialValues(fields)}
            />
          </Collapse>
        </div>
      </Fade>
      <Loader visible={loading} absolute />
    </div>
  );
}
