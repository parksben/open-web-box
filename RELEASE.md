# 发布流程说明

## 📦 版本发布类型

本项目支持四种发布类型，适用于不同的开发阶段：

### 1. 🚀 Stable (正式版本)
- **用途**: 生产环境就绪的正式版本
- **版本格式**: `1.0.0`, `1.2.3`
- **npm 标签**: `latest`
- **安装方式**: `npm install open-web-box`
- **推荐场景**: 
  - 稳定的功能发布
  - 生产环境部署
  - 对外正式发布

### 2. 🧪 Alpha (内测版本)
- **用途**: 早期测试版本，可能不稳定
- **版本格式**: `1.0.0-alpha.1701234567890`
- **npm 标签**: `alpha`
- **安装方式**: `npm install open-web-box@alpha`
- **推荐场景**:
  - 新功能早期开发阶段
  - 内部团队测试
  - 快速迭代和验证想法
  - 可能包含未完成的特性

### 3. 🔬 Beta (公测版本)
- **用途**: 功能完整的测试版本
- **版本格式**: `1.0.0-beta.1701234567890`
- **npm 标签**: `beta`
- **安装方式**: `npm install open-web-box@beta`
- **推荐场景**:
  - 功能已经完整
  - 需要更广泛的测试
  - 收集用户反馈
  - 已知 bug 较少

### 4. ✨ RC (候选发布版本)
- **用途**: 接近正式发布的候选版本
- **版本格式**: `1.0.0-rc.1701234567890`
- **npm 标签**: `rc`
- **安装方式**: `npm install open-web-box@rc`
- **推荐场景**:
  - 准备正式发布前的最后验证
  - 生产环境预演
  - 没有已知的关键 bug
  - 功能冻结，仅修复 bug

## 🚀 发布步骤

### 1. 准备发布

```bash
# 确保代码质量
npm run check

# 确保所有改动已提交
git status

# 如果有未提交的改动
git add .
git commit -m "feat: your changes"
```

### 2. 执行发布命令

```bash
npm run deploy
```

### 3. 交互式选择

#### 步骤 1: 选择发布类型
```
? Select release type:
  🚀 Stable - Production ready release
  🧪 Alpha - Early testing version (unstable)
  🔬 Beta - Testing version (feature complete)
  ✨ RC - Release Candidate (near production)
```

#### 步骤 2: 选择版本升级类型
```
? Select version bump type:
  patch (1.0.1-alpha.xxx)  # Bug 修复
  minor (1.1.0-alpha.xxx)  # 新功能
  major (2.0.0-alpha.xxx)  # 破坏性更新
```

#### 步骤 3: 确认发布
```
Release Type: 🧪 Alpha Version
New version will be: 1.0.1-alpha.1701234567890

? Are you sure you want to deploy version 1.0.1-alpha.xxx?
```

### 4. 自动执行流程

脚本会自动执行以下操作：

1. ✅ 更新 `package.json` 版本号
2. ✅ 生成 CHANGELOG（基于 git commits）
3. ✅ 构建所有资源（npm + CDN + demo）
4. ✅ 发布到 npm（使用对应的 tag）
5. ✅ 提交代码并创建 git tag
6. ✅ 推送到 GitHub
7. ✅ 部署示例站点到 GitHub Pages
8. ✅ 创建 Pull Request（如果需要）

### 5. 发布完成

```
✨ Deployment completed successfully!

Version: 1.0.1-alpha.1701234567890
Tag: v1.0.1-alpha.1701234567890
Release Type: 🧪 Alpha Version

📦 Installation:
   npm install open-web-box@alpha
   or
   npm install open-web-box@1.0.1-alpha.1701234567890

📌 npm tags:
   latest - stable releases
   alpha - 🧪 Alpha Version

🎉 Your package is now published!
```

## 📊 版本号规则

