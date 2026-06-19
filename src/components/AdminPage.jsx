import { Check, Heart, LogOut, RefreshCw, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { adminUserIds, hasSupabaseConfig, supabase } from '../lib/supabase.js';

function backToWall() {
  window.history.pushState({}, '', '/');
  window.dispatchEvent(new PopStateEvent('popstate'));
}

export default function AdminPage() {
  const [session, setSession] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!hasSupabaseConfig) {
      setReady(true);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => setSession(next));
    return () => sub.subscription.unsubscribe();
  }, []);

  let body;
  if (!hasSupabaseConfig) {
    body = <p className="admin-empty">Add your Supabase keys to .env.local to use the admin page.</p>;
  } else if (!ready) {
    body = <p className="admin-empty">Loading...</p>;
  } else if (!session) {
    body = <SignIn />;
  } else if (!(adminUserIds.length === 0 || adminUserIds.includes(session.user.id))) {
    body = (
      <div className="space-y-4 text-center">
        <p className="font-bold text-rose-500">
          This account is not a moderator. Signed in as {session.user.email}.
        </p>
        <button className="btn-reject mx-auto" onClick={() => supabase.auth.signOut()} type="button">
          <LogOut size={16} /> Sign out
        </button>
      </div>
    );
  } else {
    body = <Queue email={session.user.email} />;
  }

  return (
    <main className="admin-shell scrapbook-bg text-[#5f3b36]">
      <span className="float-doodle left-[7%] top-24">♡</span>
      <span className="float-doodle right-[9%] top-40 delay-1">✦</span>
      <div className="admin-wrap">
        <div className="admin-head">
          <h1>Note<span>Nest</span> Admin</h1>
          <button className="admin-link" onClick={backToWall} type="button">Back to wall</button>
        </div>
        <div className="admin-panel">
          <span className="admin-tape" />
          {body}
        </div>
      </div>
    </main>
  );
}

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) setError(signInError.message);
    setBusy(false);
  }

  return (
    <form className="mx-auto max-w-sm space-y-4" onSubmit={handleSubmit}>
      <p className="text-center font-hand text-2xl font-black text-coral">
        Sign in to moderate notes <Heart className="inline fill-coral text-coral" size={20} />
      </p>
      <input
        className="pretty-input"
        type="email"
        placeholder="Admin email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
      />
      <input
        className="pretty-input"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        required
      />
      {error && <p className="text-center font-bold text-rose-500">{error}</p>}
      <button className="pin-button" disabled={busy} type="submit">
        {busy ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  );
}

function Queue({ email }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    setError('');
    const { data, error: loadError } = await supabase
      .from('notes')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: true });
    if (loadError) setError(loadError.message);
    else setNotes(data || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function decide(id, status) {
    setNotes((current) => current.filter((note) => note.id !== id));
    const { error: updateError } = await supabase.from('notes').update({ status }).eq('id', id);
    if (updateError) {
      setError(updateError.message);
      load();
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="admin-status">
          {email} · <span className="text-coral">{notes.length}</span> pending
        </p>
        <div className="flex gap-2">
          <button className="admin-link" onClick={load} type="button">
            <RefreshCw size={16} /> Refresh
          </button>
          <button className="admin-link" onClick={() => supabase.auth.signOut()} type="button">
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </div>

      {error && <p className="font-bold text-rose-500">{error}</p>}
      {loading && <p className="admin-empty">Loading queue...</p>}
      {!loading && notes.length === 0 && <p className="admin-empty">No pending notes. All caught up! 🎉</p>}

      <ul>
        {notes.map((note) => (
          <li className="queue-card" key={note.id}>
            <span className="note-pin" />
            <p>{note.message}</p>
            <div className="queue-meta">
              <span className="queue-author">{note.name || 'Anonymous'}</span>
              <div className="queue-actions">
                <button className="btn-approve" onClick={() => decide(note.id, 'approved')} type="button">
                  <Check size={16} /> Approve
                </button>
                <button className="btn-reject" onClick={() => decide(note.id, 'rejected')} type="button">
                  <X size={16} /> Reject
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
