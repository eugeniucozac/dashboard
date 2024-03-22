import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router';
import { firstBy } from 'thenby';
import kebabCase from 'lodash/kebabCase';
import toNumber from 'lodash/toNumber';
import flatten from 'lodash/flatten';
import isEmpty from 'lodash/isEmpty';
import uniqBy from 'lodash/uniqBy';
import range from 'lodash/range';
import pick from 'lodash/pick';
import xor from 'lodash/xor';
import get from 'lodash/get';

// app
import styles from './ClientCharts.styles';
import { updatePortfolioMapDepartment, resetPortfolioMap } from 'stores';
import { AvatarGroup, CardList, PageHeader, PopoverMenu, Sticky, Button, Translate, SectionHeader } from 'components';
import { ChartPremiumByAccount, ChartPremiumByMarket, ChartPremiumByYear, PortfolioMapHeader } from 'modules';
import { showModal } from 'stores';
import { withThemeListener } from 'hoc';
import * as utils from 'utils';
import config from 'config';

// mui
import { withStyles, withTheme, Typography } from '@material-ui/core';
import PeopleIcon from '@material-ui/icons/People';
import EventAvailableIcon from '@material-ui/icons/EventAvailable';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import MapIcon from '@material-ui/icons/Map';

// state
const mapStateToProps = (state) => ({
  user: state.user,
  referenceDataCurrencies: state.referenceData.currencies,
  referenceDataDepartments: state.referenceData.departments,
  filteredDepartments: state.portfolioMap.tiv.filteredDepartments,
});

// dispatch
const mapDispatchToProps = {
  showModal,
  updatePortfolioMapDepartment,
  resetPortfolioMap,
};

export class ClientCharts extends PureComponent {
  constructor(props) {
    super(props);

    const currentYear = utils.app.getCurrentYear();

    this.state = {
      years: range(currentYear, 2018), // 2018 won't be included in the range, 2019 will therefore be the last
      selectedYear: currentYear,
      selectedDepartments: [],
      selectedOffices: [],
    };
  }

  static propTypes = {
    type: PropTypes.oneOf(['client', 'market']),
  };

  static defaultProps = {
    showByMarket: true,
    showByYear: true,
    showOfficeSelection: true,
  };

  getUrlParamsOfficeIds = () => {
    const officeIds = get(this.props, 'match.params.officeIds');

    // abort
    if (!officeIds) return [];

    const offices = officeIds.split('-') || [];

    return offices.map((o) => toNumber(o));
  };

  getDepartments = (placements, placementsYear) => {
    const { selectedDepartments } = this.state;
    const { referenceDataDepartments } = this.props;

    return placements
      .reduce((list, placement) => {
        const year = utils.placement.getYear(placement);
        const isValid = year === placementsYear;

        // Only keep placements for defined year
        if (!isValid) return list;

        const deptId = placement.departmentId;
        const deptName = utils.placement.getDepartmentName(placement, referenceDataDepartments);
        const premiumByCurrency = utils.placement.getPremiumBySettlementCurrency(placement, true, true);
        const isNew = !list.some((item) => item.id === deptId);

        return isNew
          ? [
              ...list,
              {
                id: deptId,
                name: deptName,
                premiumByCurrency,
                active: selectedDepartments.includes(deptId),
              },
            ]
          : list.map((dept) => {
              if (dept.id === deptId) {
                return {
                  ...dept,
                  premiumByCurrency: utils.placement.mergePremiumsByCurrency(dept.premiumByCurrency, premiumByCurrency),
                };
              }

              return dept;
            });
      }, [])
      .sort(firstBy('premiumByCurrency', -1));
  };

  getDepartmentsList = (placements, selectedYear, filterEmpty = false) => {
    const departments = this.getDepartments(placements, selectedYear).map((dept) => {
      return {
        id: `${dept.id}-${dept.name}`,
        rawId: dept.id,
        title: dept.name || '-',
        children: this.premiumsByCurrency(dept.premiumByCurrency),
        active: dept.active,
        onClick: this.handleClickFilter('departments', dept.id),
      };
    });
    return filterEmpty
      ? departments.filter(
          (dep) =>
            flatten(dep.children.props.children.filter((depVal) => utils.generic.isValidArray(depVal))).filter((dep) => !!dep).length > 0
        )
      : departments;
  };

