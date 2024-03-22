import drop from 'lodash/drop';
import orderBy from 'lodash/orderBy';
import isNumber from 'lodash/isNumber';
import flatten from 'lodash/flatten';

// app
import * as utils from 'utils';

const getSeeNoteMessage = (comments, placementId, market, lIndex, pIndex, mIndex) => {
  const hasNotes = !!comments[`placement/${placementId}/policyMarket/${market.id}`] || market.subjectivities;
  if (!hasNotes) return;
  return `${lIndex + 1}.${pIndex + 1}.${mIndex + 1}`;
};

const getMarketsOrdered = (markets) => utils.markets.order(markets);

export const getNoteCount = (page) => {
  if (!utils.generic.isValidArray(page)) return 0;
  return page.reduce((pageAcc, pageSection) => {
    const charLimit = 120;
    const subjectivitiesChars = pageSection.subjectivities ? 2 : 0;
    const messageChars = pageSection.comments
      ? pageSection.comments.reduce((noteAcc, comment) => noteAcc + comment.message.length, 0) / charLimit
      : 0;
    return Math.ceil(subjectivitiesChars + messageChars + pageAcc);
  }, 0);
};

export const getMarketRowCount = (markets) => {
  if (!utils.generic.isValidArray(markets)) return 0;
  return markets.length + markets.map((market) => (market.seeNoteMessage ? 2 : 0)).reduce((a, c) => a + c, 0);
};

// return grouped arrays of no more than the row limit (taking into account the seeNoteMessage row)
export const marketChunk = (markets, rowLimit) => {
  if (!utils.generic.isValidArray(markets) || !isNumber(rowLimit)) return [];
  return markets.reduce((marketChunks, market) => {
    const count = marketChunks[marketChunks.length - 1] ? getMarketRowCount(marketChunks[marketChunks.length - 1]) : 0;
    const current = getMarketRowCount([market]);
    if (count + current <= rowLimit) {
      if (!marketChunks.length) marketChunks.push([]);
      marketChunks[marketChunks.length - 1] = [...marketChunks[marketChunks.length - 1], market];
    } else {
      marketChunks.push([market]);
    }
    return marketChunks;
  }, []);
};

export const getRowCount = (policies) => {
  if (!utils.generic.isValidArray(policies, true)) return 0;

  const noteCount = policies.map((policy) => getMarketRowCount(policy.markets)).reduce((a, c) => a + c, 0);

  return policies.length + noteCount;
};

const addPolicyPages = (marketSegments, isFirstPolicy, showMudmap, businessType, policy, pdfPages) => {
  marketSegments.forEach((marketSegment, index) => {
    const page = {};

    // Add first market segment to a page
    if (index === 0) {
      page.title = isFirstPolicy && !showMudmap ? businessType.businessTypeName : `${businessType.businessTypeName} (continued)`;
      page.policies = [policy];
    }

    // Add remaining markets of a policy to a new page
    if (index > 0) {
      page.title = `${businessType.businessTypeName} (continued)`;
      page.policies = [{ ...policy, markets: marketSegment, showHeaderRow: false }];
    }

    pdfPages.push(page);
  });
};

export const addCommentPages = (businessType, comments, pdfPages, placementId, rowLimit) => {
  const notes = businessType.policies
    .map((policy) =>
      policy.markets
        .map((market) => ({
          title: market.seeNoteMessage,
          subjectivities: market.subjectivities,
          comments: comments[`placement/${placementId}/policyMarket/${market.id}`],
        }))
        .filter(({ comments, subjectivities }) => comments || subjectivities)
    )
    .filter((notes) => notes.length);

  const notePages = flatten(notes).reduce((acc, note) => {
    const previousPage = acc[acc.length - 1];
    const previousPageCount = previousPage ? getNoteCount(acc[acc.length - 1]) : 0;
    const currentPageCount = getNoteCount([note]);
    const totalCount = previousPageCount + currentPageCount;

    if (totalCount < rowLimit) {
      if (!acc.length) acc.push([]);
      acc[acc.length - 1] = [...acc[acc.length - 1], note];
    } else {
      acc.push([note]);
    }

    return acc;
  }, []);

  notePages.forEach((page) => {
    pdfPages.push({ title: `${businessType.businessTypeName} (continued)`, notes: page });
  });
};

const utilsPlacementPDF = {
  getAccumulatedRowCount: (markets, rowLimit) => {
    if (!utils.generic.isValidArray(markets) || !isNumber(rowLimit)) return [];
    return markets.reduce((acc, market) => {
      const count = getMarketRowCount(acc);
      const current = getMarketRowCount([market]);
      if (count + current <= rowLimit) {
        acc.push(market);
      }
      return acc;
    }, []);
  },
  getPages: (businessTypes, userSelectedConfig, comments, placementId) => {
    let pages = [];
    businessTypes.forEach((businessType) => {
      const policyCount = businessType.policies.length;
      const reducer = (pdfPages, policy, index) => {
        const rowLimit = 20;
        const isFirstPolicy = index === 0;
        const isLastPolicy = policyCount === index + 1;
        const previousPage = pdfPages[pdfPages.length - 1];

        const showMudmap = isFirstPolicy && userSelectedConfig.showMudmap && businessType.mudmap && businessType.mudmap.length > 0;

        const remainingSpace = rowLimit - (previousPage ? getRowCount(previousPage.policies) : 0);

        // Add mudmap before first policy only
        if (isFirstPolicy && showMudmap) {
          pdfPages.push({
            title: businessType.businessTypeName,
            mudmap: businessType.mudmap,
          });
        }

        // Fill any space on previous page, then populate new pages
        if (!isFirstPolicy && remainingSpace > getRowCount([policy])) {
          const remainingMarkets = drop(policy.markets, utilsPlacementPDF.getAccumulatedRowCount(policy.markets, remainingSpace).length);
          const previousPage = pdfPages.length - 1;
          pdfPages.splice(previousPage, 1, {
            ...pdfPages[previousPage],
            policies: [{ ...(policy || {}), markets: policy.markets }, ...(pdfPages[previousPage].policies || [])],
          });
          addPolicyPages(marketChunk(remainingMarkets, 20), isFirstPolicy, showMudmap, businessType, policy, pdfPages);
        } else {
          // Populate new pages
          addPolicyPages(marketChunk(policy.markets, 20), isFirstPolicy, showMudmap, businessType, policy, pdfPages);
        }

        // Add notes after the last policy
        if (isLastPolicy) {
          addCommentPages(businessType, comments, pdfPages, placementId, rowLimit);
        }

        return pdfPages;
      };

      const splitPolicies = orderBy(businessType.policies, ['excess', 'amount'], ['asc', 'asc']).reduce(reducer, []);
      pages = [...pages, ...splitPolicies];
    });
    return pages;
  },
  getPDFMarkets: (markets, comments, placementId, lIndex, pIndex) => {
    if (!utils.generic.isValidArray(markets) || !utils.generic.isValidObject(comments) || !placementId) return [];
    return getMarketsOrdered(markets).map((market, mIndex) => ({
      ...market,
      seeNoteMessage: getSeeNoteMessage(comments, placementId, market, lIndex, pIndex, mIndex),
    }));
  },
};

export default utilsPlacementPDF;
