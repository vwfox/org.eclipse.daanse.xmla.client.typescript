/*
  Copyright (c) 2023 Contributors to the  Eclipse Foundation.
  This program and the accompanying materials are made
  available under the terms of the Eclipse Public License 2.0
  which is available at https://www.eclipse.org/legal/epl-2.0/
  SPDX-License-Identifier: EPL-2.0

  Contributors: Smart City Jena

*/

import type {IdataDataPointDescription} from "@/plugins/OGCSTA/composables/IdataDataPointDescription";
import TLCDataLabelRenderer from "@/plugins/OGCSTA/widgets/parts/dataLabelRenderer/TLCDataLabelRenderer.vue";

export default class TLCDataLabelRendererDescription implements IdataDataPointDescription {
    public readonly component: any = TLCDataLabelRenderer;
    public readonly description: string = "renders a Trafic Light DataPoint";
    public readonly name: string = 'Traffic Light Data Point Renderer';
    public readonly qualifiedName: string = 'tlc';
    public readonly namespace: string = 'tlc';
    public readonly example: any = ' 🟢⚪⚪';
}