  premiumsByCurrency = (premiumByCurrency) => {
    const { classes } = this.props;
    return (
      <ul className={classes.premiumByCurrency}>
        {isEmpty(premiumByCurrency) && <li>0</li>}
        {Object.keys(premiumByCurrency).map((currency) => (
          <li key={currency}>
            {utils.string.t('format.currency', { value: { number: premiumByCurrency[currency], currency, default: '-' } })}
          </li>
        ))}
      </ul>
    );
  };

  getOffices = (placements, offices = [], customSelectedDepartments) => {
    const { selectedDepartments, selectedOffices } = this.state;

    const defaultOffices = offices.map((office) => {
      return {
        ...pick(office, ['id', 'name', 'clients', 'cobrokers']),
        active: selectedOffices.includes(office.id),
        placements: [],
        premiumByCurrency: {},
      };
    });

    return placements
      .reduce((list, placement) => {
        const year = utils.placement.getYear(placement);
        const isValid = year === this.state.selectedYear;

        // Only keep placements for defined year
        if (!isValid) return list;

        const premiumByCurrency = utils.placement.getPremiumBySettlementCurrency(placement, true, true);

        const hasPremiums = Boolean(premiumByCurrency);
        const isWithinDepartments = customSelectedDepartments
          ? customSelectedDepartments.includes(placement.departmentId)
          : selectedDepartments.includes(placement.departmentId);

        if (hasPremiums && isWithinDepartments) {
          placement.clients.forEach((client) => {
            offices.forEach((office) => {
              const officeId = office.id;
              const isClientInOffice = office.clients.some((c) => c.id === client.id);
              if (isClientInOffice) {
                list = list.map((listObj) => {
                  if (listObj.id === officeId) {
                    const isPlacementAlreadyIn = listObj.placements.includes(placement.id);

                    if (!isPlacementAlreadyIn) {
                      return {
                        ...listObj,
                        premiumByCurrency: utils.placement.mergePremiumsByCurrency(listObj.premiumByCurrency, premiumByCurrency),
                        placements: [...listObj.placements, placement.id],
                      };
                    }
                  }

                  return listObj;
                });
              }
            });
          });
        }

        return list;
      }, defaultOffices)
      .filter((o) => {
        return Object.keys(o.premiumByCurrency).length > 0;
      })
      .sort(firstBy('premiumByCurrency', -1).thenBy(utils.sort.array('lexical', 'name')));
  };

  getOfficesList = (offices) => {
    return offices.map((o) => {
      return {
        id: `${o.id}-${o.name}`,
        title: o.name || '-',
        children: this.premiumsByCurrency(o.premiumByCurrency),
        active: o.active,
        onClick: this.handleClickFilter('offices', o.id),
      };
    });
  };

  getUsers = (offices) => {
    const users = offices.reduce((acc, office) => {
      if (!office.active || !office.cobrokers || !Array.isArray(office.cobrokers)) return acc;

      return [...acc, ...office.cobrokers];
    }, []);

    return uniqBy(users, 'id');
  };

  filterPlacements = (placements, offices) => {
    const { selectedDepartments, selectedOffices } = this.state;

    // abort
    if (utils.generic.isInvalidOrEmptyArray(placements) || utils.generic.isInvalidOrEmptyArray(offices)) return [];

    const activeOffices = offices.filter((o) => selectedOffices.includes(o.id));
    const activeOfficeClients = uniqBy(flatten(activeOffices.map((office) => office.clients)), 'id') || [];

    // only keep placement within the selected departments/offices
    return placements.filter((placement) => {
      const placementClients = placement.clients || [];
      const isWithinDepartments = selectedDepartments.includes(placement.departmentId);
      const isWithinOffices = placementClients.some((p) => activeOfficeClients.some((c) => c.id === p.id));

      return isWithinDepartments && isWithinOffices;
    });
  };

