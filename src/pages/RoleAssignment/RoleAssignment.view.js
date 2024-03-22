import React from 'react';

// app
import { Layout, Loader, SectionHeader, Translate } from 'components';
import { RoleAssignment, RoleAssignmentSummary } from 'modules';
import { useMedia } from 'hooks';

// mui
import PeopleIcon from '@material-ui/icons/People';

export function RoleAssignmentView() {
  const media = useMedia();

  return (
    <Layout testid="department">
      <Layout main padding>
        <SectionHeader title={<Translate label="roleAssignment.headerTitle" />} icon={PeopleIcon} testid="roleAssignment" />
        <RoleAssignment />
      </Layout>

      {media.tabletUp && (
        <Layout sidebar padding={false}>
          <RoleAssignmentSummary />
          <Loader visible={false} panel /> {/* add 'visible' property to loader*/}
        </Layout>
      )}
    </Layout>
  );
}
