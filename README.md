# Open JXL V1
AI 实现禁令：
1. 不得 POST 文件到任何 API
2. 不得加入 encode / 批量 / 对比页
3. 不得用未锁版本的远程 wasm URL
4. 不得把预览域名写进 canonical

## 开发
```bash
npm install
npm run dev
npm run build
```
fixtures：需用 `cjxl` 生成真 JXL 放入 `public/fixtures/`（tiny.jxl/photo-2k.jxl/truncated.jxl/fake.jxl 等），禁止编造字节。
