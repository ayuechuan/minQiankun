
## miniqiankun
### 当前项目还需要完善 有时间会继续更新
#### 微应用的核心原理

1. 路由变化
2. 匹配子应用
3. 加载子应用
4. 渲染男子应用

### 子应用必须存在三个生命周期

#### 常用

1. 通常需要在子应用中 export 这三个钩子函数 ( main.js )

```
//  渲染之前
export async function bootstrap() {

}

//  渲染函数
export async function mount() {

}

//  卸载函数
export async function unmount() {

}
```
2. 使用  typescript  开发者习惯用 class 内聚方法与函数, 不必要在 main文件暴露过多的函数，可采用一下方法： 以react为例。

- 2.1 主函数暴露出Bootstrap类, 在类中定义上述 三个钩子静态钩子函数， 插件内部会先判断 是以类内聚的方法定义还是直接 export 钩子函数。 ( index.tsx )
```

export class Bootstrap {
  render() {
    ReactDOM.render(
      <App />
      ,
      document.getElementById('root')
    );
  }

  //  打印日志
  log() {
    console.log('应用版本');

  }

  // 初始化解析url上是否存在token
  token() { }

  static async bootstrap() { }
  static async mount() { }
  static async unmount() { }
}

const bootstrap = new Bootstrap();
bootstrap.render();

```







