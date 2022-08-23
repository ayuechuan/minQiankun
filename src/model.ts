export interface AppsModel {
  name: string;
  entry: string;
  container: string;
  activeRule: string;
  //  可选部分参数
  bootstrap?: () => Promise<void>;
  mount?: (props: MountParameter) => Promise<void>;
  unmount?: () => Promise<void>;
}


interface MountParameter extends Partial<Omit<AppsModel, "container">> {
  container: HTMLDivElement
}


export interface RegisterMicroApps {
  registerMicroApps: () => void;
  start: () => void
}

export const SafeWindow: {
  _POWERED_BY_QIANKUN_?: boolean | null | undefined;
} = window as any;


export interface YamlConfig {
  APPS: Array<AppsModel>,
  QIANKUNCONFIG: string
}


