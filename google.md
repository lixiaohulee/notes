### 谷歌开发者文档学习

#### 元素检查 inspect

* 在web页面上直接右击某个元素 选择inspect直接打开开发者工具并定位到当前元素
* 检查元素打开工具 在styles tab里面点击.cls出现输入框 可以输入任意的css类名然后引用于当前检查的元素  在.cls输入框的下面有输入的历史记录 可以通过checkbox选择使用和取消

* 点击sytles tab下面:hovke可以展示当前元素伪类样式 支持:hover :active 等等 可以在弹出的checkbox列表中选择和更改 
* 选择元素  然后滑动到最低部可以看到元素的盒模型 在盒模型中选中元素的大小及padding margin等属性 将会在文档中高亮显示  **然后双击某一个属性就可以修改该属性的值  -表示该属性没有值**

* command + shift + c 直接开始选择元素
* 点击styles tab下面css文件link  可以打开这个外部css规则文件 如果文件是压缩的 点击底部的花括号可以变成人类可读的形式 这个真赞 link后面有个数字表示这个样式定义在文件的第几行 
* 默认的sytles tab展示的所有的样式 包括被覆盖的样式  **如果想查看真正被应用的样式 可以点击computed tab 展示的列表样式就是实际上使用的样式  但是这里不包含被继承来的css属性  如果还想看继承来的属性 可以点击show all 这样就会展示继承和实际添加应用的样式**

* style tab下面的filter 输入框可以用来筛选和选择元素的样式 computed下面也是一样  选择了show all 同时会搜索继承来的属性  **这里既可以搜索值也可以搜索属性**

* 打开Command Menu command + shift + p  可以在弹出的命令工具输入框中输入搜索相关能力或者和选择使用 

* Coverage 使用上面的命令选择并打开Coverage  tab 然后选择capturing coverage 页面将会被reload  然后生成一份列表展示有多少css和js文件被使用 同时会显示使用百分比  绿色表示使用 红色表示非使用 点击其中某个文件会展示该文件的source 并列出具体哪些内容实用哪些没有使用 
* 在style tab下面改变样式的数字属性的时候 可以使用快捷键  option+up增加0.1 shift+up增加10 comand+up增加100

* 点击style tab下面.cls右边的加号可以添加style rule
* 点击style tab下面某个color或者background-color左侧的小方块可以调起color picker  这个gul可以复制颜色 改变透明度 采集颜色等

* 打印预览模式 command + shift + p 搜索show rendering  在rendering tab下面点击Emulate preview mode 选择print 可以看到当前页面的打印预览模式  并且可以调整css样式 查看预览 

#### console

* ctrl + L 清除console记录 
* 如果想保存console中日志 可以右键然后save as 保存日志
* 在非console面板下打开console可直接ESC
* option + Command + j 直接打开console

* 堆栈跟踪  console里面有的信息显示尖头 可以看到当前的console在哪里定义到哪里调用

* console打印自定义样式的log 可以提前写好sytle样式字符串 然后作为第二个参数传递给console.log  eg： console.log('message', style);

* console中可以过滤消息 可以通过点击levels选择只看什么类型的log。也可以直接点击levels左边的filter输入框 直接通过文本或者正则表达式过滤出你想看的信息  

* 点击consosle左边的slidebar可以看出哪些文件具体在打印log信息 
* 一般情况下 console中的代码有历史记忆功能 可以通过settings中from history去掉这个 
* 点击filter输入框旁边的top可以选择在哪个框架中调试 
* $_ 引用console中的最后一条表达式的求值 
* 在console中的filter的旁边可以点击眼睛 在输入框输入一个表达式。然后就可以看到这个表达式在运行时值及其变化 

#### network

