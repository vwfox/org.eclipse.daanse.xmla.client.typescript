/*
  Copyright (c) 2023 Contributors to the  Eclipse Foundation.
  This program and the accompanying materials are made
  available under the terms of the Eclipse Public License 2.0
  which is available at https://www.eclipse.org/legal/epl-2.0/
  SPDX-License-Identifier: EPL-2.0

  Contributors: Smart City Jena

*/

import type {Component} from "vue";

export interface IdataDataPointDescription {
    readonly name: string
    readonly namespace: string
    readonly component: any,
    readonly qualifiedName: string,
    readonly description: string,
    readonly example: any;
}
