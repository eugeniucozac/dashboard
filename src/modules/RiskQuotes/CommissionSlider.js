/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// app
import { FormGrid, Restricted } from 'components';
import { ROLE_BROKER, ROLE_COBROKER } from 'consts';
import * as utils from 'utils';

// mui
import { makeStyles, Typography, Slider, Input } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  title: {
    color: `${theme.palette.neutral.darker}!important`,
    marginBottom: 5,
  },
  ratioTitle: {
    color: `${theme.palette.neutral.darker}!important`,
    display: 'inline-block',
  },
  boldTitle: {
    color: `${theme.palette.neutral.darker}!important`,
    fontWeight: 600,
  },
  brokerCommission: {
    color: `${theme.palette.neutral.darker}!important`,
    marginBottom: 5,
    textAlign: 'center',
  },
  sliderGrid: {
    '&.MuiGrid-item': {
      paddingTop: 6,
      paddingBottom: 6,
    },
    '& .MuiSlider-mark': {
      backgroundColor: 'currentColor',
      height: 8,
      width: 1,
      '&.MuiSlider-markActive': {
        opacity: 1,
        height: 12,
        backgroundColor: 'currentColor',
      },
    },
    '& .MuiSlider-markLabel': {
      fontSize: 12,
      '&.MuiSlider-markActive': {
        opacity: 1,
        backgroundColor: 'currentColor',
      },
    },
  },

  input: {
    maxWidth: '50px',
    textAlign: 'center',
    '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0,
    },
  },
}));

