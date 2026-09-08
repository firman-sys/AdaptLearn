<p align="center">
  <img src="frontend/src/assets/logo-adaptlearn.webp" alt="AdaptLearn Logo" width="120" />
</p>

<h1 align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Outfit&weight=700&size=40&pause=99999&color=78624A&center=true&vCenter=true&width=435&lines=Adapt" height="0" width="0" alt="" />
  Adapt<span>Learn</span>
</h1>

<p align="center"><strong>Platform Pembelajaran Adaptif Berbasis Gaya Belajar</strong></p>

AdaptLearn adalah aplikasi web full-stack yang menyajikan pengalaman belajar yang dipersonalisasi berdasarkan gaya belajar pengguna. Aplikasi ini mengidentifikasi gaya belajar masing-masing pengguna melalui kuis asesmen, lalu merekomendasikan materi pembelajaran yang sesuai — baik dalam bentuk **materi bacaan** maupun **video visual** — agar proses belajar menjadi lebih efektif dan menyenangkan.

Link Deployment : <a href="https://adaptlearn-ps091.vercel.app/" target="_blank">AdaptLearn</a>

## ✨ Fitur Utama

- **Kuis Identifikasi Gaya Belajar** — Menganalisis preferensi belajar pengguna (visual, reading, dsb.)
- **Asesmen Level** — Menentukan tingkat kemampuan pengguna untuk rekomendasi materi yang tepat
- **Dashboard Personal** — Menampilkan progres belajar dan rekomendasi materi
- **Pembelajaran Bacaan** — Halaman belajar dengan materi teks berbasis Markdown
- **Pembelajaran Visual** — Halaman belajar dengan konten video dari YouTube
- **Rekomendasi Adaptif** — Sistem rekomendasi materi berdasarkan hasil asesmen gaya belajar dan level pengguna

## 🏗️ Arsitektur & Tech Stack

| Layer        | Teknologi                                                             |
| ------------ | --------------------------------------------------------------------- |
| **Frontend** | React 19, Vite 7, Tailwind CSS 4, Shadcn UI, React Router DOM 7      |
| **Backend**  | Node.js, Express 5, ES Modules                                       |
| **Database** | Supabase (PostgreSQL)                                                 |
| **API**      | REST API dengan Axios                                                 |
| **Lainnya**  | React Markdown, Lucide React (ikon), YouTube API (konten video)       |

```
AdaptLearn/
├── backend/              # Server Express.js (REST API)
│   ├── config/           # Konfigurasi Supabase client
│   ├── controllers/      # Logic handler untuk setiap endpoint
│   │   ├── authController.js
│   │   ├── materialController.js
│   │   ├── progressController.js
│   │   ├── quizController.js
│   │   └── recommendationController.js
│   ├── routes/           # Definisi routing API
│   ├── utils/            # Utility functions
│   ├── index.js          # Entry point server
│   └── package.json
│
├── frontend/             # Aplikasi React + Vite
│   ├── public/           # Static assets
│   └── src/
│       ├── assets/       # Gambar & aset
│       ├── components/   # Komponen UI reusable (Shadcn UI)
│       ├── layouts/      # Layout wrapper (Main, Quiz, Dashboard, Learning)
│       ├── lib/          # Utility library
│       ├── pages/        # Halaman aplikasi
│       │   ├── public/       # Landing, Login, Register
│       │   ├── quiz/         # WelcomeScreen, StyleIdentification, AssessmentLevel, QuizResult
│       │   ├── dashboard/    # DashboardHome
│       │   └── learning/     # ReadingLearningPage, VisualLearningPage
│       ├── services/     # API service layer
│       ├── App.jsx       # Root component & routing
│       └── main.jsx      # Entry point React
│
├── .gitignore
└── README.md
```

## 📋 Prasyarat (Prerequisites)

Pastikan software berikut sudah terinstal di komputer Anda:

| Software     | Versi Minimum | Cara Cek                |
| ------------ | ------------- | ----------------------- |
| **Node.js**  | v18.x         | `node --version`        |
| **npm**      | v9.x          | `npm --version`         |
| **Git**      | v2.x          | `git --version`         |

