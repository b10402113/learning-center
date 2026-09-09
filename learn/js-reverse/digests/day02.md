---
source: js逆向课件/day02
source_lines: 876
created: 2026-09-05
updated: 2026-09-05
status: absorbed
absorbed_at: 2026-09-08
---

# Digest — js逆向课件/day02

## Overview (L1)

- **函数操作**（4.函数操作.md）— 函数是可复用的工具，使用分"定义"与"调用"两步；讲清 return 返回值（含返回内部函数名的写法）、形参与实参、位置参数与默认参数的规则。
- **文件操作**（5.文件操作.md）— 用 open() 按三步（打开/操作/关闭）读写本地文件实现持久化；覆盖打开模式（r/w/a/b/+）、read/readline/readlines/write/close 各自行为、with 上下文管理器，以及图片二进制拷贝和登录注册综合练习。
- **包与模块**（6.包与模块.md）— 模块是组织代码的 py 文件（内建/第三方/自定义三种），import 即执行模块；`__name__` 区分入口文件与被导入模块；包是带 `__init__` 的文件夹。随后过一遍常见模块：time、random、os、json（序列化重点）、re（正则重点）。

## Sections (L2)

### 函数基础

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day02/4.函数操作.md#函数基础]]`
- Summary: 解释函数是完成特定操作的复用工具（露营生火"自带打火机还是现场造工具"的类比），自定义函数的使用分定义与调用两个过程。
- Key claims: `def 函数名(参数):` 定义函数，定义时函数体不会被执行; 调用必须用函数名后跟圆括号，并按定义提供个数和类型匹配的参数（逗号分隔），否则报错
- Learner-relevant: 能读懂并正确调用别人封装好的函数，是写爬虫/逆向脚本的基本功。

### 返回值

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day02/4.函数操作.md#返回值]]`
- Summary: 讲解 return 语句把执行结果返回给调用者，覆盖不写 return、返回多个值、返回内部函数名等情形。
- Key claims: 不写 return 默认返回 None; return 可一次返回多个值，用单个变量接收时会被封装成元组; 程序执行到 return 即函数调用结束，return 后面的代码不会执行; 外部函数 `return inner`（函数名不加括号）可让调用方拿到并调用内部函数，`return inner()` 返回的则是 inner 的调用结果
- Learner-relevant: 理解"函数返回函数"的写法，为后续 JS 逆向中识别闭包结构做思维准备。

### 函数参数

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day02/4.函数操作.md#函数参数]]`
- Summary: 说明参数如何提升函数的通用性，并区分定义时的形参与调用时的实参。
- Key claims: 无参函数只能处理固定数据，通用性差; 形参=函数定义时制定的参数，实参=调用时传递的参数，通常讨论的参数指形参; 参数名定义得和外部变量同名是坏习惯，容易混淆出错
- Learner-relevant: 能分清一段代码里的形参与实参，读懂带参函数的接口。

### 位置参数

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day02/4.函数操作.md#位置参数]]`
- Summary: 讲解必须按顺序一一对应传递的位置参数（必传参数/顺序参数），以及 Python 不检查参数类型的特点。
- Key claims: 位置参数必须按先后顺序、个数不多不少地一一对应传递，多传、少传、错位都报错; Python 传参不做数据类型检查，传错类型在运行时才暴露异常（弱数据类型/动态语言特点），类型检查要自己做
- Learner-relevant: 调用第三方函数时不踩参数坑，并理解类型错误为何运行时才报。

### 默认参数

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day02/4.函数操作.md#默认参数]]`
- Summary: 讲解带默认值的参数如何简化调用，以及两条使用注意事项。
- Key claims: 定义时给了默认值的参数即默认参数，调用时可传新值也可沿用默认值; 默认参数必须放在位置参数后面; 可用"参数名=值"的方式指定传参以跳过中间的默认参数
- Learner-relevant: 能看懂并正确调用 requests 等库中大量使用默认参数的接口。

