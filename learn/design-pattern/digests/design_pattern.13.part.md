---
source: design_pattern
source_hash: 7e40d1038887e21ab701140c74eefca654c937c34abb056d68d40a32386b5b09
source_lines: 24398
part: 13
created: 2026-09-01
updated: 2026-09-01
---

# Digest — design_pattern (part 13)

## Overview (L1)
本部分完成第 4 节中介者模式（Mediator）：以"模仿 Mybatis 手写 ORM 框架"为场景，先展示一把梭式的 JDBC 直连代码（工程 16-01），再用中介者模式封装 jdbc 层、隐藏连接与查询细节（工程 16-02），使外部调用像用 Mybatis 一样简单。核心是把 SqlSession / DefaultSqlSession / SqlSessionFactory / SqlSessionFactoryBuilder / Configuration 作为中介者组件，协调资源加载、XML 解析、会话获取与结果返回，最后用单条与集合两条查询测试验证通过，并总结其满足单一职责、开闭与迪米特原则。

## Sections (L2)

### 场景模拟工程
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#场景模拟工程]]`
- Summary: 给出开发环境（JDK 1.8、Idea + Maven、mysql 5.1.20），并列出本场景的两个工程：`itstack-demo-design-16-01` 用 JDBC 方式直接连接数据库，`itstack-demo-design-16-02` 手写 ORM 框架操作数据库。源码可通过关注公众号 bugstack 虫洞栈、回复"源码下载"获取（序号 18）。
- Key claims: 本场景靠"16-01 直接 JDBC vs 16-02 手写 ORM"两个工程的前后对照来体现中介者模式的收益；两个工程均属 itstack-demo-design-16 系列。
- Learner-relevant: 先建立"先看一把梭、再看中介者重构"的对照思路，为理解中介者解决的痛点做铺垫。

### 场景简述
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#场景简述]]`
- Summary: 引入中介者模式定义：用一个中介对象封装一系列对象交互，使各对象不需要显式相互引用，从而耦合松散且可独立改变它们之间的交互；它要解决复杂功能应用之间的重复调用，通过中间增加一层中介者包装服务，对外提供简单、通用、易扩展的服务能力。生活与工程中的例子有塔台喊话协调飞机降落、站台上下车、公司中台统一包装接口，以及中间件包装底层多种数据库的差异化。案例场景则是模仿 Mybatis 手写 ORM 框架，把 jdbc 层包装起来，让用户使用数据库服务时与用 Mybatis 一样简单，同时也可把 N 种奖品服务等外部接口交由中台统一包装对外提供服务。
- Key claims: 中介者模式 = 用中介对象封装对象交互 → 松耦合、可独立变更交互；ORM/中间件对底层多种数据库差异化的包装就是中介者思想的典型应用；本案例学习路径＝包装 jdbc 层以模仿 Mybatis。
- Learner-relevant: 掌握中介者模式的定义句与适用判据（重复调用多、需统一包装），是判断"何时该引入中介者"的价值锚点。

### 工程结构
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#工程结构]]`
- Summary: 16-01 工程结构极简，src/main/java 下只有 `org.itstack.demo.design.JDBCUtil` 一个数据库操作类。16-02 工程则按职责分包：`dao`（ISchool、IUserDao）、`mediator`（Configuration、DefaultSqlSession、DefaultSqlSessionFactory、Resources、SqlSession、SqlSessionFactory、SqlSessionFactoryBuilder）、`po`（School、User）、`resources`（School_Mapper.xml、User_Mapper.xml、mybatis-config-datasource.xml）以及 `test`（ApiTest）。
- Key claims: 16-02 的 mediator 包集中了全部中介者组件，把"加载配置、解析 xml、获取 session、操作数据库、结果返回"收敛在框架内部；包结构与真实 Mybatis 高度对应。
- Learner-relevant: 对照两工程结构可直观看到"一把梭一个类 vs 中介者一群协作类"的差异，是理解中介者分层的入口。

### 一把梭实现需求
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#一把梭实现需求]]`
- Summary: JDBCUtil 的 main 中按四步直接操作数据库：`Class.forName("com.mysql.jdbc.Driver")` 加载驱动、`DriverManager.getConnection(URL, USER, PASSWORD)` 获取连接、`createStatement` + `executeQuery("SELECT id, name, age, createTime, updateTime FROM user")` 查询、`while(resultSet.next())` 逐行打印姓名与年龄。测试输出查到水水(18)、豆豆(18)、花(19)三条数据，exit code 0。
- Key claims: 直接 JDBC 方式可完成查询但把连接、驱动、结果处理全部暴露给业务方；若全部业务都这样实现会非常麻烦（难以复用与扩展）。
- Learner-relevant: 记住这把梭方案的痛点是"业务代码与 JDBC 细节强耦合"，正是中介者要消除的问题。