const CommissionSlider = ({
  defaultClientCommission,
  defaultBrokerCommission,
  netDownClientCommission,
  commissionRatioClient,
  handleChangedValues,
  isSliderDisabled,
}) => {
  const classes = useStyles();
  const [commissionValues, setCommissionValues] = useState({
    netDownClientCommissionValue: netDownClientCommission,
    commissionRatioClientValue: commissionRatioClient,
    brokerCommissionValue: defaultClientCommission + defaultBrokerCommission - commissionRatioClient,
  });

  const maxCommission = defaultClientCommission;
  const defaultMaxCommission = defaultClientCommission + defaultBrokerCommission;

  useEffect(() => {
    const commission = {
      commissionRatioClient: commissionValues.commissionRatioClientValue,
      netDownClientCommission: commissionValues.netDownClientCommissionValue,
    };
    if (
      commissionValues.netDownClientCommissionValue !== netDownClientCommission ||
      commissionValues.commissionRatioClientValue !== commissionRatioClient
    ) {
      handleChangedValues(commission, true);
    } else handleChangedValues(commission, false);
  }, [commissionValues]);

  const handleNetDownClientUpdate = (commission) => {
    if (commission > maxCommission) {
      handleCommissionRatioUpdate(maxCommission);
    }
    const commissionUpdate = commission >= 0 ? commission : 0;

    setCommissionValues((prevState) => {
      return {
        ...prevState,
        netDownClientCommissionValue: commissionUpdate,
      };
    });
  };

  const handleNetDownClientSliderChange = (event, newValue) => {
    handleNetDownClientUpdate(newValue);
  };

  const handleNetDownClientInputChange = (event) => {
    const newValue =
      event.target.value === ''
        ? 0
        : Number(event.target.value) > commissionValues.commissionRatioClientValue
        ? commissionValues.commissionRatioClientValue
        : Number(event.target.value);
    handleNetDownClientUpdate(newValue);
  };

  const handleNetDownClientBlur = () => {
    if (commissionValues.netDownClientCommissionValue < 0) {
      handleNetDownClientUpdate(0);
    } else if (commissionValues.netDownClientCommissionValue > commissionValues.commissionRatioClientValue) {
      handleNetDownClientUpdate(commissionValues.commissionRatioClientValue);
    }
  };

  const handleCommissionRatioUpdate = (commission) => {
    let commissionUpdate = 0;
    if (commission >= 0 && commission <= maxCommission) {
      commissionUpdate = commission;
    } else commissionUpdate = maxCommission;

    setCommissionValues(() => {
      return {
        commissionRatioClientValue: commissionUpdate,
        netDownClientCommissionValue: commissionUpdate,
        brokerCommissionValue: defaultMaxCommission - commissionUpdate,
      };
    });
  };

  const handleCommissionRatioClientChange = (event, newValue) => {
    handleCommissionRatioUpdate(newValue);
  };

  const handleCommissionRatioInputChange = (event) => {
    const newValue =
      event.target.value === '' ? 0 : Number(event.target.value) > maxCommission ? maxCommission : Number(event.target.value);
    handleCommissionRatioUpdate(newValue);
  };

  const handleCommissionRatioBlur = () => {
    if (commissionValues.commissionRatioClientValue < 0) {
      handleCommissionRatioUpdate(0);
    } else if (commissionValues.commissionRatioClientValue > maxCommission) {
      handleCommissionRatioUpdate(maxCommission);
    }
  };

  const ratioMarks = [{ value: maxCommission, label: maxCommission }];

  return (
    <FormGrid data-testid="commission" container spacing={1}>
      <Restricted include={[ROLE_BROKER]}>
        <FormGrid item xs={12}>
          <Typography data-testid="commission-ratio-title" variant="body2" className={classes.boldTitle}>
            {utils.string.t('products.commissionRatio')}
          </Typography>
        </FormGrid>
        <FormGrid item xs={12} style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" className={classes.ratioTitle}>
            {utils.string.t('products.clientLabel')}
          </Typography>
          <Typography variant="body2" className={classes.ratioTitle}>
            {utils.string.t('products.brokerLabel')}
          </Typography>
        </FormGrid>
        <FormGrid item xs={12}>
          <FormGrid container spacing={2} alignItems="center">
            <FormGrid item xs={2}>
              <Input
                className={classes.input}
                value={commissionValues.commissionRatioClientValue}
                margin="dense"
                onChange={handleCommissionRatioInputChange}
                onBlur={handleCommissionRatioBlur}
                disabled={isSliderDisabled}
                data-testid="commissionRatio-input-slider"
                inputProps={{
                  step: 0.5,
                  min: 0,
                  max: defaultMaxCommission,
                  type: 'number',
                  'aria-label': 'commissionRatio-input-slider',
                  className: classes.input,
                }}
              />
            </FormGrid>
            <FormGrid item xs={8} classes={{ root: classes.sliderGrid }}>
              <Slider
                value={typeof commissionValues.commissionRatioClientValue === 'number' ? commissionValues.commissionRatioClientValue : 0}
                onChange={handleCommissionRatioClientChange}
                onChangeCommitted={handleCommissionRatioClientChange}
                aria-label="commissionRatio-slider"
                color="secondary"
                max={defaultMaxCommission}
                min={0}
                step={0.5}
                disabled={isSliderDisabled}
                marks={ratioMarks}
                data-testid="commissionRatio-slider"
              />
            </FormGrid>
            <FormGrid item xs={2}>
              <Typography variant="body2" className={classes.brokerCommission}>
                {`${commissionValues.brokerCommissionValue}`}
              </Typography>
            </FormGrid>
          </FormGrid>
        </FormGrid>
      </Restricted>

      <Restricted include={[ROLE_BROKER, ROLE_COBROKER]}>
        <FormGrid item xs={12}>
          <Typography data-testid="commission-title" variant="body2" className={classes.boldTitle}>
            {utils.string.t('products.netdown')}
          </Typography>
        </FormGrid>
        <FormGrid item xs={12}>
          <FormGrid container spacing={2} alignItems="center">
            <FormGrid item xs={2}>
              <Typography variant="body2" className={classes.title}>
                {utils.string.t('products.clientLabel')}
              </Typography>
            </FormGrid>

            <FormGrid item xs={8} classes={{ root: classes.sliderGrid }}>
              <Slider
                value={
                  typeof commissionValues.netDownClientCommissionValue === 'number' ? commissionValues.netDownClientCommissionValue : 0
                }
                onChange={handleNetDownClientSliderChange}
                aria-label="netDownClientCommission-slider"
                max={commissionValues.commissionRatioClientValue}
                color="secondary"
                min={0}
                step={0.5}
                disabled={isSliderDisabled}
                data-testid="netDownClientCommission-slider"
              />
            </FormGrid>
            <FormGrid item xs={2}>
              <Input
                className={classes.input}
                value={commissionValues.netDownClientCommissionValue}
                margin="dense"
                onChange={handleNetDownClientInputChange}
                onBlur={handleNetDownClientBlur}
                disabled={isSliderDisabled}
                data-testid="netDownClientCommission-input-slider"
                inputProps={{
                  step: '0.5',
                  min: 0,
                  max: commissionValues.commissionRatioClientValue,
                  type: 'number',
                  'aria-label': 'netDownClientCommission-input-slider',
                  className: classes.input,
                }}
              />
            </FormGrid>
          </FormGrid>
        </FormGrid>
      </Restricted>
    </FormGrid>
  );
};

CommissionSlider.propTypes = {
  commissionRatioClient: PropTypes.number.isRequired,
  netDownClientCommission: PropTypes.number.isRequired,
  isSliderDisabled: PropTypes.bool.isRequired,
};

export default CommissionSlider;