### 文件打开

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day02/5.文件操作.md#文件打开]]`
- Summary: 介绍 open() 方法与文件句柄概念，操作文件如"大象塞冰箱"分三步：打开、操作、关闭；逐一讲打开模式与编码问题。
- Key claims: `open(filename, mode)` 返回 file 对象即文件句柄，默认只读 r; b 模式按 bytes 读写二进制文件（图片/视频等），需确保传入 bytes 类型; w+ 读写前清空文件内容，a+ 只能在文件末尾写，r+ 为读写模式; 读非 UTF-8 编码文件需传 encoding 参数（如 GBK），编码不规范可加 `errors='ignore'` 跳过非法字符避免 UnicodeDecodeError
- Learner-relevant: 逆向工程中读写本地数据文件（cookie、抓包结果、配置）的基础能力。

### 文件对象操作

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day02/5.文件操作.md#文件对象操作]]`
- Summary: 讲解文件对象各方法 read/readline/readlines/write/close 的行为与选用策略。
- Key claims: read(size) 可分块读取，文件体积大时不要一次性全量 read() 入内存; readline 一次读一行且不能回头，返回空字符串说明已到最后一行; readlines 一次性读入内存返回按行列表，可随意存取但有风险; write 是内存中的操作，close() 后才真正写回硬盘，中途可用 flush() 立即保存; 忘记 close() 可能导致数据只写了一部分到磁盘
- Learner-relevant: 能按文件大小与场景（小文件/大文件/配置文件）选对读取方式。

### with关键字

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day02/5.文件操作.md#with关键字]]`
- Summary: 介绍 with 上下文管理器机制，保证文件异常或忘记 close 时也能正常关闭，并演示二进制图片拷贝。
- Key claims: `with open(...) as fp:` 自动管理文件关闭，无需手写 close 语句，操作须在缩进块内; 图片拷贝流程：rb 打开原图读取二进制数据 → wb 写入新文件 → 关闭两个文件
- Learner-relevant: 养成用 with 读写文件的安全习惯，可直接迁移到后续所有脚本。

### 练习：登录注册

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day02/5.文件操作.md#练习：登录注册]]`
- Summary: 综合练习：注册将用户名/密码/手机号以 `-` 拼接写入文件，登录读取文件逐行切分比对验证。
- Key claims: 注册用 a+ 模式追加写入，每行以 \n 结尾; 登录用 readlines 读出列表，strip() 去掉回车后 split('-') 切出用户名密码再比对; 用标志位（flat=0/1）记录登录成败
- Learner-relevant: 把函数与文件操作串成完整小项目，是后续"模拟登录"练习的原型。

### 模块介绍

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day02/6.包与模块.md#模块介绍]]`
- Summary: 解释为什么需要模块（代码越写越多，拆文件便于维护）以及模块的三种来源。
- Key claims: 一个 py 文件就是一个模块，是组织代码的更高级形式，提高可读性与可维护性; 模块分三种：解释器内建模块、第三方模块、应用程序自定义模块; 模块可避免函数名/变量名冲突，同名函数可分别存在不同模块中
- Learner-relevant: 建立"脚本拆模块"的工程意识，明白 import 的对象到底是什么。

### 模块导入

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day02/6.包与模块.md#模块导入]]`
- Summary: 演示 import / from-import 的各种形式，并用 cal.py、logger.py、main.py 三文件案例说明"导入即执行"。
- Key claims: 写法有 `import 模块名`、`import 模块名 as 别名`、`from 模块名 import 成员/*`; 导入模块时会执行该模块的顶层代码，多次导入只执行一次; 执行源文件的名字不要和模块名同名
- Learner-relevant: 看懂别人项目里的各种 import 写法，理解 import 模块为什么会"打印东西"。

### __name__

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day02/6.包与模块.md#__name__]]`
- Summary: 讲解内置变量 `__name__` 的取值规则与两大用途。
- Key claims: `__name__` 存储当前模块名称；被导入的模块中打印各自模块名，被执行的入口文件中打印 `__main__`; Python 是解释性脚本语言，无统一 main 入口，从模块顶行逐行执行; 用 `__name__=="__main__"` 声明程序入口，或对导入模块做功能测试
- Learner-relevant: 读懂标准脚本 `if __name__ == '__main__'` 惯例，分清入口文件与被导入模块。