* 右键网络区可以选择展示的row
* 点击filter可以过滤
* 点击搜索可以搜索相关的问题
* 命令工具搜索show block requests 可以检测当指定的文件不存在的时候查看网页效果
* chrome 默认只能在同一个域名下面发起六个请求 可以通过分片域名优化(http1.0 http1.1)  移除没有用的请求 
* **waterfall中的进度条**其中绿色部分表示TTFB time to first byte 就是痛发起请求等待到接受到第一个字节的时间 可以优化这里 这里慢的原因可以是dns查找和建立连接慢或者服务器处理慢  可以考虑使用cdn 优化数据库查找 缓存等
* 下载时间 waterfall中的进度条的蓝色部分就是代表资源的下载时间 
* Chrome://help 查看chrom的版本 
* 点击persevere log可以保存reqeuest。 capture screenshots 可以展示请求过程中各个的阶段的屏幕截图 
* 想体验你的网站首次进入的效果可以选择disable cache 或者可以右键清除clear browser cache 
* 可以通过offline模拟断网环境 
* 可以通过onlie入口直接点击add 进入自定义网络速度页面 然后你可以自定义网速 来检测你的网站
* 可以右键然后根据key排序
* 可以右键然后response header中添加自定义header字段 

#### Mobile conditions 

* show network conditions 可以更改user agent 
* Show sensors 可以改变地理位置 

#### DOM 

* 检查dom元素  定位到具体node节点后 可以通过上下左右方向键进一步选择元素 其中上下方向键都可以在当前元素基础上上下选择元素  左右键可以打开或收起当前元素  如果按两下左键可以选择当前元素的父亲元素  左键两下可以展开元素并选择当前元素的子元素 


* ***scroll into view*** 有时候我们在选择一个元素 然后可能经过滑动或者别的操作导致被选择的元素当前不在我们的适口中 这个时候可以通过element下的当前高亮的被选择的元素右键然后scroll into view让元素再次进入适口
* element panle 下command + f 搜索node 可以键入css选择器 元素字符串等 
* 选择元素 双击元素标签名称 然后右键方向键 开始编辑当前元素 回车显示效果 
* **重新排序**  选择元素 然后按下元素 拖动元素可以在dom树中的任何位置 这样可以对元素进程重新排序 
* 强制显示状态 可以让元素强制一直显示某种状态下的呈现 比如说hover active等 选择元素然后右键选择fource state 选择hover 此时元素一直显示的是hover状态下的样子 通过style tab下面的.hov打开之后也同步选择了hover状态
* 删除元素 选择元素 元素高亮 然后delete键删除元素 command + z 撤销删除
* $0  当选中元素后 然后在console中可以键入$0打印出当前选中的元素 
* 将元素存储为全局变量  如果当你想多次使用某个node节点的时候  可以选择此node节点  然后右键选择Store as global variable 就是在全局存储一个temp1的变量保存此节点 
* copy Js path  当我们在js文件中想要确定的选择一个元素时。可以先在elment 中选择元素 然后右键选择copy 再选择copy js path 这样就可以在剪切板中复制到此元素的js访问代码了 是通过document.querySelector()的方式 
* debug dom节点 如果在js中有修改dom的操作 可以针对这个这个dom节点进行debug调试  选择元素  然后右键选择break on 然后可以有三个具体的debug调试选择 可以选择调试节点属性的修改 子节点的改动 节点的删除 

#### JavaScript



