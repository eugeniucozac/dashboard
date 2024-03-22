import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// app
import styles from './ChartZoomLevel.styles';
import * as utils from 'utils';
import { FormSelect, Link } from 'components';

// mui
import { makeStyles } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

ChartZoomLevelView.propTypes = {
  zoomOptions: PropTypes.array.isRequired,
  onLevelChange: PropTypes.func.isRequired,
  levelOverride: PropTypes.string,
  level: PropTypes.string.isRequired,
  disabled: PropTypes.bool.isRequired,
};

export function ChartZoomLevelView({ disabled, zoomOptions, onLevelChange, levelOverride, level }) {
  const classes = makeStyles(styles, { name: 'ChartZoomLevel' })();

  const rootClasses = {
    [classes.root]: true,
    [classes.disabled]: disabled,
  };

  return (
    <div className={classnames(rootClasses)}>
      <FormSelect
        muiComponentProps={{
          disabled,
        }}
        nestedClasses={{ root: classes.select }}
        name="zoomLevel"
        label={utils.string.t('chartZoomLevel.viewingLocationsBy')}
        value={levelOverride || level}
        options={zoomOptions}
        margin="none"
        optionKey="id"
        size="sm"
        handleUpdate={(name, id) => {
          const level = utils.map.getLevelOption(zoomOptions, id);
          if (level) {
            onLevelChange({ levelOverride: level.id });
          }
        }}
        testid="select-zoom-level"
      />
      {!!levelOverride && (
        <Link
          disabled={disabled}
          nestedClasses={{ link: classes.link }}
          icon={CloseIcon}
          text={utils.string.t('chartZoomLevel.resetOverride')}
          handleClick={() => onLevelChange({ resetLevelOverride: true })}
          color="secondary"
        />
      )}
      <div className={classes.label}>{utils.string.t('chartZoomLevel.zoomLevelLabel', { level })}</div>
    </div>
  );
}
