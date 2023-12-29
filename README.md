# Edushare

## 環境設定

```
cp .env.example .env
```

-   POSTGRES_URL

    取得一個空的 PostgreSQL 資料庫並將其網址填入。

    本專案使用與上課相同的 neon。

-   NEXTAUTH_URL

    預設為 http://localhost:3000，如有更改請自行設定為專案網址。

-   NEXTAUTH_SECRET

    英文 + 數字任意組合即可。建議可使用

    ```
    openssl rand -base64 32
    ```

    指令生成。

-   UPLOADTHING_SECRET

    我們使用了 Uploadthing 這個平台來上傳及儲存圖片。

    如要使用的話需要先到這個網站註冊並創建一個 App。

    https://uploadthing.com/

    創建完成後，在

    https://uploadthing.com/dashboard/YOUR_APP_ID/api-keys

    可生成 API KEY，將生成的 UPLOADTHING_SECRET 與 UPLOADTHING_APP_ID 填入即可。

    若需協助可 email: b10902086@ntu.edu.tw

-   UPLOADTHING_APP_ID

    同上

## 安裝所需 package

```
yarn
```

## 資料庫初始設定

```
yarn migrate
```

## 啟動專案

```
yarn dev
```
