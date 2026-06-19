import { useEffect, useState } from 'react';
import AdminPage from './components/AdminPage.jsx';
import Hero from './components/Hero.jsx';
import NoteForm from './components/NoteForm.jsx';
import NotesWall from './components/NotesWall.jsx';
import { hasSupabaseConfig, supabase } from './lib/supabase.js';

function usePathRoute() {
  const [path, setPath] = useState(() => window.location.pathname);
  useEffect(() => {
    const onChange = () => setPath(window.location.pathname);
    window.addEventListener('popstate', onChange);
    return () => window.removeEventListener('popstate', onChange);
  }, []);
  return path;
}

const colors = ['#fff3b8', '#ffdce8', '#d9f7ff', '#f1e3ff', '#ffe5cf', '#e3f8d8'];

function pickStyle() {
  return {
    color: colors[Math.floor(Math.random() * colors.length)],
    rotation: Math.floor(Math.random() * 9) - 4,
  };
}

export default function App() {
  const path = usePathRoute();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState('');

  async function loadNotes() {
    if (!hasSupabaseConfig) {
      setNotice('Add your Supabase URL and anon key to .env to open the wall.');
      setLoading(false);
      return;
    }
    const pageSize = 1000;
    let from = 0;
    let allNotes = [];
    let fetchError = null;
    while (!fetchError) {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .range(from, from + pageSize - 1);
      if (error) {
        fetchError = error;
        break;
      }
      allNotes = [...allNotes, ...(data || [])];
      if (!data || data.length < pageSize) break;
      from += pageSize;
    }
    if (fetchError) setNotice('The notes are taking a tiny sea nap. Try again soon.');
    else setNotes(allNotes);
    setLoading(false);
  }

  useEffect(() => {
    loadNotes();
  }, []);

  async function addNote({ name, message, style }) {
    if (!hasSupabaseConfig) throw new Error('Supabase is not configured yet.');
    const styledNote = { name: name || null, message, style, status: 'pending', ...pickStyle() };
    const { error } = await supabase.from('notes').insert(styledNote);
    if (error) throw error;
    // Pending notes don't appear on the wall until an admin approves them.
  }

  if (path === '/admin') return <AdminPage />;

  return (
    <main className="min-h-screen overflow-hidden bg-[#fff7f3] text-[#5f3b36]">
      <div className="scrapbook-bg relative">
        <div className="scallop" />
        <span className="float-doodle left-[7%] top-32">♡</span>
        <span className="float-doodle right-[9%] top-72 delay-1">✦</span>
        <span className="float-doodle left-[18%] top-[46rem] delay-2">✧</span>
        <Hero />
        <section id="wall" className="mx-auto max-w-7xl space-y-12 px-5 pb-16 sm:px-8 lg:px-12">
          <NoteForm onSubmit={addNote} />
          <NotesWall notes={notes} loading={loading} notice={notice} />
        </section>
        <footer className="relative z-10 px-5 pb-12 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-5xl rounded-3xl border-2 border-pink-200 bg-white/75 p-6 text-center shadow-note backdrop-blur">
            <p className="font-hand text-3xl font-black text-coral">Made with tiny notes and kind hearts</p>
            <p className="mx-auto mt-2 max-w-xl font-semibold text-[#8a625b]">
              NoteNest is a public memory wall for thoughts, reviews, secrets, and little pieces of happiness.
            </p>
            <a
              className="mt-5 inline-flex items-center justify-center rounded-full bg-coral px-6 py-3 font-black text-white shadow-sm transition hover:-translate-y-1"
              href="https://github.com/rowenapinto001/Note-Nest"
              rel="noreferrer"
              target="_blank"
            >
              View NoteNest on GitHub
            </a>
          </div>
        </footer>
      </div>
    </main>
  );
}
