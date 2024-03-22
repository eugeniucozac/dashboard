import React, { PureComponent } from 'react';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import { compose } from 'redux';
import chroma from 'chroma-js';
import get from 'lodash/get';
import throttle from 'lodash/throttle';
import merge from 'lodash/merge';
import isEqual from 'lodash/isEqual';

// app
import styles from './PlacementOverview.styles';
import { Button, Chart, FormSelect, LayoutContext, SectionHeader, Restricted, TableCell, Translate, Warning } from 'components';
import { LocationsTable, PlacementMap } from 'modules';
import { withThemeListener } from 'hoc';
import {
  resetLocations,
  showModal,
  postNewLocationGroup,
  setLocationUploadWizardExcelExtract,
  setLocationUploadWizardHeaderMap,
} from 'stores';
import * as constants from 'consts';
import * as utils from 'utils';
import config from 'config';

// mui
import { withStyles, Box, RootRef, Table, TableRow, TableBody, Typography } from '@material-ui/core';
import DashboardIcon from '@material-ui/icons/Dashboard';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

// state
const mapStateToProps = (state) => ({
  uiLoaderQueue: get(state, 'ui.loader.queue', []),
  placementSelected: get(state, 'placement.selected'),
  headerMap: get(state, 'location.headerMap'),
  locationsUploaded: get(state, 'location.locationsUploaded', []),
  invalidLocationsUploaded: get(state, 'location.invalidLocationsUploaded', 0),
});

// dispatch
const mapDispatchToProps = {
  resetLocations,
  showModal,
  postNewLocationGroup,
  setLocationUploadWizardExcelExtract,
  setLocationUploadWizardHeaderMap,
};

