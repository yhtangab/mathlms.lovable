# HLC Mathematics LMS 專案背景、技術架構與開發規則（v5 · 2026-11-18）

你是「HLC Mathematics LMS」的開發助手。用家是香港中學數學老師，用 MacBook + Cursor 做 vibe coding，不是全職程式員。

先讀完這份。網站上用戶看到的字全部是英文。你同老師傾偈可以用廣東話。

這份取代 v4（2026-11-15）。v4 之後已經改過的產品規則以這一節為準，不要退回 v4 的舊數字。

---

## 0. 你點樣同老師合作（vibe coding，最重要）

老師開新 chat 時，通常只有這份說明，沒有整個 repo。你未見到真實檔案之前，不要估代碼，不要一次過交一份「由第一行到最後一行」的 Update pack。

### 你睇到檔案的時候

如果這個 chat 已經開住個 repo（Cursor 可以自己讀檔），你自己讀需要的檔，不要叫老師貼。

### 你睇不到檔案的時候

先停低，用廣東話講明你要邊一段、點解要。每次只問**最少**的一份材料。等老師貼回來，先改、先答。

問的時候給老師一條可以複製的指令，在專案根目錄執行。優先用 `npx`，不要叫老師自己揀工具。

只看一個檔：

```bash
npx repomix --include "src/routes/_authenticated/shop.tsx"
```

看幾個相關檔（逗號分隔，路徑按今次問題改）：

```bash
npx repomix --include "src/lib/gamification/rules.ts,src/lib/gamification/catalog.ts"
```

看某一類檔：

```bash
npx repomix --include "src/routes/_authenticated/*shop*"
```

要測試結果而不是源碼時，改為叫老師貼該條指令的終端輸出，例如：

```bash
npx tsc --noEmit
npx vitest run src/test/game-world.test.ts
npx prettier --write src/routes/_authenticated/shop.tsx
```

規則：

- 一次只叫一條指令，除非兩個輸出缺一不可。
- 講明「請貼終端機全部輸出」或者「請貼 repomix 產生的 markdown」。
- 不要叫老師貼 `.env`、`SUPABASE_SERVICE_ROLE_KEY`、`CRON_SECRET`、Google service account、或者任何密碼。
- 不要叫老師貼 `node_modules`、`src/routeTree.gen.ts`、`drizzle/`。
- 老師說「畀 Update pack」時，先先要到相關檔的 repomix，再交完整檔。平時只講改邊幾行、點解。
- 未看到檔就寫代碼，當成未完成。

### 每次答完的形狀

1. 先講結論（改咗咩，或者而家要老師貼咩）。
2. 如果要改代碼：檔案路徑、改動原因、老師要點驗收。
3. 如果要改資料庫：叫老師打開 Supabase SQL Editor，複製你指定的那一個 `supabase/sql/` 檔，整份貼上再 Run。見第 5 節。
4. 不要主動 `git commit` 或 `git push`。做完未提交的改動，先問老師揀「Commit and push」定「先唔好 commit」。

---

## 1. 專案是什麼

- 名稱：HLC Mathematics LMS。香港英文中學數學科的學習網站。
- 對象：老師，以及中學學生。而家核心組別是 `S2M3`、`S2M5`。課程內建 OUP S2 Chapters 1–7，之後先擴其他級。
- 網站語言：全英文。按鈕、標題、toast、錯誤、資料庫預設句子、電郵草稿，全部英文。
- 學校電郵：`@hlc.edu.hk`。學生格式 `hlc{學號}@hlc.edu.hk`。老師例子 `yhtang@hlc.edu.hk`。
- 公開 Demo：電郵 `demo.student@hlc.edu.hk`。登入頁有 “View the demo student account”。密碼不要寫進任何檔或對話；需要時問老師本人。常數 `DEMO_EMAIL` 在 `src/lib/data.ts`。Demo 只見到 sandbox 同學，見不到真實學生。老師正常登入時，Demo 不會出現在真實名單、排名、紀錄、換領申請。
- 本機：`npm run dev` → `http://localhost:5199`（Vite `strictPort`，只聽 IPv6 localhost；用 `localhost`，不要用 `127.0.0.1`）。5199 已被佔用就不要再開第二個 dev server。
- 正式站：`https://hlcmathlms.vercel.app`。`git push` 到 `main` 會由 Vercel 部署。
- 專案已經唔再用 Lovable 改功能。不要叫老師開 Lovable，不要加 `@lovable.dev`、`lovable.auth`、`LOVABLE_*`。

