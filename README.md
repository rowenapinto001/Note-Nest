# NoteNest 💕

A tiny space for your big thoughts — a **public scrapbook wall** where anyone can pin a styled sticky note (a message, a memory, a review, or a little piece of happiness). Submissions go through a lightweight **admin moderation queue**, so only approved notes appear on the wall.

<p align="center">
  <a href="assets/demo.mp4">
    <img src="assets/NoteNest%20Thumbnail.png" alt="NoteNest demo video — click to play" width="720">
  </a>
  <br>
  <em>▶️ Click the thumbnail to watch the 1-minute demo</em>
</p>

## ✨ Features

- **Post without an account** — anyone can write a note; no login, no pressure.
- **12+ note styles** — circles, diamonds, stars, tickets, hexagons, blobs and more, each with paper textures, random tilts, pastel colors, and pushpins.
- **Style picker & live counter** — choose a shape before posting; 280-character limit with a live counter.
- **Draft auto-save** — your in-progress note is kept in `localStorage` so you never lose it.
- **Moderation queue** — every submission starts as `pending`; it only reaches the wall after an admin approves it.
- **Multi-admin** — more than one moderator can sign in and review the queue.
- **Paginated wall** — 24 notes per page with a live note count.
- **Hand-drawn scrapbook theme** — bespoke CSS with washi tape, doodles, and floating accents.

## 🛠 Tech stack

- **React 19** + **Vite 8**
- **Supabase** — Postgres, Auth, and Row Level Security
- **Tailwind CSS v4**
- **lucide-react** icons

## 🚀 Getting started

```bash
# 1. Install dependencies
npm install

# 2. Configure environment (see below)
cp .env.example .env.local

# 3. Run the dev server
npm run dev
```

The app runs at **http://localhost:5173/**.

### Environment variables

Create `.env.local` with:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-anon-key

# Comma-separated Supabase Auth user ids allowed to moderate.
VITE_ADMIN_USER_IDS=uuid-of-admin-one,uuid-of-admin-two
```

> The anon key is public by design — security is enforced by Row Level Security, not by hiding the key.

## 🗄 Supabase setup

Create a `notes` table, then run this in the Supabase **SQL Editor** to add moderation and lock down access. Replace the UUIDs with your admin auth user ids (the same ones in `VITE_ADMIN_USER_IDS`):

```sql
-- Columns the app needs
alter table public.notes add column if not exists status text not null default 'pending';
alter table public.notes add column if not exists style text;
alter table public.notes
  add constraint notes_status_check check (status in ('pending', 'approved', 'rejected'));

-- Row Level Security
alter table public.notes enable row level security;

-- Public can read only approved notes
create policy "public read approved" on public.notes
  for select using (status = 'approved');

-- Anyone can submit, but only as pending, with length limits
create policy "public submit pending" on public.notes
  for insert with check (
    status = 'pending'
    and char_length(message) between 1 and 280
    and (name is null or char_length(name) <= 40)
  );

-- Admins can read all, update (approve/reject), and delete
create policy "admin read all" on public.notes
  for select using (auth.uid() in ('uuid-of-admin-one', 'uuid-of-admin-two'));
create policy "admin update" on public.notes
  for update using (auth.uid() in ('uuid-of-admin-one', 'uuid-of-admin-two'))
  with check (auth.uid() in ('uuid-of-admin-one', 'uuid-of-admin-two'));
create policy "admin delete" on public.notes
  for delete using (auth.uid() in ('uuid-of-admin-one', 'uuid-of-admin-two'));
```

Then create your admin user(s) under **Authentication → Users** and put their UUIDs in both the SQL above and `VITE_ADMIN_USER_IDS`.

## 🛡 Moderation flow

1. A visitor writes a note and clicks **Pin my note** → it is saved as `pending` and does **not** appear on the wall.
2. An admin opens **`/admin`**, signs in with email + password, and sees the pending queue.
3. **Approve** publishes the note to the wall; **Reject** hides it. RLS guarantees only listed admins can do this.

> Path-based routing is used for `/admin`, so production hosting needs an SPA fallback (serve `index.html` for unknown paths). Vite's `dev` and `preview` already do this.

## 📂 Project structure

```
src/
  App.jsx                 # Routing, note fetching, submit handler
  lib/supabase.js         # Supabase client + admin id list
  components/
    Hero.jsx              # Landing header
    NoteForm.jsx          # Submission form (style picker, draft save)
    NotesWall.jsx         # Paginated grid of approved notes
    NoteCard.jsx          # Single note rendering
    AdminPage.jsx         # Login + moderation queue
  index.css               # Scrapbook theme
```

## 📜 Scripts

| Command           | Description                  |
| ----------------- | ---------------------------- |
| `npm run dev`     | Start the dev server         |
| `npm run build`   | Production build             |
| `npm run preview` | Preview the production build |
| `npm run lint`    | Run ESLint                   |

---

Made with tiny notes and kind hearts. ✨
