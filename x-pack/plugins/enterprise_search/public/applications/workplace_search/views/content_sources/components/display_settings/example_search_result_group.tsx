/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React from 'react';

import classNames from 'classnames';
import { useValues } from 'kea';

import { getAsLocalDateTimeString } from 'shared/utils/dateUtil';

import { isColorDark, hexToRgb } from '@elastic/eui';

import { DESCRIPTION_LABEL } from '../../../../constants';

import { CustomSourceIcon } from './custom_source_icon';
import { DisplaySettingsLogic } from './display_settings_logic';
import { SubtitleField } from './subtitle_field';
import { TitleField } from './title_field';

export const ExampleSearchResultGroup: React.FC = () => {
  const {
    sourceName,
    searchResultConfig: {
      titleField,
      subtitleField,
      descriptionField,
      typeField,
      mediaTypeField,
      createdByField,
      updatedByField,
      color,
    },
    titleFieldHover,
    subtitleFieldHover,
    descriptionFieldHover,
    typeFieldHover,
    mediaTypeFieldHover,
    createdByFieldHover,
    updatedByFieldHover,
    exampleDocuments,
  } = useValues(DisplaySettingsLogic);

  return (
    <div className="example-result-group" data-test-subj="ExampleSearchResultGroup">
      <div className="example-result-group__header" style={{ backgroundColor: color }}>
        <CustomSourceIcon color={isColorDark.apply(null, hexToRgb(color)) ? 'white' : 'black'} />
        <span
          className="example-result-group__source-name"
          style={{ color: isColorDark.apply(null, hexToRgb(color)) ? 'white' : 'black' }}
        >
          {sourceName}
        </span>
      </div>
      <div className="example-result-group__content">
        <div className="example-result-group__border" style={{ backgroundColor: color }} />
        <div className="example-result-group__results">
          {exampleDocuments.map((result, id) => (
            <div key={id} className="example-grouped-result">
              <div className="example-result-content">
                <TitleField
                  titleFieldHover={titleFieldHover}
                  titleField={titleField}
                  result={result}
                />
                <SubtitleField
                  subtitleFieldHover={subtitleFieldHover}
                  subtitleField={subtitleField}
                  result={result}
                />
                <div
                  className={classNames('example-result-content__description', {
                    'example-result-field-hover': descriptionFieldHover,
                  })}
                >
                  {descriptionField ? (
                    <div>{result[descriptionField]}</div>
                  ) : (
                    <span
                      className="example-result-content-placeholder"
                      data-test-subj="DefaultDescriptionLabel"
                    >
                      {DESCRIPTION_LABEL}
                    </span>
                  )}
                </div>
                {createdByField && result[createdByField] && (
                  <div
                    className={classNames('example-result-content__subtitle', {
                      'example-result-field-hover': createdByFieldHover,
                    })}
                  >
                    Created by {result[createdByField]}
                  </div>
                )}
                <div className="example-result-content__meta">
                  {typeField && result[typeField] && (
                    <div
                      className={classNames('example-result-content__tag', {
                        'example-result-field-hover': typeFieldHover,
                      })}
                    >
                      <span className="example-search-result__tag-content">
                        {result[typeField]}
                      </span>
                    </div>
                  )}
                  {mediaTypeField && result[mediaTypeField] && (
                    <div
                      className={classNames('example-result-content__tag', {
                        'example-result-field-hover': mediaTypeFieldHover,
                      })}
                    >
                      <span className="example-search-result__tag-content">
                        {result[mediaTypeField]}
                      </span>
                    </div>
                  )}
                  <div className="example-result-content__tag-content">
                    <span>
                      Last updated&nbsp;
                      {updatedByField && result[updatedByField] && (
                        <span
                          className={classNames('example-result-content__tag-content', {
                            'example-result-field-hover': updatedByFieldHover,
                          })}
                        >
                          {' '}
                          by {result[updatedByField]}&nbsp;
                        </span>
                      )}
                      {getAsLocalDateTimeString(result.last_updated) || result.last_updated}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
