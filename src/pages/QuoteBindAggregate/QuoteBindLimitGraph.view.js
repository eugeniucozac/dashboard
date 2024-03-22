import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useState, useRef, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// app
import { Empty } from 'components';
import * as utils from 'utils';
import styles from './QuoteBindAggregate.styles';

// app
import { Loader } from 'components';

// mui
import { Typography, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import { getAggregateLimitsGraph, selectFacilityAggregateLimits, selectIsLimitsLoading } from 'stores';
import { ReactComponent as IconSearchFile } from '../../assets/svg/line-icon-search-file.svg';

import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Brush } from 'recharts';
import { useMedia } from 'hooks';

QuoteBindLimitGraphView.propTypes = {
  facilityId: PropTypes.string.isRequired,
};

export function QuoteBindLimitGraphView({ facilityId }) {
  const dispatch = useDispatch();
  const aggregateLimits = useSelector(selectFacilityAggregateLimits);
  const isLimitsLoading = useSelector(selectIsLimitsLoading);
  const media = useMedia();
  const parentRef = useRef(null);
  const [width, setWidth] = useState(1200);
  const classes = makeStyles(styles, { name: 'QuoteBindAggregate' })({ media });

  useEffect(() => {
    dispatch(getAggregateLimitsGraph(facilityId));
  }, [facilityId, dispatch]);

  const parsedAggregateLimits = useMemo(() => {
    let graphData = [];
    if (aggregateLimits?.length > 0) {
      aggregateLimits.forEach((item) => {
        const valueLimits = utils.risk.parsedGraphValues(item?.valueLimits);
        graphData.push({
          title: item?.label,
          data: valueLimits,
        });
      });

      return graphData;
    }
    return [];
  }, [aggregateLimits]);

  useEffect(() => {
    if (parentRef?.current?.offsetWidth) {
      setWidth(parentRef?.current?.offsetWidth);
    }
  }, [parentRef]);

  const CustomTooltip = ({ payload, label }) => {
    const boundQuotesLimit = payload[0]?.payload?.boundQuotesLimit;
    const aggregateLimits = payload[0]?.payload?.facilityLimit;

    return (
      <Box className={classes.tootlTip}>
        <Typography style={{ fontWeight: 900 }} variant="caption">
          {label}
        </Typography>
        {boundQuotesLimit ? (
          <Typography style={{ color: '#413ea0' }} variant="caption">
            {`${utils.string.t('products.aggregateLimits.bondAggregate')}: ${boundQuotesLimit.toLocaleString()}`}
          </Typography>
        ) : null}
        {aggregateLimits ? (
          <Typography style={{ color: '#ff7300' }} variant="caption">
            {`${utils.string.t('products.aggregateLimits.aggregateLimitLabel')}: ${aggregateLimits.toLocaleString()}`}
          </Typography>
        ) : null}
      </Box>
    );
  };
  const customTraveler = ({ x, y, width, height, fill, stroke }) => {
    return (
      <>
        <rect x={x} y={y} width={width} height={height} fill={fill} stroke={stroke} />
      </>
    );
  };

  if (isLimitsLoading) {
    return (
      <Box height={300}>
        <Loader visible absolute />
      </Box>
    );
  }
  if (!isLimitsLoading && aggregateLimits?.length === 0)
    return (
      <Fragment>
        <Box style={{ whiteSpace: 'nowrap' }}>
          <Empty title={utils.string.t('products.aggregateLimits.graphNotFound')} icon={<IconSearchFile />} padding />
        </Box>
      </Fragment>
    );

  return (
    <>
      {parsedAggregateLimits.map((item, index) => {
        return (
          <Box key={`${item.title}-${index}`} justifyContent="center">
            <Box justifyContent="left" className={classes.titleDiv}>
              <Typography style={{ color: 'rgb(128, 128, 128)', fontWeight: 500 }} variant="h3" testid="products-aggregate-limits-title">
                {`${item.title} ${utils.string.t('products.aggregateLimits.aggregateLimitTitle')}`}
              </Typography>
            </Box>
            <Box display="flex" className={classes.contentWrapper} ref={parentRef}>
              {item.data?.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={media.mobile ? 300 : 500}>
                    <ComposedChart
                      data={item.data}
                      margin={{
                        top: media.mobile ? 20 : 50,
                        right: media.mobile ? 10 : 30,
                        bottom: media.mobile ? 20 : 50,
                        left: media.mobile ? 20 : 30,
                      }}
                    >
                      <CartesianGrid stroke="#f5f5f5" />
                      <XAxis dataKey="label" scale="band" angle={-45} textAnchor="end" interval={0} />

                      <YAxis tickFormatter={(parameter) => parameter.toLocaleString()} />

                      <Tooltip content={<CustomTooltip />} />

                      <Legend
                        wrapperStyle={{ position: 'sticky', paddingTop: media.mobile ? 0 : 15, width: '100%' }}
                        align="center"
                        verticalAlign="bottom"
                      />

                      <Bar
                        dataKey="boundQuotesLimit"
                        barSize={50}
                        fill="#413ea0"
                        name={utils.string.t('products.aggregateLimits.bondAggregate')}
                      />
                      <Line
                        type="monotone"
                        dataKey="facilityLimit"
                        stroke="#ff7300"
                        name={utils.string.t('products.aggregateLimits.aggregateLimitLabel')}
                      />

                      {item.data?.length > 10 ? (
                        <Brush
                          dataKey="label"
                          height={media.mobile ? 10 : 35}
                          stroke="#7699bc"
                          x={0}
                          y={media.mobile ? 290 : 465}
                          width={parseInt(width)}
                          endIndex={media.mobile ? parseInt(item.data?.length / 4) : parseInt(item.data?.length / 2)}
                          travellerWidth={15}
                          travellerContent={customTraveler}
                        />
                      ) : null}
                    </ComposedChart>
                  </ResponsiveContainer>
                </>
              ) : null}
            </Box>
          </Box>
        );
      })}
    </>
  );
}
