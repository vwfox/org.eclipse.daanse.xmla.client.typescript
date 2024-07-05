declare interface ISerializable {
  getState: () => string;
  loadState: (state: string, eventBus?: any) => void;
}

declare interface IDatasource {
  id: string;
  caption: string;
  url: string;
  type: "REST" | "XMLA" | "CSV" | "JSON" | "MQTT" | string;
  getData: (params: any) => Promise<any>;
}

interface IStore {
  id: string;
  caption: string;
  events: IStoreEvents[];
  type: "REST" | "XMLA" | string;
  datasourceId?: string | null;
  datasourceIds?: string[] | null;
  getData: (options?:any) => Promise<any>;
}

interface EventBus {
  emit: (string, any?) => void;
  on: (string, Function) => void;
  off: (string, Function) => void;
}

interface IStoreParams {
  [key: string]: any;
}

interface IStoreEvents {
  name: string;
  action: string;
}
