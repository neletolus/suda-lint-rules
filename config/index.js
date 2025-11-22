const js = require('@eslint/js');
const tseslint = require('typescript-eslint');
const importPlugin = require('eslint-plugin-import');
const prettier = require('eslint-config-prettier/flat');

/** @type {import('eslint').FlatConfig.ConfigArray} */
module.exports = tseslint.config(
  {
    name: 'suda/ignores',
    ignores: ['dist/**', 'coverage/**'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    name: 'suda/rules',
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      import: importPlugin,
    },
    rules: {
      /* -----------------------------------------------------------
       * 第II部：ループとロジックの単純化
       * 原則：制御フローを読みやすくする / ネストを浅くする / 早期リターン
       * ----------------------------------------------------------- */

      // elseブロックを使わず、早期リターン（Guard Clause）を推奨する
      // 「ネストを浅くする」ための強力なルールです。
      'no-else-return': ['error', { allowElseIf: false }],

      // ネストの深さを制限する（精神的なスタックオーバーフローを防ぐ）
      'max-depth': ['warn', 3],

      // 複雑度（Cyclomatic Complexity）を制限する
      // 分岐が多すぎる関数は分割すべきという警告。
      complexity: ['warn', 10],

      // 条件式の否定形を避ける（肯定形の方が理解しやすいため）
      // 例: if (!isNotError) -> if (isSuccess)
      'no-negated-condition': 'warn',

      /* -----------------------------------------------------------
       * 第III部：コードの再構成
       * 原則：一度に一つのことをやる / 変数のスコープを縮める
       * ----------------------------------------------------------- */

      // 関数が長すぎる場合は分割を促す
      // 「巨大な式を分割する」「一度に1つのタスクを行う」ために重要。
      'max-lines-per-function': ['warn', { max: 50, skipBlankLines: true, skipComments: true }],

      // パラメータの再代入を禁止する
      // 変数の値がどこで変わったか追いやすくするため。
      'no-param-reassign': 'error',

      // varを禁止し、let/constを強制する（スコープを明確にする）
      'no-var': 'error',

      // 再代入がない変数はconstを強制する
      // 「動く部品（変更される変数）を最小限にする」原則。
      'prefer-const': 'error',

      // 不要な変数を残さない
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],

      /* -----------------------------------------------------------
       * 第I部：表面上の改善（命名）
       * 原則：名前に情報を詰め込む / 誤解されない名前
       * ----------------------------------------------------------- */

      // 命名規則の強制
      // 特にbooleanには is, has, should などの接頭辞を強制し、
      // 「それが何を意味するフラグか」を明確にします。
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'variable',
          format: ['camelCase', 'UPPER_CASE'],
        },
        {
          selector: 'function',
          format: ['camelCase'],
        },
        {
          selector: 'typeLike', // class, interface, typeAlias
          format: ['PascalCase'],
        },
        {
          selector: 'variable',
          types: ['boolean'],
          format: ['PascalCase'],
          prefix: ['is', 'should', 'has', 'can', 'did', 'will'], // 誤解を防ぐための接頭辞
        },
      ],

      // マジックナンバーを禁止し、名前付き定数への置き換えを促す
      '@typescript-eslint/no-magic-numbers': [
        'warn',
        {
          ignore: [-1, 0, 1], // 一般的なループやインデックス用は許容
          ignoreEnums: true,
          ignoreReadonlyClassProperties: true,
        },
      ],

      /* -----------------------------------------------------------
       * 第IV部：選抜テーマ（テストと可読性）& その他
       * ----------------------------------------------------------- */

      // importの順序を整理する
      // コードの「形状」を整え、依存関係を一目で把握しやすくする。
      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],

      // console.logの放置を警告（デバッグ用コードの混入を防ぐ）
      'no-console': ['warn', { allow: ['warn', 'error'] }],

      // TODOコメントなどを残したままにしない（あるいは定期的に確認させる）
      'no-warning-comments': ['warn', { terms: ['todo', 'fixme'], location: 'start' }],
    },
  },
  prettier
);