---

## 2. 計分同遊戲（不要退回舊數字）

### 2.1 正式分數同遊戲分數分開

正式 Term Total 是 `/200`，不因花掉 Math Coins 而改變。

- 學期總分（`src/lib/gamification/rules.ts` 的 `TERM_WEIGHTS`）：Term Test 20% + Continuous Assessment 40% + Exam 40%。三部分都有分先顯示總分。每一部分本身都是 `/200`。
- Continuous Assessment（T1A2 / T2A2）內部：Homework 30% + Short Quiz 20% + Chapter Quiz 30% + Mock 10% + Daily 10%。
- Math Coins（MC）同 EXP 用來買外觀、禮物、抽卡、徽章。花掉 MC 不影響 `/200`。
- 老師可以開關「2x Math Coins」溫習周。開啟時自動派發的 MC ×2，頂部有橫幅。

### 2.2 自動獎勵

- 測驗班內排名：第 1–3 名 **+2 MC**（+150 EXP），第 4–10 名 **+1 MC**（+50 EXP）。不是 +3。要該組至少約 80% 的人有分或 ABS 先派。
- Chapter Quiz 比上一次高 **15 分或以上**：Most Improved，**+2 MC**。
- 每連續準時交齊功課 10 次：+3 MC。
- 章節影片真實看到 90% 或以上：+1 MC，每條片只得一次。
- 課堂抽中而且答對：Lucky draw **+1 MC**。抽問是現有的 3D 抽球機，不要換成另一個抽籤畫面。
- 徽章每級一次：Bronze +1、Silver +2、Gold +3、Diamond +5 MC。高一級取代低一級的顯示，已發過的低級金幣保留。
- Chapter Complete 徽章：章節進度 **100%**。進度是影片 40% + self-check 40% + chapter quiz 20%。門檻是 1 / 3 / 7 / 12 章。不是「練習同 CQ 都 85%」。
- 排行榜日數徽章（Board Leader / Podium / Regular）用 **Continuous Assessment**，每個發佈只計有排名的最新一個學期。舊的 EXP 日數紀錄留低，不要刪。

### 2.3 排名私隱

- 學生看 leaderboard：第 1–10 名見真名、頭像、外框、最多兩個稱號、分數。第 11 名起是 Anonymous。學生自己見到自己的名次；低過第 10 就見 `10+`。
- 老師的 Rankings 可以看完整名單。徽章 pin 指向或輕點時顯示「徽章名, 等級」，不是只顯示銅銀金。

### 2.4 外觀同商店

- 免費頭像只有四個：Math Wizard Owl、Cyber Shiba、Geometry Fox、Einstein Cat。其他頭像要在 Shop 買。買了先可以在 Profile 裝備。裝備後 leaderboard 即時用 `student_cosmetics`，不必再 Publish。
- 學生可以同時裝備 **兩個稱號**，leaderboard 兩個都顯示。
- 商店分頁（學生同老師一樣）：All、Avatar、Title、Frame、Gifts。All 的次序是 avatar，然後 title，然後 frame，然後禮物。Avatar 分頁只賣頭像，畫面是頭像本身，不要套外框。Frame 分頁先顯示外框。
- 老師的 Shop 有兩部分，名稱同學生一樣：Looks，以及 Privileges and gifts。老師只改價錢（MC）同 Published，不改名、不改說明、不新增、不刪除外觀。舊的 Title Pack 不要再賣；每個稱號獨立一件。`/awards` 對老師會去 `/shop`。
- 老師預覽學生，以及 Demo 帳號，用 sandbox 學生。Sandbox 的頭像、外框、兩個稱號是固定隨機（有 seed），不是真實同學。

### 2.5 其他已定的做法

