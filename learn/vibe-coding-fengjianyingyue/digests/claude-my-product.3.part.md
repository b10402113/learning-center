---
source: claude-my-product
source_type: codebase
source_lines: 2904
language: java
file_count: 67
part: 3
status: absorbed
absorbed_at: 2026-09-26
created: 2026-09-26
updated: 2026-09-26
---

## Overview (L1)

This part covers the "rebuild the backend in an enterprise stack + add an admin console" stage of the 财务管家 (Finance Manager) project. Two independent systems live here:

1. **Java backend** (`005.后端代码（Java工程师）/finance-manager-api/`) — the consumer-facing API reimplemented in Spring Boot 2.7.18 + MyBatis + MySQL, replacing the earlier single-page HTML app that stored data in `localStorage`. It is a classic Maven project targeting **JDK 17**, packaged as a Spring Boot jar, with a layered `controller → service → mapper → entity/dto` architecture.
2. **Admin console** (`006.后台管理系统（运营专员）/`) — a separate operations ("运营专员") system: a Node.js + Express + MySQL backend (`backend/server.js`) plus static HTML pages (`frontend/pages/`). It talks to the *same* `finance_manager` database but exposes an entirely different surface (admin login, platform-wide statistics, user/transaction/category browsing), authenticated with JWT for an `admins` table.

The two stages contrast sharply: the Java stage is the "enterprise stack" rebuild (Maven, JDK, ORM, DTO/VO layering, JDBC SQL), while the admin stage is a lightweight JS console (Express, raw SQL, static pages). The Java stage implies a distinct toolchain — JDK/Maven setup is a prerequisite prompt/topic — versus the no-build HTML and `node server.js` of the other stages.

## Sections (L2)

### 005-backend-maven-stack
- Locator: [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/005.后端代码（Java工程师）/finance-manager-api/pom.xml]]
- Purpose: Declares the Java backend build, dependencies, and toolchain.
- Key exports: `groupId=com.finance`, `artifactId=finance-manager-api`, Spring Boot parent `2.7.18`, `<java.version>17</java.version>`, `spring-boot-starter-web`, `spring-boot-starter-validation`, `mybatis-spring-boot-starter 2.3.2`, `mysql-connector-j`, `lombok`, `spring-boot-starter-test`, `jjwt 0.11.5` (api/impl/jackson), `jbcrypt 0.4`, `spring-boot-maven-plugin`.
- Dependencies: Maven Central; requires JDK 17 + Maven to build/run.
- Learner-relevant: The canonical enterprise Java setup — Maven `pom.xml`, Spring Boot parent BOM, JDK version property, JWT + BCrypt for auth. Learning to install/configure JDK+Maven and run `mvn spring-boot:run` is the gate to this stage.

### 005-backend-app-entry-config
- Locator: [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/005.后端代码（Java工程师）/finance-manager-api/src/main/java/com/finance/manager/FinanceManagerApplication.java]]
- Locator: [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/005.后端代码（Java工程师）/finance-manager-api/src/main/resources/application.yml]]
- Purpose: Boot entry point and runtime configuration.
- Key exports: `@SpringBootApplication` main class; YAML sets `server.port: 8081`, MySQL datasource `jdbc:mysql://localhost:3306/finance_manager` (root/root, Asia/Shanghai), `mybatis.mapper-locations: classpath:mapper/*.xml`, `type-aliases-package: com.finance.manager.entity`, `map-underscore-to-camel-case: true`, SQL logging.
- Dependencies: MySQL at localhost:3306, schema in `resources/finance_manager.sql`.
- Learner-relevant: Shows externalized config (YAML), port choices, and MyBatis global settings — the difference between config and code, and how the app binds snake_case DB columns to camelCase Java fields.

### 005-backend-package-layout
- Locator: [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/005.后端代码（Java工程师）/finance-manager-api/src/main/java/com/finance/manager/]]
- Purpose: The layered package structure under `com.finance.manager`.
- Key exports: `controller/` (5), `service/` + `service/impl/` (4 interfaces + 4 impls), `mapper/` (7 MyBatis interfaces), `entity/` (7), `dto/` (16 request/result/VO classes), plus `resources/mapper/*.xml` (7) and `finance_manager.sql`.
- Dependencies: internal only; mirrors `Java开发规范.md` naming rules.
- Learner-relevant: A textbook MVC/三层架构 (`Controller`/`Service`/`Mapper`) decomposition; the naming convention `XxxController`, `XxxService`, `XxxServiceImpl`, `XxxMapper`, `XxxVO` is spelled out in the standards file.

### 005-backend-controllers
- Locator: [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/005.后端代码（Java工程师）/finance-manager-api/src/main/java/com/finance/manager/controller/]]
- Purpose: REST endpoints for the consumer app.
- Key exports: `UserController` (`/api/register`, `/api/login`, user info), `TransactionController` (add/list/update/delete/statistics/export), `AccountController`, `CategoryController`, `IndexController` (`/` health). All use `@RestController`, `@RequestMapping("/api")`, `@CrossOrigin(origins="*")`, `@Autowired` services, and wrap results in `ApiResponse<T>`.
- Dependencies: `service/*`, `dto/*`.
- Learner-relevant: Mapping annotations (`@GetMapping`/`@PostMapping`), constructor-free field injection, and the universal `ApiResponse` envelope; exception handling is try/catch returning `ApiResponse.fail`.

