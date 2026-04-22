# Simple Blog System

A high-performance, professional CMS and Blog engine built with the **Next.js App Router**, featuring a robust moderation system, server-side SEO optimization, and a premium "Liquid Glass" design aesthetic.

**[🌐 Live Demo](https://your-live-demo-link.vercel.app)**

---

## 🚀 Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/) - Leveraged for Server-Side Rendering (SSR) and optimized hydration.
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Ensures type safety across the full stack, from Prisma schemas to frontend props.
- **Database**: [Neon DB](https://neon.tech/) (PostgreSQL) - Serverless Postgres used for reliable data persistence and low-latency scaling.
- **ORM**: [Prisma](https://www.prisma.io/) - Provides a type-safe interface for database queries and schema migrations.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Used for rapid, responsive UI development with a custom design system.
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/) - Built on Radix UI for accessible, high-quality interactive components.
- **Validation**: [Zod](https://zod.dev/) - Handles schema validation for API requests and client-side forms.

---

## 📂 Project Structure

```bash
├── app/                  # Next.js App Router (The "Skeleton")
│   ├── (auth)/           # Route Group for Admin Login
│   ├── admin/            # Admin Panel (Dashboard, Posts, Comments)
│   ├── api/              # Backend API routes for CRUD operations
│   ├── blog/             # Public Blog Detail routes (SSR)
│   ├── layout.tsx        # Global Layout (UI Navigation)
│   ├── page.tsx          # Blog Listing Home Page (ISR)
│   ├── sitemap.ts        # Dynamic SEO Sitemap
│   └── robots.ts         # Robots.txt Configuration
├── components/           # Reusable UI components (Shadcn + Custom)
│   ├── admin/            # Admin-specific components (Sidebar, Tables)
│   ├── blog/             # Public-facing components (Blog cards, Comments)
│   └── ui/               # Base Shadcn UI components (Buttons, Inputs)
├── lib/                  # Shared Utilities
│   ├── prisma.ts         # Prisma Client singleton
│   └── utils.ts          # Tailwind merge & helper functions
├── prisma/               # Database Configuration
│   └── schema.prisma     # DB Schema (Blog, Image, Comment tables)
├── public/               # Static assets (Images, Favicons)
├── .env.example          # Template for required Environment Variables
├── middleware.ts         # Auth protection for /admin routes
└── README.md             # Project documentation
```

---

## 📊 Database Schema

The system utilizes a relational PostgreSQL schema managed via Prisma. Key relationships are designed for high-performance retrieval and data integrity.

| Table | Description | Key Fields |
| :--- | :--- | :--- |
| **Blog** | Stores article content and metadata. | `id`, `title`, `slug` (unique), `summary`, `content`, `viewCount`, `published`. |
| **BlogImage** | Stores secondary gallery images. | `id`, `url`, `blogId` (Foreign Key to Blog). |
| **Comment** | Stores user interactions. | `id`, `senderName`, `content`, `isApproved`, `blogId`. |
| **Admin** | Manages dashboard credentials. | `id`, `username`, `password` (hashed). |

**Entity Relationship Overview:**
- A **Blog** has a one-to-many relationship with **BlogImage** (up to 6 images).
- A **Blog** has a one-to-many relationship with **Comment**.
- Comments are hidden by default (`isApproved: false`) until moderated.

---

## ✨ Key Features & Design Decisions

### 🔍 SEO & Routing
- **Dynamic URL Slugs**: Instead of IDs, articles use readable slugs (e.g., `/blog/mastering-typescript`) to improve search engine rankings.
- **Server-Side Metadata**: Implemented `generateMetadata` in `app/blog/[slug]/page.tsx` to dynamically inject OpenGraph titles and descriptions for every post.

### ⚡ Performance Optimization
- **Incremental Static Regeneration (ISR)**: The home page utilizes `revalidate = 60`, ensuring the site remains lightning-fast while automatically updating content every minute without manual rebuilds.
- **Database Indexing**: Explicitly added indexes to the `title` and `createdAt` columns in the `Blog` model to ensure millisecond-fast performance for search queries and sorting.
- **View Counting System**: Implemented an atomic view increment system using a server-side `PATCH` method. It includes a `useRef` guard on the client to prevent duplicate counts during a single session or React StrictMode re-renders.

### 🛡️ Data Integrity & Security
- **Type Safety**: Unified the data flow using a custom `BlogWithImages` interface in `types/index.ts`, ensuring end-to-end type safety from Prisma to the Admin Dashboard.
- **Strict Zod Validation**: The comment system includes a custom regex validation (`/^[ก-๙0-9\s]+$/`) ensuring that only **Thai characters and numbers** are submitted.
- **Secure Authentication**: Admin access is protected by **JWT (Jose)** stored in `HttpOnly` secure cookies.

### 🧩 Reusability & Scalability
- **Unified Admin Architecture**: Leveraged the Shadcn Sidebar component to establish a scalable navigation hub, allowing for the addition of new modules (e.g., Users, Settings, Analytics) without refactoring the core dashboard layout.
- **Design Token Strategy**: Utilized Tailwind CSS variables and Shadcn UI theming to ensure the entire system is "brand-agnostic," enabling rapid visual rebranding across multiple projects by modifying a single theme file.
- **Metadata & SEO Framework**: Implemented centralized Sitemap and Robots logic using Next.js Metadata API, creating a reusable pattern for ensuring search engine discoverability across dynamic URL slugs.
- **Robust Build Stability**: Wrapped search-dependent listing components in `<Suspense>` boundaries to handle client-side hydration for search parameters, ensuring the build remains stable and the UI remains responsive during data fetching.

---

## 🛠️ Admin Panel Instructions

**Accessing the Dashboard:**
1. Navigate to `/admin/login`.
2. Enter the admin credentials (default seeded: `admin` / `admin123`).
3. Upon successful login, you will be redirected to the **Dashboard Overview**.

**Moderation Flow:**
- **Manage Posts**: Create, edit, or delete articles. You can toggle the `Published` status to control visibility on the public site.
- **Comment Inbox**: View a list of pending comments. Approve them to make them visible on the blog post, or reject them to delete them permanently.

---

## 💻 Setup & Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Lwant-02/Simple-Blog.git
   cd simple-blog
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Configuration:**
   Create a `.env` file in the root and add your database and JWT secrets:
   ```env
   DATABASE_URL="postgresql://user:pass@host/db"
   JWT_SECRET="your_secret_key"
   BASE_URL="https://your-blog-domain.com"
   ```

### 🔐 Admin Access
**Dashboard Login:**
- **URL**: `/admin/login`
- **Username**: `admin`
- **Password**: `admin123`

### 🔍 Advanced SEO & Crawling
- **Dynamic Sitemap**: Automatically generated via `sitemap.ts`, indexing all public articles.
- **Robots Management**: Configured in `robots.ts` to guide crawlers while protecting private admin routes.
- **Metadata**: Comprehensive keyword lists and OpenGraph tags for maximum visibility.

4. **Database Setup:**
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```

---

## 📝 Assumptions & Limitations

- **Image Constraints**: The system assumes a maximum of **6 secondary images** per blog post to maintain UI performance and layout balance.
- **Image Hosting**: Currently, images are provided via external URLs (Unsplash used for seeding).
- **Thai-Only Comments**: The validation strictly enforces Thai characters; English or other languages will trigger a validation error by design.

---

## 🚀 Future Improvements

**Current Status**: 100% of core requirements (CRUD, SEO, Moderation, Validation, Performance, View Tracking) are implemented.

**If given more time, I would continue with:**
1. **Rich Text Editor**: Integrate TipTap or Quill for a full WYSIWYG authoring experience.
2. **Cloud Media Storage**: Implement direct image uploads to Cloudinary or AWS S3.
3. **Draft Preview System**: Add a "Live Preview" mode to see how articles look before they are published.