### 基础版本
遵循 [语义化版本](https://semver.org/lang/zh-CN/) 规范：

- **MAJOR**: 不兼容的 API 修改
- **MINOR**: 向下兼容的功能性新增
- **PATCH**: 向下兼容的问题修正

### Prerelease 后缀
格式: `{version}-{type}.{timestamp}`

- **type**: alpha / beta / rc
- **timestamp**: Unix 时间戳（确保唯一性和时间顺序）

示例:
- `1.0.0-alpha.1701234567890`
- `1.2.0-beta.1701234567891`
- `2.0.0-rc.1701234567892`

## 🎯 使用场景示例

### 场景 1: 日常 Bug 修复（Stable）
```bash
npm run deploy
# 选择: Stable -> patch
# 结果: 1.0.0 -> 1.0.1
```

### 场景 2: 添加新功能（Stable）
```bash
npm run deploy
# 选择: Stable -> minor
# 结果: 1.0.1 -> 1.1.0
```

### 场景 3: 破坏性更新（Stable）
```bash
npm run deploy
# 选择: Stable -> major
# 结果: 1.1.0 -> 2.0.0
```

### 场景 4: 新功能开发测试（Alpha）
```bash
npm run deploy
# 选择: Alpha -> minor
# 结果: 1.1.0 -> 1.2.0-alpha.xxx
# 用户安装: npm install open-web-box@alpha
```

### 场景 5: 公测版本（Beta）
```bash
npm run deploy
# 选择: Beta -> minor
# 结果: 1.2.0-alpha.xxx -> 1.2.0-beta.yyy
# 用户安装: npm install open-web-box@beta
```

### 场景 6: 发布候选（RC）
```bash
npm run deploy
# 选择: RC -> patch
# 结果: 1.2.0-beta.yyy -> 1.2.1-rc.zzz
# 用户安装: npm install open-web-box@rc
```

### 场景 7: RC 转正式版本
```bash
npm run deploy
# 选择: Stable -> patch
# 结果: 1.2.1-rc.zzz -> 1.2.1
# 用户安装: npm install open-web-box
```

## 📌 npm 标签管理

### 标签用途
- **latest**: 自动指向最新的 stable 版本
- **alpha**: 指向最新的 alpha 版本
- **beta**: 指向最新的 beta 版本
- **rc**: 指向最新的 rc 版本

### 查看所有版本
```bash
npm view open-web-box versions
```

### 查看特定标签的版本
```bash
npm view open-web-box@alpha version
npm view open-web-box@beta version
npm view open-web-box@rc version
npm view open-web-box@latest version
```

### 安装特定版本
```bash
# 安装最新稳定版
npm install open-web-box

# 安装最新 alpha 版本
npm install open-web-box@alpha

# 安装特定版本
npm install open-web-box@1.2.0-alpha.1701234567890
```

## 🔄 版本升级路径建议

### 推荐路径
```
开发阶段:
1.0.0 → 1.1.0-alpha.xxx (新功能开发)
       ↓
1.1.0-beta.yyy (功能测试)
       ↓
1.1.0-rc.zzz (候选版本)
       ↓
1.1.0 (正式发布)
```

### 持续迭代
```
1.1.0 → 1.1.1-alpha.xxx (修复测试)
       ↓
1.1.1 (快速修复)
```

## 💡 最佳实践

### 1. Commit 消息规范
使用 [Conventional Commits](https://www.conventionalcommits.org/)：

```bash
feat: 新功能
fix: Bug 修复
docs: 文档更新
style: 代码格式
refactor: 重构
perf: 性能优化
test: 测试相关
build: 构建系统
ci: CI 配置
chore: 其他杂项
```

### 2. 发布前检查清单
- [ ] 运行 `npm run check` 确保代码质量
- [ ] 确保所有测试通过
- [ ] 更新相关文档
- [ ] 检查 git 状态，提交所有改动
- [ ] 选择正确的发布类型
- [ ] 选择正确的版本升级类型

### 3. Alpha/Beta/RC 使用建议

**Alpha 阶段 (🧪)**
- 快速迭代，频繁发布
- 内部团队测试
- 可以包含不完整的功能
- 可以有已知问题

**Beta 阶段 (🔬)**
- 功能冻结（除非必要）
- 开放给更多测试者
- 重点修复 bug
- 收集用户反馈

**RC 阶段 (✨)**
- 只修复关键 bug
- 不添加新功能
- 生产环境预演
- 准备正式发布

**Stable 阶段 (🚀)**
- 充分测试过的版本
- 适合生产环境
- 遵循语义化版本
- 谨慎发布 major 版本

### 4. 版本回退
如果发布后发现严重问题：

```bash
# 废弃有问题的版本
npm deprecate open-web-box@1.2.0 "This version has critical bugs, please upgrade"

# 发布修复版本
npm run deploy
# 选择: Stable -> patch
```

## 🔍 故障排查

### 问题 1: npm publish 失败
```bash
# 检查登录状态
npm whoami

# 重新登录
npm login
```

### 问题 2: 版本号冲突
```bash
# 检查远程版本
npm view open-web-box versions

# 确保本地版本号唯一
```

### 问题 3: Git push 失败
```bash
# 检查远程分支
git fetch

# 解决冲突后重新推送
git push origin <branch>
```

## 📚 相关文档

- [语义化版本规范](https://semver.org/lang/zh-CN/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [npm 版本管理](https://docs.npmjs.com/about-semantic-versioning)
- [npm 标签管理](https://docs.npmjs.com/cli/v9/commands/npm-dist-tag)

---

**更新日期**: 2025年11月30日  
**版本**: 0.1.0
