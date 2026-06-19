import { Heart, Send, Sparkles, UserRound } from 'lucide-react';
import { useEffect, useState } from 'react';

const maxName = 40;
const maxMessage = 280;
const previewStyles = [
  { preview: 'preview-rect', style: 'shape-rectangle note-lines' },
  { preview: 'preview-circle', style: 'shape-circle note-dots' },
  { preview: 'preview-diamond', style: 'shape-diamond note-frame' },
  { preview: 'preview-ticket', style: 'shape-ticket note-hearts-list' },
  { preview: 'preview-tag', style: 'shape-tag note-grid' },
  { preview: 'preview-hex', style: 'shape-hex note-floral' },
  { preview: 'preview-star', style: 'shape-star note-confetti' },
  { preview: 'preview-blob', style: 'shape-blob note-diary' },
  { preview: 'preview-arch', style: 'shape-arch note-tabs' },
  { preview: 'preview-scallop', style: 'shape-scallop note-lace' },
  { preview: 'preview-pill', style: 'shape-pill note-split' },
  { preview: 'preview-label', style: 'shape-tag note-labels' },
];
const draftKey = 'notenest-draft';

function getDraft() {
  try {
    return JSON.parse(localStorage.getItem(draftKey)) || {};
  } catch {
    return {};
  }
}

export default function NoteForm({ onSubmit }) {
  const draft = getDraft();
  const [name, setName] = useState(draft.name || '');
  const [message, setMessage] = useState(draft.message || '');
  const [style, setStyle] = useState(draft.style || previewStyles[0].style);
  const [status, setStatus] = useState({ type: '', text: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    localStorage.setItem(draftKey, JSON.stringify({ name, message, style }));
  }, [name, message, style]);

  async function handleSubmit(event) {
    event.preventDefault();
    const cleanName = name.trim().slice(0, maxName);
    const cleanMessage = message.trim();
    if (!cleanMessage) return setStatus({ type: 'error', text: 'Please write a message first.' });
    if (cleanMessage.length > maxMessage || saving) return;
    setSaving(true);
    setStatus({ type: '', text: '' });
    try {
      await onSubmit({ name: cleanName, message: cleanMessage, style });
      localStorage.removeItem(draftKey);
      setName('');
      setMessage('');
      setStatus({ type: 'success', text: 'Thank you! Your note is awaiting approval and will appear once a moderator approves it.' });
    } catch {
      setStatus({ type: 'error', text: 'Could not save that note. Please try again.' });
    } finally {
      setSaving(false);
    }
  }

  function saveDraft() {
    localStorage.setItem(draftKey, JSON.stringify({ name, message, style }));
    setStatus({ type: 'success', text: 'Draft saved on this device.' });
  }

  return (
    <form onSubmit={handleSubmit} className="journal-panel">
      <span className="clip form-clip" />
      <div className="form-sticker"><Heart className="fill-coral text-coral" /></div>
      <div className="form-note-left">Tiny<br />words<br />matter <span>✦</span></div>
      <div className="form-note">You<br />belong<br />here <span>♥</span></div>
      <div className="cat-frame" aria-hidden="true">
        <span className="cat-corner cat-top-left" />
        <span className="cat-corner cat-top-right" />
        <span className="cat-corner cat-bottom-left" />
        <span className="cat-corner cat-bottom-right" />
        <span className="cat-clip cat-clip-one" />
        <span className="cat-clip cat-clip-two" />
      </div>

      <div className="form-main relative z-10">
        <div className="form-intro">
          <h2 className="font-hand text-4xl font-black md:text-5xl">Write your note <Heart className="inline text-coral" /></h2>
          <p className="mt-2 font-semibold text-[#8a625b]">Pin a thought to the wall ✨</p>
          <div className="heart-page mt-8 hidden md:grid"><Heart className="fill-coral text-coral" /></div>
        </div>

        <div className="form-fields">
          <div className="form-section">
            <label className="block text-sm font-black" htmlFor="name">Name or nickname <span className="font-semibold">(optional)</span></label>
          <div className="relative">
            <input id="name" maxLength={maxName} value={name} onChange={(event) => setName(event.target.value)}
              placeholder="Your name..." className="pretty-input pr-11" />
            <UserRound className="absolute right-4 top-3.5 text-[#b19a95]" size={18} />
          </div>
          </div>
          <div className="form-section">
          <p className="text-sm font-black">Pick a note style</p>
          <div className="style-row">
            {previewStyles.map((item) => (
              <button
                aria-label="Choose note style"
                aria-pressed={style === item.style}
                className={`style-chip ${item.preview} ${style === item.style ? 'selected' : ''}`}
                key={item.style}
                onClick={() => setStyle(item.style)}
                type="button"
              />
            ))}
          </div>
          </div>
          <div className="form-section">
            <label className="block text-sm font-black" htmlFor="message">Your note <Sparkles className="inline text-yellow-400" size={16} /></label>
          <textarea id="message" required maxLength={maxMessage} rows="6" value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Write your thoughts, note, review, memory, or anything..."
            className="pretty-input resize-none leading-7" />
          </div>
          <div className="flex items-center justify-between gap-3 text-sm font-bold">
            <span className={status.type === 'error' ? 'text-rose-500' : 'text-emerald-600'}>{status.text}</span>
            <span className="text-coral">{message.length}/{maxMessage}</span>
          </div>
        </div>
      </div>

      <div className="form-actions relative z-10">
        <button className="draft-button" onClick={saveDraft} type="button">Save draft</button>
        <button disabled={saving} className="pin-button">{saving ? 'Saving...' : 'Pin my note'} <Send size={18} /></button>
        <div className="hidden justify-end gap-3 md:flex">
          {['#ff9eb0', '#ffc4a8', '#ffd76e', '#b8e6c8', '#83d8f4', '#d7c8ff'].map((color) => <span className="color-dot" style={{ backgroundColor: color }} key={color} />)}
        </div>
      </div>
    </form>
  );
}
