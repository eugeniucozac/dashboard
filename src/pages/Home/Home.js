import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { Helmet } from 'react-helmet';
import { firstBy } from 'thenby';
import kebabCase from 'lodash/kebabCase';
import get from 'lodash/get';

// app
import { HomeView } from './Home.view';

import {
  selectUserIsExtended,
  selectRefDataDepartments,
  selectUserDepartmentIds,
  selectUserOffices,
  selectIsCobroker,
  selectIsUnderwriter,
  setDepartmentSelected,
} from 'stores';
import * as utils from 'utils';
import config from 'config';

export default function Home() {
  const history = useHistory();
  const dispatch = useDispatch();

  const brand = useSelector((state) => state.ui.brand);
  const userIsCoBroker = useSelector(selectIsCobroker);
  const userIsUnderwriter = useSelector(selectIsUnderwriter);
  const userIsExtendedEdge = useSelector(selectUserIsExtended);
  const userDepartmentIds = useSelector(selectUserDepartmentIds);
  const userOffices = useSelector(selectUserOffices);
  const refDataDepartments = useSelector(selectRefDataDepartments);

  const departments = refDataDepartments
    .filter((dept) => {
      return userDepartmentIds.includes(dept.id);
    })
    .map((dept) => {
      return {
        id: dept.id,
        title: dept.name,
        compact: false,
        onClick: () => {
          dispatch(setDepartmentSelected(dept.id));
          history.push(`${config.routes.department.root}/${dept.id}/${kebabCase(get(dept, 'name', ''))}`);
        },
      };
    });

  const offices = userOffices
    .map((office) => {
      const parentId = get(office, 'parent.id');
      const parentName = get(office, 'parent.name', '');
      const parentSlug = kebabCase(parentName);

      return {
        id: office.id,
        title: office.name,
        subheader: parentName,
        compact: false,
        ...(parentId && { onClick: () => history.push(`${config.routes.client.item}/${parentId}/${parentSlug}`) }),
      };
    })
    .filter((o) => o.id && o.title && o.subheader)
    .sort(firstBy(utils.sort.array('lexical', 'subheader')).thenBy(utils.sort.array('lexical', 'title')));

  return (
    <>
      <Helmet>
        <title>{`${utils.string.t('home.title')} - ${utils.app.getAppName(brand)}`}</title>
      </Helmet>

      <HomeView
        brand={brand}
        departments={departments}
        offices={offices}
        isCobroker={userIsCoBroker}
        isUnderwriter={userIsUnderwriter}
        isExtendedEdge={userIsExtendedEdge}
      />
    </>
  );
}
