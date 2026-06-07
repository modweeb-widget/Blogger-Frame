# ModweeB Design

إطار React موحد للأدوات داخل مدونة Blogger على موقع modweeb.com.

---

## هيكل المشروع

```
src/
├── components/
│   ├── Header.jsx        ← الهيدر مع الشعار + زر الثيم + زر المستخدم
│   ├── Footer.jsx        ← الفوتر
│   ├── Preloader.jsx     ← شاشة التحميل المسبق
│   ├── ThemeToggle.jsx   ← زر تبديل الوضع الليلي/النهاري
│   ├── LogoIcon.jsx      ← مكوّن الشعار SVG المشترك
│   └── Layout.jsx        ← الإطار الرئيسي
│
├── pages/
│   ├── Home.jsx              ← /tools
│   ├── Login.jsx             ← /tools/login
│   ├── Account.jsx           ← /tools/account
│   ├── PrivacyPolicy.jsx     ← /tools/privacy-policy
│   ├── RobotsGenerator.jsx   ← /tools/robots-generator
│   └── SeoAnalyzer.jsx       ← /tools/seo-analyzer
│
├── routes/Router.jsx
├── styles/
│   ├── variables.css
│   ├── globals.css
│   ├── layout.css
│   └── auth.css
├── App.jsx
└── main.jsx
```

---

## المسارات المتاحة

| المسار | الصفحة |
|--------|--------|
| `/tools` | الصفحة الرئيسية |
| `/tools/login` | تسجيل الدخول (Google OAuth) |
| `/tools/account` | إدارة الحساب |
| `/tools/privacy-policy` | سياسة الخصوصية |
| `/tools/robots-generator` | مولّد Robots.txt |
| `/tools/seo-analyzer` | محلّل SEO |

---

## تشغيل المشروع محلياً

```bash
npm install
npm run dev
```

---

## الطريقة الأسرع للنشر: Replit Deploy (بدون GitHub)

لا تحتاج GitHub لتضمين المشروع في Blogger.  
Replit يُنشر المشروع مباشرة ويُعطيك رابطاً عاماً ثابتاً.

**الخطوة 1:** في Replit اضغط زر **Deploy / Publish**

**الخطوة 2:** بعد اكتمال النشر ستحصل على رابط مثل:
```
https://modweeb-design.YOUR-USERNAME.replit.app
```

**الخطوة 3:** ملفاتك الجاهزة ستكون على روابط **ثابتة دائماً** (لأننا أزلنا الـ hash من أسماء الملفات):
```
https://modweeb-design.YOUR-USERNAME.replit.app/assets/index.js
https://modweeb-design.YOUR-USERNAME.replit.app/assets/index.css
```

---

## دمج المشروع مع Blogger — Embed مباشر

هذه الطريقة تدمج التطبيق **مباشرة داخل قالب Blogger** بدون iframe.  
التطبيق يُغطي الصفحة كاملاً (`position: fixed`) ويعمل كصفحة مستقلة.

### الخطوة 1 — أضف الملفات في رأس قالب Blogger

في لوحة تحكم Blogger:  
**القالب ← تحرير HTML**

أضف هذا مباشرة **قبل `</head>`**، مع تغيير `YOUR-USERNAME` باسمك:

```html
<!-- ModweeB Design — React Bundle -->
<link
  rel="stylesheet"
  href="https://modweeb-design.YOUR-USERNAME.replit.app/assets/index.css"
  crossorigin="anonymous"
/>
<script
  type="module"
  src="https://modweeb-design.YOUR-USERNAME.replit.app/assets/index.js"
  crossorigin="anonymous"
  defer
></script>
```

### الخطوة 2 — أضف حاوية التطبيق في الصفحة

في **كل صفحة أداة** تريد عرض التطبيق فيها، أضف في محتوى الصفحة:

```html
<div id="root"></div>
```

هذا كل شيء. التطبيق سيُحمَّل ويُغطي الصفحة تلقائياً بتصميمه الكامل.

### الخطوة 3 — تحديد المسار المطلوب لكل صفحة

لأن React Router يقرأ الـ URL تلقائياً، كل ما عليك فعله هو أن يكون رابط صفحة Blogger مطابقاً للمسار:

| صفحة Blogger (رابطها) | الأداة التي ستظهر |
|------------------------|-------------------|
| `modweeb.com/p/login.html` | لن يعمل التوجيه التلقائي — راجع الخطوة 4 |
| `modweeb.com/tools` | صفحة أهلاً بك |

### الخطوة 4 — تمرير المسار يدوياً (لصفحات Blogger بروابط مختلفة)

