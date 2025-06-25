# Todoアプリ

React、TypeScript、Viteで構築された多機能なTodoアプリケーションです。

## 主な機能

*   タスクの追加、編集、削除
*   タスクの完了状態の切り替え
*   ドラッグ＆ドロップによるタスクの並べ替え
*   Material-UIによるモダンなUI

## 使用技術

*   React
*   TypeScript
*   Vite
*   Material-UI
*   @dnd-kit (ドラッグ＆ドロップ機能)

## 始め方

### 前提条件

*   Node.js (v18以降)
*   npm

### インストールと実行

1.  アプリケーションのディレクトリに移動します:
    ```bash
    cd app
    ```
2.  依存関係をインストールします:
    ```bash
    npm install
    ```
3.  開発サーバーを起動します:
    ```bash
    npm run dev
    ```
4.  ブラウザで `http://localhost:5173` を開きます。

## ディレクトリ構成

```
todo-app/
├── README.md
└── app/
    ├── public/
    ├── src/
    ├── .gitignore
    ├── package.json
    └── vite.config.ts
```