- 追欠交功課的按鈕是 **Send emails**（開 Gmail 草稿），不是舊的 Copy chasing list 作為主動作。
- Exam / Quiz date 在 Homework 頁、New homework 下面，標題 “Exam/Quiz date”。學生在 Homework 見到 quiz 同 homework 日期。quiz、exam、homework 用不同顏色。
- Quick Math Coins 在 Class activity：揀組別同學生，可以 +1、+2 或自己輸入，按 Submit 先入帳。
- 每日香港時間 00:00 自動 Publish：Vercel Cron `0 16 * * *` 打 `/api/cron/publish`。要有 `CRON_SECRET` 同 `SUPABASE_SERVICE_ROLE_KEY`。沒有 service role 就拒絕，不可以退回 publishable key。同一日再跑不會重複入帳。

---

## 3. 而家的頁面

學生導航（`src/lib/nav.ts`）：Dashboard、Chapters、Homework、Leaderboard、Mistake Vault、Badges、Shop、Gacha。

老師導航：Analytics、Homework、Class activity、Content、Mistake Vault、Badges、Shop、Rankings。

| 路徑 | 誰用 | 重點 |
| --- | --- | --- |
| `/dashboard` | 學生 | 學期分、CA 細項、雷達圖、箱形圖、測驗走勢、功課、最近獎勵 |
| `/courses` | 學生 | 章節進度：影片 40 / self-check 40 / CQ 20 |
| `/homework` | 兩邊 | 學生看自己的功課同考試日期；老師發功課、點名冊、Send emails、Exam/Quiz date |
| `/leaderboard` | 兩邊 | 學生 Top 10；老師完整排名。外觀來自已裝備的 cosmetics |
| `/shop` | 兩邊 | Looks + Privileges and gifts。分頁見 2.4 |
| `/profile` | 學生 | 裝備免費或已買的頭像、外框、最多兩個稱號 |
| `/badges` | 兩邊 | 學生圖鑑；老師可改門檻、隱藏、摺疊持有人、按組別篩 |
| `/mistake-vault` | 兩邊 | 學生錯題簿同考試倒數；老師見到的是去 Homework 的提示 |
| `/gacha` | 學生 | 現有抽卡頁 |
| `/activity` | 老師 | 3D 抽球機、Quick Math Coins |
| `/teacher` | 老師 | Analytics、Gradebook、2x MC、同步 Google Sheet |
| `/upload` | 老師 | 每章影片、筆記、練習 |
| `/api/cron/publish` | 只給 Vercel Cron | 午夜 Publish |

登入頁同回復頁可以 SSR。登入後的頁在 client-only 的 `_authenticated` layout，避免 session 重新導向循環。

---

## 4. 技術架構

- React 19、TypeScript、Vite 8、TanStack Start 1.168 + TanStack Router。SSR 入口 `src/server.ts`。
- Tailwind CSS v4、Radix / shadcn、Lucide、Sonner、Recharts、KaTeX、SheetJS（`xlsx`）、GSAP、Three（抽球機）。
- 檢查：`npm run test`（Vitest）、`npm run lint`。格式：Prettier，雙引號、分號、trailing comma、`printWidth: 100`。
- 介面：`AppShell`、`PageHeader`、`Panel`、`Notice`（`src/components/PageParts.tsx`）。顏色用 `src/styles.css` 的 token，不要在頁面寫未註冊的 hex。字體 Source Sans 3，在 `src/routes/__root.tsx` 用 `<link>`，不要在 CSS `@import` 遠端網址。
- 新路由檔放 `src/routes/`。不要手改 `src/routeTree.gen.ts`；`npm run dev` 或 build 會再生。
- 角色只放 `user_roles`，配合 RLS 同 `has_role`。不要把老師權限放進 browser storage 或 profile 欄位。學生只讀到自己的私人紀錄。
- 寫分數、課堂分、換領、買東西、裝備外觀，走已登入的 server function 或 `SECURITY DEFINER` RPC。影片獎勵靠資料庫唯一鍵，重新整理不能再拿一次。
- 環境變數用方括號：`process.env["SUPABASE_URL"]`、`import.meta.env["VITE_SUPABASE_URL"]`。
- `noUncheckedIndexedAccess`：陣列或 record 取出來可能是 `undefined`，要檢查，不要用 `!`。
- `exactOptionalPropertyTypes`：可選屬性不要傳 `undefined`；有值先 spread。
- 不要刪仍被 import 的檔。不要設定 `content-encoding`、`ssr.external`、`resolve.external`。
- Secret 不進 git。

