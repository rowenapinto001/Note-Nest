import { Heart, Mail, Send, ShieldCheck, Sparkles, Star } from 'lucide-react';

const features = [
  { title: 'Write Freely', text: 'No login, no pressure. Just you and your thoughts.', icon: Heart },
  { title: 'Spread Positivity', text: 'Share kind words and brighten someone’s day.', icon: Star },
  { title: 'Safe & Respectful', text: 'Keep this wall soft, honest, and kind.', icon: ShieldCheck },
  { title: 'Memories Live Here', text: 'Thoughts today, tiny memories forever.', icon: Mail },
];

export default function Hero() {
  return (
    <section className="relative mx-auto max-w-7xl px-4 pb-5 pt-9">
      <div className="hero-note hero-note-left">
        <span className="paperclip" />
        <p>Every<br />thought matters</p>
        <Heart className="mx-auto mt-3 fill-coral text-coral" size={18} />
      </div>
      <div className="hero-note hero-note-right">
        <span className="washi right-7 -top-3" />
        <p>Kind words<br />make the world<br />more beautiful</p>
        <span className="block pt-2 text-coral">☺</span>
      </div>
      <div className="tulip-garden">
        <span className="tulip tulip-one" />
        <span className="tulip tulip-two" />
        <span className="tulip tulip-three" />
      </div>
      <div className="mobile-sparkle mobile-sparkle-left">✦</div>
      <div className="mobile-sparkle mobile-sparkle-right">♡</div>
      <div className="mail-card"><Heart className="fill-coral text-coral" /></div>

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <div className="mb-2 flex justify-center gap-4 text-yellow-400">
          <Sparkles className="floaty fill-yellow-300" />
          <Heart className="floaty fill-coral text-coral delay-1" />
          <Star className="floaty fill-yellow-300 delay-2" />
        </div>
        <h1 className="brand-title">Note<span>Nest</span></h1>
        <p className="ribbon mx-auto">A tiny space for your big thoughts</p>
        <p className="mx-auto mt-5 max-w-xl text-lg font-semibold leading-8">
          Share a memory, a review, a secret, or a little piece of happiness.
        </p>
        <div className="dashed-swoop mx-auto" />
        <a href="#wall" className="hero-cta">
          Leave a note on the wall <Send size={21} />
        </a>
      </div>

      <details className="feature-strip mt-8">
        <summary className="feature-toggle">
          <span>Why people leave notes here</span>
          <span className="chev">^</span>
        </summary>
        <div className="feature-list">
          {features.map((item) => {
            const Icon = item.icon;
            return (
              <div className="feature-card" key={item.title}>
                <Icon className="feature-icon" />
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </details>
    </section>
  );
}
