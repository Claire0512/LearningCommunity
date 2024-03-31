# 學習互助平台 Learning Community
![image](https://github.com/Claire0512/EduShare/assets/92367572/4fd1ce01-d4a1-4543-8c00-fe2ac208a819)



## Deployed 連結：https://learning-community.vercel.app
## Demo 影片連結：https://www.youtube.com/watch?v=1H7aHJi9-e8

## 網站介紹：
這是一個專為學習和互助設計的平台。使用者可以匿名自由地提出問題、回答他人的疑問，或是分享有價值的文章。為了促進用戶之間的互助，我們引入了一個點數機制：用戶可以透過回答問題或分享文章來獲得點數，而提出問題則會消耗一定的點數。我們希望通過這樣的設計，能夠鼓勵大家在自己擅長的領域幫助他人，同時在需要時也能從社群中獲得幫助，從而形成一個正向的知識共享和互助的循環。

## 服務說明：
### 討論專區
- 問題瀏覽：可以查看本日熱門問題及所有問題，並支持按類別或其他標準進行篩選和排序。
- 互動功能：能夠收藏貼文，回覆貼文，以及對貼文和留言使用表情。
- 問題管理：可以發起新問題，上傳圖片，選擇最佳回答，並將問題標記為已解決。
  ![image](https://github.com/Claire0512/EduShare/assets/92367572/fe45e41d-cd27-4787-8997-2a33fcbcc60b)
  ![image](https://github.com/Claire0512/EduShare/assets/92367572/295f22da-0ad9-40b6-a322-4dea13dad420)


### 學習資源
- 文章瀏覽：可以查看本日熱門文章及所有文章，並支持按類別或其他標準進行篩選和排序。
- 互動功能：能夠收藏貼文，回覆貼文，以及對貼文和留言使用表情。
- 文章管理：可以發佈文章，上傳圖片。
  ![image](https://github.com/Claire0512/EduShare/assets/92367572/c951e6a1-dfa9-45ae-bdbe-c910cc9cd1c4)
  ![image](https://github.com/Claire0512/EduShare/assets/92367572/627b6a93-e3a1-434e-9757-c44a774ba522)

### 個人檔案
- 編輯個人資訊：可以上傳頭貼並更改使用者名稱及密碼。
- 查看個人紀錄：能夠查看自己的互動記錄，包括文章和問題獲得的愛心數、收藏數、讚數、倒讚數、被認證為最佳回答的次數，以及目前持有的點數。
- 管理內容：可以查看自己發佈的所有問題和文章，以及所有收藏的問題和文章。
- 每日簽到：可以每日簽到累積點數。
![image](https://github.com/Claire0512/EduShare/assets/92367572/e267b3b1-b776-496a-aae1-b082b52826f0)
![image](https://github.com/Claire0512/EduShare/assets/92367572/31ed55b3-9fc5-43a1-bdee-63262579bb0a)

## 使用與參考之框架/模組/原始碼：無
## 使用之第三方套件、框架：
- 前端： TypeScript, Next.js, Tailwind CSS, Material UI
- 後端： Next.js, PostgreSQL, Drizzle ORM, Next-Auth
- 雲端資料庫： Neon database, uploadthing
- Deploy： Vercel

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
yarn build
yarn start
```