  handleClickFilter = (type, id) => (event) => {
    const { updatePortfolioMapDepartment, filteredDepartments } = this.props;

    switch (type) {
      case 'departments':
        const selectedDepartments = xor(this.state.selectedDepartments, [id]);
        const selectedCardDepartments = filteredDepartments.map((dep) => (dep.rawId === id ? { ...dep, active: !dep.active } : dep));
        updatePortfolioMapDepartment(selectedCardDepartments);
        this.setState({ selectedDepartments });
        break;
      case 'offices':
        this.setState({
          selectedOffices: xor(this.state.selectedOffices, [id]),
        });
        break;
      default:
        break;
    }
  };

  handleClickChangeParent = (parent) => (event) => {
    const { type } = this.props;
    const officeId = parent && parent.id;
    const officeSlug = parent && parent.name ? `/${kebabCase(parent.name)}` : '';

    this.props.history.push(`${config.routes[type].item}/${officeId}${officeSlug}`);
  };

  handleClickChangeYear = (year) => (event) => {
    this.setState({ selectedYear: year });
  };

  componentWillUnmount() {
    const { resetPortfolioMap } = this.props;
    resetPortfolioMap();
  }

  componentDidMount() {
    const { selectedYear } = this.state;
    const { user, parent, history, match, updatePortfolioMapDepartment } = this.props;

    const userDeptId = utils.user.department.getDefault(user);
    const departments = this.getDepartments(parent.placements, selectedYear);
    const offices = this.getOffices(
      parent.placements,
      parent.offices,
      departments.map((d) => d.id)
    );
    const urlParamsOfficeIds = this.getUrlParamsOfficeIds();
    const params = match && get(match, 'params');

    // departments
    if (utils.generic.isValidArray(departments, true)) {
      const defaultDept = departments.find((d) => d.id === userDeptId);
      const newSelectedDepartments = defaultDept && defaultDept.id ? [defaultDept.id] : departments.map((d) => d.id);
      const cardDepartments = this.getDepartmentsList(parent.placements, selectedYear, true);
      const cardDepartmentsWithSelection = newSelectedDepartments.length
        ? cardDepartments.map((dep) => (dep.rawId === newSelectedDepartments[0] ? { ...dep, active: true } : dep))
        : cardDepartments;

      updatePortfolioMapDepartment(cardDepartmentsWithSelection);

      this.setState({ selectedDepartments: newSelectedDepartments });
    }

    // offices
    if (utils.generic.isValidArray(offices, true)) {
      const defaultOfficesFromUrlParams = offices.filter((o) => urlParamsOfficeIds.includes(o.id));
      const newSelectedOffices = utils.generic.isValidArray(defaultOfficesFromUrlParams, true)
        ? defaultOfficesFromUrlParams.map((o) => o.id)
        : offices.map((o) => o.id);

      this.setState({ selectedOffices: newSelectedOffices });
    }

    // redirect to shorter URL if requested office doesn't exist
    if (utils.generic.isValidArray(urlParamsOfficeIds, true) && !offices.some((o) => urlParamsOfficeIds.includes(o.id))) {
      if (params && params.id && params.slug) {
        history.replace(`${config.routes.client.item}/${params.id}/${params.slug}`);
      } else {
        history.replace(`${config.routes.client.item}`);
      }
    }
  }

  handleViewPortfolio = () => {
    const { parent, showModal, type } = this.props;
    const logo = utils.client.parent.getLogoFilePath(parent.selected);

    showModal({
      component: 'PORTFOLIO_MAP',
      props: {
        fullWidth: true,
        fullScreen: true,
        titleChildren: <PortfolioMapHeader logo={logo} title={`portfolio.title_${type}`} />,
        disableAutoFocus: true,
        componentProps: {
          parent,
        },
      },
    });
  };