### 005-backend-services-and-mappers
- Locator: [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/005.后端代码（Java工程师）/finance-manager-api/src/main/java/com/finance/manager/service/impl/UserServiceImpl.java]]
- Locator: [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/005.后端代码（Java工程师）/finance-manager-api/src/main/resources/mapper/TransactionMapper.xml]]
- Purpose: Business logic and SQL mapping.
- Key exports: `UserServiceImpl` (277 lines: register/login with BCrypt hash + JWT token issue, default ledger/category/account seeding), `TransactionServiceImpl` (185 lines: add/update/delete with account-balance updates, monthly stats, export), `AccountServiceImpl`, `CategoryServiceImpl`; MyBatis XML maps (e.g. `TransactionMapper.xml` resultMaps `TransactionVO`, `CategoryStatVO`, `ExportDataVO`).
- Dependencies: `mapper/*`, `entity/*`, `dto/*`, `jbcrypt`, `jjwt`.
- Learner-relevant: The service layer owns correctness (balance mutation, ownership checks); MyBatis XML keeps SQL out of Java. Note `@Transactional` usage/omission and where auth (JWT) is issued.

### 005-backend-domain-model
- Locator: [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/005.后端代码（Java工程师）/finance-manager-api/src/main/java/com/finance/manager/entity/]]
- Locator: [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/005.后端代码（Java工程师）/finance-manager-api/src/main/resources/finance_manager.sql]]
- Purpose: Entities and schema for users, accounts, ledgers, categories, transactions.
- Key exports: Entities `User`, `Account`, `AccountType`, `Category`, `CategoryType`, `Ledger`, `Transaction` (all Lombok `@Data`, `LocalDateTime`); SQL DDL script `finance_manager.sql`; DTO/VO set includes `HomeDataVO`, `StatisticsVO`, `MonthlyDataVO`, `CategoryStatVO`, `ExportDataVO`, `TransactionVO`, `TransactionListVO`, `LoginRequest/Result`, `RegisterRequest/Result`, `ApiResponse` (generic envelope).
- Dependencies: MySQL schema; MyBatis.
- Learner-relevant: Shows normalization (`category_types`, `account_types` lookup tables), system vs user categories (`is_system`), and a DTO layer separating wire contracts from entities.

### 005-backend-standards
- Locator: [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/005.后端代码（Java工程师）/Java开发规范.md]]
- Purpose: The enterprise Java/Spring Boot coding standard the rebuild follows (1,243 lines).
- Key exports: 12 sections — naming, layering, interface design, DB design, exception handling, logging, security, config, transactions, testing, Git commits, code review. Based on "大厂架构师实践", targets Spring Boot 2.7.x + JDK 8+.
- Dependencies: none (reference document).
- Learner-relevant: The explicit rubric behind the code's conventions; useful as a checklist when rebuilding or reviewing the Java stage. Note the doc says JDK 8+ while `pom.xml` uses 17 — a version-reconciliation detail.

### 006-admin-backend
- Locator: [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/006.后台管理系统（运营专员）/backend/server.js]]
- Locator: [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/006.后台管理系统（运营专员）/backend/package.json]]
- Purpose: Express API backing the operations console.
- Key exports: `server.js` (747 lines, port 3002) — `POST /api/admin/login`, `GET /api/admin/verify`, `/api/admin/statistics/{overview,trend,ranking,global}`, `/api/admin/users[/:id][/transactions]`, `/api/admin/transactions`, `/api/admin/categories`, `/api/admin/account-types`. Uses `express`, `mysql2/promise` pool, `cors`, `bcryptjs`, `jsonwebtoken`, `dotenv`; scripts `start`/`dev = node server.js`.
- Dependencies: same `finance_manager` MySQL DB + `admins` table; `.env` for DB/JWT secrets.
- Learner-relevant: A second, independent backend in a *different* stack (Node/Express) querying the same schema — good contrast for "admin console vs product API". Note several endpoints build SQL by string interpolation (`WHERE t.user_id = ${id}`), an SQL-injection risk to flag versus the Java stage's parameterized `@Param` mappers.

### 006-admin-seed-scripts
- Locator: [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/006.后台管理系统（运营专员）/backend/init_admin.js]]
- Locator: [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/006.后台管理系统（运营专员）/backend/add_admin.js]]
- Purpose: Bootstrap the `admins` table and administrator accounts.
- Key exports: `init_admin.js` creates the `admins` table and a default `admin`/`admin123` (bcrypt-hashed); `add_admin.js` inserts a `lee`/`123456` operator.
- Dependencies: `mysql2`, `bcryptjs`, MySQL.
- Learner-relevant: Shows admin identity as a separate table/credential set from app `users`; also a security lesson — default/weak seeded credentials and hardcoded DB creds in the script.

### 006-admin-frontend-pages
- Locator: [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/006.后台管理系统（运营专员）/frontend/pages/]]
- Purpose: Static, no-build HTML admin pages (2,540 lines across 8 files).
- Key exports: `login.html`, `dashboard.html` (data overview + Chart.js), `statistics.html`, `users.html`, `user_detail.html`, `transactions.html`, `categories.html`, `account_types.html`. Shared inline CSS theme (pink `--primary: #FFB7C5`) and sidebar layout; calls the Express API at port 3002.
- Dependencies: Chart.js + Google Fonts via CDN; the admin backend API.
- Learner-relevant: The console is plain HTML/JS (like the original consumer app) but desktop/sidebar-oriented, with a charting dashboard — a different UX target (运营) from the mobile-first consumer app.

### admin-vs-consumer
- Locator: [[sources/vibe-coding-fengjianyingyue/20260926/claude-my-product/006.后台管理系统（运营专员）/backend/server.js]]
- Purpose: Characterize how the admin system differs from the consumer app.
- Key exports: (analysis)
- Dependencies: cross-cutting.
- Learner-relevant: Consumer app = per-user data, mobile-first, port 8081 (Java) / original localStorage single page; admin console = cross-user, platform-wide aggregates (total/today users, global income/expense, TOP-10 rankings), desktop layout, port 3002, separate `admins` auth. Two audiences → two stacks → one shared MySQL schema.