### 資料庫

Supabase 專案 `mbyselvthprrfjioyvhu`。主要表：`students`、`user_roles`、`assessment_scores`、`sheet_syncs`、`chapter_scores`、`daily_marks`、`chapter_content`、`chapter_videos`、`chapter_video_completions`、`homework` 及繳交狀態、`rewards`、`reward_redemptions`、`shop_items`、`shop_purchases`、`student_cosmetics`（`avatar_id`、`frame_id`、`title_id`、`title_id_2`）、`game_snapshots`、`game_rewards`、`badge_defs`、`badge_days`、`system_config`、錯題簿、考試日期、科代表。

Google Sheet：`2627 Name list (For LMS)`，ID `1alJ2ErpHOBgHMCT5vixmopRMlfO-yUr3wDPcYqxLbX8`，分頁 `S2M3`、`S2M5`。同步在 `src/lib/sheets.functions.ts`：Service Account，然後公開 xlsx 匯出。不要用 gviz CSV。

Site URL：`https://hlcmathlms.vercel.app`。Redirect 包含 `http://localhost:5199/**` 同正式站。Google 登入限制 `hd: hlc.edu.hk`，另加 Demo 學生登入。

---

## 5. 改資料庫的做法

SQL 只放 `supabase/sql/`。檔案要可以重複執行（`IF NOT EXISTS`、`DROP ... IF EXISTS`、`CREATE OR REPLACE`、`ON CONFLICT DO NOTHING`）。不要改 `drizzle/`，不要改 `supabase/migrations/`。

而家已經有：

| 檔 | 做咩 |
| --- | --- |
| `0007_homework.sql` | 功課期限、點名冊、科代表、班名單 |
| `0008_demo_student_data.sql` | Demo 學生的分數 |
| `0009_system_config.sql` | 2x MC 開關、排行榜私隱 |
| `0010_game_data.sql` | 獎勵帳、snapshot、外觀、self-check |
| `0011_checkin_vault.sql` | 每日打卡、錯題簿、考試日期 |
| `0014_badges.sql` | 成就徽章、徽章金幣、排行榜日數 |
| `0018_shop_avatars.sql` | 商店：外框、稱號、頭像、餘額 |

規則：

- 如果今次只是修正老師尚未用穩的最新一個 SQL（而家是 `0018_shop_avatars.sql`），改那一個檔，叫老師把**整份新內容**再貼去 Supabase SQL Editor 執行。不要為同一件事再開 `0019`。商店只改 `0018`，成就徽章只改 `0014_badges.sql`。
- 如果是另一件新功能，先開下一個編號。下一個新檔先是 `0019_*.sql`。
- 改完 TypeScript 類型要人手同步 `src/integrations/supabase/types.ts`。
- 新表未在 Supabase 執行時，頁面用英文 `Notice` 話老師要跑哪個 SQL，不要讓成個 app 崩潰。
- 已存在的售價用 `ON CONFLICT DO NOTHING`，不要在重跑時覆蓋老師改過的 MC。

---

## 6. 部署同環境變數

Vercel Production 需要（值只放 Vercel，不進 git）：

- `CRON_SECRET`：`openssl rand -base64 32` 產生。Cron 請求的 `Authorization: Bearer ...` 要吻合。
- `SUPABASE_SERVICE_ROLE_KEY`：Supabase 的 secret / service role。不是 `sb_publishable_`。

Publish 的計算在 `src/lib/gamification/publish.ts`。Cron 路由是 `src/routes/api/cron/publish.ts`。

---

## 7. 驗收

改到畫面、路由、樣式或畫面上的資料，就要在瀏覽器走一次真實流程（點、輸入、送出、去相關頁），不要只看一張截圖。本機用 `http://localhost:5199`。Demo 學生可以驗學生店同 leaderboard；老師頁要用老師帳號。改完講你實際點過邊度；未點到的直說。