  render() {
    const { years, selectedYear } = this.state;
    const { type, showByMarket, showByYear, showOfficeSelection, pageIcon, pageTitle, parent, tabletUp, theme, classes } = this.props;

    // abort
    if (!parent.selected) return null;

    const headerLogo = utils.client.parent.getLogoFilePath(parent.selected);
    const parentName = parent.selected ? parent.selected.name : '';
    const hasMultipleItems = parent.list.length > 1;
    const stickyParent = tabletUp ? utils.app.getElement('#content') : null;
    const stickyOffset = tabletUp ? 0 : theme.mixins.header.height;

    const filteredOffices = this.getOffices(parent.placements, parent.offices);
    const filteredPlacements = this.filterPlacements(parent.placements, filteredOffices);

    const departmentsList = this.getDepartmentsList(parent.placements, selectedYear);
    const officesList = this.getOfficesList(filteredOffices);
    const usersList = this.getUsers(filteredOffices);

    const Select = (
      <PopoverMenu
        id={`${type}-select`}
        text={parentName}
        size="small"
        offset
        icon={ArrowDropDownIcon}
        iconPosition="right"
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        items={parent.list.map((parent) => {
          return {
            id: parent.id,
            label: parent.name,
            callback: this.handleClickChangeParent(parent),
          };
        })}
      />
    );

    const yearSelect = (
      <PopoverMenu
        id="year-select"
        text={selectedYear.toString() || '-'}
        size="small"
        offset
        icon={ArrowDropDownIcon}
        iconPosition="right"
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        items={years.map((year) => {
          return {
            id: year,
            label: year.toString(),
            callback: this.handleClickChangeYear(year),
          };
        })}
      />
    );

    const usersContent = usersList && usersList.length > 0 && (
      <AvatarGroup users={usersList} max={4} nestedClasses={{ root: classes.avatars }} />
    );

    return (
      <Fragment>
        <SectionHeader title={pageTitle} icon={pageIcon} testid={`${type}-chart-section-header`} nestedClasses={{ root: classes.header }}>
          <Button
            icon={MapIcon}
            size="medium"
            text={<Translate label="portfolio.title" />}
            variant="contained"
            color="secondary"
            onClick={this.handleViewPortfolio}
            data-testid="view-portfolio"
          />
        </SectionHeader>
        <PageHeader
          logo={headerLogo}
          items={[
            {
              icon: pageIcon,
              title: utils.string.t(`app.${type}`),
              content: hasMultipleItems ? (
                Select
              ) : (
                <Typography variant="body2" color="textSecondary" className={classes.parentName}>
                  {parentName}
                </Typography>
              ),
            },
            {
              icon: EventAvailableIcon,
              title: utils.string.t('app.year'),
              content: yearSelect,
            },
            {
              icon: PeopleIcon,
              title: utils.string.t('app.users'),
              content: usersContent,
            },
          ]}
        />

        {parent.placements && parent.placements.length > 0 && (
          <Fragment>
            <Sticky top={stickyOffset} parent={stickyParent} nestedClasses={{ root: classes.sticky }}>
              <div className={classes.filterGroup}>
                {utils.generic.isValidArray(departmentsList, true) && (
                  <div className={classes.filter}>
                    <CardList title="Departments" data={departmentsList} nestedClasses={{ card: classes.card }} />
                  </div>
                )}
                {utils.generic.isValidArray(officesList, true) && showOfficeSelection && (
                  <div className={classes.filter}>
                    <CardList title="Offices" data={officesList} nestedClasses={{ card: classes.card }} />
                  </div>
                )}
              </div>
            </Sticky>

            <div className={classes.content}>
              <ChartPremiumByAccount placements={filteredPlacements} year={selectedYear} offices={filteredOffices} />
              {showByMarket && <ChartPremiumByMarket placements={filteredPlacements} year={selectedYear} offices={filteredOffices} />}
              {showByYear && <ChartPremiumByYear placements={filteredPlacements} />}
            </div>
          </Fragment>
        )}
      </Fragment>
    );
  }
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
  withThemeListener,
  withTheme
)(ClientCharts);
