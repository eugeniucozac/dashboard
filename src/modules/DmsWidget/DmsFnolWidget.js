import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

//app
import { TreeView } from 'components';
import {
  selectClaimData,
  selectLossInformation,
  selectClaimAssociateWithLoss,
  getClaimsAssociateWithLoss,
  getViewTableDocuments,
  selectDmsWidgetClaimDocs,
} from 'stores';
import config from 'config';
import * as utils from 'utils';
import { DMS_CONTEXT_LOSS } from 'consts';

export default function DmsWidget() {
  const dispatch = useDispatch();
  const lossInformation = useSelector(selectLossInformation);
  const claimData = useSelector(selectClaimData);
  const associatedClaims = useSelector(selectClaimAssociateWithLoss);
  const dmsWidgetClaimDocs = useSelector(selectDmsWidgetClaimDocs);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const currentLossDetailId = get(lossInformation, 'lossDetailID');
  const currentLossRef = get(lossInformation, 'lossRef');
  const currentClaimRef = get(claimData, 'claimRef') || get(claimData, 'claimReference');
  const lossDocDetails = dmsWidgetClaimDocs[currentLossRef];
  const claimsDocDetails = dmsWidgetClaimDocs[currentClaimRef];

  useEffect(() => {
    if (currentLossDetailId) {
      dispatch(getClaimsAssociateWithLoss(currentLossDetailId));
    }
  }, [currentLossDetailId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (currentLossRef) {
      dispatch(
        getViewTableDocuments({ dmsWidgetReqParams: [{ referenceId: currentLossRef, sectionType: DMS_CONTEXT_LOSS }], isFromDmsWidget: true })
      );
    }
  }, [currentLossRef]); // eslint-disable-line react-hooks/exhaustive-deps

  const claimRefsArray = associatedClaims?.map((item) => item.claimReference)?.filter((claimref) => claimref !== currentClaimRef);

  const createSortedDocs = (docs) => docs?.sort((doc1, doc2) => new Date(doc1?.createdDate) - new Date(doc2?.createdDate));

  const lossDocuments = !utils.generic.isInvalidOrEmptyArray(lossDocDetails)
    ? createSortedDocs(
        lossDocDetails?.map((doc) => {
          return {
            ...doc,
            id: doc.documentId,
            label: doc.documentName,
            labelInfo: utils.string.t('format.date', { value: { date: doc?.createdDate, format: config.ui.format.date.text } }),
          };
        })
      )
    : [{ label: utils.string.t('dms.widget.loss.noDocMessage') }];

  const currentClaimDocuments = createSortedDocs(
    claimsDocDetails?.map((doc) => {
      return {
        ...doc,
        id: doc.documentId,
        label: doc.documentName,
        labelInfo: utils.string.t('format.date', { value: { date: doc?.createdDate, format: config.ui.format.date.text } }),
      };
    })
  );

  const openedChild = [
    ...lossDocuments,
    ...(currentClaimRef
      ? [
          {
            id: 'child1',
            label: currentClaimRef
              ? `${utils.string.t('claims.manageDocumentLabels.claim')} ${currentClaimRef}`
              : utils.string.t('dms.widget.claim.noDocMessage'),
            labelInfo: '',
            children: currentClaimDocuments,
          },
        ]
      : []),
  ];

  //claimRefsArray?.[0]?.claimId --> need to know why this condition exactly
  const closedChild =
    claimRefsArray.length > 0
      ? claimRefsArray?.map((item) => {
          return {
            id: item,
            label: item ? `${utils.string.t('claims.manageDocumentLabels.claim')} ${item}` : '',
            labelInfo: '',
            children: createSortedDocs(
              dmsWidgetClaimDocs.hasOwnProperty(item) && !utils.generic.isInvalidOrEmptyArray(dmsWidgetClaimDocs[item])
                ? dmsWidgetClaimDocs[item]?.map((doc) => {
                    return {
                      ...doc,
                      id: doc.documentId,
                      label: doc.documentName,
                      labelInfo: utils.string.t('format.date', { value: { date: doc?.createdDate, format: config.ui.format.date.text } }),
                    };
                  })
                : [{ label: utils.string.t('dms.widget.claim.noDocMessage') }]
            ),
          };
        })
      : [];

  const rootChildren = [...openedChild, ...closedChild];

  const data = {
    id: 'root',
    label: currentLossRef ? `${utils.string.t('claims.manageDocumentLabels.loss')} ${currentLossRef}` : '',
    labelInfo: '',
    children: rootChildren,
  };

  let arr = [];
  data?.children?.forEach((child) => {
    if (child.labelInfo) {
      arr.push(child);
    } else {
      child?.children?.forEach((child) => {
        if (child) {
          arr.push(child);
        }
      });
    }
  });

  const onClickAccordion = (_, nodeIds) => {
    if (nodeIds !== 'root' && nodeIds !== 'child1' && !dmsWidgetClaimDocs.hasOwnProperty(nodeIds)) {
      dispatch(getViewTableDocuments({ dmsWidgetReqParams: [{ referenceId: nodeIds, sectionType: 'Claim' }], isFromDmsWidget: true }));
    }
  };

  const submitSearch = (query) => {
    const filteredData = createSortedDocs(
      arr?.filter(
        ({ documentName, labelInfo }) =>
          !isEmpty([documentName, labelInfo]?.find((item) => item?.toLowerCase()?.includes(query?.toLowerCase())))
      )
    );
    setSearchQuery(query);
    setFilteredData(filteredData);
  };

  const resetSearch = () => {
    setFilteredData([]);
    setSearchQuery('');
  };

  const rowClick = (e, doc) => {
    e.preventDefault();
    const { documentId, documentName } = doc;
    utils.dms.dmsDocumentViewLauncher(documentId, documentName);
  };

  return (
    <TreeView
      title={utils.string.t('dms.view.documents.title')}
      rootRef={currentLossRef}
      treeData={data}
      filteredData={filteredData}
      defaultExpanded={['child1', 'root']}
      searchQuery={searchQuery}
      handlers={{
        submitSearch,
        resetSearch,
        rowClick,
        onClickAccordion,
      }}
    />
  );
}
