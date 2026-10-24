# 📋 專案 04：班級經營導師神器大廳 (bio-classroom)

本檔案為 **大廳四（bio-classroom）** 之權威專案身分證與架構設定檔。

---

## 📌 專案基本資料

* **專案識別名稱**：`04_大廳四_班級經營導師神器 (bio-classroom)`
* **本機唯一路徑**：`D:\antigravity\教學專案系統\04_大廳四_班級經營導師神器 (bio-classroom)`
* **GitHub 倉庫**：[`zeroseven-hue/bio-classroom`](https://github.com/zeroseven-hue/bio-classroom)
* **GitHub Pages 線上站點**：[https://zeroseven-hue.github.io/bio-classroom/](https://zeroseven-hue.github.io/bio-classroom/)
* **Git 主要分支**：`master`
* **架構定位**：**導師日常班級經營與活動專用神器（Homeroom Teacher Suite）**
  * 專為國中導師開學、迎新、常規排班、座位排定、親師溝通與表揚激勵量身打造。

---

## 🎒 大廳四收錄的 8 款導師工具清單

| 編號 | 工具目錄 | 工具中文名稱 | 主要功能特色 |
| :---: | :--- | :--- | :--- |
| 1 | `orientation/` | 🎒 新生始業輔導闖關 | 國一新生入學認識校園、常規指引、破冰互動。 |
| 2 | `textbook-check/` | 📚 開學教科書清點檢查 | 一鍵勾選點名各科課本發放狀態、缺書登記。 |
| 3 | `form-check/` | 📝 開學各項表單回條檢查 | 註冊回條、家長聯絡表、午餐調查等繳交追蹤。 |
| 4 | `seating-chart/` | 🪑 智慧排座位表系統 | 支援男女分開隨機排位、視力障礙前排鎖定、一鍵匯印。 |
| 5 | `cadre-election/` | 🗳️ 班級幹部選舉開票機 | 投票倒數、動態票數長條圖、當選特效。 |
| 6 | `duty-assignment/` | 🧹 外掃區與值日生分配 | 教室衛生整潔輪值表、外掃區責任到人。 |
| 7 | `parent-letter/` | ✉️ 家長通知書產生器 | 快速生成格式化親師通知、支援複製文字與列印。 |
| 8 | `award-celebrator/` | 🏅 課堂得獎表揚動畫 | 大螢幕頒獎專用，包含彩帶、金牌獎盃動畫與自訂得獎名單。 |

---

## ⚙️ 核心排版與樣式優化標準

* 經過實際大螢幕驗證，本專案首頁 `style.css` 已確立**黃金響應式規範**：
  * 卡片 Grid 採用 `grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));`
  * 單一卡片最大寬度限制為 `max-width: 460px;`，防止在大螢幕寬屏上卡片被拉得過扁。
  * 啟動按鈕寬度限制為 `max-width: 320px;` 並置中對齊，視覺協調美觀。
