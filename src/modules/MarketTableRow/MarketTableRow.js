import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import classnames from 'classnames';
import get from 'lodash/get';
import has from 'lodash/has';
import round from 'lodash/round';

// app
import styles from './MarketTableRow.styles';
import { Avatar, InlineEdit, PopoverMenu, Status, Restricted, TableCell, TableCheckbox, Translate, StatusIcon } from 'components';
import * as utils from 'utils';
import * as constants from 'consts';
import config from 'config';
import { selectRefDataStatusesMarketQuote, selectFormattedAccountStatusList } from 'stores';

// mui
import { Box, TableRow, makeStyles } from '@material-ui/core';

MarketTableRow.propTypes = {
  policy: PropTypes.object,
  market: PropTypes.object.isRequired,
  capacities: PropTypes.array,
  isLast: PropTypes.bool,
  isChecked: PropTypes.bool,
  isDisabled: PropTypes.bool,
  isSelected: PropTypes.bool,
  isEditing: PropTypes.array,
  showPremium: PropTypes.bool,
  showWritten: PropTypes.bool,
  showSigned: PropTypes.bool,
  showStatus: PropTypes.bool,
  showUnderwriterGroup: PropTypes.bool,
  popoverItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      callback: PropTypes.func.isRequired,
    })
  ),
  inlineEditValues: PropTypes.object,
  inlineEditOnClick: PropTypes.func,
  inlineEditOnClickAway: PropTypes.func,
  handleToggle: PropTypes.func,
  handleSelect: PropTypes.func,
};

MarketTableRow.defaultProps = {
  printView: false,
};

