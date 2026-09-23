# codec 选型记录（V1 已钉死）

- 包：`@jsquash/jxl@1.3.0`（仅调用 `decode`；仓库内 fixtures 用其 `encode` 本地生成，浏览器产物不含编码器）
- 许可证：Apache-2.0（随 squashed 构建，见 `node_modules/@jsquash/jxl/LICENSE`）
- wasm：本站静态资源 `public/jxl/jxl_dec.js` + `jxl_dec.wasm`（849240 bytes，约 0.83 MB），禁止远程 CDN
- API：Worker（`public/jxl-worker.js`，`type: module`）中 `initEmscriptenModule(jxlDecoder, undefined, { locateFile: p => '/jxl/' + p })` 后 `module.decode(Uint8Array)`，仅 decode
- 体积：UI 文案已填实约 0.9 MB
- 动画行为：解码器对动画 JXL 只输出第一帧；V1 接受此行为，UI 在 WASM 解码成功时注明「仅显示第一帧」，见 `public/viewer.js` frame 文案（满足设计文档「不得静默只出第一帧还不说明」）
- ICC：解码器默认输出 8-bit canvas，不做 Display P3/HDR 真显示承诺；`with-icc.jxl` 仅验收能预览
- 后备：若体积/许可不合，改用 jxl-oxide 的 wasm 绑定（未发生）