### 代码实现
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#代码实现]]`
- Summary: 逐类实现中介者核心组件：①`SqlSession` 接口定义 `selectOne` / `selectList`（分带参与不带参）与 `close`；②`DefaultSqlSession` 持有 `Connection` 和 `Map<String, XNode> mapperElement`，按 statement 取 XNode、prepareStatement 执行查询，`resultSet2Obj` 用 `ResultSetMetaData` + 反射 setter（Timestamp 映射为 Date）把结果行转成对象，selectOne 返回第一条，close 关闭连接，整个 jdbc 层被包装隐藏、入参出参内部处理；③`SqlSessionFactory` 接口定义 `openSession()`；④`DefaultSqlSessionFactory` 持有 `Configuration`，openSession 返回 `new DefaultSqlSession(configuration.connection, configuration.mapperElement)`，Configuration 内包含 Connection、dataSource Map 与 mapperElement Map；⑤`SqlSessionFactoryBuilder` 是核心类，`build(Reader)` 用 SAXReader 解析配置（`setEntityResolver(new XMLMapperEntityResolver())` 保证离线也能解析、无需联网取 dtd），`parseConfiguration` 取 dataSource 与 mappers，`connection` 以 `Class.forName(driver)+DriverManager.getConnection` 建立连接（包装后外部无需知道具体操作、多套数据库可在此扩展），`mapperElement` 用正则 `#{(.*?)}` 解析 SQL 占位符替换为 `?`，构建 XNode（namespace/id/parameterType/resultType/sql/parameter）并按 `namespace.id` 存入 Map。
- Key claims: 中介者由 SqlSession 及其工厂、构建器、Configuration 协同完成——构建器解析 xml 与建连、工厂开 session、DefaultSqlSession 屏蔽 jdbc 并映射结果；外部只按 statement 字符串 + 参数调用；这就是 Mybatis 的原型，读过 Mybatis 源码的人对这些类不会陌生。
- Learner-relevant: 中介者的核心收益在此落地——调用方只需"statement + 参数"，连接、SQL 匹配、结果反射全部由中介者内部完成，是理解 Mybatis 启动链路的原型素材。

### 测试验证
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#测试验证]]`
- Summary: 测试前先向 itstack-demo-design 库导入 school、user 两表及三条各测试数据；随后创建 PO（User、School）、DAO 接口（IUserDao.queryUserInfoById、ISchoolDao.querySchoolInfoById）与 ORM 配置文件（mybatis-config-datasource.xml 的 environments/dataSource/mappers，以及 namespace + select + `#{id}` 占位符的 User_Mapper.xml、School_Mapper.xml）。两个测试都走同一调用链：`Resources.getResourceAsReader` 加载配置 → `new SqlSessionFactoryBuilder().build(reader)` 构建工厂 → `sqlMapper.openSession()` → `session.selectOne("org.itstack.demo.design.dao.IUserDao.queryUserInfoById", 1L)` 返回单条 JSON（age:18、id:1、name:水水）；`session.selectList(..., req)` 按 age=18 返回豆豆、水水两条集合记录。两测试均 exit code 0 通过。
- Key claims: 使用方式与 Mybatis 完全一致（资源加载与解析 → 工厂构建 → 开启 SqlSession → selectOne/selectList → finally 中 close session 与 reader）；单个结果与集合结果两条路径都验证通过。
- Learner-relevant: 用"手写 ORM 跑通查询"的实证证明中介者包装有效，可作为 /tackle 判断"中介者是否真的屏蔽了 JDBC 复杂度"的锚点。

### 中介者模式模型结构
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#中介者模式模型结构]]`
- Summary: 以结构图概括 ORM 框架的核心类分工：左上是对数据库的定义和处理，基本包括常用方法 `<T> T selectOne`、`<T> List<T> selectList` 等；右侧蓝色是对数据库配置并开启 session 的工厂处理类，会操作 DefaultSqlSession；红色部分是 SqlSessionFactoryBuilder，是操作数据库的核心类，负责处理工厂、解析文件、拿到 session。
- Key claims: 整体职责划分＝selectOne/selectList 查询侧 + 工厂开 session 侧 + SqlSessionFactoryBuilder 装配侧；三者协作完成"配置→会话→查询→结果返回"。
- Learner-relevant: 先把握模型结构图再进入各组件实现，形成中介者的整体分工心智模型。

### 总结
- Locator: `[[sources/design-pattern/completed/20260901_design_pattern.pdf#总结]]`
- Summary: 通过中介者模式的设计思想手写了一个 ORM 框架，隐去了对数据库操作的复杂度，让外部调用方可以非常简单地进行数据库操作，这正是平常使用的 Mybatis 的原型；日常开发只需按配置即可。除组件模式外，服务接口的包装也可用中介者模式，例如把公司各种奖品接口统一收到中台开发一个奖品中心对外提供服务，使需要对接奖品的接口不用逐个找具体提供者。该设计满足了单一职责和开闭原则，也符合迪米特原则——越少人知道越好，外部的人只需按需求调用，复杂的实现已由组件合作服务平台处理。
- Key claims: 收益＝隐藏复杂度、对外简单统一；适用面＝中间件/ORM 组件 + 服务接口统一包装（如奖品中心中台）；满足单一职责、开闭原则与迪米特原则。
- Learner-relevant: 收尾价值判断：中介者"该出手时出手"的判据（对象交互复杂、重复调用多、需统一入口），并关联到中台/网关的现实架构。