# BuilderPro Marketplace - Project Guide & Instructions (README)

elderbuddy ek premium e-commerce portal aur interior designer showcase platform hai. Isko Express/Node backend (MongoDB/Mongoose ke sath) aur vanilla JavaScript (SPA - Single Page Application) frontend ke sath banaya gaya hai.

---

## Server Chalane aur Setup karne ke Instructions (Setup & Run Instructions)

### 1. Prerequisites (Zaroori cheezein)
- **Node.js** (v18 ya usse upar) installed hona chahiye.
- **MongoDB** local machine par chal raha hona chahiye (default roop se `mongodb://127.0.0.1:27017/builderpro` par).

### 2. Installation (Dependencies install karein)
Project ke root folder mein jaakar dependencies install karein:
```bash
npm install
```

### 3. Environment Variables (Environment setup)
Root directory mein ek `.env` file banayein (ya pehle se bani file ko check karein):
```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/builderpro
```

### 4. Project Chalana (Running the Project)
Development server ko shuru karne ke liye niche di gayi command chalayein:
```bash
npm start
```
Yeh command **Nodemon** ke sath backend server ko shuru karegi jo auto-reload support karta hai. Server chalne ke baad aap browser mein **http://localhost:3000** par project dekh sakte hain.

---

## Pure Project mai kiye gaye kaam (Key Achievements & Implemented Features)
1. **Database Migration (MongoDB/Mongoose)**: Purane file-based JSON database ko hatakar MongoDB mein shift kiya gaya hai.
2. **Auto-Seeder (Auto-Seeding)**: Server ke pehli baar chalne par agar database khali hota hai, toh yeh default roop se 30+ construction materials, categories, measurement units, banners, 3 designer profiles, 3 builder profiles, aur buying guides ko seed (insert) kar deta hai.
3. **Admin Console (Admin & Vendor Console)**: Ek premium console banaya gaya hai jahan se admin products, categories, units, home banners, interior designers, builders, aur **Buying Guides/Blogs** ko add, update, aur delete (CRUD) kar sakta hai.
4. **Interior Designer Showcase & Portfolio**:
   - Designers ki list dekhne ke liye `#/interior-designers` page.
   - Har designer ke liye detail `#/interior-designer/:id` page.
   - Har project ke andar multiple photos upload karne aur unhe sliding carousel mein dekhne ki suvidha.
   - Custom profile photo upload karne ya name ke initials (jaise Ananya Sharma -> AS) automatic generate karne ki suvidha.
   - Booking consultation form jo automatically designer ke name ke sath service lead enquiry generate karta hai.
5. **Builders Portfolio Module**:
   - Builders ki list dekhne ke liye `#/builders` page.
   - Har builder ke liye detail `#/builder/:id` page.
   - Builder profiles aur unke structural project portfolios ko show karne ke liye visual carousels, firm names, ratings, bio, aur specialties.
   - Admin console CRUD controls tab nested project forms support ke sath.
6. **Buying Guide & Markdown Blog Detail Engine**:
   - Buying guide ke blog cards par click karne par users dedicated detail view (`#/guide/:id`) par navigate kar sakte hain.
   - Ek dynamic client-side **Markdown-to-HTML Parser** banaya gaya hai jo blog posts, bold text, lists, and headings ko render karta hai.
   - Multiple images ke sequence ko modern CSS Grid layout (Image Gallery) aur **Lightbox Zoom Overlay** me render kiya gaya hai.
7. **Material & Banner Image Upload (Image Uploads & Compression)**: Multer ka use karke server par images upload hoti hain. Upload karne se pehle frontend par images ko Canvas ki help se compress kiya jata hai taaki local storage fallback limit aur server bandwidth par load na pade.

---

## Project ki File Structure (File Structure & File Purposes)

### 1. Backend Files

#### [backend/server.js](file:///c:/Users/CLICK/Documents/practice-folder/ecomerce/backend/server.js)
- Backend ka main entry point hai. Express app initialize karta hai, middlewares (CORS, JSON parser, static folders) set karta hai, routes register karta hai aur port 3000 par listen karta hai.

#### [backend/config/database.js](file:///c:/Users/CLICK/Documents/practice-folder/ecomerce/backend/config/database.js)
- Mongoose ke through MongoDB se connection set up karta hai aur database auto-seeder function ko run karta hai.

