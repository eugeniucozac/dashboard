import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { firstBy } from 'thenby';
import * as Yup from 'yup';
import get from 'lodash/get';
import compact from 'lodash/compact';
import isNumber from 'lodash/isNumber';
import truncate from 'lodash/truncate';

// app
import styles from './EditPlacementMarketsLayers.styles';
import {
  editPlacementMarketsLayers,
  filterReferenceDataBusinessTypes,
  selectPlacementLayers,
  selectPlacementMarkets,
  selectRefDataDepartments,
  selectRefDataStatusesMarketQuote,
  selectRefDataStatusIdByCode,
  selectRefDataRationales,
  selectRefDataDeclinatures,
  showModal,
} from 'stores';
import { EditPlacementMarketsLayersView } from './EditPlacementMarketsLayers.view';
import { Avatar } from 'components';
import * as constants from 'consts';
import { useMedia } from 'hooks';
import * as utils from 'utils';

// mui
import { makeStyles } from '@material-ui/core';
import { createFilterOptions } from '@material-ui/lab/Autocomplete';

EditPlacementMarketsLayers.propTypes = {
  placementMarket: PropTypes.object.isRequired,
  placementLayer: PropTypes.object,
  handleClose: PropTypes.func.isRequired,
};

export default function EditPlacementMarketsLayers({ handleClose, placementMarket = {}, placementLayer }) {
  const classes = makeStyles(styles, { name: 'EditPlacementMarketsLayers' })();

  const media = useMedia();
  const dispatch = useDispatch();

  const initialRender = useRef(true);
  const initialRenderLayer = useRef(true);
  const placementLayers = useSelector(selectPlacementLayers);
  const placementMarkets = useSelector(selectPlacementMarkets);
  const refDataDepartments = useSelector(selectRefDataDepartments);
  const refDataRationales = useSelector(selectRefDataRationales);
  const refDataDeclinatures = useSelector(selectRefDataDeclinatures);
  const refDataStatusesMarketQuote = useSelector(selectRefDataStatusesMarketQuote);
  const statusQuotedId = useSelector(selectRefDataStatusIdByCode('market', constants.STATUS_MARKET_QUOTED));
  const statusDeclinedId = useSelector(selectRefDataStatusIdByCode('market', constants.STATUS_MARKET_DECLINED));

  const isStatusDeclined = (status) => {
    return status === statusDeclinedId;
  };

  const isStatusQuoted = (status) => {
    return status === statusQuotedId;
  };

  const [uuid, setUuid] = useState('');
  const [selectedMarket, setSelectedMarket] = useState(placementMarket);

  const getLayerOptions = (layers, currentMarket) => {
    const isMarketInLayer = (layer) => {
      const market = get(layer, 'markets', []).find((m) => m.market?.id === currentMarket?.market?.id);

      return market ? { statusId: market.statusId, isMarketInLayer: true } : { statusId: null, isMarketInLayer: false };
    };

    const layersOrdered = utils.layers.orderLayers(layers);

    return layersOrdered
      .map((layer) => {
        const businessTypes = utils.referenceData.departments.getBusinessTypes(refDataDepartments, layer.departmentId);
        const businessTypeName = utils.referenceData.businessTypes.getNameById(businessTypes, layer.businessTypeId);
        const layerName = utils.layer.getName(layer);
        const layerNotes = layer.notes ? truncate(layer.notes, { length: 15 }) : '';

        return {
          id: layer.id,
          label: compact([businessTypeName, layerName]).join(' - '),
          businessTypeId: layer.businessTypeId,
          notes: layerNotes,
          ...isMarketInLayer(layer),
        };
      })
      .sort(
        firstBy(utils.sort.array('customSort', 'statusId', 'DESC', true, constants.MARKETS_STATUS_ID_ORDER)).thenBy(
          utils.sort.array('lexical', 'label')
        )
      );
  };

  const underwriterOptions = get(selectedMarket, 'availableUnderwriters', [])
    .map((uw) => ({
      id: uw.id,
      label: utils.user.fullname(uw),
    }))
    .sort(firstBy(utils.sort.array('lexical', 'label')));

  const getMarketOptions = () => {
    return placementMarkets
      .map((market) => ({
        id: market.id,
        label: utils.market.getName(market),
      }))
      .sort(firstBy(utils.sort.array('lexical', 'label')));
  };

  const getUmrOptions = () => {
    const umrSet = new Set();

    if (utils.generic.isValidArray(placementLayers)) {
      placementLayers.forEach((layer) => {
        if (utils.generic.isValidArray(layer.markets)) {
          layer.markets.forEach((market) => {
            const umr = market.uniqueMarketReference;

            if (umr) {
              umrSet.add(market.uniqueMarketReference);
            }
          });
        }
      });
    }

    return [...umrSet].sort().map((umr) => ({ id: umr, label: umr }));
  };

  const getPremiumOptions = () => {
    const premiumSet = new Set();

    if (utils.generic.isValidArray(placementLayers)) {
      placementLayers.forEach((layer) => {
        if (utils.generic.isValidArray(layer.markets)) {
          layer.markets.forEach((market) => {
            const premium = market.premium;

            if (premium) {
              premiumSet.add(market.premium);
            }
          });
        }
      });
    }

    return [...premiumSet]
      .sort((a, b) => a && a - b)
      .map((premium) => {
        return { id: premium, label: premium };
      });
  };

  const marketOptions = getMarketOptions(placementMarkets);
  const layerOptions = getLayerOptions(placementLayers, selectedMarket);
  const hasLayers = layerOptions?.length > 0 ? true : false;
  const umrOptions = getUmrOptions();
  const premiumOptions = getPremiumOptions();

  const firstLayer = layerOptions.find((l) => l.statusId !== null) || null;

  const [selectedLayer, setSelectedLayer] = useState(
    placementLayer ? placementLayer : firstLayer?.id ? utils.placement.layer.getById(placementLayers, firstLayer?.id) : null
  );

  const [selectedLayerMarket, setSelectedLayerMarket] = useState(utils.layer.getMarketById(selectedLayer, selectedMarket?.market?.id));

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
    } else {
      const newLayer = placementLayers[placementLayers.length - 1];
      setSelectedLayer(newLayer);
      setSelectedLayerMarket(utils.layer.getMarketById(newLayer, selectedMarket?.market?.id));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placementLayers]);

  const resetLayer = () => {
    setUuid(new Date().getTime());
  };

  const handleFormSubmit = (data, dirtyFields) => {
    const selectedMarketId = selectedMarket?.market?.id;

    return dispatch(editPlacementMarketsLayers(data, selectedMarketId, dirtyFields, false)).then((responsesObj) => {
      const newSelectedMarket = responsesObj.market || selectedMarket;
      const newSelectedLayer = utils.placement.layer.getById(placementLayers, data?.layer?.id);

      if (responsesObj.market) {
        setSelectedMarket(newSelectedMarket);
      }

      if (responsesObj.layerMarket) {
        setSelectedLayer(newSelectedLayer);
        setSelectedLayerMarket(utils.layer.getMarketById(newSelectedLayer, newSelectedMarket?.market?.id));
      }

      // after form submit, get new uuid to force form re-initialization
      setUuid(new Date().getTime());
    });
  };

  const handleSubmitAndClose = (data, dirtyFields) => {
    const selectedMarketId = selectedMarket?.market?.id;

    return dispatch(editPlacementMarketsLayers(data, selectedMarketId, dirtyFields, true));
  };

  const handleFormClose = () => {
    if (utils.generic.isFunction(handleClose)) {
      handleClose();
    }
  };

  const handleFormReset = (reset) => () => {
    if (utils.generic.isFunction(reset)) {
      reset();
      setUuid(new Date().getTime());
    }
  };

  const isLayerMarketFormDirty = (form) => {
    return (
      form.layerMarket_isLeader ||
      form.layerMarket_lineToStand ||
      !!form.layerMarket_premium ||
      form.layerMarket_premium === 0 ||
      !!form.layerMarket_writtenLinePercentage ||
      form.layerMarket_writtenLinePercentage === 0 ||
      !!form.layerMarket_subjectivities ||
      !!form.layerMarket_validUntilDate
    );
  };

  const isLayerMarketFormDisabled = !Boolean(selectedLayer?.id);

  const isLayerMarketAmountRequired = (form, value) => {
    if (isNumber(value)) return true;
    return !form.layerMarket_statusId || form.layerMarket_statusId.toString() !== statusQuotedId.toString();
  };

  const renderOption = (option) => {
    return (
      <div className={classes.layerName}>
        <span>{option.label}</span>
        {option.notes ? <span className={classes.notes}>{option.notes}</span> : ''}
        {option?.statusId ? (
          <>
            <Avatar
              classes={{
                root: classes.marketStatus,
              }}
              text=" "
              size={10}
              bg={constants.MARKET_COLORS[option.statusId]}
              title={option.name}
            />
          </>
        ) : null}
      </div>
    );
  };

  const getOptionLabel = (option) => {
    return compact([option.label, option.notes]).join(' - ');
  };

  const formatPremiumOption = (option) => utils.number.formatNumber(option.label);

  useEffect(() => {
    if (initialRenderLayer.current) {
      initialRenderLayer.current = false;
    } else {
      const firstLayer = layerOptions.find((l) => l.statusId !== null) || null;
      const newSelectedLayer = firstLayer ? utils.placement.layer.getById(placementLayers, firstLayer?.id) : null;
      const newSelectedLayerMarket = utils.layer.getMarketById(newSelectedLayer, selectedMarket?.market?.id);

      setSelectedLayer(newSelectedLayer);
      setSelectedLayerMarket(newSelectedLayerMarket);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMarket]);

  const marketFields = [
    {
      name: 'market',
      type: 'autocompletemui',
      label: utils.string.t('placement.marketing.fields.market'),
      value: marketOptions.find((market) => market.id === selectedMarket.id),
      options: marketOptions,
      optionKey: 'id',
      optionLabel: 'label',
      muiComponentProps: {
        disableClearable: true,
        autoFocus: true,
      },
      callback: (event, data) => {
        const marketId = data?.id;
        const newSelectedMarket = placementMarkets.find((m) => m.id === marketId);

        if (marketId) {
          setSelectedMarket(newSelectedMarket);
        }
      },
      validation: Yup.object()
        .nullable()
        .required(() => utils.form.getValidationLabel('placement.marketing.fields.market', 'required')),
    },
    {
      name: 'market_statusId',
      type: 'select',
      label: utils.string.t('placement.marketing.fields.status'),
      value: selectedMarket.statusId || '',
      options: refDataStatusesMarketQuote,
      optionKey: 'id',
      optionLabel: 'code',
      nestedClasses: {
        root: classes.status,
      },
    },
    {
      name: 'market_rationales',
      type: 'autocompletemui',
      label: utils.string.t('placement.marketing.fields.rationales'),
      value: selectedMarket.rationales || [],
      options: refDataRationales,
      optionKey: 'id',
      optionLabel: 'description',
      muiComponentProps: {
        multiple: true,
      },
    },
    {
      name: 'market_declinatures',
      type: 'autocompletemui',
      label: utils.string.t('placement.marketing.fields.declinatures'),
      value: selectedMarket.declinatures || [],
      options: refDataDeclinatures,
      optionKey: 'id',
      optionLabel: 'description',
      muiComponentProps: {
        multiple: true,
      },
    },
    {
      name: 'market_underwriter',
      type: 'autocompletemui',
      label: utils.string.t('placement.marketing.fields.underwriter'),
      value: underwriterOptions.find((uw) => uw.id === selectedMarket?.underwriter?.id),
      options: underwriterOptions,
      optionKey: 'id',
      optionLabel: 'label',
      muiComponentProps: {
        disabled: utils.generic.isInvalidOrEmptyArray(underwriterOptions),
      },
    },
    {
      name: 'market_notes',
      label: utils.string.t('placement.marketing.fields.notes'),
      type: 'textarea',
      value: selectedMarket.notes || '',
      muiComponentProps: {
        multiline: true,
        minRows: 5,
        maxRows: 8,
      },
      validation: Yup.string().max(280),
    },
  ];

  const layerMarketFields = [
    {
      name: 'layer',
      type: 'autocompletemui',
      label: utils.string.t('placement.marketing.fields.layer'),
      value: selectedLayer ? layerOptions.find((l) => l.id === selectedLayer.id) : layerOptions.find((l) => l.statusId !== null) || null,
      options: hasLayers ? [...layerOptions, { id: 0, label: `+ ${utils.string.t('placement.marketing.addLayer')}` }] : [],
      muiComponentProps: {
        disableClearable: true,
        disabled: isLayerMarketFormDisabled,
        getOptionLabel,
        renderOption,
      },
      callback: (event, data) => {
        const layerId = data?.id;
        if (layerId === 0) {
          handleAddLayerClick();
          setSelectedLayer(utils.placement.layer.getById(placementLayers, get(getLayerOptions(placementLayers, selectedMarket), '[0].id')));
        } else {
          const newSelectedLayer = utils.placement.layer.getById(placementLayers, layerId);
          const newSelectedLayerMarket = utils.layer.getMarketById(newSelectedLayer, selectedMarket?.market?.id);

          setSelectedLayer(newSelectedLayer);
          setSelectedLayerMarket(newSelectedLayerMarket);
        }
      },
      ...(hasLayers &&
        !isLayerMarketFormDisabled && {
          validation: Yup.object()
            .nullable()
            .required(() => utils.form.getValidationLabel('placement.marketing.fields.layer', 'required')),
        }),
    },
    {
      name: 'layerMarket',
      type: 'hidden',
      value: selectedLayerMarket,
    },
    {
      name: 'layerMarket_statusId',
      type: 'select',
      label: utils.string.t('placement.form.status.label'),
      value: get(selectedLayerMarket, 'statusId') || '',
      options: refDataStatusesMarketQuote,
      optionKey: 'id',
      optionLabel: 'code',
      muiComponentProps: {
        disabled: isLayerMarketFormDisabled,
      },
      ...(hasLayers &&
        !isLayerMarketFormDisabled && {
          validation: Yup.string().test('layerMarket_statusId', utils.string.t('validation.required'), function () {
            return isLayerMarketFormDirty(this.options.parent) ? this.options.parent.layerMarket_statusId : true;
          }),
        }),
      nestedClasses: {
        root: classes.status,
      },
    },
    {
      name: 'layerMarket_declinatures',
      type: 'autocompletemui',
      label: utils.string.t('placement.marketing.fields.declinatures'),
      value: selectedLayerMarket?.declinatures || [],
      options: refDataDeclinatures,
      optionKey: 'id',
      optionLabel: 'description',
      muiComponentProps: {
        multiple: true,
      },
    },
    {
      name: 'layerMarket_uniqueMarketReference',
      type: 'autocompletemui',
      label: utils.string.t('placement.form.uniqueMarketReference.label'),
      value: selectedLayerMarket ? umrOptions.find((umr) => umr.id === selectedLayerMarket.uniqueMarketReference) : null,
      options: umrOptions,
      optionsCreatable: true,
      optionKey: 'id',
      optionLabel: 'label',
      disabled: isLayerMarketFormDisabled,
      muiComponentProps: {
        filterOptions: (options, params) => {
          const filtered = createFilterOptions()(options, params);

          // Suggest the creation of a new value
          if (params.inputValue !== '') {
            filtered.push({
              id: params.inputValue,
              label: `${utils.string.t('app.add')} "${params.inputValue}"`,
            });
          }

          return filtered;
        },
      },
      validation: Yup.object({
        id: Yup.string().matches(/^[a-zA-Z0-9]*$/, utils.string.t('validation.string.alphaNumericOnly')),
      }).nullable(),
    },
    {
      name: 'layerMarket_section',
      type: 'text',
      label: utils.string.t('placement.form.section.label'),
      value: get(selectedLayerMarket, 'section') || '',
      validation: Yup.string()
        .trim()
        .max(2)
        .uppercase()
        .matches(/^[A-Z]{0,2}$/, utils.string.t('validation.string.alphaOnly')),
      muiComponentProps: {
        disabled: isLayerMarketFormDisabled,
        inputProps: {
          maxLength: 2,
        },
        InputProps: {
          classes: {
            input: classes.section,
          },
        },
      },
    },
    {
      name: 'layerMarket_quoteOptions',
      type: 'checkbox',
      options: [
        {
          label: utils.string.t('placement.form.lead.label'),
          name: 'layerMarket_isLeader',
          value: Boolean(get(selectedLayerMarket, 'isLeader')),
          disabled: isLayerMarketFormDisabled,
        },
        {
          label: utils.string.t('placement.form.lineToStand.label'),
          name: 'layerMarket_lineToStand',
          value: Boolean(get(selectedLayerMarket, 'lineToStand')),
          disabled: isLayerMarketFormDisabled,
        },
      ],
      muiFormGroupProps: {
        row: media.desktopUp,
      },
    },
    {
      name: 'layerMarket_currency',
      type: 'text',
      value: utils.layer.getCurrency(selectedLayer, ''),
      label: utils.string.t('placement.form.currency.label'),
      muiComponentProps: {
        disabled: isLayerMarketFormDisabled,
        InputProps: {
          readOnly: true,
          disabled: true,
        },
      },
    },
    {
      name: 'layerMarket_premium',
      type: 'autocompletemui',
      label: utils.string.t('placement.form.premium.label'),
      value: selectedLayerMarket ? premiumOptions.find((premium) => premium.id === selectedLayerMarket.premium) : null,
      options: premiumOptions,
      optionsCreatable: true,
      optionKey: 'id',
      optionLabel: 'label',
      isNumeric: true,
      disabled: isLayerMarketFormDisabled,
      muiComponentProps: {
        filterOptions: (options, params) => {
          const filtered = createFilterOptions({
            stringify: (option) => `${option.label}`,
          })(options, params);

          // Suggest the creation of a new value
          if (params.inputValue !== '' && parseFloat(params.inputValue)) {
            const premiumFormatted = utils.number.formatNumber(parseFloat(params.inputValue));
            filtered.push({
              id: parseFloat(params.inputValue),
              label: `${utils.string.t('app.add')} "${premiumFormatted}"`,
            });
          }

          return filtered;
        },
        renderOption: formatPremiumOption,
        getOptionLabel: formatPremiumOption,
      },
      validation: Yup.object({
        id: Yup.number().nullable().min(0).currency(),
      })
        .nullable()
        .test('layerMarket_premium', utils.string.t('validation.required'), function () {
          return isLayerMarketAmountRequired(this.options.parent, this.options.parent.layerMarket_premium?.id);
        }),
    },
    {
      name: 'layerMarket_writtenLinePercentage',
      type: 'number',
      value: isNumber(get(selectedLayerMarket, 'writtenLinePercentage')) ? get(selectedLayerMarket, 'writtenLinePercentage') : '',
      validation: Yup.number()
        .nullable()
        .min(0)
        .max(100)
        .percent()
        .transform(function (value, originalvalue) {
          return this.isType(value) ? (Number.isNaN(value) ? null : value) : null;
        })
        .test('layerMarket_writtenLinePercentage', utils.string.t('validation.required'), function () {
          return isLayerMarketAmountRequired(this.options.parent, this.options.parent.layerMarket_writtenLinePercentage);
        }),
      label: utils.string.t('placement.form.written.label'),
      muiComponentProps: {
        disabled: isLayerMarketFormDisabled,
        autoComplete: 'off',
        fullWidth: false,
      },
    },
    {
      name: 'layerMarket_quoteDate',
      type: 'datepicker',
      icon: 'TodayIcon',
      label: utils.string.t('placement.form.dateFrom.label'),
      value: isLayerMarketFormDisabled ? null : get(selectedLayerMarket, 'quoteDate') || null,
      validation: Yup.string().nullable(),
      muiComponentProps: {
        disabled: isLayerMarketFormDisabled,
        fullWidth: true,
      },
    },
    {
      name: 'layerMarket_validUntilDate',
      type: 'datepicker',
      label: utils.string.t('placement.form.dateExpiry.label'),
      value: get(selectedLayerMarket, 'validUntilDate') || null,
      validation: Yup.string().nullable(),
      muiComponentProps: {
        disabled: isLayerMarketFormDisabled,
        fullWidth: true,
      },
      muiPickerProps: {
        clearable: true,
      },
    },
    {
      name: 'layerMarket_subjectivities',
      type: 'textarea',
      value: get(selectedLayerMarket, 'subjectivities') || '',
      validation: Yup.string().max(280),
      label: utils.string.t('placement.form.subjectivities.label'),
      muiComponentProps: {
        disabled: isLayerMarketFormDisabled,
        multiline: true,
        minRows: 1,
        maxRows: 6,
      },
    },
  ];

  const actions = [
    {
      name: 'submit',
      type: 'submit',
      label: utils.string.t('app.saveClose'),
      handler: handleSubmitAndClose,
    },
    {
      name: 'secondary',
      label: utils.string.t('app.save'),
      handler: handleFormSubmit,
    },
    {
      name: 'close',
      label: utils.string.t('app.close'),
      callback: handleFormClose,
    },
    {
      name: 'reset',
      label: utils.string.t('app.reset'),
      callback: handleFormReset,
    },
  ];

  const handleAddLayerClick = (popoverData = {}) => {
    dispatch(filterReferenceDataBusinessTypes());
    dispatch(
      showModal({
        component: 'ADD_PLACEMENT_LAYER',
        props: {
          title: 'placement.marketing.addLayer',
          subtitle: popoverData.title,
          fullWidth: true,
          maxWidth: 'sm',
          disableAutoFocus: true,
          componentProps: {
            businessTypeId: popoverData.id,
          },
        },
      })
    );
  };

  // uuid on the form key is to force the form to re-initialise from scratch with new defaultValues and dirty state
  // this is to allow us to detect which part(s) of the form were edited
  return (
    <EditPlacementMarketsLayersView
      key={`${selectedMarket?.id}-${selectedLayer?.id}-${selectedLayerMarket?.id}${uuid ? `-${uuid}` : ''}`}
      actions={actions}
      fields={[...marketFields, ...layerMarketFields]}
      hasLayers={hasLayers}
      handlers={{
        isStatusDeclined,
        isStatusQuoted,
        handleAddLayerClick,
        resetLayer,
      }}
    />
  );
}
