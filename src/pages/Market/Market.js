import React, { useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet';
import toNumber from 'lodash/toNumber';
import get from 'lodash/get';
import { useParams, useHistory } from 'react-router';

// app
import { Layout } from 'components';
import { ClientContent, ClientSummary } from 'modules';
import { getMarketParentPlacements, getMarketParentList } from 'stores';
import config from 'config';
import * as utils from 'utils';

// miu
import TimelineIcon from '@material-ui/icons/Timeline';

export function Market() {
  const parentSelected = useSelector((state) => state.marketParent.selected);
  const parentList = useSelector((state) => state.marketParent.listAll.items);
  const parentPlacements = useSelector((state) => state.marketParent.placements);
  const uiBrand = useSelector((state) => get(state, 'ui.brand'));
  const { id, slug } = useParams();
  const history = useHistory();
  const previousId = useRef();
  const dispatch = useDispatch();

  const parentName = get(parentSelected, 'name') || utils.string.capitalise(slug);
  const title = parentName ? `${utils.string.t('app.market')} - ${parentName}` : utils.string.t('market.title');

  useEffect(
    () => {
      if (!id || toNumber(previousId.current) === toNumber(id)) return;
      previousId.current = id;
      fetchParent(id);
    },
    [id] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const fetchParent = async (id) => {
    const response = await dispatch(getMarketParentList());
    if (response && response.content) {
      dispatch(getMarketParentPlacements(id));
    } else {
      history.push(config.routes.home.root);
    }
  };

  return (
    <>
      <Helmet>
        <title>{`${title} - ${utils.app.getAppName(uiBrand)}`}</title>
      </Helmet>

      <Layout testid="market">
        <Layout main>
          <ClientContent
            parent={{
              list: parentList,
              offices: [],
              placements: parentPlacements,
              selected: parentSelected,
            }}
            pageIcon={TimelineIcon}
            type="market"
            showOfficeSelection={false}
            selectedId={toNumber(id)}
          />
        </Layout>

        <Layout sidebar padding={false}>
          {parentSelected ? <ClientSummary /> : <span />}
        </Layout>
      </Layout>
    </>
  );
}

export default Market;
