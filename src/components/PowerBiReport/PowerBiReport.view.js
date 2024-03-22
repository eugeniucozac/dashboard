import React from 'react';
import PropTypes from 'prop-types';

// app
import { Button } from 'components';
import styles from './PowerBiReport.styles';
import { useMedia } from 'hooks';

// mui
import { makeStyles } from '@material-ui/core';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FormSelect from 'components/FormSelect/FormSelect';

PowerBiReportView.propTypes = {
  reportExists: PropTypes.bool.isRequired,
  reports: PropTypes.array.isRequired,
  containerRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }).isRequired,
  setFullscreen: PropTypes.func.isRequired,
  onSelectReport: PropTypes.func.isRequired,
  selectedReport: PropTypes.object.isRequired,
};

export function PowerBiReportView({ reports, containerRef, setFullscreen, reportExists, onSelectReport, selectedReport }) {
  const media = useMedia();
  const classes = makeStyles(styles, { name: 'PowerBiReport' })({ reportExists, media });

  return (
    <div className={classes.root}>
      {reportExists && (
        <div className={classes.menu}>
          {reports.length > 1 && (
            <FormSelect
              nestedClasses={{ root: classes.select }}
              name="report"
              value={selectedReport.id}
              options={reports}
              margin="none"
              optionKey="id"
              size="sm"
              muiComponentProps={{
                fullWidth: false,
              }}
              handleUpdate={onSelectReport}
              testid="select-power-bi-report"
            />
          )}
          <Button size="small" onClick={setFullscreen} icon={FullscreenIcon} />
        </div>
      )}
      <div className={classes.powerbi} ref={containerRef} />
    </div>
  );
}

export default PowerBiReportView;
