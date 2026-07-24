import React, {
  type KeyboardEvent as ReactKeyboardEvent,
  type TouchEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const LAST_STEP = 17;
const TOPICS = [
  "Parenting",
  "Health & Wellness",
  "Money & Finance",
  "History",
  "Philosophy",
  "Personal Development",
  "Science",
  "Technology",
];

const GOALS = [
  { title: "Quick", detail: "2 min / day" },
  { title: "Regular", detail: "5 min / day" },
  { title: "Advanced", detail: "10 min / day" },
];

const TIMES = [
  { title: "Morning", detail: "With breakfast or commuting" },
  { title: "Afternoon", detail: "At lunch or during downtime" },
  { title: "Evening", detail: "After dinner or while in bed" },
];

function StatusBar({ dark = false }: { dark?: boolean }) {
  const [time, setTime] = useState(() =>
    new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(new Date()),
  );

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTime(
        new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(new Date()),
      );
    }, 30_000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className={`status-bar ${dark ? "status-bar--dark" : ""}`} aria-hidden="true">
      <strong>{time}</strong>
      <div className="status-signals">
        <span className="cellular"><i /><i /><i /><i /></span>
        <span className="wifi"><i /><i /><b /></span>
        <span className="battery"><i /></span>
      </div>
    </div>
  );
}

