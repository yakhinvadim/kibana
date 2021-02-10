/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React, { useEffect } from 'react';

import { useActions, useValues } from 'kea';

import { EuiCallOut, EuiEmptyPrompt, EuiSpacer, EuiPanel } from '@elastic/eui';
import { i18n } from '@kbn/i18n';

import { LicensingLogic } from '../../../../applications/shared/licensing';
import { Loading } from '../../../shared/loading';
import { EuiButtonTo } from '../../../shared/react_router_helpers';
import { AppLogic } from '../../app_logic';
import noSharedSourcesIcon from '../../assets/share_circle.svg';
import { ContentSection } from '../../components/shared/content_section';
import { SourcesTable } from '../../components/shared/sources_table';
import { ADD_SOURCE_PATH, getSourcesPath } from '../../routes';

import {
  AND,
  PRIVATE_LINK_TITLE,
  PRIVATE_HEADER_TITLE,
  PRIVATE_HEADER_DESCRIPTION,
  PRIVATE_SHARED_SOURCES_TITLE,
  PRIVATE_EMPTY_TITLE,
  SHARED_EMPTY_TITLE,
  SHARED_EMPTY_DESCRIPTION,
  LICENSE_CALLOUT_TITLE,
  LICENSE_CALLOUT_DESCRIPTION,
} from './constants';
import { SourcesLogic } from './sources_logic';
import { SourcesView } from './sources_view';

export const PrivateSources: React.FC = () => {
  const { hasPlatinumLicense } = useValues(LicensingLogic);
  const { initializeSources, setSourceSearchability, resetSourcesState } = useActions(SourcesLogic);

  useEffect(() => {
    initializeSources();
    return resetSourcesState;
  }, []);

  const { dataLoading, contentSources, serviceTypes, privateContentSources } = useValues(
    SourcesLogic
  );

  const {
    account: { canCreatePersonalSources, groups },
  } = useValues(AppLogic);

  if (dataLoading) return <Loading />;

  const hasConfiguredConnectors = serviceTypes.some(({ configured }) => configured);
  const canAddSources = canCreatePersonalSources && hasConfiguredConnectors;
  const hasPrivateSources = privateContentSources?.length > 0;
  const hasSharedSources = contentSources.length > 0;

  const headerAction = (
    <EuiButtonTo
      to={getSourcesPath(ADD_SOURCE_PATH, false)}
      fill
      color="primary"
      data-test-subj="AddSourceButton"
    >
      {PRIVATE_LINK_TITLE}
    </EuiButtonTo>
  );

  const privateSourcesTable = (
    <ContentSection
      title={PRIVATE_HEADER_TITLE}
      description={PRIVATE_HEADER_DESCRIPTION}
      action={canAddSources && headerAction}
    >
      <SourcesTable
        showDetails
        onSearchableToggle={setSourceSearchability}
        sources={privateContentSources}
      />
    </ContentSection>
  );

  const privateSourcesEmptyState = (
    <ContentSection
      className="zero-state__private-sources"
      title={PRIVATE_HEADER_TITLE}
      description={PRIVATE_HEADER_DESCRIPTION}
      action={canAddSources && headerAction}
    >
      <EuiPanel className="euiPanel--inset">
        <EuiSpacer size="xxl" />
        <EuiEmptyPrompt iconType="lock" title={<h2>{PRIVATE_EMPTY_TITLE}</h2>} />
        <EuiSpacer size="xxl" />
      </EuiPanel>
    </ContentSection>
  );

  const sharedSourcesEmptyState = (
    <ContentSection className="zero-state__private-sources">
      <EuiPanel className="euiPanel--inset">
        <EuiSpacer size="xxl" />
        <EuiEmptyPrompt
          iconType={noSharedSourcesIcon}
          title={<h2>{SHARED_EMPTY_TITLE}</h2>}
          body={<p>{SHARED_EMPTY_DESCRIPTION}</p>}
        />
        <EuiSpacer size="xxl" />
      </EuiPanel>
    </ContentSection>
  );

  const privateSources = hasPrivateSources ? privateSourcesTable : privateSourcesEmptyState;

  const groupsSentence =
    groups.length === 1
      ? `${groups}`
      : `${groups.slice(0, groups.length - 1).join(', ')}${
          groups.length === 2 ? '' : ','
        } ${AND} ${groups.slice(-1)}`;

  const sharedSources = (
    <ContentSection
      title={PRIVATE_SHARED_SOURCES_TITLE}
      description={i18n.translate(
        'xpack.enterpriseSearch.workplaceSearch.sources.private.privateShared.header.description',
        {
          defaultMessage:
            'You have access to the following sources through the {groups, plural, one {group} other {groups}} {groupsSentence}.',
          values: { groups: groups.length, groupsSentence },
        }
      )}
    >
      <SourcesTable showDetails={false} isOrganization={false} sources={contentSources} />
    </ContentSection>
  );

  const licenseCallout = (
    <>
      <EuiCallOut title={LICENSE_CALLOUT_TITLE} iconType="iInCircle">
        <p>{LICENSE_CALLOUT_DESCRIPTION}</p>
      </EuiCallOut>
      <EuiSpacer />
    </>
  );

  return (
    <SourcesView>
      {hasPrivateSources && !hasPlatinumLicense && licenseCallout}
      {canCreatePersonalSources && privateSources}
      {hasSharedSources ? sharedSources : sharedSourcesEmptyState}
    </SourcesView>
  );
};
