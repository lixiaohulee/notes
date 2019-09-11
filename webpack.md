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

### 代码分割

webpack有三种方式可以实现代码分割

1. entry 入口处手动物理分割

2. splitChunksPlugin

3. 动态引入，import

> 对于入口

chunkFilename用来标示非入口文件的名称

#### splitChunksPlugin

**默认情况下 分割插件只会影响按需加载的块**

```
module.export = {
    optimization: {
        splitChunks: {
            chunks: 'async',
            minSize: 30000,
            maxSize: 0,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: '~',
            automaticNameMaxLength: 30,
            name: true,
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10
                },
                defalut: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true
                }
            }
        }
    }
}
```
> webpack的代码分割默认的配置已经是很好的优化设计了，但不排除你的项目需要改变配置而达到更好的优化体验

**automaticNameDelimiter** 生成的chunk名称的分隔符号 默认是‘～’

**automaticNameMaxLength** 生成的名字字数最大值

**chunks** 表示哪样的chunk可以用来被优化 它的值可以是函数或者字符串，如果是字符串接受all async initial all表示任何类型的模块提供函数可以做到更加灵活的优化模块选择

```
chunks(chunk) {
    return chunk.name !== 'my-excluded-chunk'
}
```
**maxAsyncRequests** 按需加载的时候的最大并行请求数量 

**maxInitialRequests** 入口文件的最大的并行请求数量

**minChunks** 分割前必须共享的最小块数

**minSize** 要生成的块的最小大小，字节单位

**maxSize** 无论是optimization.splitChunks.maxSize 还是optimization.splitChunks.cacheGroups[x].maxSize 还是optimization.splitChunks.fallbackCacheGroup.maxSize都是在告诉webpack将比maxSize更大的模块尝试分割更小的块

**maxInitialRequests** 入口文件的最大的并行请求数量

**minChunks** 分割前必须共享的最小块数

**minSize** 要生成的块的最小大小，字节单位

**maxSize** 无论是optimization.splitChunks.maxSize 还是optimization.splitChunks.cacheGroups[x].maxSize 还是optimization.splitChunks.fallbackCacheGroup.maxSize都是在告诉webpack将

**name** 表示生成的chunk的名称，可以接受true或者函数或者string，接收true表示根据模块的名称自动生成名字，当然这里的name属性也可以被cacheGroups中模块分组中的name属性所覆盖，***注意，指定name属性为字符串或者为一个函数切函数始终返回相同的值会导致webpack将所有的模块合并成一个模块 这是不可取的***

> 通常建议在生产环境下name属性设置为fasle，以防止不必要的将名称改变


#### cacheGroups

	cacheGroups可以继承或者重写splitChunks的选项除了test，
	priority，reuseExistingChunk
	
**如果不想启用任何缓存组中的默认设置，可以通过将default选项设置为false达到这个目的**

**priority** 一个模块有可能同时属于多个缓存组，而优化则会选择具有更高的优先级的缓存组，默认的缓存组的优先级是负数，允许自定义缓存组拥有更高的优先级，自定义缓存组的优先级是0

**reuseExistingChunk** 如果当前模块包含一个已经在前面主模块拆分出来的模块，那么将不会再重新生成一个模块二是使用已经存在的模块

**test**给cacheGroup控制模块，如果忽略这个属性将会选择所有的模块，他可以接受一个函数或者正则或者字符串

**filename** 允许去重写filename属性当且仅当是initial块的时候

**enforce** 告诉webpack忽略掉minSize minChunks, maxAsyncRequests, maxInitalRequests总是为缓存组创建块


