import React from 'react';
import PropTypes from 'prop-types';

// app
import styles from './DownloadBordereaux.styles';
import { Empty, Form, Loader } from 'components';
import * as utils from 'utils';

// mui
import { makeStyles, Fade, Collapse, LinearProgress } from '@material-ui/core';
import { ReactComponent as Loading } from '../../assets/svg/loading.svg';

DownloadBordereauxView.propTypes = {
  fields: PropTypes.array.isRequired,
  actions: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
};

export function DownloadBordereauxView({ fields, actions, loading, download }) {
  const classes = makeStyles(styles, { name: 'DownloadBordereaux' })();

  return (
    <div className={classes.root}>
      {download?.started ? (
        <div>
          <LinearProgress />
          <Empty
            width={400}
            title={utils.string.t('products.downloadInProgress')}
            text="Depending on the request, this may take some time"
            icon={<Loading />}
            padding
          />
        </div>
      ) : (
        <>
          {loading ? (
            <div>
              <LinearProgress />
              <Empty width={400} padding />
            </div>
          ) : (
            <Fade in={!loading}>
              <div>
                <Collapse in={!loading}>
                  <Form
                    id="download-bordereaux"
                    type="dialog"
                    fields={fields}
                    actions={actions}
                    validationSchema={utils.form.getValidationSchema(fields)}
                    defaultValues={utils.form.getInitialValues(fields)}
                  />
                </Collapse>
              </div>
            </Fade>
          )}
        </>
      )}

      <Loader visible={loading} absolute />
    </div>
  );
}
