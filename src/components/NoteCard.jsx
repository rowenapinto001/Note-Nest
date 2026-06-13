const styles = [
  'shape-rectangle note-lines', 'shape-circle note-dots', 'shape-diamond note-frame',
  'shape-ticket note-hearts-list', 'shape-tag note-grid', 'shape-hex note-floral',
  'shape-star note-confetti', 'shape-blob note-diary', 'shape-arch note-tabs',
  'shape-scallop note-lace', 'shape-pill note-split', 'shape-ticket note-checks',
  'shape-diamond note-dots', 'shape-circle note-ribbon', 'shape-tag note-labels',
];

export default function NoteCard({ note }) {
  const numericId = Number(String(note.id || '').replace(/\D/g, ''));
  const fallbackIndex = (Number.isNaN(numericId) ? 0 : numericId) % styles.length;
  const noteStyle = styles.includes(note.style) ? note.style : styles[fallbackIndex];
  const date = note.created_at
    ? new Date(note.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    : '';

  return (
    <article className={`mini-note ${noteStyle}`} style={{ '--tilt': `${note.rotation || 0}deg` }}>
      <span className="shape-bg" />
      <span className="note-pin" />
      <div className="note-inner">
        <p>{note.message}</p>
        <span className="note-heart">♥</span>
        <footer>
          <span>{note.name || 'Anonymous'}</span>
          <span>{date}</span>
        </footer>
      </div>
    </article>
  );
}