export function MarketTableRow({
  policy,
  market,
  capacities = [],
  isLast,
  isChecked,
  isDisabled,
  isSelected,
  isEditing,
  showPremium,
  showWritten,
  showSigned,
  showStatus,
  showUnderwriterGroup,
  inlineEditValues,
  inlineEditOnClick,
  inlineEditOnClickAway,
  handleToggle,
  handleSelect,
  popoverItems,
  printView,
}) {
  const classes = makeStyles(styles, { name: 'MarketTableRow' })();
  const referenceDataStatusesPolicyMarketQuote = useSelector(selectRefDataStatusesMarketQuote);
  const referenceDataAccountStatuses = useSelector(selectFormattedAccountStatusList);
  const currency = utils.market.getCurrency(market);
  const percentage = round(utils.market.getLineSize(market), config.ui.format.percent.decimal);
  const underwriters = get(market, 'underwriter') || {};
  const underwritersName = utils.user.fullname(underwriters);
  const underwriterGroup = showUnderwriterGroup && utils.market.getUnderwriterGroup(market);
  const signedPercentage = round(utils.market.getLineSize(market, true), config.ui.format.percent.decimal);
  const marketName = utils.market.getName(market);
  const marketStatus = utils.referenceData.status.getLabelById(referenceDataStatusesPolicyMarketQuote, market.statusId);
  const marketPremium = inlineEditValues ? inlineEditValues['premium'] || market.premium : market.premium;
  const marketWritten = inlineEditValues ? inlineEditValues['writtenLinePercentage'] || percentage : percentage;
  const marketSigned = inlineEditValues ? inlineEditValues['orderPercentage'] || signedPercentage : signedPercentage;
  const marketCapacityId = get(market, 'market.capacityTypeId');
  const marketCapacity = capacities.find((c) => c.id === marketCapacityId) || {};

  const isEditingPremium = isEditing && Array.isArray(isEditing) && isEditing.includes('premium');
  const isEditingWritten = isEditing && Array.isArray(isEditing) && isEditing.includes('writtenLinePercentage');
  const isEditingSigned = isEditing && Array.isArray(isEditing) && isEditing.includes('orderPercentage');
  const isSelectable = utils.generic.isFunction(handleSelect);
  const isToggable = utils.generic.isFunction(handleToggle);
  const isEditable = inlineEditValues && utils.generic.isFunction(inlineEditOnClick) && utils.generic.isFunction(inlineEditOnClickAway);
  const isEditablePremium = isEditable && has(inlineEditValues, 'premium');
  const isEditableWritten = isEditable && has(inlineEditValues, 'writtenLinePercentage');
  const isEditableSigned = isEditable && has(inlineEditValues, 'orderPercentage');
  const hasStatus = !!(market.market && market.market.statusId);

  const classesRow = {
    [classes.row]: true,
    [classes.rowLast]: isLast,
    [classes.rowSelected]: isSelected,
  };

  const marketClasses = {
    [classes.market]: true,
    [classes.marketWithoutStatus]: !hasStatus,
  };

  return (
    <TableRow hover onClick={isToggable ? handleToggle(market.id) : undefined} className={classnames(classesRow)} data-testid="market-row">
      <TableCell minimal data-testid="market-main-cell">
        <div className={classnames(marketClasses)}>
          <Restricted include={[constants.ROLE_BROKER]}>
            {hasStatus && <StatusIcon translationPath="statusMarket" list={referenceDataAccountStatuses} id={market.market.statusId} />}
          </Restricted>
          {!printView && isSelectable && (
            <Restricted include={[constants.ROLE_BROKER]}>
              <TableCheckbox
                checked={isChecked}
                disabled={isDisabled}
                handleClick={handleSelect(market.id)}
                tooltip={isDisabled ? { title: utils.string.t('placement.sheet.marketsNotAllowed') } : undefined}
                nestedClasses={{ root: classes.checkbox }}
                data-testid="market-row-checkbox"
              />
            </Restricted>
          )}

          <div className={classes.marketDetails}>
            {marketName && (
              <div className={classes.marketName} data-testid="market-name">
                <Box display="flex" alignItems="center" position="relative">
                  <span>
                    {underwriterGroup && (
                      <span
                        title={utils.string.t('placement.bound.underwriterGroup', { group: underwriterGroup })}
                        className={classes.marketUnderwriterGroup}
                      >
                        [{underwriterGroup}]
                      </span>
                    )}
                    {marketName}
                  </span>
                  {marketCapacity && marketCapacity.color && (
                    <Box ml={0.5} mb={underwritersName ? '-1px' : '-2px'}>
                      <Avatar text=" " size={10} bg={marketCapacity.color} title={marketCapacity.name} />
                    </Box>
                  )}
                </Box>
                {market.isLeader && (
                  <Status
                    size="xs"
                    text={<Translate label="placement.generic.lead" />}
                    status="light"
                    nestedClasses={{ root: classes.marketTag }}
                    data-testid="market-generic-lead"
                  />
                )}
                {market.lineToStand && (
                  <Status
                    size="xs"
                    text={<Translate label="placement.generic.lineToStand" />}
                    status="light"
                    nestedClasses={{ root: classes.marketTag }}
                    data-testid="market-line-to-stand-cell"
                  />
                )}
              </div>
            )}
            {underwritersName && <div className={classes.marketContact}>{underwritersName}</div>}
          </div>
        </div>
      </TableCell>

      {showPremium && (
        <TableCell narrow nowrap center data-testid="market-premium-cell">
          {isEditablePremium && (
            <>
              <Restricted include={[constants.ROLE_BROKER]}>
                <InlineEdit
                  name="premium"
                  type="number"
                  variant="currency"
                  currency={marketPremium ? currency : ''}
                  value={inlineEditValues['premium']}
                  editing={isEditingPremium}
                  onClick={inlineEditOnClick('premium', market.id)}
                  onClickAway={inlineEditOnClickAway('premium', market)}
                />
              </Restricted>
              <Restricted include={[constants.ROLE_COBROKER, constants.ROLE_UNDERWRITER]}>
                <Translate
                  label="format.currency"
                  options={{ value: { number: marketPremium, currency: marketPremium ? currency : '', default: '-' } }}
                />
              </Restricted>
            </>
          )}
          {!isEditablePremium && (
            <Translate
              label="format.currency"
              options={{ value: { number: marketPremium, currency: marketPremium ? currency : '', default: '-' } }}
            />
          )}
        </TableCell>
      )}

      {showWritten && (
        <TableCell narrow nowrap center data-testid="market-written-cell">
          {isEditableWritten && (
            <>
              <Restricted include={[constants.ROLE_BROKER]}>
                <InlineEdit
                  name="writtenLinePercentage"
                  type="number"
                  variant="percent"
                  value={inlineEditValues['writtenLinePercentage']}
                  editing={isEditingWritten}
                  onClick={inlineEditOnClick('writtenLinePercentage', market.id)}
                  onClickAway={inlineEditOnClickAway('writtenLinePercentage', market)}
                />
              </Restricted>
              <Restricted include={[constants.ROLE_COBROKER, constants.ROLE_UNDERWRITER]}>
                <Translate label="format.percent" options={{ value: { number: marketWritten, default: '-' } }} />
              </Restricted>
            </>
          )}
          {!isEditableWritten && <Translate label="format.percent" options={{ value: { number: marketWritten, default: '-' } }} />}
        </TableCell>
      )}

      {showSigned && (
        <TableCell narrow nowrap center data-testid="market-signed-cell">
          {isEditableSigned && (
            <>
              <Restricted include={[constants.ROLE_BROKER]}>
                <InlineEdit
                  name="orderPercentage"
                  type="number"
                  variant="percent"
                  value={inlineEditValues['orderPercentage']}
                  editing={isEditingSigned}
                  onClick={inlineEditOnClick('orderPercentage', market.id)}
                  onClickAway={inlineEditOnClickAway('orderPercentage', market)}
                />
              </Restricted>
              <Restricted include={[constants.ROLE_COBROKER, constants.ROLE_UNDERWRITER]}>
                <Translate label="format.percent" options={{ value: { number: marketSigned } }} />
              </Restricted>
            </>
          )}
          {!isEditableSigned && <Translate label="format.percent" options={{ value: { number: marketSigned } }} />}
        </TableCell>
      )}

      {showStatus && (
        <TableCell compact narrow nowrap center data-testid="market-status-cell">
          {marketStatus && <Status size="sm" text={<Translate label={`status.${marketStatus}`} />} status={marketStatus} />}
        </TableCell>
      )}

      <TableCell menu data-testid="market-menu-cell">
        {!printView && popoverItems && popoverItems.length > 0 && (
          <Restricted include={[constants.ROLE_BROKER]}>
            <PopoverMenu
              id="market-sheet-market"
              data={{
                title: marketName,
                policy: policy,
                policyMarket: market,
              }}
              items={popoverItems}
            />
          </Restricted>
        )}
      </TableCell>
    </TableRow>
  );
}

export default MarketTableRow;
