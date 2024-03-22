import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import { useMedia } from 'hooks';

// app
import { Loader, Layout, Breadcrumb, PopoverMenu } from 'components';
import { selectFacilitiesListItems, selectFacilitiesLoading, getAllFacilities } from 'stores';
import * as utils from 'utils';
import config from 'config';
import { QuoteBindLimitGraphView } from './QuoteBindLimitGraph.view';
import styles from './QuoteBindAggregate.styles';

// mui
import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

export default function QuoteBindAggregate() {
  const dispatch = useDispatch();
  const brand = useSelector((state) => state.ui.brand);
  const facilities = useSelector(selectFacilitiesListItems);
  const isFacilityLoading = useSelector(selectFacilitiesLoading);
  const [facility, setFacility] = useState(null);
  const media = useMedia();
  const classes = makeStyles(styles, { name: 'QuoteBindAggregate' })({ media });

  useEffect(
    () => {
      dispatch(getAllFacilities());
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  useEffect(() => {
    if (!isFacilityLoading) {
      const defaultFacility = { id: facilities[0]?.id, name: facilities[0]?.name };
      setFacility(defaultFacility);
    }
  }, [isFacilityLoading, facilities]);

  const handleOnChange = (values) => (event) => {
    setFacility(values);
  };

  const breadcrumbs = [
    {
      name: 'products',
      label: utils.string.t('products.title'),
      link: config.routes.quoteBind.root,
    },
    {
      name: 'products-aggregate',
      label: utils.string.t('products.aggregate'),
      link: config.routes.quoteBind.aggregate,
      active: true,
    },
  ];

  const Select = (
    <PopoverMenu
      id="select-facilities"
      text={facility?.name}
      offset
      icon={ArrowDropDownIcon}
      iconPosition="right"
      size="large"
      nestedClasses={{
        root: classes.headerRoot,
        label: classes.headerLabel,
        paper: classes.paperPopOver,
      }}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      items={facilities.map((facility) => {
        return {
          id: facility.id,
          label: facility.name,
          callback: handleOnChange(facility),
        };
      })}
    />
  );

  return (
    <>
      <Helmet>
        <title>{`${utils.string.t('products.aggregateLimits.title')} - ${utils.app.getAppName(brand)}`}</title>
      </Helmet>
      <Box className={classes.pageContainer}>
        <Layout isCentered padding={false} testid="products-aggregate">
          <Layout main padding={false}>
            {isFacilityLoading ? (
              <Box height={300}>
                <Loader visible absolute />
              </Box>
            ) : (
              <Box display="flex" justifyContent="left" className={classes.headerDivision}>
                <Box margin={0} padding={0}>
                  <Breadcrumb links={breadcrumbs} testid="products-aggregate-breadcrumbs" />
                </Box>
                <Box marginTop="15px" marginLeft={media?.mobile ? '0px' : '30px!important'}>
                  {Select}
                </Box>
              </Box>
            )}
            <Box>{facility?.id ? <QuoteBindLimitGraphView facilityId={facility?.id} /> : null}</Box>
          </Layout>
        </Layout>
      </Box>
    </>
  );
}
