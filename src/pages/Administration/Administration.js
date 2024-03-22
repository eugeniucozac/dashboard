import React from 'react';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import get from 'lodash/get';

// app
import { AccessControl, Layout, SectionHeader, Translate } from 'components';
import { AdministrationUser } from 'modules';
import * as utils from 'utils';

// mui
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';

export default function Administration() {
  const uiBrand = useSelector((state) => get(state, 'ui.brand'));

  return (
    <>
      <Helmet>
        <title>{`${utils.string.t('administration.title')} - ${utils.app.getAppName(uiBrand)}`}</title>
      </Helmet>

      <Layout testid="administration">
        <Layout main padding>
          <SectionHeader title={<Translate label="administration.title" />} icon={PeopleAltIcon} testid="administration" />

          <AccessControl feature="admin.user" permissions="read">
            <AdministrationUser />
          </AccessControl>
        </Layout>
      </Layout>
    </>
  );
}
