# shineusn.github.io

这是我的 GitHub Pages 个人网站源码仓库。站点使用纯静态文件构建，并通过 GitHub Actions 自动部署到 Pages。

## 访问地址
- https://shineusn.github.io/

## 本地开发
- 直接双击 `index.html` 预览，或使用任意静态服务器（如 VS Code Live Server）。

## 部署
- 推送到 `main` 分支后，Actions 会自动构建并发布。

## 自定义域名（可选）
1. 在仓库根目录添加 `CNAME`，内容为你的域名（如 `example.com`）。
2. 在 DNS 添加 A 记录到 185.199.108.153/154/155/156（IPv4），可选 AAAA 到 2606:50c0:8000::153/154/155/156。
3. 推送后在 Settings  Pages 勾选 Enforce HTTPS。

