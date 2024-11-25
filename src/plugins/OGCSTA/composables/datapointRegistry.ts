/*
  Copyright (c) 2023 Contributors to the  Eclipse Foundation.
  This program and the accompanying materials are made
  available under the terms of the Eclipse Public License 2.0
  which is available at https://www.eclipse.org/legal/epl-2.0/
  SPDX-License-Identifier: EPL-2.0

  Contributors: Smart City Jena

*/

import type {IdataDataPointDescription} from "@/plugins/OGCSTA/composables/IdataDataPointDescription";

const storeRegistry: Map<string, IdataDataPointDescription> = new Map();

export function useDataPointRegistry() {

    const registerDataPointRenderer = (rendererDescription: IdataDataPointDescription) => {
        storeRegistry.set(rendererDescription.namespace + rendererDescription.qualifiedName, rendererDescription)
    }
    const unregisterDataPointrender = (rendererDescription: IdataDataPointDescription) => {
        storeRegistry.delete(rendererDescription.namespace + rendererDescription.qualifiedName);
    }
    const getAll = () => {
        return storeRegistry
    }
    const getById = (id) => {
        return storeRegistry.get(id)
    }

    return {
        registerDataPointRenderer,
        unregisterDataPointrender,
        getAll,
        getById
    }
}
