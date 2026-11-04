# 星詠ミオ — Official Character Website

**架空のオリジナルキャラクター『星詠ミオ』の非商用デモ公式サイト。** 既存作品とは別の独立プロジェクトです。

## 機能
- レスポンシブ対応のシングルページ、静的HTML/CSS/JavaScript
- イラストもオリジナルのSVG（外部画像依存なし）
- 87.7 MHzでメッセージを受信できるインタラクティブラジオ
- プロフィール、観測日誌、ギャラリー
- キーボード操作、状態通知、低モーション設定に配慮

## 起動
`python3 -m http.server 8000` でローカルサーバーを開いてください。ビルド不要です。

## キャラクター
**星詠 ミオ (Hoshiyomi Mio)**：夜の観測所で星からの電波を集める少女。7月7日生まれ、身長158cm。好きなものは流星群、クリームソーダ、古いラジオ。実在人物・団体とは関係ありません。

## 著作・ライセンス
HTML/CSS/JSおよびSVGはこのプロジェクト向けに制作。MIT License。

## Accessibility and interaction verification
- Range slider is keyboard-accessible and exposes a label.
- Receiver outputs an aria-live status message.
- Reduced motion is respected.
- Responsive navigation uses aria-expanded state.
