

import { QiankunStarter } from "../bootstrap";
import { AppsModel } from "../model";
import { AppElement } from "../components/elementNode/appElement"

/**
 * 转换 解析 html内容
 */
export class TranformatHTML {

  private readonly element!: AppElement;

  constructor(
    private readonly html: string,
    private readonly url: string
  ) {
    this.element = new AppElement();
    this.element.element.innerHTML = this.html;
  }


  get template(): AppElement {
    return this.element;
  }

  /**
   * 获取全部js资源
   */
  getExternalScripts(): Promise<string[]> {

    const scripts = this.element.element.querySelector("script") as HTMLScriptElement as any;
    return Promise.all(Array.from(scripts).map((script: any) => {
      //  判断是可执行文本还是link 脚本
      const src = script.getAttribute("src") as string;
      if (!src) {
        return Promise.resolve(script.innerHTML);
      }

      const httpURL = src.startsWith("http");
      const htppsURL = src.startsWith("https");
      const tempURL = (httpURL || htppsURL) ? src : `${this.url}${src}`

      return QiankunStarter.fetchSroucce(tempURL);

    }))
  }


  /**
   * 获取全部js资源并执行
   */
  async execScripts(): Promise<Partial<Pick<AppsModel, "mount" | "unmount" | "bootstrap">>> {
    const scripts = await this.getExternalScripts();

    //  构造cjs模块环境
    const module = this.commonJS();

    for (const script of scripts) {
      //  执行每一条js代码
      eval(script);
    }

    return module.exports;
  }


  private commonJS() {
    const module = { exports: {} };
    const exports = module.exports;
    return { module, exports }
  }

}