### 什么是包

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day02/6.包与模块.md#什么是包]]`
- Summary: 引入比模块更高级的组织方式：包，即组织相关功能 py 文件的文件夹。
- Key claims: 包可以理解为文件夹，更确切地说是包含 `__init__` 文件的文件夹; 当项目模块越来越多、维护开发效率下降时引入包
- Learner-relevant: 理解第三方库的目录组织形态。

### 导入包的语法

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day02/6.包与模块.md#导入包的语法]]`
- Summary: 列出三种导入包的语法形式，并以 m_log 包中 logger.py 模块为例演示。
- Key claims: `import 包名[.模块名 [as 别名]]`; `from 包名 import 模块名 [as 别名]`; `from 包名.模块名 import 成员名 [as 别名]`
- Learner-relevant: 知道 `from xxx import yyy` 背后对应包/模块/成员哪一层。

### time模块

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day02/6.包与模块.md#time模块]]`
- Summary: 演示 time 模块的时间戳、格式化时间字符串与 sleep 暂停，并给出计时案例。
- Key claims: time.time() 返回时间戳，可用来计算程序执行耗时; time.strftime('%Y-%m-%d %X') 把时间格式化成人能看懂的字符串; time.sleep(n) 让程序暂停 n 秒; 时间戳是计算机识别的时间，时间字符串是人看的时间，元组用来操作时间
- Learner-relevant: 逆向签名中常见的时间戳参数（ts）从这来；会测请求耗时。

### random模块

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day02/6.包与模块.md#random模块]]`
- Summary: 列举 random 模块生成随机数的常用函数（了解级别）。
- Key claims: random() 返回 0-1 间小数; randint(a,b) 返回含两端的整数; randrange 不含上界; choice 从序列随机取一个、sample 取任意 n 个; uniform 返回区间小数; shuffle 原地打乱列表不返回新列表
- Learner-relevant: 爬虫随机延迟、随机 UA 等反反爬手段的基础。

### os模块

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day02/6.包与模块.md#os模块]]`
- Summary: 列举 os 与 os.path 的常用接口，作为与操作系统交互的门户（了解级别）。
- Key claims: getcwd/chdir 管工作目录; makedirs/mkdir/removedirs/rmdir 管目录增删; listdir 列目录（含隐藏文件）、remove/rename 删改文件; os.path.exists/isfile/isdir/abspath/join/getsize 是高频路径工具; os.system 可运行 shell 命令、os.environ 取环境变量
- Learner-relevant: 脚本中做路径拼接、文件存在性检查等文件系统日常操作。

### 序列化模块：json

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day02/6.包与模块.md#序列化模块：json]]`
- Summary: 讲解 json 的序列化/反序列化概念与 dumps/loads/dump/load 四个方法（重点）。
- Key claims: 序列化=把 Python 字典/列表转成指定格式字符串，反序列化=字符串转回字典/列表对象; dumps/loads 操作字符串与对象互转; dump/load 直接配合文件句柄实现持久化存储与读取
- Learner-relevant: 解析接口返回的 json 数据、保存结构化结果的核心技能。

### 正则模块

- Locator: `[[sources/js-reverse/20260908/js逆向课件/day02/6.包与模块.md#正则模块]]`
- Summary: 讲解正则表达式的常用语法（单字符/数量修饰/边界/分组/贪婪与非贪婪）与 re.findall 的匹配用法，附五个提取练习。
- Key claims: `.` 匹配除换行外任意字符、`\d` 数字、`[]` 集合内任一字符; `*` 任意多次、`+` 至少一次、`?` 0 或 1 次、`{m,n}` m 到 n 次; `^` 开头、`$` 结尾、`()` 分组; `.*` 贪婪模式，`.*?` 非贪婪（惰性）模式; re.findall(正则, 原始字符串) 返回匹配内容的列表; 练习覆盖提取数字、http/https 协议、标签内容、非贪婪截取 `h.*?\.`、`sa{1,2}s`、手机号 `1[3,5,7,8,9]\d{9}`
- Learner-relevant: 从 HTML/文本中提取目标数据，是爬虫与逆向分析的核心工具。
