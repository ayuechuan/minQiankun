import { AppsModel, YamlConfig } from "./model";
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml'

/**
 * 子应用配置
 */
export class Config {
  /**
   * 子应用配置列表
   */
  private _apps: Array<AppsModel>;
  /**
   * 乾坤应用 配置信息 (  实际应用会以配置为主 )
   */
  private readonly config: YamlConfig;

  constructor(apps?: Array<AppsModel>) {
    /**
     *  apps的来源可以是多种途径
     *  1.由开发者实例化时传入
     *  2.通过yaml配置
     *  3.通过本地存储是传入 （ 此时ken需要做出硬性限制 : QIANKUNCONFIG ）
     */
    const yamlConfig = this.getYamlConfig();
    const { QIANKUNCONFIG } = yamlConfig
    const sessionAppConfig = this.getSessionStorge(QIANKUNCONFIG || "QIANKUNCONFIG");

    this._apps = apps || yamlConfig?.APPS || sessionAppConfig;
    this.config = yamlConfig;
  }


  /**
   * 获取config全局配置
   * @returns 
   */
  private getYamlConfig(): YamlConfig {
    const fileContent = fs.readFileSync(path.join(__dirname, "../confog.yaml"), "utf-8");
    return yaml.load(fileContent) as YamlConfig;
  }

  /**
   * 查找本地是否存在 apps 配置
   * @param sessionKey key
   * @returns 
   */
  private getSessionStorge(sessionKey: string): null | AppsModel[] {
    const apps = sessionStorage.getItem(sessionKey);
    if (!apps) {
      return null;
    }
    const tranformatSession = JSON.parse(apps);
    return tranformatSession;
  }



  protected get apps(): Array<AppsModel> {
    return this._apps;
  }

  protected set apps(app: AppsModel[]) {
    this._apps = app
  }

  /**
   * 更新某一子应用信息
   * @param activeApp 当前选中子应用信息
   * @param pathname 当前路由信息
   * @returns ConfigModel
   */
  protected update(activeApp: Partial<AppsModel>, pathname?: string): AppsModel | null {
    const index = this.findAppByPathKey(pathname).index;
    if (index >= 0) {
      return null;
    }
    //  更新对应的子应用信息
    Object.assign(this._apps[index], activeApp);
    return this._apps[index];
  }


  /**
   * 通过路由信息  查找出当前子应用的详情 与 下标
   * @param pathKey 当前路由信息
   * @returns activeApp详情 与 下标
   */
  protected findAppByPathKey(pathKey = window.location.pathname): {
    app: AppsModel;
    index: number;
  } {
    const appCurrentKey = this._apps.findIndex((app) => pathKey.startsWith(app.activeRule));
    return {
      app: this._apps[appCurrentKey],
      index: appCurrentKey
    };

  }
}
