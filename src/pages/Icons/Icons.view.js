import React, { useState } from 'react';

// app
import styles from './Icons.styles';
import { FilterBar, Layout, SectionHeader } from 'components';
import * as utils from 'utils';

// mui
import { makeStyles, List, ListItem, ListItemText, ListItemIcon, Typography } from '@material-ui/core';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import AddIcon from '@material-ui/icons/Add';
import ApartmentIcon from '@material-ui/icons/Apartment';
import AssignmentIcon from '@material-ui/icons/Assignment';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import BallotIcon from '@material-ui/icons/Ballot';
import CallMadeIcon from '@material-ui/icons/CallMade';
import CancelIcon from '@material-ui/icons/Cancel';
import CheckIcon from '@material-ui/icons/Check';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import CloseIcon from '@material-ui/icons/Close';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import DashboardIcon from '@material-ui/icons/Dashboard';
import DescriptionIcon from '@material-ui/icons/Description';
import EventIcon from '@material-ui/icons/Event';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import FlagOutlinedIcon from '@material-ui/icons/FlagOutlined';
import FlightTakeoffIcon from '@material-ui/icons/FlightTakeoff';
import FullScreenIcon from '@material-ui/icons/Fullscreen';
import FullScreenExitIcon from '@material-ui/icons/FullscreenExit';
import GavelIcon from '@material-ui/icons/Gavel';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import HomeIcon from '@material-ui/icons/Home';
import HowToVoteIcon from '@material-ui/icons/HowToVote';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import LanguageIcon from '@material-ui/icons/Language';
import LaunchIcon from '@material-ui/icons/Launch';
import LayersIcon from '@material-ui/icons/Layers';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import LockIcon from '@material-ui/icons/Lock';
import MapIcon from '@material-ui/icons/Map';
import MenuIcon from '@material-ui/icons/Menu';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import PeopleIcon from '@material-ui/icons/People';
import PersonIcon from '@material-ui/icons/Person';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import PhotoOutlinedIcon from '@material-ui/icons/PhotoOutlined';
import PostAddIcon from '@material-ui/icons/PostAdd';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import LocationOffIcon from '@material-ui/icons/LocationOff';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import PolicyIcon from '@material-ui/icons/Policy';
import PublicIcon from '@material-ui/icons/Public';
import ReportProblemOutlinedIcon from '@material-ui/icons/ReportProblemOutlined';
import SearchIcon from '@material-ui/icons/Search';
import SettingsIcon from '@material-ui/icons/Settings';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import StorageIcon from '@material-ui/icons/Storage';
import SubdirectoryArrowRightIcon from '@material-ui/icons/SubdirectoryArrowRight';
import TodayIcon from '@material-ui/icons/Today';
import WidgetsIcon from '@material-ui/icons/Widgets';
import DonutLargeIcon from '@material-ui/icons/DonutLarge';

