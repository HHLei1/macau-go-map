# 綠門 GO｜澳門生態地圖

綠門 GO 是一個包含公開地圖、人物文章、主題路線、訪客投稿及單一管理員後台的網站。

项目支持两种运行方式：

- **本地版**：Node.js + SQLite + 本机图片目录。
- **线上版**：Cloudflare Workers + D1 + KV，代码由 GitHub 管理。

## 功能

- Leaflet 互动地图、分类与地区筛选、关键词搜索
- 地点详情、收藏和分享
- 人物／地方文章
- 可排序的主题路线
- 五步访客投稿与后台审核
- 单一管理员后台：地点、文章、路线、投稿、图片和地图选点
- 草稿与发布状态；只有已发布内容会出现在前台

## 本地运行

需要 Node.js 24 或以上版本：

```sh
npm start
```

- 网站：<http://127.0.0.1:8765/>
- 1920px、100% 预览：<http://127.0.0.1:8765/preview-1920.html>
- 后台：<http://127.0.0.1:8765/admin.html>

首次进入本地后台时建立至少 12 个字元的密码。

本地数据库位于 `data/green-go.sqlite`，图片位于 `data/uploads/`。这两个位置不会提交到 GitHub。

## Cloudflare 架构

| 组件 | 用途 |
|---|---|
| Workers Static Assets | 前台和后台静态文件 |
| Worker `src/worker.js` | API、登录、内容管理和图片访问 |
| D1 | 地点、文章、路线、投稿、管理员和会话 |
| Workers KV | 后台和访客上传的图片 |
| MapTiler Cloud | 正式底图与后台地址定位 |
| Turnstile | 公开投稿的人机验证 |

线上后台地址为 `https://你的域名/admin`。首次进入时需要两项资料：

1. 部署时设定的 `ADMIN_SETUP_TOKEN`；
2. 你希望使用的管理员密码。

设置完成后，只需管理员密码即可登录。`ADMIN_SETUP_TOKEN`、`ADMIN_PEPPER` 和 Turnstile Secret 都必须存放在 Cloudflare Secrets，不能写入 GitHub。

## 第一次部署到 Cloudflare

需要先建立 Cloudflare 帐号，并安装依赖：

```sh
npm install
npx wrangler login
```

Wrangler 4.45 及以上版本能够根据 `wrangler.jsonc` 自动建立 D1 和 KV 资源。先部署一次以建立并绑定资源：

```sh
npx wrangler deploy
npm run cf:migrate:remote
```

建立两个不同的长随机值，并逐项保存为 Cloudflare Secret：

```sh
npx wrangler secret put ADMIN_SETUP_TOKEN
npx wrangler secret put ADMIN_PEPPER
```

创建 Cloudflare Turnstile Widget 后，再保存：

```sh
npx wrangler secret put TURNSTILE_SITE_KEY
npx wrangler secret put TURNSTILE_SECRET
```

最后重新部署：

```sh
npm run cf:deploy
```

然后访问 Worker 给出的网址，在 `/admin` 完成首次管理员设置。

## GitHub 自动部署

仓库包含手动触发的 `.github/workflows/deploy-cloudflare.yml`。第一次 Cloudflare 部署完成后，在 GitHub 仓库的 **Settings → Secrets and variables → Actions** 添加：

- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_API_TOKEN`

API Token 应只授予本项目所需的 Workers、D1 和 KV 权限。完成后可在 GitHub 的 **Actions → Deploy to Cloudflare → Run workflow** 手动上线。确认流程稳定后，再把 workflow 改为每次推送 `main` 自动部署。

## 数据迁移与示范资料

- `migrations/0001_initial.sql` 建立资料表及索引。
- `migrations/0002_seed.sql` 导入当前示范地点、路线和文章。
- `data/seed.json` 是本地数据库的同一份示范来源。

当前地名、地址、电话、营业时间和故事均为示范资料。公开发布前必须逐项核实。

## 上线前检查

- 核实所有公开资料和图片使用权
- 建立 Turnstile 并测试带图和无图投稿
- 更换并安全保存管理员设置凭证
- 设置 D1 导出或备份流程
- 确认地图图砖服务符合实际流量和使用政策
- 绑定正式域名并测试 HTTPS、登录、发布和登出

## 前台底圖與詳情頁

- `dist/map-style.js` 統一向量底圖的道路、水域、綠地與文字樣式，隱藏商戶 POI、交通圖示及 3D 建築。繁體中文和英文使用各自的單語標示。
- 正式網站沿用 Cloudflare Secret 中的 `MAPTILER_KEY`；沒有設定金鑰的本地預覽使用 OpenFreeMap 向量資料。向量渲染不可用時會退回一般圖磚。
- `dist/vendor/` 固定使用 MapLibre GL JS 5.6.1 與 Leaflet adapter 0.1.4，包含對應開源授權。
- 路線中的地點連結會保留來源路線；「在地圖上查看」會直接選中對應地點。文章、地點和路線共用靠左的返回導覽。
