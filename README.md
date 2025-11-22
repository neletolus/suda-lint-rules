# eslint-config-suda

TypeScriptの可読性・保守性を高めるためのESLint共有設定です。  
ルールは`config/index.js`にまとまっており、Guard Clause推奨や命名規約など、`.eslintrc.js`で使っていたものをそのままパッケージ化しています。

## インストール

```bash
npm install -D eslint-config-suda \
  eslint@^9.0.0 \
  @typescript-eslint/parser@^8.47.0 \
  @typescript-eslint/eslint-plugin@^8.47.0 \
  typescript-eslint@^8.47.0 \
  eslint-plugin-import \
  eslint-config-prettier \
  prettier
```

## 使い方

`eslint.config.js` (または `eslint.config.mjs/ts`) で共有設定をそのままエクスポートしてください。

```js
// eslint.config.js (CommonJS)
const suda = require('eslint-config-suda');

module.exports = suda;
```

```js
// eslint.config.js (ESM)
import suda from 'eslint-config-suda';

export default suda;
```

TypeScriptを使わないプロジェクトでも動きますが、パーサとプラグインは peerDependencies として必須なので、インストールは忘れずに。`@typescript-eslint/*@8.47.0` は `eslint@^9.0.0` とセットで動くことを前提にしています。

## 動作確認フロー

1. `npm run lint:test`  
   `eslint --config config/index.js --print-config config/index.js` で共有設定が読み込めるか確認できます
2. `npm pack` → 別プロジェクトで `npm install ../suda-lint-rules-*.tgz`  
   実際に `extends: ['eslint-config-suda']` を書いて読み込めるか検証してください

## 公開前チェックリスト

- `package.json` の `version` を更新したか
- `npm publish --access public` で公開できることを `npm whoami` 等で確認したか
- 追加で必要なルールがあれば `config/index.js` に追記し、READMEも更新する

