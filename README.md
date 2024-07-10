<h1 align=center> Cloudflare-No-Tracked </h1>

使用 Cloudflare 托管的 b 站以及小红书短链去除 web，参考 Demo：<https://cloudflare-no-tracked.fwqaaq.workers.dev/>

你也可以使用 Telegram 机器人，参考 Demo：<https://t.me/fwqaaq_bot>

## Cloudflare Worker 部署

>[!NOTE]
>需要 Cloudflare 账户

1. 首先克隆该仓库

   ```bash
   git clone git@github.com:fwqaaq/Cloudflare-No-Tracked.git
   ```

2. 需要 cloudflare 账户，或者使用 npm、yarn 包管理器

   ```bash
   pnpm i
   # 如果 wrangler 未登陆，需要
   # pnpx wrangler login
   pnpm deploy
   ```

## LICENSE

[MIT](./LICENSE) Copyright (c) 2024 fwqaaq.