روابط Blogger (`/p/login.html`) لا تتطابق مع مسارات React (`/tools/login`).  
الحل: أخبر التطبيق بالمسار المطلوب عبر سكريبت صغير **قبل** تحميل bundle:

```html
<!-- في صفحة /p/login.html في Blogger -->
<script>
  // أخبر React Router بالمسار الصحيح
  window.__INITIAL_ROUTE__ = "/tools/login";
</script>
<div id="root"></div>
```

```html
<!-- في صفحة /p/account.html في Blogger -->
<script>
  window.__INITIAL_ROUTE__ = "/tools/account";
</script>
<div id="root"></div>
```

```html
<!-- في صفحة /p/robots-generator.html في Blogger -->
<script>
  window.__INITIAL_ROUTE__ = "/tools/robots-generator";
</script>
<div id="root"></div>
```

ثم في `src/App.jsx` سنقرأ هذا المتغير (راجع قسم التكوين أدناه).

### الخطوة 5 — تكوين App.jsx لدعم التوجيه من Blogger

```jsx
// src/App.jsx
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import AppRouter from "./routes/Router";

export default function App() {
  const initialRoute = window.__INITIAL_ROUTE__;

  // إذا حُدِّد مسار من Blogger، استخدم MemoryRouter
  if (initialRoute) {
    return (
      <MemoryRouter initialEntries={[initialRoute]}>
        <AppRouter />
      </MemoryRouter>
    );
  }

  // وضع التطوير العادي
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <AppRouter />
    </BrowserRouter>
  );
}
```

---

## دمج المشروع مع Blogger — iframe (الأبسط)

إذا أردت الطريقة الأسهل بدون أي تعديل على القالب:

```html
<!-- في صفحة Blogger -->
<style>
  #tool-frame { width:100%; height:100vh; border:none; display:block; }
</style>
<iframe id="tool-frame"
  src="https://modweeb-design.YOUR-USERNAME.replit.app/tools/login"
  allow="clipboard-write">
</iframe>
```

---

## نشر عبر GitHub Pages (اختياري)

إذا أردت GitHub بدلاً من Replit:

```bash
git init
git add .
git commit -m "Initial commit: ModweeB Design"
git branch -M main
git remote add origin https://github.com/modweeb/modweeb-design.git
git push -u origin main
npm run build
# ارفع مجلد dist/public/ إلى فرع gh-pages
```

روابط الملفات ستكون:
```
https://modweeb.github.io/modweeb-design/assets/index.js
https://modweeb.github.io/modweeb-design/assets/index.css
```

---

## نظام المصادقة

| الصفحة | المسار في موقعك | المسار في التطبيق |
|--------|----------------|------------------|
| تسجيل الدخول | `/p/login.html` | `/tools/login` |
| إدارة الحساب | `/p/account.html` | `/tools/account` |

**Google OAuth Client ID:**
```
36053852280-iqmfrcu1m2vd8ai6sc4e10r6afaiiln0.apps.googleusercontent.com
```

**مفاتيح localStorage:**
```js
localStorage.getItem("userLoggedIn")    // "true" | null
localStorage.getItem("userName")         // اسم المستخدم
localStorage.getItem("userPicture")      // رابط الصورة
localStorage.getItem("userEmail")        // البريد الإلكتروني
localStorage.getItem("userJoinDate")     // تاريخ الانضمام
localStorage.getItem("userSessions")     // JSON: قائمة الجلسات
localStorage.getItem("standalone-theme") // "dark" | "light"
```

---

## إضافة أداة جديدة

**1.** أنشئ `src/pages/MyTool.jsx`

```jsx
export default function MyTool() {
  return (
    <div className="tool-page">
      <h2>اسم الأداة</h2>
      {/* محتوى الأداة */}
    </div>
  );
}
```

**2.** أضف المسار في `src/routes/Router.jsx`

```jsx
import MyTool from "../pages/MyTool";
<Route path="/tools/my-tool" element={<MyTool />} />
```

**3.** في صفحة Blogger أضف:

```html
<script>window.__INITIAL_ROUTE__ = "/tools/my-tool";</script>
<div id="root"></div>
```

---

## التقنية المستخدمة

| التقنية | الغرض |
|---------|--------|
| React 18 | بناء الواجهة |
| React Router v6 | التنقل (BrowserRouter + MemoryRouter) |
| Vite | الحزم — أسماء ملفات ثابتة بدون hash |
| Google Identity Services | المصادقة |
| CSS عادي | التصميم |
| localStorage | تخزين بيانات المستخدم |
