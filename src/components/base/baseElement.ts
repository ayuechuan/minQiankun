
export class Element<K extends keyof HTMLElementTagNameMap>{

  readonly element: HTMLElementTagNameMap[K];

  constructor(
    private readonly elementTag: K,
    private readonly options?: ElementCreationOptions | undefined
  ) {
    this.element = document.createElement(this.elementTag, options)
  }

  //  设置样式
  set style(style: any) {
    Object.assign(this.element.style, style)
  }

  /**
 * 从界面中移除元素界面
 */
  remove() {
    // 元素节点自己从界面移除 [无需从父级节点调用removerChild]
    this.element.remove();
  }

  /**
 * 移除 class 属性
 * @param tokens 属性名称数组
 */
  protected removeClass(...tokens: string[]) {
    this.element.classList.remove(...tokens);
    return this;
  }

  /**
 * 添加 class 属性
 * @param tokens 属性名称数组
 */
  protected addClass(...tokens: string[]) {
    this.element.classList.add(...tokens)
    return this;
  }

  /**
* 追加元素节点
* @param node 追加的节点
*/
  protected append<T extends HTMLElement | Node>(node: T) {
    this.element.append(node);
    return this;
  }

  /**
 * 添加子元素节点
 * 如子元素节点需要始终在界面上显示，请调用此方法
 * @param children 
 */
  protected addChild<T extends HTMLElement | Node>(children: T) {
    this.element.appendChild(children);
    return this;
  }

}

