# Fileo - Secure File Sharing App

A modern file sharing application built with Next.js and Supabase, featuring password protection, automatic expiry, and file previews.

## 🚀 Features

- **File Upload**: Upload files up to 50MB with drag-and-drop support
- **Password Protection**: Optional password protection for shared files
- **Automatic Expiry**: Files automatically expire based on user-selected time
- **File Previews**: Preview images and PDFs directly in the browser
- **Download Tracking**: Track how many times files have been downloaded
- **Secure Links**: Generate secure, shareable links for files
- **Modern UI**: Beautiful, responsive interface built with Tailwind CSS

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Storage**: Supabase Storage
- **Database**: Supabase PostgreSQL
- **Authentication**: Optional (anonymous for MVP)
- **File Upload**: Supabase JS SDK
- **Password Hashing**: bcryptjs
- **ID Generation**: nanoid

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account and project

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd fileo
npm install
```

### 2. Set up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Create a storage bucket named `fileo-bucket` with public access
3. Create the following table in your Supabase database:

```sql
CREATE TABLE files (
  id TEXT PRIMARY KEY,
  file_name TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  password_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  download_count INTEGER DEFAULT 0,
  file_size BIGINT NOT NULL,
  mime_type TEXT NOT NULL
);

-- Create indexes for better performance
CREATE INDEX idx_files_expires_at ON files(expires_at);
CREATE INDEX idx_files_created_at ON files(created_at);
```

### 3. Environment Variables

Copy the example environment file and fill in your Supabase credentials:

```bash
cp env.example .env.local
```

Edit `.env.local` with your Supabase project details:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── upload/        # File upload endpoint
│   │   ├── download/      # File download endpoint
│   │   └── file/          # File info and preview endpoints
│   ├── file/[id]/         # File view page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── FileViewer.tsx     # File display component
│   ├── Header.tsx         # Navigation header
│   ├── PasswordModal.tsx  # Password input modal
│   └── UploadForm.tsx     # File upload form
└── lib/                   # Utility functions
    ├── supabase.ts        # Supabase client
    └── utils.ts           # Helper functions
```

## 🔧 API Endpoints

### Upload File

- **POST** `/api/upload`
- Accepts multipart form data with file, password (optional), and expiryHours

### Download File

- **POST** `/api/download`
- Requires fileId and password (if protected)

### Get File Info

- **GET** `/api/file/[id]`
- Returns file metadata without password

### File Preview

- **GET** `/api/file/[id]/preview`
- Serves file previews for images and PDFs

## 🎨 Features in Detail

### File Upload

- Drag and drop support
- File size validation (max 50MB)
- Progress indication
- Multiple file type support

### Password Protection

- Optional password for files
- Secure password hashing with bcrypt
- Password verification on download

### File Previews

- Image previews with inline display
- PDF previews with iframe embedding
- Fallback for unsupported file types

### Expiry System

- Configurable expiry times (1 hour to 7 days)
- Automatic file cleanup (requires background job)
- Expired file handling

### Download Tracking

- Increment download count on successful downloads
- Display download statistics

## 🔒 Security Features

- Password hashing with bcrypt
- Secure file URLs with expiration
- File access validation
- Expiry enforcement
- MIME type validation

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🔧 Environment Variables

| Variable                        | Description                 | Required |
| ------------------------------- | --------------------------- | -------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Your Supabase project URL   | Yes      |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key | Yes      |
| `NEXT_PUBLIC_APP_URL`           | Your app's public URL       | Yes      |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions, please open an issue on GitHub.

## 🎯 Roadmap

- [ ] User authentication
- [ ] File organization (folders)
- [ ] Bulk file operations
- [ ] Advanced file previews
- [ ] File versioning
- [ ] API rate limiting
- [ ] Background job for file cleanup
- [ ] Mobile app