export class PlacementOverview extends PureComponent {
  constructor(props) {
    super(props);

    this.mapRef = React.createRef();
    this.geocodingMap = {
      ROOFTOP: utils.string.t('map.geocoding.accuracy.building'),
      RANGE_INTERPOLATED: utils.string.t('map.geocoding.accuracy.street'),
      GEOMETRIC_CENTER: utils.string.t('map.geocoding.accuracy.longRoad'),
      APPROXIMATE: utils.string.t('map.geocoding.accuracy.area'),
      NOT_FOUND: utils.string.t('map.geocoding.accuracy.notFound'),
    };

    this.defaultMapOptions = {
      center: config.mapbox.location.country.center.US,
      zoom: config.mapbox.zoom,
    };

    this.charts = [
      {
        id: 'country',
        label: utils.string.t('placement.overview.chart.country'),
        getFilterVal: (l) => {
          return l.country && typeof l.country == 'string' ? l.country : utils.string.t('app.na');
        },
        sortFn: (labels) => {
          return labels.sort();
        },
      },
      {
        id: 'state',
        label: utils.string.t('placement.overview.chart.state'),
        getFilterVal: (l) => {
          return l.state && typeof l.state === 'string' ? l.state : utils.string.t('app.na');
        },
        sortFn: (labels) => {
          return labels.sort();
        },
      },
      {
        id: 'city',
        label: utils.string.t('placement.overview.chart.city'),
        getFilterVal: (l) => {
          return l.city && typeof l.city === 'string' ? l.city : utils.string.t('app.na');
        },
        sortFn: (labels) => {
          return labels.sort();
        },
      },
      {
        id: 'geocodingAccuracy',
        label: utils.string.t('placement.overview.chart.geocodingAccuracy'),
        getFilterVal: (l) => {
          return l.geocodeResult && l.geocodeResult.accuracy ? this.geocodingMap[l.geocodeResult.accuracy] : this.geocodingMap.NOT_FOUND;
        },
        sortFn: (labels) => {
          return Object.values(this.geocodingMap);
        },
      },
      {
        id: 'catExposure',
        label: utils.string.t('placement.overview.chart.catExposure'),
        getFilterVal: (l) => {
          return l.exposures[0] && l.exposures[0].catType ? l.exposures[0].catType : utils.string.t('app.na');
        },
        sortFn: (labels) => {
          return labels.sort();
        },
      },
      {
        id: 'hasSprinklers',
        label: utils.string.t('placement.overview.chart.hasSprinklers'),
        getFilterVal: (l) => {
          return l.hasSprinklers && typeof l.hasSprinklers === 'string' ? l.hasSprinklers : utils.string.t('app.na');
        },
        sortFn: (labels) => {
          return labels.sort();
        },
      },
      {
        id: 'hasAlarm',
        label: utils.string.t('placement.overview.chart.hasAlarm'),
        getFilterVal: (l) => {
          return l.hasAlarm && typeof l.hasAlarm === 'string' ? l.hasAlarm : utils.string.t('app.na');
        },
        sortFn: (labels) => {
          return labels.sort();
        },
      },
      {
        id: 'hasBackupPower',
        label: utils.string.t('placement.overview.chart.hasBackupPower'),
        getFilterVal: (l) => {
          return l.hasBackupPower && typeof l.hasBackupPower === 'string' ? l.hasBackupPower : utils.string.t('app.na');
        },
        sortFn: (labels) => {
          return labels.sort();
        },
      },
    ];

    this.tivCategories = [utils.string.t('app.na'), '< 100k', '100k - 1m', '1m - 10m', '10m - 100m', '100m - 1bn', ' > 1bn'];

    this.tivCategory = (tiv) => {
      if (!tiv || !(tiv > 0)) return this.tivCategories[0];
      if (tiv < 100000) return this.tivCategories[1];
      if (tiv < 1000000) return this.tivCategories[2];
      if (tiv < 10000000) return this.tivCategories[3];
      if (tiv < 100000000) return this.tivCategories[4];
      if (tiv < 1000000000) return this.tivCategories[5];
      return this.tivCategories[6];
    };

    this.state = {
      filter: null,
      maps: {
        activeMarkers: [],
        center: this.defaultMapOptions.center,
        zoom: this.defaultMapOptions.zoom,
      },
      chartFilter: null,
      chartInstance: null,
      options: {
        ...config.ui.chart.bar,
        maintainAspectRatio: false,
        scales: merge({}, config.ui.chart.bar.scales, {
          xAxes: [
            {
              scaleLabel: {
                labelString: utils.string.t('placement.overview.chart.state'),
              },
            },
          ],
          yAxes: [
            {
              scaleLabel: {
                labelString: utils.string.t('placement.overview.chart.scaleTivTitle', { currency: config.currency }),
              },
              ticks: {
                callback: (label) => {
                  return utils.string
                    .t('format.number', {
                      value: {
                        number: label,
                        format: {
                          average: true,
                          totalLength: 12,
                          lowPrecision: false,
                        },
                      },
                    })
                    .toUpperCase();
                },
              },
            },
          ],
        }),
        tooltips: {
          ...config.ui.chart.bar.tooltips,
          callbacks: {
            title: (tooltipItems, data) => {
              const tiv = tooltipItems.reduce((sum, tooltipItem) => {
                const value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] || 0;
                return sum + value;
              }, 0);
              return (tooltipItems[0].label || '') + ' ' + utils.string.t('chart.tooltip.tiv', { amount: tiv });
            },
            label: () => null,
            footer: (tooltipItems, data) => {
              return tooltipItems.map((tooltipItem) => {
                const value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] || 0;
                return this.tivCategories[tooltipItem.datasetIndex] + ' ' + utils.string.t('chart.tooltip.tiv', { amount: value });
              });
            },
          },
        },
        onClick: (event) => {
          const { maps, filter, chartFilter } = this.state;
          const chart = get(this, 'state.chartInstance', {});
          const element = chart.getElementAtEvent(event)[0];

          if (element) {
            const newChartFilter = get(maps, `[${filter}].labels[${element._index}]`);

            this.setState({
              chartFilter: chartFilter === newChartFilter ? null : newChartFilter,
            });
          }
        },
        onHover: throttle((event, elems) => {
          const canvas = get(this, 'state.chartInstance.canvas');

          if (canvas) {
            canvas.style.cursor = elems[0] ? 'pointer' : 'default';
          }
        }, 100),
      },
    };
  }

  componentDidMount() {
    this.preparePage(get(this.props, 'placementSelected.locations', []));
  }

  componentWillUnmount() {
    const chart = get(this, 'state.chartInstance') || {};

    if (chart && utils.generic.isFunction(chart.destroy)) {
      chart.destroy();
    }
  }

  componentDidUpdate(prevProps) {
    const prevLocations = get(prevProps, 'placementSelected.locations', []);
    const newLocations = get(this.props, 'placementSelected.locations', []);

    if (!isEqual(prevLocations, newLocations)) {
      this.preparePage(newLocations);
    }
  }

  preparePage = (locations = []) => {
    const maps = this.buildChartMaps(locations);
    const filter = this.findDefaultFilter(locations);
    this.setState({ maps, filter });
  };

  findDefaultFilter = (locations = []) => {
    for (let i = 0; i < locations.length; i++) {
      const filter = this.charts.reduce((f, chart) => {
        if (f) return f;
        if (locations[i][chart.id]) return chart.id;
        return f;
      }, null);

      if (filter) return filter;
    }
  };

  buildChartMaps = (locations) => {
    const maps = locations.reduce((maps, l) => {
      const yAxisLabel = this.tivCategory(l.totalInsurableValues);

      this.charts.forEach((chart) => {
        const map = maps[chart.id];
        const xAxisLabel = chart.getFilterVal(l);

        if (!map.locationMap[yAxisLabel][xAxisLabel]) {
          map.locationMap[yAxisLabel][xAxisLabel] = { tiv: 0, locations: [] };
          map.labelMap[xAxisLabel] = true;
        }
        map.locationMap[yAxisLabel][xAxisLabel].tiv += l.totalInsurableValues;
        map.locationMap[yAxisLabel][xAxisLabel].locations.push(l);
      });
      return maps;
    }, this.blankMaps());

    const colors = utils.color.scale(this.tivCategories.length).map((c) => {
      return {
        color: c,
        colorHover: chroma(c).darken(0.5).hex(),
      };
    });

    this.charts.forEach((chart) => {
      const map = maps[chart.id];

      map.id = chart.id;
      map.labels = chart.sortFn(Object.keys(map.labelMap));

      map.datasets = Object.keys(map.locationMap).map((y, yi) => {
        const dataset = this.blankDataSetRow(colors[yi].color, colors[yi].colorHover);

        map.labels.forEach((x, xi) => {
          const bar = map.locationMap[y][x];

          if (bar) {
            dataset.data[xi] = bar.tiv;
            dataset.objects[xi] = bar.locations;
          }
        });

        return dataset;
      });
    });

    return maps;
  };

  tivCategoryMap = () => {
    return this.tivCategories.reduce((map, category) => {
      map[category] = {};
      return map;
    }, {});
  };

  blankMaps = () => {
    return this.charts.reduce(
      (maps, chart) => {
        maps[chart.id] = this.blankGraphData();
        return maps;
      },
      { ...this.state.maps }
    );
  };

  blankGraphData = () => {
    return {
      labelXMap: {},
      labelCountMap: {},
      labelMap: {},
      datasets: [],
      labels: [],
      max: 0,
      locationMap: this.tivCategoryMap(),
    };
  };

  blankDataSetRow = (color, colorHover) => {
    return { data: [], objects: [], backgroundColor: color, hoverBackgroundColor: colorHover };
  };

  getLocationsFiltered = (chartFilter) => {
    const { filter } = this.state;

    if (!chartFilter || !this.state.maps[filter] || !this.state.maps[filter].locationMap) {
      return this.getLocationsActive(get(this.props, 'placementSelected.locations', []));
    }

    let locationsFiltered = this.tivCategories.reduce((arr, category) => {
      const obj = this.state.maps[filter].locationMap[category][chartFilter];
      return obj && obj.locations ? arr.concat(obj.locations) : arr;
    }, []);
    return this.getLocationsActive(locationsFiltered);
  };

  getLocationsActive = (locations) => {
    return locations.map((location) => {
      location.active = this.state.maps.activeMarkers.includes(location.id);
      return Object.assign({}, location);
    });
  };

  handleClickLocation = (location) => {
    if (!location || !location.id) return;

    const { maps } = this.state;
    const { mobile, tablet } = this.props;
    const lng = get(location, 'geocodeResult.lng');
    const lat = get(location, 'geocodeResult.lat');
    const elementToScroll = mobile || tablet ? window : this.props.context.refMain.current;
    const elementOffsetTop = this.mapRef.current.offsetTop;

    this.setState({
      maps: {
        ...maps,
        activeMarkers: maps.activeMarkers.includes(location.id) ? [] : [location.id],
        ...(lng && lat && { center: [lng, lat] }),
        zoom: config.mapbox.marker.maxZoom,
      },
    });

    if (mobile) {
      // adding 40px to offset the breadcrumb height
      elementToScroll.scroll({ top: elementOffsetTop + 40, left: 0, behavior: 'smooth' });
    } else {
      this.mapRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  handleChangeFilter = (name, value) => {
    const mergedOptions = merge({}, this.state.options, {
      scales: {
        xAxes: [
          {
            scaleLabel: {
              labelString: utils.string.t(`placement.overview.chart.${value}`),
            },
          },
        ],
      },
    });

    this.setState({
      filter: value,
      chartFilter: null,
      options: mergedOptions,
      maps: {
        ...this.state.maps,
        center: this.defaultMapOptions.center,
        zoom: this.defaultMapOptions.zoom,
      },
    });
  };

  handleChangePage = (event, newPage) => {
    this.setState({
      pagination: {
        ...this.state.pagination,
        page: newPage,
      },
    });
  };

  handleChangeRowsPerPage = (event) => {
    this.setState({
      pagination: {
        ...this.state.pagination,
        rowsPerPage: event.target.value,
      },
    });
  };

  handleChartOnload = (id, instance) => {
    this.setState({
      chartInstance: instance,
    });
  };

  handleClickUpload = (event) => {
    this.props.resetLocations();
    this.props.showModal({
      component: 'PASTE_FROM_EXCEL',
      props: {
        title: 'location.upload.title',
        fullWidth: true,
        maxWidth: 'lg',
        componentProps: {
          name: 'placement-overview',
          headers: this.props.headerMap,
          steps: 4,
          labels: {
            step1: {
              title: utils.string.html('location.upload.step1.title'),
              hint: utils.string.t('location.upload.step1.hint'),
            },
            step2: {
              title: utils.string.html('location.upload.step2.title'),
              hint: utils.string.t('location.upload.step2.hint'),
            },
            step3: {
              title: utils.string.html('location.upload.step3.title'),
              hint: utils.string.t('location.upload.step3.hint'),
            },
            step4: {
              title: utils.string.html('location.upload.step4.title'),
              hint: utils.string.t('location.upload.step4.hint'),
            },
          },
          handlers: {
            extract: (data) => this.props.setLocationUploadWizardExcelExtract(data),
            match: (data) => this.props.setLocationUploadWizardHeaderMap(data),
            submit: () => this.props.postNewLocationGroup(),
          },
          children: () => {
            const tiv = this.props.locationsUploaded.reduce((sum, l) => sum + (l.totalInsurableValues || 0), 0);
            const { invalidTIVLocations, invalidGeoLocations } = this.props?.invalidLocationsUploaded;

            return (
              <Box mt={2} mb={2}>
                <Table>
                  <TableBody>
                    {invalidTIVLocations > 0 || invalidGeoLocations > 0 ? (
                      <>
                        <TableRow>
                          <TableCell style={{ border: 0, paddingBottom: 0 }}>
                            <Translate label="location.summary.invalidLocationCount" />
                          </TableCell>
                          <TableCell align="right" style={{ border: 0, paddingBottom: 0 }}>
                            <strong>{invalidTIVLocations + invalidGeoLocations}</strong>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={2}>
                            <Table size="small" padding="none">
                              <TableBody>
                                {invalidTIVLocations > 0 ? (
                                  <TableRow>
                                    <TableCell style={{ border: 0 }}>
                                      <Warning
                                        text={utils.string.t('location.summary.locationRequiredFields1')}
                                        type="error"
                                        size="small"
                                        align="left"
                                      />
                                    </TableCell>
                                    <TableCell align="right" style={{ border: 0 }}>
                                      <strong>{invalidTIVLocations}</strong>
                                    </TableCell>
                                  </TableRow>
                                ) : null}
                                {invalidGeoLocations > 0 ? (
                                  <TableRow>
                                    <TableCell style={{ border: 0 }}>
                                      <Warning
                                        text={utils.string.t('location.summary.locationRequiredFields2')}
                                        type="error"
                                        size="small"
                                        align="left"
                                      />
                                    </TableCell>
                                    <TableCell align="right" style={{ border: 0 }}>
                                      <strong>{invalidGeoLocations}</strong>
                                    </TableCell>
                                  </TableRow>
                                ) : null}
                              </TableBody>
                            </Table>
                          </TableCell>
                        </TableRow>
                      </>
                    ) : null}

                    <TableRow>
                      <TableCell>
                        <Translate label="location.summary.locationCount" />
                      </TableCell>
                      <TableCell align="right">
                        <strong>{this.props.locationsUploaded.length} </strong>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Translate label="location.field.totalInsurableValues" />
                      </TableCell>
                      <TableCell align="right">
                        <strong>
                          {utils.string.t('format.currency', {
                            value: { number: tiv, currency: constants.CURRENCY_USD },
                          })}
                        </strong>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Box>
            );
          },
        },
      },
    });
  };

  render() {
    const { uiLoaderQueue, classes, placementSelected } = this.props;
    const { filter, maps, chartFilter, options } = this.state;

    const loading = uiLoaderQueue.length || 0;

    const cols = [
      { id: 'streetAddress', label: <Translate label="app.streetAddress" />, sort: { type: 'lexical', direction: 'asc' } },
      { id: 'city', label: <Translate label="app.city" />, sort: { type: 'lexical', direction: 'asc' } },
      { id: 'state', label: <Translate label="app.state" />, sort: { type: 'lexical', direction: 'asc' } },
      { id: 'totalInsurableValues', label: <Translate label="app.tiv" />, sort: { type: 'numeric', direction: 'desc' } },
    ];

    const locations = get(this.props, 'placementSelected.locations', []);
    const locationsFiltered = this.getLocationsFiltered(chartFilter);

    const chartOpts = this.charts.map((chart) => {
      return { value: chart.id, label: chart.label };
    });

    return (
      <>
        {utils.placement.isPhysicalLoss(placementSelected) ? (
          <>
            <SectionHeader title={<Translate label="placement.overview.title" />} icon={DashboardIcon} testid="placement-overview">
              {locations.length > 0 && !loading && (
                <FormSelect
                  name="map_filter"
                  size="sm"
                  value={filter}
                  options={chartOpts}
                  muiComponentProps={{
                    fullWidth: false,
                  }}
                  nestedClasses={{
                    root: classes.select,
                  }}
                  handleUpdate={this.handleChangeFilter}
                />
              )}

              {!loading && locations.length <= 0 && (
                <Restricted include={[constants.ROLE_BROKER]}>
                  <Button
                    icon={CloudUploadIcon}
                    iconWide={true}
                    color="primary"
                    variant="outlined"
                    size="medium"
                    text={<Translate label="map.sov.upload" />}
                    onClick={this.handleClickUpload}
                  />
                </Restricted>
              )}
            </SectionHeader>

            <div style={{ height: locationsFiltered.length > 0 ? 'auto' : 0 }}>
              {filter && !!get(maps, `${filter}.datasets.length`) && !!get(maps, `${filter}.labels.length`) && (
                <Chart
                  id="placementLocations"
                  type="bar"
                  height={180}
                  // JSON parse/stringify is not ideal but ChartJS takes reference to data/objects within
                  // this allows us to keep the animation when changing filter/data
                  data={JSON.parse(JSON.stringify(maps[filter]))}
                  options={options}
                  nestedClasses={{ root: classes.chartContainer, chart: classes.chart }}
                  onload={this.handleChartOnload}
                />
              )}
            </div>

            <RootRef rootRef={this.mapRef}>
              <PlacementMap locations={locations} locationsFiltered={locationsFiltered} center={maps.center} zoom={maps.zoom} />
            </RootRef>

            {locationsFiltered.length > 0 && (
              <div className={classes.tableContainer}>
                <Translate label="placement.overview.listLocations" variant="h3" display="inline" noWrap />

                {(filter || chartFilter) && (
                  <Typography variant="h6" display="inline" noWrap className={classes.tableSubtitle}>
                    <span>(</span>
                    {filter && <Translate label={`placement.overview.chart.${filter}`} />}

                    {chartFilter && <span>&nbsp;/&nbsp;{chartFilter}</span>}
                    <span>)</span>
                  </Typography>
                )}

                <LocationsTable
                  rows={locationsFiltered}
                  cols={cols}
                  sort={{
                    by: 'totalInsurableValues',
                    type: 'numeric',
                    direction: 'desc',
                  }}
                  pagination={{
                    page: 0,
                    rowsPerPage: 100,
                    rowsTotal: locationsFiltered.length,
                  }}
                  handleClickRow={this.handleClickLocation}
                />
              </div>
            )}
          </>
        ) : (
          <Redirect to={`${config.routes.placement.marketing.markets}/${placementSelected.id}`} />
        )}
      </>
    );
  }
}

export class PlacementOverviewWithContext extends PureComponent {
  render() {
    return <LayoutContext.Consumer>{(context) => <PlacementOverview {...this.props} context={context} />}</LayoutContext.Consumer>;
  }
}

export default compose(connect(mapStateToProps, mapDispatchToProps), withStyles(styles), withThemeListener)(PlacementOverviewWithContext);
