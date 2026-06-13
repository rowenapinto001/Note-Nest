import { Heart, Star } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import NoteCard from './NoteCard.jsx';

const starterNotes = [
  'Today is a good day to have a good day 💕',
  'You are enough just as you are.',
  'Be the reason someone smiles today 😊',
  'Grateful for the little things in life 🌱',
  'Keep going, everything you need will come.',
  'I came, I saw, I made it awkward.',
  'Collect memories, not things.',
  'You glow differently when you are happy ✨',
  'Small progress is still progress.',
  'Take care of your mind.',
  'Throw kindness around like confetti 🎉',
  'Every day is a fresh start.',
  'Breathe in peace, breathe out stress.',
  'Do more of what makes your soul happy.',
  'Kind words mean everything.',
  'Happiness looks gorgeous on you.',
  'Be kind to your mind.',
  'Your story still matters.',
  'Tiny joys count too.',
  'Leave a little sparkle behind.',
];

const notesPerPage = 24;
const starterStyles = [
  'shape-rectangle note-lines', 'shape-circle note-dots', 'shape-diamond note-frame',
  'shape-ticket note-hearts-list', 'shape-tag note-grid', 'shape-hex note-floral',
  'shape-star note-confetti', 'shape-blob note-diary',
];

export default function NotesWall({ notes, loading, notice }) {
  const [page, setPage] = useState(1);
  const displayNotes = notes.length ? notes : starterNotes.map((message, id) => ({
    id: `starter-${id}`,
    message,
    name: id === 0 ? 'Just now' : 'NoteNest',
    style: starterStyles[id % starterStyles.length],
    rotation: (id % 7) - 3,
  }));
  const pageCount = Math.max(1, Math.ceil(displayNotes.length / notesPerPage));
  const visibleNotes = useMemo(() => {
    const start = (page - 1) * notesPerPage;
    return displayNotes.slice(start, start + notesPerPage);
  }, [displayNotes, page]);
  const pageNumbers = Array.from({ length: pageCount }, (_, index) => index + 1)
    .filter((item) => item === 1 || item === pageCount || Math.abs(item - page) <= 1);

  useEffect(() => {
    setPage(1);
  }, [notes.length]);

  return (
    <section className="relative">
      <div className="wall-badge left-badge">Take what<br />you need today ♥</div>
      <div className="wall-badge right-badge">So many beautiful<br />minds here! ♥</div>
      <div className="wall-title">
        <Star className="fill-yellow-300 text-yellow-300" />
        <h2><Heart className="inline fill-coral text-coral" size={20} /> Notes from kind hearts</h2>
        <Star className="fill-yellow-300 text-yellow-300" />
      </div>
      {notice && <p className="mb-4 rounded-xl bg-white/80 p-3 font-bold text-coral shadow-sm">{notice}</p>}
      {loading && <p className="rounded-xl bg-white/80 p-4 font-bold text-coral shadow-sm">Loading notes...</p>}
      <div className="notes-grid">
        {!loading && visibleNotes.map((note) => <NoteCard key={note.id} note={note} />)}
      </div>
      {!loading && pageCount > 1 && (
        <div className="pagination">
          <button disabled={page === 1} onClick={() => setPage((item) => item - 1)} type="button">Previous</button>
          {pageNumbers.map((item, index) => (
            <span key={item}>
              {index > 0 && item - pageNumbers[index - 1] > 1 && <span className="page-gap">...</span>}
              <button className={item === page ? 'active' : ''} onClick={() => setPage(item)} type="button">{item}</button>
            </span>
          ))}
          <button disabled={page === pageCount} onClick={() => setPage((item) => item + 1)} type="button">Next</button>
        </div>
      )}
      {!loading && (
        <p className="note-count">
          Number of notes = {notes.length}
        </p>
      )}
    </section>
  );
}
