import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import parse from 'autosuggest-highlight/parse';
import throttle from 'lodash/throttle';

import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';

import { makeStyles } from '@material-ui/core/styles';

import { Button } from 'components';

import { enqueueNotification, getRiskAddress, getDistanceToCoast } from 'stores';
import * as utils from 'utils';
import { RISK_LOCATIONS_ACCURACY } from 'consts';

function loadScript(src, position, id) {
  if (!position) {
    return;
  }

  const script = document.createElement('script');
  script.setAttribute('async', '');
  script.setAttribute('id', id);
  script.src = src;
  position.appendChild(script);
}

const autocompleteService = { current: null };

const useStyles = makeStyles((theme) => ({
  icon: {
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(2),
  },
  autocomplete: {
    width: 300,
  },
}));

export default function LocationAutocomplete({ handleAdd, componentRestrictions }) {
  const dispatch = useDispatch();
  const classes = useStyles();

  const [value, setValue] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);
  const [isAdding, setIsAdding] = useState(false);

  const loaded = useRef(false);

  if (typeof window !== 'undefined' && !loaded.current) {
    if (!document.querySelector('#google-maps')) {
      loadScript(
        'https://maps.googleapis.com/maps/api/js?key=AIzaSyBeX9Z1AmI5hFNx3FAfdodgyv34B7dy9CY&libraries=places',
        document.querySelector('head'),
        'google-maps'
      );
    }

    loaded.current = true;
  }

  const fetch = React.useMemo(
    () =>
      throttle((request, callback) => {
        autocompleteService.current.getPlacePredictions(request, callback);
      }, 200),
    []
  );

  React.useEffect(() => {
    let active = true;

    if (!autocompleteService.current && window.google) {
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
    }
    if (!autocompleteService.current) {
      return undefined;
    }

    fetch({ input: inputValue, componentRestrictions }, (results) => {
      if (active) {
        let newOptions = [];

        if (value) {
          newOptions = [value];
        }

        if (results) {
          newOptions = [...newOptions, ...results];
        }

        setOptions(newOptions);
      }
    });

    return () => {
      active = false;
    };
  }, [value, inputValue, fetch, componentRestrictions]);

  const getAddressDetails = async (address) => {
    const response = await dispatch(getRiskAddress(address));
    if (response?.accuracy !== 'ROOFTOP')
      if (!RISK_LOCATIONS_ACCURACY.includes(response?.accuracy)) return { error: 'NO_ACCURATE_RESULT', address };

    const location = { lng: response.lng, lat: response.lat };
    const distanceToCoastResult = await dispatch(getDistanceToCoast(location));
    const streetAddress = response?.streetNumber ? `${response.streetNumber} ${response?.streetAddress}` : `${response?.streetAddress}`;

    const result = {
      city: response?.city,
      zip: response?.zip,
      county: response?.county,
      state: response?.state,
      streetAddress,
      formattedAddress: response?.outputAddress,
      distanceToCoast: distanceToCoastResult?.distanceInMiles,
      distanceToCoastInitialValue: distanceToCoastResult?.distanceInMiles,
      latitude: response?.lat,
      longitude: response?.lng,
    };

    return result;
  };

  const handleAddAddress = async () => {
    setIsAdding(true);

    if (value?.description) {
      const result = await getAddressDetails(value.description);

      if (result?.error !== 'NO_ACCURATE_RESULT') {
        handleAdd(result);
      } else {
        dispatch(
          enqueueNotification(`${result?.address} ${utils.string.t('products.multiLocation.buildingError')}`, 'error', { delay: 6000 })
        );
      }
    }
    setIsAdding(false);
  };

  return (
    <>
      <Box mb={1}>
        <Autocomplete
          id="google-autocomplete"
          className={classes.autocomplete}
          getOptionLabel={(option) => (typeof option === 'string' ? option : option.description)}
          filterOptions={(x) => x}
          options={options}
          autoComplete
          includeInputInList
          filterSelectedOptions
          value={value}
          onChange={(event, newValue) => {
            setOptions(newValue ? [newValue, ...options] : options);
            setValue(newValue);
          }}
          onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label={utils.string.t('products.multiLocation.label')}
              placeholder={utils.string.t('products.multiLocation.placeholder')}
              variant="outlined"
              fullWidth
              onKeyPress={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  handleAddAddress();
                }
              }}
            />
          )}
          renderOption={(option) => {
            const matches = option.structured_formatting.main_text_matched_substrings;
            const parts = parse(
              option.structured_formatting.main_text,
              matches.map((match) => [match.offset, match.offset + match.length])
            );

            return (
              <Grid container alignItems="center">
                <Grid item>
                  <LocationOnIcon className={classes.icon} />
                </Grid>
                <Grid item xs>
                  {parts.map((part, index) => (
                    <span key={index} style={{ fontWeight: part.highlight ? 700 : 400 }}>
                      {part.text}
                    </span>
                  ))}

                  <Typography variant="body2" color="textSecondary">
                    {option.structured_formatting.secondary_text}
                  </Typography>
                </Grid>
              </Grid>
            );
          }}
        />
      </Box>
      <Box ml={2.5} mt={1}>
        <Button
          disabled={isAdding || !value}
          color="primary"
          size="small"
          icon={isAdding ? null : AddIcon}
          text={utils.string.t('app.addLocation')}
          onClick={() => handleAddAddress()}
        />
      </Box>
    </>
  );
}