#### Database Models (backend/models/)
- [productModel.js](file:///c:/Users/CLICK/Documents/practice-folder/ecomerce/backend/models/productModel.js): Construction materials ka Mongoose schema (name, brand, category, price, specs, etc.).
- [categoryModel.js](file:///c:/Users/CLICK/Documents/practice-folder/ecomerce/backend/models/categoryModel.js): Product categories ka schema.
- [unitModel.js](file:///c:/Users/CLICK/Documents/practice-folder/ecomerce/backend/models/unitModel.js): Measurement units (jaise Bag, Ton, Piece) ka schema.
- [bannerModel.js](file:///c:/Users/CLICK/Documents/practice-folder/ecomerce/backend/models/bannerModel.js): Home page banners ka schema.
- [designerModel.js](file:///c:/Users/CLICK/Documents/practice-folder/ecomerce/backend/models/designerModel.js): Interior designers ka schema (nested projects aur images ke sath).
- [builderModel.js](file:///c:/Users/CLICK/Documents/practice-folder/ecomerce/backend/models/builderModel.js): Builders ka schema (nested projects aur images ke sath).
- [leadModel.js](file:///c:/Users/CLICK/Documents/practice-folder/ecomerce/backend/models/leadModel.js): Sourcing request leads aur consultation inquiries ka schema.
- [orderModel.js](file:///c:/Users/CLICK/Documents/practice-folder/ecomerce/backend/models/orderModel.js): E-commerce cart orders ka schema.
- [guideModel.js](file:///c:/Users/CLICK/Documents/practice-folder/ecomerce/backend/models/guideModel.js): Buying guide posts ka schema (detailed content/markdown support ke sath).

#### Routes (backend/routes/)
- [apiRoutes.js](file:///c:/Users/CLICK/Documents/practice-folder/ecomerce/backend/routes/apiRoutes.js): Sabhi API routing paths ko `/api` ke andar integrate karta hai.
- [guideRoutes.js](file:///c:/Users/CLICK/Documents/practice-folder/ecomerce/backend/routes/guideRoutes.js): Sabhi blog/guides API endpoints ko control karta hai.
- [builderRoutes.js](file:///c:/Users/CLICK/Documents/practice-folder/ecomerce/backend/routes/builderRoutes.js): Builders API routes mapping.
- [uploadRoutes.js](file:///c:/Users/CLICK/Documents/practice-folder/ecomerce/backend/routes/uploadRoutes.js): Images ko `backend/uploads` directory mein upload karne ke liye Multer use karta hai.

#### Controllers (backend/controllers/)
- [guideController.js](file:///c:/Users/CLICK/Documents/practice-folder/ecomerce/backend/controllers/guideController.js): Buying guides ki database lookup, creation, update aur deletion handling.
- [builderController.js](file:///c:/Users/CLICK/Documents/practice-folder/ecomerce/backend/controllers/builderController.js): Builders and projects CRUD and database handling.

---

### 2. Frontend Files (React + Vite Architecture)

Ab application vanilla JS se **React v18 + Vite** par fully migrate ho chuki hai. Aap isme normal React components ke roop mein edits kar sakte hain.

#### [index.html](file:///c:/Users/CLICK/Documents/practice-folder/ecomerce/index.html)
- Main HTML entrypoint jo `src/main.jsx` ko load karta hai aur static styling (`index.css`) & Google Fonts load karta hai.

#### [index.css](file:///c:/Users/CLICK/Documents/practice-folder/ecomerce/index.css)
- Central custom stylesheets jo complete premium layout styling, dark theme variables, transitions aur glassmorphic templates ko specify karti hain.

#### [src/main.jsx](file:///c:/Users/CLICK/Documents/practice-folder/ecomerce/src/main.jsx)
- React app ka entry module jo root node par React Virtual DOM tree load karta hai.

#### [src/App.jsx](file:///c:/Users/CLICK/Documents/practice-folder/ecomerce/src/App.jsx)
- Global state provider (`AppContext`) jo cart logic (add/remove/update/clear), dark theme status aur server state (products, builders, designers, orders, guides) ko handle karta hai. Hash Router mapping bhi isi file me define hai.

#### Component-Based Directory Structure:

- **Pages (`src/pages/`)**:
  - [Home.jsx](file:///c:/Users/CLICK/Documents/practice-folder/ecomerce/src/pages/Home.jsx): Responsive marketing slides, brand marquee, circles category navigation.
  - [ProductList.jsx](file:///c:/Users/CLICK/Documents/practice-folder/ecomerce/src/pages/ProductList.jsx): Catalog grid, brand and category filter sidebars, range price sliders.
  - [ProductDetail.jsx](file:///c:/Users/CLICK/Documents/practice-folder/ecomerce/src/pages/ProductDetail.jsx): Specifications list, related products recommendation.
  - [Checkout.jsx](file:///c:/Users/CLICK/Documents/practice-folder/ecomerce/src/pages/Checkout.jsx): Cart subtotal/GST checkout invoice forms and order POST submissions.
  - [Designers.jsx](file:///c:/Users/CLICK/Documents/practice-folder/ecomerce/src/pages/Designers.jsx) & [DesignerDetail.jsx](file:///c:/Users/CLICK/Documents/practice-folder/ecomerce/src/pages/DesignerDetail.jsx): Interior designers portfolio listings, ratings badge and image carousels.
  - [Builders.jsx](file:///c:/Users/CLICK/Documents/practice-folder/ecomerce/src/pages/Builders.jsx) & [BuilderDetail.jsx](file:///c:/Users/CLICK/Documents/practice-folder/ecomerce/src/pages/BuilderDetail.jsx): Structural developers cards and project carousel sliders.
  - [GuideDetail.jsx](file:///c:/Users/CLICK/Documents/practice-folder/ecomerce/src/pages/GuideDetail.jsx): Custom Markdown-to-HTML parser blogs engine and lightbox zoom modal.
  - [AdminConsole.jsx](file:///c:/Users/CLICK/Documents/practice-folder/ecomerce/src/pages/AdminConsole.jsx): Tabbed CRUD admin panel (products, categories, measurement units, orders, leads, designers, builders, guides) nested fields and image file compression.

- **Components (`src/components/`)**:
  - [Navbar.jsx](file:///c:/Users/CLICK/Documents/practice-folder/ecomerce/src/components/Navbar.jsx): Sticky header, central store search form, dark theme toggle.
  - [CartDrawer.jsx](file:///c:/Users/CLICK/Documents/practice-folder/ecomerce/src/components/CartDrawer.jsx): Slide-out cart panel with GST invoice calculator.
  - [MaterialEstimatorModal.jsx](file:///c:/Users/CLICK/Documents/practice-folder/ecomerce/src/components/MaterialEstimatorModal.jsx): Bricks, sand, cement construction volume calculator.
  - [InquiryModal.jsx](file:///c:/Users/CLICK/Documents/practice-folder/ecomerce/src/components/InquiryModal.jsx): Custom project execution / sourcing quote submission form.
  - [Footer.jsx](file:///c:/Users/CLICK/Documents/practice-folder/ecomerce/src/components/Footer.jsx): Links, estimator modal trigger.

---

## React Development Workflow

Aap as a developer manually components me changes karke verify kar sakte hain:

### 1. Vite Development Server (Port 5173)
Vite dev server start karne ke liye:
```bash
npm run dev
```
- Isse frontend hot reloading (HMR) ke sath **http://localhost:5173** par run hoga.
- `vite.config.js` proxy rule automatically `/api` aur `/uploads` endpoints backend port 3000 par routing redirect kar dega. Isliye call options same chalenge.

### 2. Express Backend Server (Port 3000)
Backend APIs/Database handler run karne ke liye:
```bash
npm run server
```
- Nodemon backend codes auto-refresh ensure karta hai.

### 3. Production Build Compilation
Build generate karne ke liye:
```bash
npm run build
```
- Yeh production optimized assets build generates karke `/dist` folder me save karega.
- Backend server `dist/` directory ko index endpoint (`*`) fallback serve ke liye direct load karega.

---

## Developer Notes
- **React State Integration**: Sabhi CRUD operations backend database APIs request karte hain, response validation par AppContext refetch updates trigger karta hai jisse component instantly reload ho jata hai.
- **Canvas Compression**: Product/Avatar files select karne par browser local storage quota issues prevent karne ke liye automatic lightweight client-side Canvas optimization base64 resize compress use hota hai.
