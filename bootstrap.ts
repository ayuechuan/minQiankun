

//  registerMicroApps 注册子应用

import { Config } from "./src/config";
import { TranformatHTML } from "./src/helpers/tranformatHtml";
import { AppsModel, RegisterMicroApps, SafeWindow } from "./src/model";


const apps = [
  {
    name: "autosheets",
    entry: "//localhost:3000",
    container: "#subapp",
    activeRule: "/subapp/autosheets"
  }
]


export class QiankunStarter extends Config implements RegisterMicroApps {

  constructor(apps: AppsModel[]) {
    super(apps);
  }

  registerMicroApps() {

  }

  start() {
    this.watchURL();
    const app = this.findAppByPathKey().app;
    if (!app) {
      return void console.log('未找到');
    }

  }


  watchURL() {
    //  go   back   forward
    window.addEventListener("popstate", () => {

    })

    //  pushstate   replaceState需要函数重写劫持
    const oldPushState = window.history.pushState;
    const oldreplaceState = window.history.replaceState;

    window.history.pushState = function (...arg) {
      oldPushState.apply(window.history, arg)
    }

    window.history.replaceState = function (...arg) {
      oldreplaceState.apply(window.history, arg)
    }


  }


  /**
   * 解析子应用资源 （ css ,js, html ）
   * @param app 
   */
  async handleActiveAppSource(app: AppsModel): Promise<void> {

    const { entry, container } = app;
    const html = await QiankunStarter.fetchSroucce(entry);
    //  加载子应用
    //  直接插入 html内  不会生效 ( 浏览器安全策略 )
    const appInstace = new TranformatHTML(html, entry);
    //  先将子节点添加到容器中
    const TempContainer = document.querySelector(container);
    TempContainer?.appendChild(appInstace.template as unknown as HTMLDivElement)

    this.setGloabalEnv();

    // 执行所有的js资源
    const appExports = await appInstace.execScripts();

    //  调用子应用的生命周期
    const didmount = {
      bootstrap: appExports?.bootstrap,
      mount: appExports?.mount,
      unmount: appExports?.unmount
    }

    const updateAppInfo = this.update(didmount);
    if (!updateAppInfo) {
      return;
    }
    await updateAppInfo.bootstrap?.();
    await updateAppInfo.mount?.({
      ...updateAppInfo,
      container: document.querySelector(updateAppInfo.container) as HTMLDivElement,
    });
    await updateAppInfo.unmount?.();

  }


  /**
   * 设置微应用全局标记
   */
  setGloabalEnv() {
    SafeWindow._POWERED_BY_QIANKUN_ = true;
  }


  static async fetchSroucce(entry: string): Promise<string> {
    const res = await fetch(entry);
    return await res.text();
  }


  /**
   * 匹配子应用
   */
  handleRoute(app: AppsModel) {

  }
}



const qiankunStarter = new QiankunStarter(apps);






