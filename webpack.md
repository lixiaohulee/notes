# webpack

* 如果你打算发布自己的项目，那么package.json文件中的name和version选项非常重要，是必须要填写的

* __dirname 获得当前执行文件所在目录的完整目录名称

* path.resolve(...paths) 接收路径片段，从右向左解析，直到遇到第一个绝对路径，返回路径字符串

* webpack不会对导入导出之外的任何文件作处理

* webpack命令默认会找到webpack.config.js文件，不过也可以通过--config 传入参数表示不同的配置文件

* html-webpack-plugin默认src/index.ejs为模版在dist/下生成一个index.html文件，文件会默认包含entry中的模块(script)和产生的css文件(link)

* chrome & firefox是支持sourcemap的

* 关于webpack热更新，vue-loader 是支持热更新的, style-loader也是支持热更新的

### tree shaking

> 是用来清除僵尸代码的

* 我们可以通过package.json文件的sideEffects属性通知webpack代码有没有副作用，没有的话可以放心的修剪掉这些无用的代码

* 可以通过将sideEffects设置为false告诉webpack项目中的所有的代码都没有副作用以此可以放心的将一些僵尸代码修剪掉， 当然也可以提供一个数组来标示具体哪些文件没有副作用

* optimization 中的useExports必须设置为true

* tree要想起作用 必须是在生产模式下

* 目前的tree-shaking有很大的问题，一个情况是做不到剔除无用代码的，不过可以加入这个插件webpack-deep-scope-plugin [tree-shaking的问题](https://juejin.im/post/5b8ce49df265da438151b468)

#### tree shaking成立的条件

1. 必须使用es6模块语法 export import

2. 确保不会将es6模块语法转化为commonJs模块语法（@babel/preset-env默认就会这么干）

3. 设置sideEffects 为fasle在package.json文件中

4. 设置模式是生产模式


### production

* webpack4开始设置mode模式会我们自动配置DefinePlugin从而设置环境变量，process.env.NODE_ENV

* 默认启用TerserPlugin去压缩代码

### 打包编译优化小技巧

* 永远保持最新，node webpack

* include

* 减少resolve.modules resolve.extensions等中数量

* Dlls

* 减小chunk的大小，分割代码，删除无用的代码