## ⚙️ Petunjuk Setup Environment

### 1. Clone Repository

```bash
git clone https://github.com/<username>/AdaptLearn.git
cd AdaptLearn
```

### 2. Setup Backend

```bash
# Masuk ke direktori backend
cd backend

# Install dependencies
npm install
```

Buat file `.env` di dalam folder `backend/` dengan isi sebagai berikut:

```env
PORT=5000

SUPABASE_URL=<url_supabase_anda>
SUPABASE_KEY=<supabase_anon_key_anda>

QUIZ_API_KEY=<api_key_quiz_anda>
YOUTUBE_API_KEYS=<youtube_api_key_1>,<youtube_api_key_2>
```

> [!IMPORTANT]
> Ganti setiap placeholder `<...>` dengan kredensial yang sebenarnya. Jangan commit file `.env` ke repository — file ini sudah tercantum di `.gitignore`.

### 3. Setup Frontend

```bash
# Kembali ke root, lalu masuk ke direktori frontend
cd ../frontend

# Install dependencies
npm install
```

Buat file `.env` di dalam folder `frontend/` dengan isi sebagai berikut:

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Konfigurasi Supabase

Pastikan Anda sudah memiliki project di [Supabase](https://supabase.com/) dengan tabel-tabel yang dibutuhkan aplikasi (users, materials, progress, quiz results, dsb.). Gunakan `SUPABASE_URL` dan `SUPABASE_KEY` dari dashboard Supabase Anda.

## 🚀 Cara Menjalankan Aplikasi

### Menjalankan Backend

```bash
cd backend

# Mode development (auto-restart dengan nodemon)
npm run dev

# Atau mode production
npm start
```

Server backend akan berjalan di **`http://localhost:5000`**.

Anda dapat memverifikasi bahwa server berjalan dengan membuka URL tersebut di browser. Respon yang diharapkan:

```json
{
  "status": "ok",
  "message": "AdaptLearn API is running 🚀",
  "version": "2.0.0"
}
```

### Menjalankan Frontend

```bash
# Buka terminal baru
cd frontend

npm run dev
```

Frontend akan berjalan di **`http://localhost:5173`** (default Vite).

> [!NOTE]
> Frontend sudah dikonfigurasi dengan **proxy** di `vite.config.js` sehingga request ke `/api/*` akan otomatis diteruskan ke backend di `http://localhost:5000`.

### Menjalankan Keduanya Sekaligus

Buka **dua terminal terpisah**, lalu jalankan masing-masing:

| Terminal 1 (Backend) | Terminal 2 (Frontend) |
| -------------------- | --------------------- |
| `cd backend`         | `cd frontend`         |
| `npm run dev`        | `npm run dev`         |

## 🔗 API Endpoints

| Endpoint                 | Deskripsi                              |
| ------------------------ | -------------------------------------- |
| `GET /`                  | Health check server                    |
| `/api/auth/*`            | Autentikasi (login, register)          |
| `/api/quiz/*`            | Kuis gaya belajar & asesmen level      |
| `/api/materials/*`       | Manajemen materi pembelajaran          |
| `/api/progress/*`        | Tracking progres belajar pengguna      |
| `/api/recommendations/*` | Rekomendasi materi adaptif             |

## 🛠️ Scripts yang Tersedia

### Backend (`backend/package.json`)

| Script          | Perintah             | Deskripsi                               |
| --------------- | -------------------- | --------------------------------------- |
| `npm start`     | `node index.js`      | Menjalankan server dalam mode production |
| `npm run dev`   | `nodemon index.js`   | Menjalankan server dengan auto-reload    |

### Frontend (`frontend/package.json`)

| Script            | Perintah         | Deskripsi                             |
| ----------------- | ---------------- | ------------------------------------- |
| `npm run dev`     | `vite`           | Menjalankan dev server                 |
| `npm run build`   | `vite build`     | Build untuk production                 |
| `npm run preview` | `vite preview`   | Preview hasil build                    |
| `npm run lint`    | `eslint .`       | Menjalankan linter                     |
