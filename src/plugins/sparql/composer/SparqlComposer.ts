import type {AxisData, Composer, CSVSelector} from "@/plugins/charts/widgets/api/ChartdataComposer";
import type {SparqlSelector} from "@/plugins/sparql/composer/SparqlSelector";
import {computed, type ComputedRef, ref, type Ref} from "vue";


export default class SparqlComposer implements Composer<SparqlSelector> {

    private selectorX: SparqlSelector | undefined;
    private selectorY: {
        [key: string]: Array<SparqlSelector>
    } = {};
    private data: Ref<any> = ref({});
    private store: IStore | undefined;
    static readonly POSITIONHEADER = '<Position>';

    addSelectorY(selector: SparqlSelector, axisName: string) {
        if (!this.selectorY[axisName]) {
            this.selectorY[axisName] = [];
        }

        this.selectorY[axisName].push(selector);
    }

    getSelectorsY() {
        return this.selectorY;
    }

    setSelectorY(selector: SparqlSelector, axisName: string) {
        if (!this.selectorY[axisName]) {
            this.selectorY[axisName] = [];
            this.selectorY[axisName].push(selector)
            //this.selectorY[index] = selector;
        } else {

            this.selectorY[axisName].forEach((elm, index) => {

                if (elm.id == selector.id) {
                    this.selectorY[axisName].splice(index, 1, selector)
                }
            });
        }

    }

    setSelectorX(selector: SparqlSelector) {
        this.selectorX = selector;
    }

    getSelectorX() {
        return this.selectorX;
    }

    setData(data: Ref<any>) {
        this.data = data;
    }

    setStore(store: IStore) {
        this.store = store;
    }

    getStore() {
        return this.store;
    }

    getDataX(): ComputedRef<AxisData> | Ref<AxisData> {
        return computed(() => {
            try {
                    return {//@ts-ignore
                        data: (this.selectorX!.header == SparqlComposer.POSITIONHEADER)?
                            this.data['results']['bindings'].map((e,ind) => ind):
                            this.data['results']['bindings'].map(e => e[this.selectorX!.header]['value']),
                        title: this.selectorX?.header,
                        from: this.selectorX
                    } as AxisData

            } catch (e) {
                return {
                    data: [],
                    title: this.selectorX?.header,
                    from: undefined,
                } as AxisData
            }
        });
    }

    getDataY(): ComputedRef<Array<AxisData>> | Ref<Array<AxisData>> {
        return computed(() => {
            let ret: AxisData[] = [];
            const axises = Object.keys(this.selectorY);
            axises.forEach((axisName) => {
                this.selectorY[axisName].forEach(sel => {
                    try {
                        ret.push({//@ts-ignore
                            data: this.data['results']['bindings'].map((e,ind) => {
                                return {x: (this.selectorX!.header == SparqlComposer.POSITIONHEADER)?
                                        ind:
                                        e[this.selectorX!.header]['value'], y: e[sel.header]['value']}
                            }),
                            title: sel.header,
                            from: axisName
                        } as AxisData);
                    } catch (e) {
                        console.error(e)
                    }
                });
            });
            return ret;

        });
    }

    setSelectorsY(selectors: CSVSelector[], axisName: string = 'y'): void {
        if (!this.selectorY[axisName]) {
            this.selectorY[axisName] = [];
        }

        this.selectorY[axisName] = selectors;
    }

    async restoreState(state) {
        this.setSelectorX(state.selectorX);
        for (let sely in state.selectorY) {
            state.selectorY[sely].forEach(sel => {
                this.addSelectorY(sel, sely);
            })

        }
    }

}