* 打开开发者工具 点击source panel  可以分为三个区域  显示当前页面所有请求到的文件的file navigator区域   用于展示源码的code Editor区域 包含各种调试工具的Javascript Debugging调试区域 
* 在debug调试区域可以选择Event listener breakpoint 针对各种监听事件的断点调试
* 向下箭头 **step into next function call**  进入下一个函数调用内部  弧形箭头 **step over next function call** 跳过下一个函数  向上箭头 **step out current function call**结束当前的函数调用 向左箭头 **step** 一步一步执行 下一步
* 如果针对某一个特定的源代码行感兴趣可以在这行代码的左侧看到行号 点击这个行号就可可以在此生成一个断点 然后开始调试
* 在scope pane下面可以看到当前断点下的所有的本地变量和全局变量在这一刻的值 可以双击这个值 更改这个值 
* 在watch pane 下面可以添加任意的js表达式  然后全调试过程中检测观看某个变量的值的变化
* 当处于端点模式下 可以在console中打印此刻出现在scope pane下面的变量 可以在这里做一些操作 验证 
* apply a fix 我们不需要在断点调试的时候离开开发着工具去代码中加入我们的fix代码 可以直接在sources中的源代码中code Editor编辑区 直接替换改写代码。然后保存  再点击**Deactivate breakpoints** ![Deactivate breakpoints](https://developers.google.com/web/tools/chrome-devtools/images/deactivate-breakpoints-button.png).停用断点调试 工具将忽略所有的断点在新的代码下执行 

* 要想断点调试在某种情况下具体的代码的执行 可以code Editor区域找到具体的代码  然后右键找到add condition breakpoint 在弹出的弹窗中写入具体的表达式 回车保存 只有在这种情况下才会出现断点 

* 也可以直接在在代码中加入debugger 来添加断点
* 在debug调试区域 可以看到当前选中的所有的debug列表  可以选择checkbox来决定取消还是启用  或者右键来可以选择更多的操作 比如删除breakpoint等 

* 给dom打断点 可以通过选择dom 右键选择break on 然后选择具体的break类型 subtree modifications 不包含子元素的属性的修改 
* 点击调试区域的pause on exceptions 在异常处打断点  点击选中之后默认的会在未捕获的异常处暂停 如果相对已经捕获了的异常处也断点。可以选在pause on exceptions 的下面的checkbox
* 断点函数的调用 可以在代码中添加debug函数 传入一个函数名称。就会在这个函数调用的时候生成断点 前提要确保函数名称在debug函数的作用域链中可以可访问到 在console中使用 
* call stack 当代码停留在断点的地方  可以看到调试区域的call stack选择 打开可以看到当前有哪些函数在调用 并且可以右键选择copy call stack 拷贝调用信息到剪切板

* 添加黑盒 对于一些自己信任的代码函数或者片段 可以在debug的时候考虑添加黑盒脚本 调试流程将会跳过这里  可以只在code Editor区域右键添加。或者在调试区域breakpoints 添加  或者打开设置模式  
* Command 命令行可以通过这个搜索disable js 或者able js 来关闭和打开当前网站的js的执行

#### Performance 

* 点击performance下面设置按钮可以选择设置模拟具体的移动端设备cpu参数和网络性能 来模拟一个完整的环境
* 如果想要查看当前页面的运行时的性能分析 可以点击performance下面的record按钮 开始记录  过几秒钟可以按下stop生成分析列表
* FPS frames per second  帧率  每秒的帧数   这个是用来衡量性能的很重要的一个指标 优秀的参考值的60 FPS 在报告表盘中第一项就可以看FPS 表  任何时候只要在FPS这一栏上看到一个红色的条就表示帧率太慢以至于伤害了用户体验  实际上FPS下面的红色条越高 FPS越高 
* 在FPS表下面的就是CPU表 在这一层表示着报告记录区间cpu的占用情况  这一栏由各种颜色填充 每个颜色都代表不同的任务  比如紫色代码rendering 绿色代码painting等 这里的颜色和最下面的summary总结性的环形图分析是一一对应的
* 当把鼠标在FPS CPU和NET各个栏上移动的时候 将会弹出页面在此时此刻的截图 如果按下鼠标从左到右移动一段距离可以重播这段渲染记录  这种操作成为scrubbing 刷洗  这对我们手动分析动画的进展很有帮助
* 当进行完刷洗动作后  会出现frames模块 鼠标放到frames上的绿色方形上可以展示具体的FPS
* 打开FPS meter  可以在命令行工具中搜索 show rendering 打开 然后在renderingtab下 开启FPS meter工具  这个工具就会在当前页面展示 并实时测量FPS的值 
* 展开主线程模块  这里展示了主线程的活动的火焰图  x轴表示记录 每个条表示一个事件 条越宽代表花费了更多的时间  y轴代表着调用栈。
* 在main下面的每个条中。如果看到红色的右上尖头都意味着这是个警告 需要去关注 
* 当点击某个event的时候 下面的summary将会同步展示具体的细信息 可以点击那里文件位置链接 从而可以看到相关的源代码  
* animation frame fired 是在requestAnimationFrame方法后
* appudpate下面的有一些紫色的条 可以看到如果红色箭头 代表这里触发回流 

#### Memory

* 页面的性能随着使用的时间越来越长变得越来越差。这就是内存泄漏的症状 内存泄漏指的是页面中的错误随着时间的延长 使用内存越来越多
* 页面的性能一直很糟糕 可能这就是内存膨胀的现象  内存膨胀就是页面为达到最佳的速度而使用的内存比本应使用的内存多 
* 页面出现延迟或者经常暂停 这可能是频繁垃圾回收的现象