export function IconsView() {
  const classes = makeStyles(styles, { name: 'Icons' })();

  const [query, setQuery] = useState('');

  const items = [
    { id: 'actions', name: 'Actions (menu)', icon: MoreVertIcon, tags: 'kebab ellipsis menu' },
    { id: 'add', name: 'Add', icon: AddIcon, tags: 'plus ui' },
    { id: 'admin', name: 'Admin', icon: SettingsIcon, tags: 'settings ui' },
    { id: 'amount', name: 'Amount (currency)', icon: AttachMoneyIcon, tags: 'dollar money currency' },
    { id: 'bind', name: 'Bind', icon: PostAddIcon, tags: 'bound quote risk product' },
    { id: 'boundPlacement', name: 'Bound (placement)', icon: LockIcon, tags: 'placement' },
    { id: 'broker', name: 'Broker', icon: PeopleIcon, tags: 'user people avatar' },
    { id: 'chart', name: 'Chart', icon: EqualizerIcon, tags: 'graph' },
    { id: 'check', name: 'Check', icon: CheckIcon, tags: 'done ui' },
    { id: 'checkFilled', name: 'Check (filled)', icon: CheckCircleIcon, tags: 'done ui' },
    { id: 'checkOutlined', name: 'Check (outlined)', icon: CheckCircleOutlineIcon, tags: 'done ui' },
    { id: 'client', name: 'Client', icon: ApartmentIcon, tags: 'building placement' },
    { id: 'close', name: 'Close', icon: CloseIcon, tags: 'ui revert' },
    { id: 'cobroker', name: 'Co-broker', icon: PeopleIcon, tags: 'user people avatar' },
    { id: 'dateFrom', name: 'Date From', icon: TodayIcon, tags: 'calendar' },
    { id: 'dateTo', name: 'Date To', icon: EventIcon, tags: 'calendar' },
    { id: 'department', name: 'Department', icon: AccountBalanceIcon, tags: 'building home' },
    { id: 'document', name: 'Document (file)', icon: DescriptionIcon, tags: 'file folder' },
    { id: 'external', name: 'External (link)', icon: LaunchIcon, tags: 'web internet' },
    { id: 'firmOrderPlacement', name: 'Firm Order (placement)', icon: GavelIcon, tags: 'placement' },
    { id: 'fullscreenOpen', name: 'Fullscreen (open)', icon: FullScreenIcon, tags: 'ui map expand open' },
    { id: 'fullscreenClose', name: 'Fullscreen (close)', icon: FullScreenExitIcon, tags: 'ui map collapse close' },
    { id: 'home', name: 'Home', icon: HomeIcon, tags: 'building' },
    { id: 'image', name: 'Image', icon: PhotoOutlinedIcon, tags: 'picture' },
    { id: 'info', name: 'Info', icon: InfoOutlinedIcon, tags: 'warning error ui' },
    { id: 'lead', name: 'Lead', icon: CallMadeIcon, tags: 'arrow placement' },
    { id: 'layer', name: 'Layer (map)', icon: LayersIcon, tags: '' },
    { id: 'location', name: 'Location', icon: LocationOnIcon, tags: 'pin map' },
    { id: 'locationOff', name: 'Location (remove)', icon: LocationOffIcon, tags: 'pin map' },
    { id: 'map', name: 'Map', icon: MapIcon, tags: 'location' },
    { id: 'market', name: 'Market', icon: ShoppingCartIcon, tags: '' },
    { id: 'marketSheetPlacement', name: 'Market Sheet (placement)', icon: ShoppingCartIcon, tags: 'placement' },
    { id: 'menu', name: 'Menu', icon: MenuIcon, tags: 'ui menu' },
    { id: 'modelling', name: 'Modelling', icon: StorageIcon, tags: 'placement' },
    { id: 'news', name: 'News', icon: AssignmentIcon, tags: 'industry' },
    { id: 'openingMemo', name: 'Opening Memo', icon: PlaylistAddCheckIcon, tags: 'om' },
    { id: 'opportunity', name: 'Opportunity', icon: PublicIcon, tags: 'world earth planet' },
    { id: 'overviewPlacement', name: 'Overview (placement)', icon: DashboardIcon, tags: 'widget app layout' },
    { id: 'pdf', name: 'PDF', icon: PictureAsPdfIcon, tags: 'file' },
    { id: 'policy', name: 'Policy', icon: PolicyIcon, tags: 'risk product' },
    { id: 'productRisk', name: 'Product (risk)', icon: BallotIcon, tags: 'risk product' },
    { id: 'productType', name: 'Product (type)', icon: LocalOfferIcon, tags: 'risk product' },
    { id: 'quote', name: 'Quote', icon: HowToVoteIcon, tags: 'risk product' },
    { id: 'remove', name: 'Remove (outline)', icon: HighlightOffIcon, tags: 'clear delete ui' },
    { id: 'removeFilled', name: 'Remove (filled)', icon: CancelIcon, tags: 'clear delete ui' },
    { id: 'renew', name: 'Renew', icon: AutorenewIcon, tags: 'update ui' },
    { id: 'satellite', name: 'Satellite', icon: LanguageIcon, tags: 'world earth planet' },
    { id: 'search', name: 'Search', icon: SearchIcon, tags: 'magnifier ui' },
    { id: 'status', name: 'Status', icon: FlagOutlinedIcon, tags: 'flag' },
    { id: 'subDirectory', name: 'Sub-directory', icon: SubdirectoryArrowRightIcon, tags: 'arrow ui' },
    { id: 'trip', name: 'Trip', icon: FlightTakeoffIcon, tags: 'plane airplane transport' },
    { id: 'upload', name: 'Upload', icon: CloudUploadIcon, tags: 'file document' },
    { id: 'user', name: 'User', icon: PersonIcon, tags: 'people person avatar' },
    { id: 'warning', name: 'Warning', icon: ReportProblemOutlinedIcon, tags: 'error info' },
    { id: 'reporting', name: 'reporting', icon: DonutLargeIcon, tags: 'reporting' },
  ];

  const fields = [
    {
      gridSize: { xs: 12 },
      name: 'text',
      type: 'text',
      placeholder: 'Search icons...',
      value: '',
      onChange:
        () =>
        ([{ target }]) => {
          setQuery(target && target.value ? target.value.trim() : '');
          return target.value;
        },
    },
  ];

  const actions = [
    {
      name: 'filter',
      label: utils.string.t('app.filter'),
      handler: (values) => {
        setQuery(values.text);
      },
    },
    {
      name: 'reset',
      label: utils.string.t('app.reset'),
      handler: () => {
        setQuery('');
      },
    },
  ];

  const filterItems = items.filter((item) => {
    const { id, name, icon, tags } = item;
    const q = query.toLowerCase();

    if (q) {
      return [id, name, icon.displayName, tags].some((prop) => {
        return prop.toLowerCase().includes(q);
      });
    }

    return true;
  });

  return (
    <Layout testid="icons">
      <Layout main>
        <SectionHeader title={utils.string.t('icons.title')} icon={WidgetsIcon} testid="icons" />

        <FilterBar id="iconFilter" fields={fields} actions={actions} />

        <List>
          {filterItems.map((item) => {
            const Icon = item.icon;

            return (
              <ListItem key={item.id}>
                <ListItemIcon className={classes.icon}>
                  <Icon />
                </ListItemIcon>
                <ListItemText>
                  {item.name}{' '}
                  <Typography display="inline" variant="body2" className={classes.iconName}>
                    ({item.icon.displayName})
                  </Typography>
                </ListItemText>
              </ListItem>
            );
          })}
        </List>
      </Layout>
    </Layout>
  );
}