function ProgressHeader({
  step,
  onBack,
  dark = false,
}: {
  step: number;
  onBack: () => void;
  dark?: boolean;
}) {
  const showBack = step <= 10;
  const progressByStep = [6, 12, 18, 41, 60, 65, 70, 75, 80, 85, 90, 95, 100];
  const progress = progressByStep[step] ?? 100;

  return (
    <div className={`progress-header ${dark ? "progress-header--dark" : ""}`}>
      {showBack ? (
        <button className="back-button" onClick={onBack} aria-label="Go back">
          <span />
        </button>
      ) : (
        <span className="back-placeholder" />
      )}
      <div className="progress-track" role="progressbar" aria-valuenow={Math.round(progress)}>
        <span style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

function PrimaryButton({
  children = "Continue",
  onClick,
  dark = false,
  disabled = false,
  className = "",
}: {
  children?: React.ReactNode;
  onClick: () => void;
  dark?: boolean;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      className={`primary-button ${dark ? "primary-button--dark" : ""} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      <span>{children}</span>
    </button>
  );
}

function BottomActions({
  primary,
  onPrimary,
  secondary,
  onSecondary,
  dark,
  disabled,
}: {
  primary: React.ReactNode;
  onPrimary: () => void;
  secondary?: React.ReactNode;
  onSecondary?: () => void;
  dark?: boolean;
  disabled?: boolean;
}) {
  return (
    <div className="bottom-actions">
      <PrimaryButton onClick={onPrimary} dark={dark} disabled={disabled}>
        {primary}
      </PrimaryButton>
      {secondary ? (
        <button className="secondary-button" onClick={onSecondary ?? onPrimary}>
          {secondary}
        </button>
      ) : null}
    </div>
  );
}

function WelcomeScreen({
  onStart,
  onLogin,
}: {
  onStart: () => void;
  onLogin: () => void;
}) {
  return (
    <section className="screen welcome-screen">
      <div className="welcome-gallery" aria-hidden="true">
        <div className="welcome-row welcome-row--one">
          <img src="./welcome/row-1.png" alt="" />
        </div>
        <div className="welcome-row welcome-row--two">
          <img src="./welcome/row-2.png" alt="" />
        </div>
        <div className="welcome-row welcome-row--three">
          <img src="./welcome/row-3.png" alt="" />
        </div>
        <div className="welcome-row welcome-row--four">
          <img src="./welcome/row-4.png" alt="" />
        </div>
      </div>

      <div className="welcome-panel">
        <div className="welcome-wordmark">Imprint</div>
        <p>Learn Visually</p>
        <button className="welcome-start" onClick={onStart}>Get Started</button>
        <button className="welcome-login" onClick={onLogin}>
          I already have an account
        </button>
        <nav className="welcome-legal" aria-label="Legal">
          <a href="#terms">Terms &amp; Conditions</a>
          <span>•</span>
          <a href="#privacy">Privacy Policy</a>
        </nav>
      </div>
    </section>
  );
}

function TopicCard({
  topic,
  selected,
  onClick,
}: {
  topic: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={`selection-card topic-card ${selected ? "is-selected" : ""}`}
      onClick={onClick}
      aria-pressed={selected}
    >
      <span className="checkbox">{selected ? <i /> : null}</span>
      <span>{topic}</span>
    </button>
  );
}

function SplitChoiceCard({
  title,
  detail,
  selected,
  onClick,
}: {
  title: string;
  detail: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={`selection-card split-choice ${selected ? "is-selected" : ""}`}
      onClick={onClick}
      aria-pressed={selected}
    >
      <strong>{title}</strong>
      <span />
      <em>{detail}</em>
    </button>
  );
}

function TimeChoiceCard({
  title,
  detail,
  selected,
  onClick,
}: {
  title: string;
  detail: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={`selection-card time-choice ${selected ? "is-selected" : ""}`}
      onClick={onClick}
      aria-pressed={selected}
    >
      <strong>{title}</strong>
      <span>{detail}</span>
    </button>
  );
}

function QuoteScreen({
  second = false,
  onContinue,
}: {
  second?: boolean;
  onContinue: () => void;
}) {
  return (
    <section className="screen quote-screen">
      <div className="quote-decoration quote-decoration--left">“</div>
      <div className="quote-decoration quote-decoration--right">”</div>
      <div className="quote-card">
        {second ? (
          <p>
            “This app is one
            <br />
            of the best things
            <br />
            you can do for
            <br />
            yourself.”
          </p>
        ) : (
          <p>
            “I’m learning during my
            <br />
            lunch breaks instead of
            <br />
            scrolling through
            <br />
            Instagram and <b>I use my</b>
            <br />
            <b>new knowledge during</b>
            <br />
            <b>my work day.</b>”
          </p>
        )}
      </div>

      <div className={`award ${second ? "award--ratings" : ""}`}>
        <span className="laurel">❧</span>
        <div>
          <span className="apple-word"><i className="apple-logo" /> Apple</span>
          {second ? (
            <>
              <strong className="stars">★★★★★</strong>
              <b>20K+ Ratings</b>
            </>
          ) : (
            <strong>ESSENTIAL<br />EDUCATION APP</strong>
          )}
        </div>
        <span className="laurel laurel--right">❧</span>
      </div>

      <BottomActions primary="Continue" onPrimary={onContinue} dark />
    </section>
  );
}

function AccountScreen({
  onContinue,
  onLogin,
}: {
  onContinue: () => void;
  onLogin: () => void;
}) {
  function choose() {
    onContinue();
  }

  return (
    <section className="screen account-screen">
      <div className="account-heading">
        <h1>Create an Account</h1>
        <p>Save your progress, sync<br />across devices, and more</p>
      </div>

      <div className="account-buttons" aria-label="Account options">
        <button className="auth-button auth-button--apple" onClick={choose}>
          <i className="apple-logo" />
          <strong>Continue with Apple</strong>
        </button>
        <button className="auth-button" aria-label="Continue with Google" onClick={choose}>
          <span className="google-logo" aria-hidden="true">G</span>
          <span>Continue with Google</span>
        </button>
        <button className="auth-button auth-button--email" onClick={choose}>
          Continue with Email
        </button>
      </div>

      <button className="login-link" onClick={onLogin}>
        Already have an account? <b>Log in</b>
      </button>
    </section>
  );
}

function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button className="trial-close" onClick={onClick} aria-label="Close">
      <span aria-hidden="true">×</span>
    </button>
  );
}

function TrialIntroScreen({
  onContinue,
  onClose,
}: {
  onContinue: () => void;
  onClose: () => void;
}) {
  return (
    <section className="screen trial-screen trial-intro-screen">
      <CloseButton onClick={onClose} />
      <img
        className="trial-intro-illustration float-illustration"
        src="./illustrations/trial-intro.png"
        alt=""
      />
      <h1>We want you to try Imprint for free.</h1>
      <BottomActions primary="I’m Ready" onPrimary={onContinue} />
    </section>
  );
}

function TrialReminderScreen({ onContinue }: { onContinue: () => void }) {
  return (
    <section className="screen trial-screen trial-reminder-screen">
      <h1>You’ll get a reminder 2 days before your trial ends.</h1>
      <img
        className="trial-reminder-illustration reveal-image"
        src="./illustrations/trial-reminder.png"
        alt=""
      />
      <BottomActions primary="Try for Free" onPrimary={onContinue} />
    </section>
  );
}

function TrialDesignScreen({
  plan,
  onPlanChange,
  onRedeem,
  onClose,
  purchaseNotice,
}: {
  plan: number;
  onPlanChange: (plan: number) => void;
  onRedeem: () => void;
  onClose: () => void;
  purchaseNotice: boolean;
}) {
  return (
    <section className="screen trial-design-screen">
      <CloseButton onClick={onClose} />
      <h1>Design Your Trial</h1>

      <div className="trial-timeline">
        <div className="trial-timeline-line" aria-hidden="true" />
        <div className="trial-milestone trial-milestone--today">
          <span className="trial-icon">↗</span>
          <div>
            <strong>Today: Start Learning</strong>
            <p>Enjoy full access to the Imprint<br />library with your 7-day free trial.</p>
          </div>
        </div>
        <div className="trial-milestone">
          <span className="trial-icon">♧</span>
          <div>
            <strong>Day 5: Trial Reminder</strong>
            <p>We’ll send you a reminder that<br />your trial is ending.</p>
          </div>
        </div>
        <div className="trial-milestone">
          <span className="trial-icon">☆</span>
          <div>
            <strong>Day 7: Trial Ends</strong>
            <p>Your account will be charged.<br />Cancel anytime before.</p>
          </div>
        </div>
      </div>

      <div className="trial-options" aria-label="Trial plans">
        <button
          className={`trial-option ${plan === 0 ? "is-selected" : ""}`}
          onClick={() => onPlanChange(0)}
          aria-pressed={plan === 0}
          aria-label="Free, 7-Day Trial"
        >
          <strong>Free</strong>
          <span>7-Day Trial</span>
        </button>
        <button
          className={`trial-option ${plan === 1 ? "is-selected" : ""}`}
          onClick={() => onPlanChange(1)}
          aria-pressed={plan === 1}
          aria-label="3,99 €, 30-Day Trial"
        >
          <strong>3,99 €</strong>
          <span>30-Day Trial</span>
        </button>
      </div>

      <p className="trial-price">
        {plan === 0
          ? "7 days free, then 89,99 €/year (€7.5/mo)."
          : "30 days for 3,99 €, then 89,99 €/year."}
        <br />
        Billed annually. Cancel anytime.
      </p>
      <PrimaryButton className="redeem-button" onClick={onRedeem}>
        {plan === 0 ? "Redeem 7 Days for $0.00" : "Start 30-Day Trial"}
      </PrimaryButton>
      <button className="other-plans-button" onClick={() => onPlanChange(1)}>
        View Other Plans
      </button>
      <nav className="trial-legal" aria-label="Subscription information">
        <a href="#restore">Restore Purchase</a>
        <a href="#terms">Terms &amp; Conditions</a>
        <a href="#privacy">Privacy Policy</a>
      </nav>
      {purchaseNotice ? (
        <div className="purchase-toast" role="status">
          App Store purchase confirmation would open here.
        </div>
      ) : null}
    </section>
  );
}

type MainTab = "shorts" | "books" | "discover" | "saved" | "profile";

const SHORT_LESSONS = [
  {
    topic: "Psychology",
    title: "Why unfinished tasks stay in your head",
    copy: "Your brain keeps incomplete goals active. Writing down one clear next step gives your mind permission to let them go.",
    takeaway: "Write the next action, not the entire plan.",
    visual: "loops",
  },
  {
    topic: "Science",
    title: "Your memory is rebuilt, not replayed",
    copy: "Remembering is an act of reconstruction. Each time you recall an event, your brain can subtly reshape the original memory.",
    takeaway: "Confidence and accuracy are two different things.",
    visual: "memory",
  },
  {
    topic: "Money",
    title: "Compound growth rewards consistency",
    copy: "Small gains may look unimpressive at first. With enough repetition, the curve rises faster than intuition expects.",
    takeaway: "Protect the habit before optimizing the result.",
    visual: "growth",
  },
  {
    topic: "History",
    title: "Maps quietly influence decisions",
    copy: "Every map chooses what to center, enlarge, label, and omit. Those decisions shape how we understand power and distance.",
    takeaway: "Ask what the map makes easy to notice.",
    visual: "map",
  },
];

const BOOKS = [
  {
    title: "Why We Sleep",
    author: "Matthew Walker",
    minutes: 14,
    topic: "Science of the Human Body",
    cover: "sleep",
    progress: 42,
    summary: "How sleep restores the brain, strengthens memory, regulates emotion, and protects long-term health.",
  },
  {
    title: "Breath",
    author: "James Nestor",
    minutes: 12,
    topic: "Health and Longevity",
    cover: "breath",
    progress: 0,
    summary: "How to optimize oxygen, sleep, and performance by relearning the lost art of breathing well.",
  },
  {
    title: "John Locke on Rights, Government & Freedom",
    author: "John Locke",
    minutes: 11,
    topic: "Philosophy",
    cover: "rights",
    progress: 0,
    summary: "Why legitimate power begins with natural rights, consent, and limits on government.",
  },
  {
    title: "The Psychology of Money",
    author: "Morgan Housel",
    minutes: 16,
    topic: "Finance",
    cover: "money",
    progress: 0,
    summary: "Why behavior matters more than raw intelligence when making financial decisions.",
  },
];

const RELATED_BOOKS = [
  {
    title: "The History and Science of Cancer",
    author: "Science of the Human Body",
    description: "How Cells Go Rogue and How We Fight Back",
    cover: "cancer",
    progress: 0,
  },
  {
    title: "Why We Sleep",
    author: "Matthew Walker",
    description: "A Science-Based Guide to Better Rest",
    cover: "sleep",
    progress: 18,
  },
  {
    title: "You Are Your Microbes",
    author: "Science of the Human Body",
    description: "How to Make Your Microbiome Fight Back",
    cover: "microbes",
    progress: 0,
  },
];

const READER_PAGES: Array<{ copy: React.ReactNode; art: string }> = [
  {
    copy: <>If you looked at your thumb through a microscope, you’d discover as many <em>microbes</em> (microscopic organisms) as there are people in the entire United Kingdom.</>,
    art: "thumb",
  },
  {
    copy: <>If you then zoomed out, you’d find something else: the microbes living inside of you far outnumber your own cells.</>,
    art: "body",
  },
  {
    copy: <>Our bodies are made up of about 30 trillion cells. But there are 38 trillion microbes in our colon <em>alone.</em></>,
    art: "colon",
  },
  {
    copy: <>Thousands of species of microbes live on our skin, in our nose, eyeballs, bladder — everywhere! And they are most concentrated in our gut.</>,
    art: "gut",
  },
  {
    copy: <>If this makes you feel squeamish, know this: having this rich community of “bugs” — a <em>microbiome</em> — is amazingly good for us.</>,
    art: "community",
  },
  {
    copy: <>In this Quick Read, we’ll explore the benefits of a healthy gut microbiome for our mood, metabolism, and health — and tips for how to create one in ourselves.</>,
    art: "woman",
  },
  {
    copy: <>Everything that’s alive on this planet has a microbiome.</>,
    art: "flower",
  },
  {
    copy: <>And ours helps us not only to survive but also to thrive.</>,
    art: "meditate",
  },
  {
    copy: <>With as many as 20 million genes among them, our gut microbes can make and use molecules such as nutrients in ways our own bodies can’t. (We have only 20,000 genes.)</>,
    art: "genes",
  },
];

const TOPIC_TRACKS = [
  { label: "Psychology", icon: "◉", lessons: 48 },
  { label: "Science", icon: "✦", lessons: 62 },
  { label: "History", icon: "⌛", lessons: 55 },
  { label: "Money", icon: "↗", lessons: 31 },
  { label: "Philosophy", icon: "◇", lessons: 44 },
  { label: "Technology", icon: "⌘", lessons: 39 },
];

function ShortArtwork({ type }: { type: string }) {
  if (type === "memory") {
    return (
      <div className="short-art short-art--memory" aria-hidden="true">
        <span className="memory-core">MEMORY</span>
        <i className="memory-piece memory-piece--one" />
        <i className="memory-piece memory-piece--two" />
        <i className="memory-piece memory-piece--three" />
        <i className="memory-piece memory-piece--four" />
      </div>
    );
  }

  if (type === "growth") {
    return (
      <div className="short-art short-art--growth" aria-hidden="true">
        <span className="growth-bar growth-bar--one" />
        <span className="growth-bar growth-bar--two" />
        <span className="growth-bar growth-bar--three" />
        <span className="growth-bar growth-bar--four" />
        <span className="growth-arrow">↗</span>
      </div>
    );
  }

  if (type === "map") {
    return (
      <div className="short-art short-art--map" aria-hidden="true">
        <span className="map-route" />
        <i className="map-point map-point--one" />
        <i className="map-point map-point--two" />
        <i className="map-point map-point--three" />
        <b>YOU ARE<br />HERE?</b>
      </div>
    );
  }

  return (
    <div className="short-art short-art--loops" aria-hidden="true">
      <span className="loop loop--one" />
      <span className="loop loop--two" />
      <span className="loop loop--three" />
      <b>OPEN<br />LOOPS</b>
    </div>
  );
}

function MainNavigation({
  tab,
  onChange,
}: {
  tab: MainTab;
  onChange: (tab: MainTab) => void;
}) {
  const items: Array<{ tab: MainTab; icon: string; label: string }> =
    tab === "books"
      ? [
          { tab: "books", icon: "⌂", label: "Home" },
          { tab: "discover", icon: "⌕", label: "Explore" },
          { tab: "profile", icon: "○", label: "Me" },
        ]
      : [
          { tab: "shorts", icon: "▥", label: "Shorts" },
          { tab: "books", icon: "▤", label: "Books" },
          { tab: "discover", icon: "⌕", label: "Discover" },
          { tab: "saved", icon: "♡", label: "Saved" },
          { tab: "profile", icon: "○", label: "You" },
        ];

  return (
    <nav className={`main-navigation ${tab === "books" ? "main-navigation--library" : ""}`} aria-label="Main navigation">
      {items.map((item) => (
        <button
          key={item.tab}
          className={tab === item.tab ? "is-active" : ""}
          onClick={() => onChange(item.tab)}
          aria-current={tab === item.tab ? "page" : undefined}
        >
          <span aria-hidden="true">{item.icon}</span>
          <small>{item.label}</small>
        </button>
      ))}
    </nav>
  );
}

function BookCover({
  variant,
  compact = false,
}: {
  variant: string;
  compact?: boolean;
}) {
  return (
    <div className={`book-cover book-cover--${variant} ${compact ? "book-cover--compact" : ""}`} aria-hidden="true">
      <span className="book-cover-mark">
        {variant === "sleep" ? "W" : variant === "breath" ? "B" : variant === "rights" ? "L" : "M"}
      </span>
      <i />
    </div>
  );
}

function LibraryArtwork({
  variant,
  compact = false,
}: {
  variant: string;
  compact?: boolean;
}) {
  return (
    <div className={`library-artwork library-artwork--${variant} ${compact ? "library-artwork--compact" : ""}`} aria-hidden="true">
      {variant === "sleep" ? (
        <>
          <span className="sleep-moon">☾</span>
          <span className="sleep-face" />
          <i className="sleep-wave sleep-wave--one" />
          <i className="sleep-wave sleep-wave--two" />
        </>
      ) : null}
      {variant === "breath" ? (
        <>
          <span className="breath-head" />
          <span className="breath-body" />
          <i className="lung lung--left" />
          <i className="lung lung--right" />
          <b className="breath-leaf breath-leaf--one" />
          <b className="breath-leaf breath-leaf--two" />
        </>
      ) : null}
      {variant === "rights" ? (
        <>
          <span className="rights-arm" />
          <span className="rights-beam" />
          <i className="rights-bowl rights-bowl--left" />
          <i className="rights-bowl rights-bowl--right" />
          <b className="rights-orb rights-orb--left" />
          <b className="rights-orb rights-orb--right" />
        </>
      ) : null}
      {variant === "money" ? (
        <>
          <span className="money-profile" />
          <i className="money-coin money-coin--one">€</i>
          <i className="money-coin money-coin--two">€</i>
          <i className="money-coin money-coin--three">€</i>
        </>
      ) : null}
      {variant === "cancer" ? (
        <>
          <span className="cancer-microscope" />
          <i className="cancer-cell cancer-cell--one" />
          <i className="cancer-cell cancer-cell--two" />
          <i className="cancer-cell cancer-cell--three" />
          <i className="cancer-cell cancer-cell--four" />
          <i className="cancer-cell cancer-cell--five" />
        </>
      ) : null}
      {variant === "microbes" ? (
        <>
          <span className="microbe-body" />
          <i className="microbe-dot microbe-dot--one" />
          <i className="microbe-dot microbe-dot--two" />
          <i className="microbe-dot microbe-dot--three" />
          <i className="microbe-dot microbe-dot--four" />
          <b className="microbe-orbit" />
        </>
      ) : null}
    </div>
  );
}

function MicrobeCluster({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`microbe-cluster ${compact ? "microbe-cluster--compact" : ""}`} aria-hidden="true">
      <i className="reader-microbe reader-microbe--one"><b>••</b></i>
      <i className="reader-microbe reader-microbe--two"><b>••</b></i>
      <i className="reader-microbe reader-microbe--three"><b>••</b></i>
      <i className="reader-microbe reader-microbe--four"><b>••</b></i>
      <i className="reader-microbe reader-microbe--five"><b>••</b></i>
      <i className="reader-microbe reader-microbe--six"><b>••</b></i>
      <i className="reader-microbe reader-microbe--seven"><b>••</b></i>
      <i className="reader-microbe reader-microbe--eight"><b>••</b></i>
    </div>
  );
}

function ReaderIllustration({ type }: { type: string }) {
  if (type === "thumb") {
    return (
      <div className="reader-art reader-art--thumb" aria-hidden="true">
        <div className="reader-hand">
          <span /><span /><span /><span />
        </div>
        <div className="reader-magnifier"><MicrobeCluster /></div>
      </div>
    );
  }

  if (type === "body") {
    return (
      <div className="reader-art reader-art--body" aria-hidden="true">
        <div className="body-figure">
          <span className="body-head" />
          <span className="body-torso" />
          <i className="body-arm body-arm--left" />
          <i className="body-arm body-arm--right" />
          <i className="body-leg body-leg--left" />
          <i className="body-leg body-leg--right" />
          <b className="body-lungs" />
          <b className="body-gut" />
        </div>
        <div className="body-microbe-dots">{Array.from({ length: 18 }, (_, index) => <i key={index} />)}</div>
      </div>
    );
  }

  if (type === "colon" || type === "gut") {
    return (
      <div className={`reader-art reader-art--organ reader-art--${type}`} aria-hidden="true">
        <span className="organ-label">{type.toUpperCase()}</span>
        <span className="organ-pointer" />
        <div className="intestine-shape">
          <i /><i /><i /><i /><i /><i />
          <MicrobeCluster compact />
        </div>
      </div>
    );
  }

  if (type === "community") {
    return (
      <div className="reader-art reader-art--community" aria-hidden="true">
        <MicrobeCluster />
      </div>
    );
  }

  if (type === "woman") {
    return (
      <div className="reader-art reader-art--woman" aria-hidden="true">
        <div className="woman-figure">
          <span className="woman-hair" />
          <span className="woman-head" />
          <span className="woman-body" />
          <i className="woman-arm woman-arm--left" />
          <i className="woman-arm woman-arm--right" />
          <b className="woman-gut" />
          <MicrobeCluster compact />
        </div>
      </div>
    );
  }

  if (type === "flower") {
    return (
      <div className="reader-art reader-art--flower" aria-hidden="true">
        <span className="flower-title">MICROBIOME</span>
        <div className="flower-stem" />
        <div className="flower-bloom" />
        <i className="flower-leaf flower-leaf--left" />
        <i className="flower-leaf flower-leaf--right" />
        <div className="flower-roots"><i /><i /><i /><i /><i /></div>
        <div className="flower-loupe"><MicrobeCluster compact /></div>
      </div>
    );
  }

  if (type === "meditate") {
    return (
      <div className="reader-art reader-art--meditate" aria-hidden="true">
        <div className="meditate-person">
          <span className="meditate-head" />
          <span className="meditate-hair" />
          <span className="meditate-body" />
          <i className="meditate-arm meditate-arm--left" />
          <i className="meditate-arm meditate-arm--right" />
          <i className="meditate-leg meditate-leg--left" />
          <i className="meditate-leg meditate-leg--right" />
          <b className="meditate-gut" />
        </div>
      </div>
    );
  }

  return (
    <div className="reader-art reader-art--genes" aria-hidden="true">
      <section>
        <strong>HUMANS</strong>
        <div className="gene-human"><i /><b>DNA</b></div>
        <span>20,000<br />genes</span>
      </section>
      <section>
        <MicrobeCluster />
        <span>20 million<br />genes</span>
      </section>
    </div>
  );
}

function MainExperience({ onExit }: { onExit: () => void }) {
  const [tab, setTab] = useState<MainTab>(
    () =>
      window.name === "imprint-books" ||
      window.name === "imprint-book-detail" ||
      window.name === "imprint-book-reader"
        ? "books"
        : "shorts",
  );
  const [shortIndex, setShortIndex] = useState(0);
  const [savedShorts, setSavedShorts] = useState(() => new Set([1]));
  const [savedBooks, setSavedBooks] = useState(() => new Set([0]));
  const [selectedBook, setSelectedBook] = useState<number | null>(
    () => window.name === "imprint-book-detail" || window.name === "imprint-book-reader" ? 1 : null,
  );
  const [readerPage, setReaderPage] = useState<number | null>(
    () => window.name === "imprint-book-reader" ? 0 : null,
  );
  const [aiOpen, setAiOpen] = useState(false);
  const [aiQuestion, setAiQuestion] = useState("Why do unfinished tasks feel so distracting?");
  const [aiAnswer, setAiAnswer] = useState("");
  const [notice, setNotice] = useState("");

  const lesson = SHORT_LESSONS[shortIndex];

  function changeTab(nextTab: MainTab) {
    setTab(nextTab);
    setSelectedBook(null);
    setReaderPage(null);
    setAiOpen(false);
  }

  function nextShort(amount: number) {
    setShortIndex((current) => (current + amount + SHORT_LESSONS.length) % SHORT_LESSONS.length);
  }

  function toggleShortSave() {
    setSavedShorts((current) => {
      const next = new Set(current);
      if (next.has(shortIndex)) next.delete(shortIndex);
      else next.add(shortIndex);
      return next;
    });
  }

  function toggleBookSave(index: number) {
    setSavedBooks((current) => {
      const next = new Set(current);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  function showNotice(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 1600);
  }

  function renderShorts() {
    return (
      <div className={`main-page shorts-page shorts-page--${lesson.visual}`}>
        <header className="shorts-reader-header">
          <button onClick={() => changeTab("books")} aria-label="Close short">×</button>
          <div
            className="shorts-reader-progress"
            role="progressbar"
            aria-valuenow={shortIndex + 1}
            aria-valuemax={SHORT_LESSONS.length}
          >
            <span style={{ width: `${((shortIndex + 1) / SHORT_LESSONS.length) * 100}%` }} />
          </div>
        </header>

        <button
          className="shorts-reader-slide"
          key={shortIndex}
          onClick={() => nextShort(1)}
          aria-label="Next short"
        >
          <div className="shorts-reader-copy">
            <span>{lesson.topic}</span>
            <h1>{lesson.title}</h1>
            <p>{lesson.copy}</p>
          </div>
          <div className={`shorts-reader-art shorts-reader-art--${lesson.visual}`}>
            <ShortArtwork type={lesson.visual} />
            <strong>{lesson.takeaway}</strong>
          </div>
        </button>

        {shortIndex > 0 ? (
          <button className="shorts-reader-previous" onClick={() => nextShort(-1)} aria-label="Previous short">
            ‹
          </button>
        ) : null}

        <div className="reader-actions shorts-reader-actions">
          <div>
            <button onClick={() => showNotice("Short reported")} aria-label="Report short">⚑</button>
            <button onClick={() => showNotice("Shared link copied")} aria-label="Share short">⇧</button>
            <button
              onClick={toggleShortSave}
              aria-pressed={savedShorts.has(shortIndex)}
              aria-label={savedShorts.has(shortIndex) ? "Remove short from favorites" : "Favorite short"}
            >
              {savedShorts.has(shortIndex) ? "♥" : "♡"}
            </button>
          </div>
          <button className="reader-ask" onClick={() => setAiOpen(true)}>
            <span>✦</span>
            <small>ASK</small>
          </button>
        </div>
      </div>
    );
  }

  function renderBooks() {
    if (readerPage !== null && selectedBook !== null) {
      const page = READER_PAGES[readerPage];
      const isLastPage = readerPage === READER_PAGES.length - 1;
      return (
        <div className="main-page reader-page">
          <header className="reader-header">
            <button onClick={() => setReaderPage(null)} aria-label="Close reader">×</button>
            <div className="reader-progress" role="progressbar" aria-valuenow={readerPage + 1} aria-valuemax={READER_PAGES.length}>
              <span style={{ width: `${((readerPage + 1) / READER_PAGES.length) * 100}%` }} />
            </div>
          </header>

          <button
            className="reader-slide"
            key={readerPage}
            onClick={() => {
              if (isLastPage) {
                setReaderPage(null);
                showNotice("Quick Read completed · +20 XP");
              } else {
                setReaderPage((current) => Math.min(READER_PAGES.length - 1, (current ?? 0) + 1));
              }
            }}
            aria-label={isLastPage ? "Finish Quick Read" : "Next page"}
          >
            <p>{page.copy}</p>
            <ReaderIllustration type={page.art} />
          </button>

          {readerPage > 0 ? (
            <button
              className="reader-previous"
              onClick={() => setReaderPage((current) => Math.max(0, (current ?? 0) - 1))}
              aria-label="Previous page"
            >
              ‹
            </button>
          ) : null}

          <div className="reader-actions">
            <div>
              <button onClick={() => showNotice("Page reported")} aria-label="Report page">⚑</button>
              <button onClick={() => showNotice("Shared link copied")} aria-label="Share page">⇧</button>
              <button
                onClick={() => toggleBookSave(selectedBook)}
                aria-label="Favorite book"
                aria-pressed={savedBooks.has(selectedBook)}
              >
                {savedBooks.has(selectedBook) ? "♥" : "♡"}
              </button>
            </div>
            <button className="reader-ask" onClick={() => setAiOpen(true)}>
              <span>✦</span>
              <small>ASK</small>
            </button>
          </div>
        </div>
      );
    }

    if (selectedBook !== null) {
      const book = BOOKS[selectedBook];
      const learningCopy =
        book.cover === "breath"
          ? "Snore or wake up tired? James Nestor’s Breath shows simple fixes to retrain your nose and transform your sleep."
          : book.summary;
      return (
        <div className="main-page book-detail-page">
          <button className="book-detail-close" onClick={() => setSelectedBook(null)} aria-label="Close book details">×</button>
          <div className="book-detail-scroll">
            <section className="book-detail-visual">
              <div className="book-detail-halo" />
              <LibraryArtwork variant={book.cover} />
            </section>

            <div className="book-detail-actions" aria-label="Book actions">
              <button
                onClick={() => toggleBookSave(selectedBook)}
                aria-label="Save book"
                aria-pressed={savedBooks.has(selectedBook)}
              >
                {savedBooks.has(selectedBook) ? "♥" : "▮"}
              </button>
              <button onClick={() => showNotice("Book downloaded")} aria-label="Download book">⇩</button>
              <button onClick={() => showNotice("Shared link copied")} aria-label="Share book">⇧</button>
            </div>

            <header className="book-detail-title">
              <span className={`topic-label topic-label--${book.cover}`}>{book.topic}</span>
              <h1>{book.title}</h1>
              <p>{book.author}</p>
            </header>

            <section className="book-detail-learn">
              <h2>What you’ll learn</h2>
              <p>{learningCopy}</p>
            </section>

            <section className="book-detail-featured">
              <h2>Featured in</h2>
              <button onClick={() => showNotice("Collection opened")}>
                <span className="featured-collection-art" aria-hidden="true"><i /><i /><b /></span>
                <strong>Science of the Human Body</strong>
              </button>
            </section>

            <section className="book-detail-related">
              <h2>You may also like</h2>
              <div>
                {RELATED_BOOKS.map((related) => (
                  <button key={related.title} onClick={() => showNotice(`${related.title} selected`)}>
                    <LibraryArtwork variant={related.cover} />
                    {related.progress ? <span className="related-progress"><i style={{ width: `${related.progress}%` }} /></span> : null}
                    <strong>{related.title}</strong>
                    <em>{related.author}</em>
                    <p>{related.description}</p>
                  </button>
                ))}
              </div>
            </section>
          </div>
          <button className="book-detail-continue" onClick={() => setReaderPage(0)}>
            Continue
          </button>
        </div>
      );
    }

    return (
      <div className="main-page books-page">
        <header className="books-greeting">
          <h1>Good Evening</h1>
          <span>🔥 <b>1</b></span>
        </header>

        <button className="continue-book-card" onClick={() => setSelectedBook(0)}>
          <LibraryArtwork variant="sleep" compact />
          <div>
            <strong>Why We Sleep</strong>
            <p>Science of the Human Body</p>
            <span><i style={{ width: "17%" }} /></span>
          </div>
          <b>›</b>
        </button>

        <section className="bookshelf-section bookshelf-section--recommended">
          <header>
            <div>
              <h2>Recommended for you</h2>
              <p>We think you’ll like these</p>
            </div>
            <button onClick={() => showNotice("Recommendation settings opened")}>Manage</button>
          </header>
          <div className="bookshelf-carousel">
            {BOOKS.slice(1).map((book, index) => (
              <button className="bookshelf-item" key={book.title} onClick={() => setSelectedBook(index + 1)}>
                <LibraryArtwork variant={book.cover} />
                <strong>{book.title}</strong>
                <span>{book.author}</span>
                <p>{book.summary}</p>
                <em className={`topic-label topic-label--${book.cover}`}>{book.topic}</em>
              </button>
            ))}
          </div>
        </section>

        <section className="bookshelf-section bookshelf-section--continue">
          <header>
            <div>
              <h2>Jump back in</h2>
              <p>Pick up where you left off</p>
            </div>
          </header>
          <div className="bookshelf-carousel">
            {[BOOKS[0], BOOKS[2], BOOKS[1]].map((book) => {
              const index = BOOKS.indexOf(book);
              return (
                <button className="bookshelf-item bookshelf-item--progress" key={book.title} onClick={() => setSelectedBook(index)}>
                  <LibraryArtwork variant={book.cover} />
                  <span className="art-progress"><i style={{ width: `${book.progress || 28}%` }} /></span>
                  <strong>{book.title}</strong>
                  <span>{book.author}</span>
                </button>
              );
            })}
          </div>
        </section>
      </div>
    );
  }

  function renderDiscover() {
    return (
      <div className="main-page discover-page">
        <header className="discover-heading">
          <small>Learn something unexpected</small>
          <h1>Discover</h1>
        </header>
        <button className="ai-discover-card" onClick={() => setAiOpen(true)}>
          <span>✦</span>
          <div>
            <strong>Ask Imprint AI</strong>
            <p>Turn any question into a visual explanation.</p>
          </div>
          <b>›</b>
        </button>
        <div className="daily-question">
          <small>QUESTION OF THE DAY</small>
          <h2>Why does time feel faster as we get older?</h2>
          <button onClick={() => {
            setAiQuestion("Why does time feel faster as we get older?");
            setAiOpen(true);
          }}>Explore the answer</button>
        </div>
        <strong className="topic-title">Browse topics</strong>
        <div className="topic-grid">
          {TOPIC_TRACKS.map((track) => (
            <button key={track.label} onClick={() => showNotice(`${track.label} path selected`)}>
              <span>{track.icon}</span>
              <strong>{track.label}</strong>
              <small>{track.lessons} shorts</small>
            </button>
          ))}
        </div>
      </div>
    );
  }

  function renderSaved() {
    const shortItems = [...savedShorts];
    const bookItems = [...savedBooks];
    return (
      <div className="main-page saved-page">
        <header className="simple-page-heading">
          <small>Your personal library</small>
          <h1>Saved</h1>
        </header>
        <section>
          <div className="saved-section-heading"><strong>Shorts</strong><span>{shortItems.length}</span></div>
          {shortItems.length ? shortItems.map((index) => (
            <button className="saved-short-row" key={index} onClick={() => {
              setShortIndex(index);
              changeTab("shorts");
            }}>
              <span className={`saved-short-art saved-short-art--${SHORT_LESSONS[index].visual}`}>{index + 1}</span>
              <div><small>{SHORT_LESSONS[index].topic}</small><strong>{SHORT_LESSONS[index].title}</strong></div>
              <b>›</b>
            </button>
          )) : <p className="empty-copy">Save a short and it will appear here.</p>}
        </section>
        <section>
          <div className="saved-section-heading"><strong>Books</strong><span>{bookItems.length}</span></div>
          {bookItems.map((index) => (
            <button className="saved-book-row" key={index} onClick={() => {
              setTab("books");
              setSelectedBook(index);
            }}>
              <BookCover variant={BOOKS[index].cover} compact />
              <div><small>{BOOKS[index].topic}</small><strong>{BOOKS[index].title}</strong><em>{BOOKS[index].minutes} min summary</em></div>
              <b>›</b>
            </button>
          ))}
        </section>
      </div>
    );
  }

  function renderProfile() {
    return (
      <div className="main-page profile-page">
        <header className="profile-header">
          <div className="profile-avatar">P</div>
          <div><h1>Pablo</h1><p>Curious mind · Level 4</p></div>
          <button onClick={onExit} aria-label="Sign out">↗</button>
        </header>
        <div className="profile-stats">
          <div><strong>7</strong><span>day streak</span></div>
          <div><strong>42</strong><span>ideas learned</span></div>
          <div><strong>3.8h</strong><span>learning</span></div>
        </div>
        <section className="weekly-goal">
          <div><span>Weekly goal</span><strong>4 of 5 days</strong></div>
          <div className="week-dots">
            {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
              <span className={index < 4 ? "is-done" : ""} key={`${day}-${index}`}><i>{index < 4 ? "✓" : ""}</i>{day}</span>
            ))}
          </div>
        </section>
        <section className="profile-menu">
          <button onClick={() => showNotice("Learning goal opened")}><span>◎</span><div><strong>Daily learning goal</strong><small>10 minutes</small></div><b>›</b></button>
          <button onClick={() => showNotice("Interests opened")}><span>◇</span><div><strong>Your interests</strong><small>5 selected topics</small></div><b>›</b></button>
          <button onClick={() => showNotice("Notifications opened")}><span>♧</span><div><strong>Notifications</strong><small>Every evening at 8:00</small></div><b>›</b></button>
          <button onClick={() => showNotice("Settings opened")}><span>⚙</span><div><strong>Settings</strong><small>Account and subscription</small></div><b>›</b></button>
        </section>
      </div>
    );
  }

  return (
    <section className="screen main-experience">
      {tab === "shorts" ? renderShorts() : null}
      {tab === "books" ? renderBooks() : null}
      {tab === "discover" ? renderDiscover() : null}
      {tab === "saved" ? renderSaved() : null}
      {tab === "profile" ? renderProfile() : null}
      {readerPage === null && selectedBook === null && tab !== "shorts" ? <MainNavigation tab={tab} onChange={changeTab} /> : null}
      {aiOpen ? (
        <div className="ai-sheet" role="dialog" aria-modal="true" aria-label="Ask Imprint AI">
          <div className="ai-sheet-handle" />
          <header><span>✦</span><strong>Ask Imprint AI</strong><button onClick={() => setAiOpen(false)} aria-label="Close AI">×</button></header>
          <p>Ask about the idea you’re viewing or explore something new.</p>
          <textarea value={aiQuestion} onChange={(event) => setAiQuestion(event.target.value)} aria-label="Question for Imprint AI" />
          <button className="ask-ai-button" onClick={() => setAiAnswer(
            "Unfinished tasks stay mentally active because your brain treats them as unresolved goals. Defining one concrete next step reduces that tension by giving the goal a trusted place to continue.",
          )}>Explain visually</button>
          {aiAnswer ? <div className="ai-answer"><strong>In simple terms</strong><p>{aiAnswer}</p></div> : null}
        </div>
      ) : null}
      {notice ? <div className="main-notice" role="status">{notice}</div> : null}
    </section>
  );
}

export function App() {
  const initialStep = useMemo(() => {
    const requested = Number(new URLSearchParams(window.location.search).get("step"));
    return Number.isInteger(requested) && requested >= 1 && requested <= 18 ? requested - 1 : 0;
  }, []);
  const [step, setStep] = useState(initialStep);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [topics, setTopics] = useState(() => new Set(["Money & Finance", "History", "Philosophy"]));
  const [goal, setGoal] = useState(2);
  const [learningTime, setLearningTime] = useState(2);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [trialPlan, setTrialPlan] = useState(0);
  const [purchaseNotice, setPurchaseNotice] = useState(false);
  const [inside, setInside] = useState(
    () =>
      window.name === "imprint-inside" ||
      window.name === "imprint-shorts" ||
      window.name === "imprint-books" ||
      window.name === "imprint-book-detail" ||
      window.name === "imprint-book-reader" ||
      new URLSearchParams(window.location.search).get("inside") === "1",
  );
  const touchStart = useRef<number | null>(null);

  const isGreen = step === 6 || step === 13;
  const isDark = step === 14;

  useEffect(() => {
    if (step !== 12) return;
    setLoadingComplete(false);
    const timer = window.setTimeout(() => setLoadingComplete(true), 2300);
    return () => window.clearTimeout(timer);
  }, [step]);

  useEffect(() => {
    const keyHandler = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight" || event.key === "Enter") {
        const target = event.target as HTMLElement;
        if (target.tagName !== "BUTTON" && target.tagName !== "INPUT") goForward();
      }
      if (event.key === "ArrowLeft") goBack();
    };
    window.addEventListener("keydown", keyHandler);
    return () => window.removeEventListener("keydown", keyHandler);
  });

  function goForward() {
    if (inside) return;
    if (step >= LAST_STEP) return;
    if (step === 12 && !loadingComplete) return;
    setDirection("forward");
    setStep((current) => Math.min(LAST_STEP, current + 1));
  }

  function goBack() {
    if (inside) return;
    if (step <= 1 || step >= 12) return;
    setDirection("back");
    setStep((current) => Math.max(0, current - 1));
  }

  function moveTo(target: number, nextDirection: "forward" | "back" = "forward") {
    setDirection(nextDirection);
    setStep(Math.max(0, Math.min(LAST_STEP, target)));
  }

  function toggleTopic(topic: string) {
    setTopics((current) => {
      const next = new Set(current);
      if (next.has(topic)) next.delete(topic);
      else if (next.size < 5) next.add(topic);
      return next;
    });
  }

  function startSwipe(event: TouchEvent) {
    if (inside) return;
    touchStart.current = event.touches[0]?.clientX ?? null;
  }

  function endSwipe(event: TouchEvent) {
    if (inside) return;
    if (touchStart.current === null) return;
    const distance = event.changedTouches[0].clientX - touchStart.current;
    if (distance < -70) goForward();
    if (distance > 70) goBack();
    touchStart.current = null;
  }

  function renderScreen() {
    if (inside) {
      return <MainExperience onExit={() => {
        setInside(false);
        moveTo(0, "back");
      }} />;
    }

    if (step === 0) {
      return (
        <WelcomeScreen
          onStart={goForward}
          onLogin={() => moveTo(14)}
        />
      );
    }

    const flowStep = step - 1;

    switch (flowStep) {
      case 0:
        return (
          <section className="screen intro-screen">
            <h1>Imprint is a completely<br />new way to learn...</h1>
            <img className="intro-phone float-illustration" src="./illustrations/phone-learning.png" alt="" />
            <BottomActions primary="Continue" onPrimary={goForward} />
          </section>
        );
      case 1:
        return (
          <section className="screen benefits-screen">
            <h1><b>Imprint</b> helps you...</h1>
            <img className="benefits-image reveal-image" src="./illustrations/benefit-cards.png" alt="" />
            <BottomActions primary="Continue" onPrimary={goForward} />
          </section>
        );
      case 2:
        return (
          <section className="screen question-intro-screen">
            <p>Answer a few quick<br />questions to personalize<br />your experience.</p>
            <BottomActions primary="Continue" onPrimary={goForward} />
          </section>
        );
      case 3:
        return (
          <section className="screen topics-screen">
            <div className="choice-heading">
              <h1>Which of these topics<br />interest you?</h1>
              <p>(Select up to 5 to start. You can always<br />explore more later.)</p>
            </div>
            <div className="topic-list">
              {TOPICS.map((topic, index) => (
                <div className="stagger-card" style={{ "--order": index } as React.CSSProperties} key={topic}>
                  <TopicCard
                    topic={topic}
                    selected={topics.has(topic)}
                    onClick={() => toggleTopic(topic)}
                  />
                </div>
              ))}
            </div>
            <BottomActions primary="Continue" onPrimary={goForward} />
          </section>
        );
      case 4:
        return (
          <section className="screen choices-confirmed-screen">
            <h1>Great choices.</h1>
            <p>
              Imprint helps you learn<br />
              these topics more<br />
              effectively with a unique<br />
              format, optimized for bite-<br />
              sized sessions.
            </p>
            <img className="format-image reveal-image" src="./illustrations/learning-format.png" alt="" />
            <BottomActions primary="Continue" onPrimary={goForward} />
          </section>
        );
      case 5:
        return <QuoteScreen onContinue={goForward} />;
      case 6:
        return (
          <section className="screen goal-choice-screen">
            <div className="choice-heading">
              <h1>Set a daily learning goal</h1>
              <p>You can always change this later.</p>
            </div>
            <div className="goal-list">
              {GOALS.map((option, index) => (
                <div className="stagger-card" style={{ "--order": index } as React.CSSProperties} key={option.title}>
                  <SplitChoiceCard
                    {...option}
                    selected={goal === index}
                    onClick={() => setGoal(index)}
                  />
                </div>
              ))}
            </div>
            <div className="insight-card insight-card--goal">
              <span className="fire-orb">🔥</span>
              <p>That’s <b>150</b> bite-sized<br />lessons in a month!</p>
            </div>
            <BottomActions primary="Continue" onPrimary={goForward} />
          </section>
        );
      case 7:
        return (
          <section className="screen goal-set-screen">
            <h1>Goal set.</h1>
            <p>
              People who commit to a<br />
              goal learn more. Even with<br />
              just a few minutes a day<br />
              you can master complex<br />
              topics.
            </p>
            <img className="goal-path-image reveal-image" src="./illustrations/goal-path.png" alt="" />
            <BottomActions primary="Continue" onPrimary={goForward} />
          </section>
        );
      case 8:
        return (
          <section className="screen reminders-screen">
            <img className="reminder-image float-illustration" src="./illustrations/reminder-hand.png" alt="" />
            <h1>Reach your daily goal<br />with reminders</h1>
            <p>Turn on notifications to<br />keep yourself motivated<br />and stay on track.</p>
            <BottomActions
              primary="Enable Notifications"
              secondary="Not now"
              onPrimary={goForward}
              onSecondary={goForward}
            />
          </section>
        );
      case 9:
        return (
          <section className="screen invite-screen">
            <div className="choice-heading">
              <h1>Want to invite a friend?</h1>
              <p>Learning with a friend will<br />make you both 4x more<br />likely to achieve your goals.</p>
            </div>
            <div className="guest-pass">
              <span className="guest-logo">I</span>
              <span>FREE</span>
              <strong>7-Day<br /><b>Guest Pass</b></strong>
            </div>
            <BottomActions
              primary="Invite a Friend"
              secondary="Not now"
              onPrimary={goForward}
              onSecondary={goForward}
            />
          </section>
        );
      case 10:
        return (
          <section className="screen time-screen">
            <div className="choice-heading">
              <h1>When will you fit learning<br />into your day?</h1>
              <p>Picking a time helps to build a habit.</p>
            </div>
            <div className="time-list">
              {TIMES.map((option, index) => (
                <div className="stagger-card" style={{ "--order": index } as React.CSSProperties} key={option.title}>
                  <TimeChoiceCard
                    {...option}
                    selected={learningTime === index}
                    onClick={() => setLearningTime(index)}
                  />
                </div>
              ))}
            </div>
            <div className="insight-card insight-card--time">
              <span className="mind-orb">💡</span>
              <p>End the day right with<br />something you can feel<br />good about.</p>
            </div>
            <BottomActions primary="Continue" onPrimary={goForward} />
          </section>
        );
      case 11:
        return (
          <section className="screen personalization-screen">
            <h1>Just a moment while we<br />personalize your Imprint<br />experience...</h1>
            <div className="mosaic-window">
              <img src="./illustrations/personalization-grid.png" alt="" />
              <span className="mosaic-shimmer" />
            </div>
            <BottomActions
              primary={loadingComplete ? "Continue" : "Continue"}
              onPrimary={goForward}
              disabled={!loadingComplete}
            />
          </section>
        );
      case 12:
        return <QuoteScreen second onContinue={goForward} />;
      case 13:
        return <AccountScreen onContinue={goForward} onLogin={() => setInside(true)} />;
      case 14:
        return (
          <TrialIntroScreen
            onContinue={goForward}
            onClose={() => moveTo(14, "back")}
          />
        );
      case 15:
        return <TrialReminderScreen onContinue={goForward} />;
      default:
        return (
          <TrialDesignScreen
            plan={trialPlan}
            onPlanChange={(nextPlan) => {
              setTrialPlan(nextPlan);
              setPurchaseNotice(false);
            }}
            onRedeem={() => {
              setPurchaseNotice(true);
              window.setTimeout(() => setInside(true), 900);
            }}
            onClose={() => moveTo(16, "back")}
            purchaseNotice={purchaseNotice}
          />
        );
    }
  }

  function preventButtonEnter(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter" && (event.target as HTMLElement).tagName === "BUTTON") {
      event.stopPropagation();
    }
  }

  return (
    <main className="app-stage">
      <div
        className={`phone-shell ${isGreen ? "phone-shell--green" : ""} ${isDark ? "phone-shell--dark" : ""} ${inside ? "phone-shell--inside" : ""}`}
        onTouchStart={startSwipe}
        onTouchEnd={endSwipe}
        onKeyDown={preventButtonEnter}
      >
        {step > 0 || inside ? <StatusBar dark={inside || isGreen || isDark} /> : null}
        {!inside && step >= 1 && step < 14 ? (
          <ProgressHeader step={step - 1} onBack={goBack} dark={isGreen} />
        ) : null}
        <div className={`screen-transition screen-transition--${direction}`} key={inside ? "inside" : step}>
          <div className="functional-layer">
            {renderScreen()}
          </div>
        </div>
      </div>
    </main>
  );
}

const rootElement = document.getElementById("root");

if (rootElement) {
  createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}
