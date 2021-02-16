/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { AND } from '../views/content_sources/constants';

export const toSentenceSerial = (array: string[]) =>
  array.length === 1
    ? `${array}`
    : `${array.slice(0, array.length - 1).join(', ')}${
        array.length === 2 ? '' : ','
      } ${AND} ${array.slice(-1)}`;
