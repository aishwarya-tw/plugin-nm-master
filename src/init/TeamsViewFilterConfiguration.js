import { FiltersListItemType } from '@twilio/flex-ui';

async function fetchTeamManagers(manager) {
  // collect all workers with isTeamManager set to true
  let response = await manager.insightsClient.liveQuery(
    'tr-worker',
    'data.attributes.isTeamManager == "true"'
  );
  let items = response.getItems();
  return Object.values(items).map(supervisor =>
    supervisor.attributes.full_name && supervisor.attributes.full_name !== ''
      ? supervisor.attributes.full_name
      : supervisor.attributes.firstName + ' ' + supervisor.attributes.lastName
  );
}

// This is needed only for the optional customOpsManagerFilter found below.
async function fetchOpsManagers(manager) {
  let response = await manager.insightsClient.liveQuery(
    'tr-worker',
    `data.attributes.isOpsManager == "true"`
  );
  let items = response.getItems();
  return Object.values(items).map(manager => manager.attributes.full_name);
}

async function fetchBpoProviders(manager) {
  // only provide bpo options if bpo is available
  const { serviceConfiguration } = manager;
  const { TeamsViewFilters = {} } = serviceConfiguration.attributes;
  let { bpoList } = TeamsViewFilters;
  const bpoOptionsArray = [];

  if (!bpoList) {
    bpoList = ['Internal', 'Arise', 'Alorica GDL', 'Alorica Honduras', 'Qualfon','Telus', 'CCI'];
  }

  for (const bpo of bpoList) {
    let response = await manager.insightsClient.liveQuery(
      'tr-worker',
      `data.attributes.bpoProvider == "${bpo}"`
    );
    let items = response.getItems();
    if (Object.values(items).length > 0) {
      bpoOptionsArray.push(bpo);
    }
  }
  return bpoOptionsArray;
}

// DISABLED - purpose is to restrict based on BPO, but not needed.
export function applyBpoRestrictions(flex, manager) {
  const bpoProvider = manager.workerClient.attributes.bpoProvider;
  if (bpoProvider && bpoProvider !== 'none') {
    const hiddenExpression = `data.attributes.bpoProvider CONTAINS "${bpoProvider}"`;
    flex.TeamsView.defaultProps.hiddenFilter = hiddenExpression;
  }
}

export async function teamsViewFilters(flex, manager) {
  const teamManagerArray = await fetchTeamManagers(manager);
  teamManagerArray.sort();
  const opsManagerArray = await fetchOpsManagers(manager);
  opsManagerArray.sort();
  const siteLocationsArray = await fetchBpoProviders(manager);
  const customSiteLocation = () => {
    const siteLocations = siteLocationsArray.map(siteLocation => ({
      value: siteLocation,
      label: siteLocation,
      default: false
    }));

    return {
      id: `data.attributes.bpoProvider`,
      title: 'Site Location',
      fieldName: 'bpoProvider',
      type: FiltersListItemType.multiValue,
      options: siteLocations,
      condition: 'IN'
    };
  };

  const customManagerFilter = () => {
    const teamManagers = teamManagerArray.map(teamManager => ({
      value: teamManager,
      label: teamManager,
      default: false
    }));

    return {
      id: `data.attributes.teamManager`,
      title: 'Manager',
      fieldName: 'teamManager',
      type: FiltersListItemType.multiValue,
      options: teamManagers,
      condition: 'IN'
    };
  };

  const customChannelFilter = () => {
    const { serviceConfiguration } = manager;
    const { TeamsViewFilters = {} } = serviceConfiguration.attributes;
    let { channelsList } = TeamsViewFilters;

    if (!channelsList) {
      channelsList = ['SMS', 'Email', 'Voice', 'Chat'];
    }

    const channels = channelsList.map(channel => ({
      value: channel,
      label: channel,
      default: false
    }));

    return {
      id: 'data.attributes.routing.skills',
      title: 'Channels',
      fieldName: 'skills',
      type: FiltersListItemType.multiValue,
      options: channels,
      condition: 'IN'
    };
  };

  // This filter is not necessary for the 'My Team' button.
  // This allows an ops manager to view the team managers directly beneath them.
  const customOpsManagerFilter = () => {
    const opsManagers = opsManagerArray.map(opsManager => ({
      value: opsManager,
      label: opsManager,
      default: false
    }));

    return {
      id: 'data.attributes.opsManager',
      title: 'Ops Manager',
      fieldName: 'opsManager',
      type: FiltersListItemType.multiValue,
      options: opsManagers,
      condition: 'IN'
    };
  };

  flex.TeamsView.defaultProps.filters = [
    flex.TeamsView.activitiesFilter,
    customChannelFilter,
    customManagerFilter,
    customSiteLocation,
    customOpsManagerFilter
  ];
}
