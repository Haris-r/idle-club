import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Instagram,
  Music2,
  Ghost,
  LockKeyhole,
  LogOut,
  Mail,
  Minus,
  Plus,
  Shirt,
  TrendingUp,
} from "lucide-react";
import { supabase } from "./supabase";
import grayImg from "./assets/gray-idle-club.png";
import blackImg from "./assets/black-idle-club.png";
import purpleImg from "./assets/purple-idle-club.png";
import charcoalImg from "./assets/washed-idle-club.png";
import type { Session } from "@supabase/supabase-js";

const colours = [
  { name: "Heather Grey", hex: "#bfc0c2", image: grayImg },
  { name: "Black", hex: "#111111", image: blackImg },
  { name: "Vintage Purple", hex: "#8b667f", image: purpleImg },
  { name: "Washed Charcoal", hex: "#3a3a3a", image: charcoalImg },
];
const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
const cost = 49.99;
const retailPrice = 74.99;
type Reservation = {
  id: string;
  email: string;
  first_name: string | null;
  colour: string;
  size: string;
  quantity: number;
  source: string | null;
  marketing_opt_in: boolean;
  created_at: string;
};
const dateLabel = (v: string) =>
  new Date(v).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
const csvEscape = (v: unknown) =>
  '"' + String(v ?? "").replace(/"/g, '""') + '"';

function SiteHeader() {
  return (
    <header className="site-header">
      <a href="/" className="wordmark">
        IDLE CLUB
      </a>
      <nav>
        <a href="#details">COLLECTION</a>
        <a href="#reserve">PREORDER</a>
        <a href="/admin" className="admin-link">
          ADMIN
        </a>
      </nav>
    </header>
  );
}
function ProductArtwork({ colour }: { colour: string }) {
  const item = colours.find((c) => c.name === colour) || colours[0];

  return (
    <div className="artwork">
      <div className="artwork-header">
        <span>01 / IDLE CLUB</span>
        <span>FIRST HOODIE DROP</span>
      </div>

      <img
        className="hoodie-photo"
        src={item.image}
        alt={`${item.name} Idle Club hoodie`}
      />

      <div className="artwork-footer">
        <span>PREMIUM STREETWEAR</span>
        <span>NO PAYMENT RESERVATION</span>
      </div>
    </div>
  );
}
function Shop() {
  const [colour, setColour] = useState(colours[0].name);
  const [size, setSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [marketing, setMarketing] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const source = useMemo(
    () =>
      new URLSearchParams(window.location.search).get("source")?.slice(0, 60) ||
      "direct",
    [],
  );
  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (honeypot) return;
    if (!supabase) {
      setError("Supabase is not configured yet. See README.md.");
      return;
    }
    setBusy(true);
    const { error: err } = await supabase.rpc("submit_reservation", {
      p_email: email.trim(),
      p_first_name: firstName.trim() || null,
      p_colour: colour,
      p_size: size,
      p_quantity: quantity,
      p_source: source,
      p_marketing_opt_in: marketing,
    });
    setBusy(false);
    if (err) {
      setError(
        err.message.includes("rate")
          ? "Please try again later."
          : "Unable to register your interest. Please check your details and try again.",
      );
      return;
    }
    setDone(true);
  }
  return (
    <>
      <SiteHeader />
      <main>
        <section className="hero" id="details">
          <div className="left">
            <div className="eyebrow">
              <span className="dot" /> THE FIRST COLLECTION / 001
            </div>
            <h1>
              NOT JUST
              <br />A HOODIE.
              <br />
              <em>A STATEMENT.</em>
            </h1>
            <p className="hero-description">
              Crafted from 100% premium cotton for a luxuriously soft,
              heavyweight feel. Designed with a relaxed oversized fit,
              exceptional comfort, and quality you can feel.
            </p>
            <div className="hero-meta">
              <span>100% COTTON</span>
              <span>PREMIUM HEAVYWEIGHT</span>
              <span>OVERSIZED FIT</span>
            </div>
            <a className="dark-button" href="#reserve">
              EXPLORE THE DROP <ArrowRight size={18} />
            </a>
            <p className="fineprint">
              No payment required. This is a non-binding expression of interest.
            </p>
          </div>
          <ProductArtwork colour={colour} />
        </section>
        <section className="product" id="reserve">
          <div className="product-intro">
            <p className="overline">001 — THE ESSENTIAL</p>
            <h2>The Essential Hoodie</h2>
            <p>
              Our debut piece. Designed for effortless everyday wear and a
              clean, timeless silhouette.
            </p>
            <div className="price">
              <span className="launch-label">EXCLUSIVE FIRST-DROP PRICE</span>

              <div className="price-row">
                <strong>£{cost.toFixed(2)}</strong>

                <span className="original-price">
                  £{retailPrice.toFixed(2)}
                </span>
              </div>

              <p className="price-message">
                A special price for our earliest supporters.
              </p>

              <p className="price-note">
                Planned regular price: £74.99. No payment required to register
                interest.
              </p>
            </div>
            <div className="details-list">
              <div>
                FIT <strong>Relaxed / oversized</strong>
              </div>
              <div>
                FABRIC <strong>Heavyweight cotton blend (planned)</strong>
              </div>
              <div>
                RELEASE <strong>To be confirmed</strong>
              </div>
            </div>
          </div>
          <div className="reservation-card">
            {done ? (
              <div className="success">
                <div className="success-icon">
                  <Check size={26} />
                </div>
                <h3>You're on the list.</h3>
                <p>
                  Thanks for registering your interest in {quantity} × {colour},
                  size {size}. Nothing has been charged or ordered.
                </p>
                <button
                  className="outline-button"
                  onClick={() => {
                    setDone(false);
                    setEmail("");
                    setFirstName("");
                    setMarketing(false);
                  }}
                >
                  Register another interest
                </button>
              </div>
            ) : (
              <form onSubmit={submit}>
                <p className="overline">YOUR PICK</p>
                <h3>Register your interest</h3>
                <p className="form-description">
                  Tell us what you'd like to wear. This helps us plan the first
                  production run.
                </p>
                {/* Live mobile hoodie preview */}
                <div className="mobile-product-preview">
                  <img
                    src={colours.find((c) => c.name === colour)?.image}
                    alt={`${colour} Idle Club hoodie`}
                    className="mobile-preview-image"
                  />

                  <div className="mobile-preview-details">
                    <span>YOUR SELECTED DESIGN</span>
                    <strong>{colour}</strong>
                    <p>100% Cotton · Premium Heavyweight</p>
                  </div>
                </div>
                <div className="field-label">
                  COLOUR <strong>{colour}</strong>
                </div>
                <div className="colour-options">
                  {colours.map((c) => (
                    <button
                      type="button"
                      key={c.name}
                      title={c.name}
                      aria-label={c.name}
                      aria-pressed={colour === c.name}
                      onClick={() => setColour(c.name)}
                      className={
                        "swatch " + (colour === c.name ? "selected" : "")
                      }
                    >
                      <span style={{ background: c.hex }} />
                    </button>
                  ))}
                </div>
                <div className="field-label size-title">
                  SIZE{" "}
                  <a href="#size-guide">
                    Size guide <ChevronDown size={14} />
                  </a>
                </div>
                <div className="sizes">
                  {sizes.map((s) => (
                    <button
                      type="button"
                      key={s}
                      onClick={() => setSize(s)}
                      aria-pressed={size === s}
                      className={size === s ? "picked" : ""}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <div className="field-label">QUANTITY</div>
                <div className="qty">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus size={15} />
                  </button>
                  <span>{quantity}</span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() => setQuantity(Math.min(10, quantity + 1))}
                  >
                    <Plus size={15} />
                  </button>
                </div>
                <label className="input-label" htmlFor="firstName">
                  FIRST NAME <span>OPTIONAL</span>
                </label>
                <input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  maxLength={80}
                  placeholder="Your name"
                  autoComplete="given-name"
                />
                <label className="input-label" htmlFor="email">
                  EMAIL ADDRESS <span>REQUIRED</span>
                </label>
                <input
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  required
                  maxLength={254}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
                <div className="hidden-field" aria-hidden="true">
                  <label htmlFor="company">Leave this empty</label>
                  <input
                    id="company"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                </div>
                <label className="marketing">
                  <input
                    type="checkbox"
                    checked={marketing}
                    onChange={(e) => setMarketing(e.target.checked)}
                  />
                  <span>
                    I'd also like to receive future product launches and
                    promotional emails. Optional.
                  </span>
                </label>
                <button
                  className="dark-button submit"
                  type="submit"
                  disabled={busy}
                >
                  {busy ? "SUBMITTING…" : "REGISTER MY INTEREST"}
                  <ArrowRight size={18} />
                </button>
                {error && (
                  <p role="alert" className="form-error">
                    {error}
                  </p>
                )}
                <p className="privacy">
                  No payment. No guaranteed allocation. We'll only use your
                  details for this drop and, if you opt in, marketing.{" "}
                  <a href="/privacy.html" target="_blank" rel="noreferrer">
                    Privacy notice
                  </a>
                  .
                </p>
              </form>
            )}
          </div>
        </section>
        <section className="size-guide" id="size-guide">
          <p className="overline">FIND YOUR FIT</p>
          <h2>Size guide</h2>
          <p>
            Final measurements will be published before any paid launch. Your
            selected size is an indication of demand and can be changed later.
          </p>
        </section>
      </main>
      <footer>
        <strong>IDLE CLUB</strong>

        <span>PREMIUM COMFORT. EFFORTLESS STYLE.</span>

        <div className="footer-socials">
          <a
            href="https://www.instagram.com/lifeofalif"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <Instagram size={22} />
          </a>

          <a
            href="https://www.tiktok.com/@isthatalif1"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TikTok"
          >
            <Music2 size={22} />
          </a>

          <a
            href="https://www.snapchat.com/add/alifeating"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Snapchat"
          >
            <Ghost size={22} />
          </a>
        </div>
      </footer>
    </>
  );
}
function Admin() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [records, setRecords] = useState<Reservation[]>([]);
  const [authorised, setAuthorised] = useState(false);
  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    const client = supabase;
    client.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);
  useEffect(() => {
    if (!session || !supabase) {
      setRecords([]);
      setAuthorised(false);
      return;
    }
    let active = true;
    async function get() {
      const { data, error: err } = await supabase!
        .from("reservations")
        .select(
          "id,email,first_name,colour,size,quantity,source,marketing_opt_in,created_at",
        )
        .order("created_at", { ascending: false })
        .limit(5000);
      if (active) {
        setAuthorised(!err);
        setRecords((data || []) as Reservation[]);
        if (err)
          setError(
            "Unable to access reservations. Your account may not be authorised as an admin.",
          );
      }
    }
    void get();
    return () => {
      active = false;
    };
  }, [session]);
  const total = records.reduce((s, r) => s + r.quantity, 0);
  const per = (key: "colour" | "size") =>
    Object.entries(
      records.reduce<Record<string, number>>(
        (a, r) => ({ ...a, [r[key]]: (a[r[key]] || 0) + r.quantity }),
        {},
      ),
    ).sort((a, b) => b[1] - a[1]);
  function exportCsv() {
    const cols: (keyof Reservation)[] = [
      "created_at",
      "first_name",
      "email",
      "colour",
      "size",
      "quantity",
      "source",
      "marketing_opt_in",
    ];
    const content = [
      cols.join(","),
      ...records.map((r) => cols.map((c) => csvEscape(r[c])).join(",")),
    ].join("\n");
    const url = URL.createObjectURL(
      new Blob([content], { type: "text/csv;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "hoodie-reservations.csv";
    a.click();
    URL.revokeObjectURL(url);
  }
  async function signIn(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!supabase) {
      setError("Configure Supabase first.");
      return;
    }
    const { error: err } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin + "/admin",
      },
    });
    if (err) setError(err.message);
    else setSent(true);
  }
  return (
    <>
      <SiteHeader />
      <section className="admin-layout">
        <div className="admin-head">
          <div>
            <p className="overline">PRIVATE / STAFF ONLY</p>
            <h1>Demand dashboard</h1>
          </div>
          <a href="/">← Back to store</a>
        </div>
        {loading ? (
          <p>Loading…</p>
        ) : !session ? (
          <div className="login-card">
            <LockKeyhole />
            <h2>Admin sign in</h2>
            <p>
              Use your approved admin email. We'll email you a secure sign-in
              link.
            </p>
            {sent ? (
              <p className="success-text">
                <Mail size={18} /> Check your email for a sign-in link.
              </p>
            ) : (
              <form onSubmit={signIn}>
                <label className="input-label" htmlFor="adminEmail">
                  EMAIL
                </label>
                <input
                  id="adminEmail"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@example.com"
                />
                <button className="dark-button submit" type="submit">
                  SEND SIGN-IN LINK <ArrowRight size={17} />
                </button>
              </form>
            )}
            {error && (
              <p role="alert" className="form-error">
                {error}
              </p>
            )}
          </div>
        ) : (
          <>
            <div className="admin-actions">
              <p>Signed in as {session.user.email}</p>
              <button
                className="outline-button"
                onClick={() => supabase?.auth.signOut()}
              >
                <LogOut size={15} /> Sign out
              </button>
            </div>
            {!authorised ? (
              <p className="form-error">{error || "Checking access…"}</p>
            ) : (
              <>
                <div className="metric-grid">
                  <div>
                    <Shirt />
                    <span>INTEREST SUBMISSIONS</span>
                    <strong>{records.length}</strong>
                  </div>
                  <div>
                    <TrendingUp />
                    <span>TOTAL HOODIES REQUESTED</span>
                    <strong>{total}</strong>
                  </div>
                  <div>
                    <Mail />
                    <span>MARKETING OPT-INS</span>
                    <strong>
                      {records.filter((r) => r.marketing_opt_in).length}
                    </strong>
                  </div>
                </div>
                <div className="breakdown">
                  <div>
                    <h2>Top sizes</h2>
                    {per("size").map(([label, count]) => (
                      <div className="barline" key={label}>
                        <span>{label}</span>
                        <div>
                          <i
                            style={{
                              width: `${total ? (count / total) * 100 : 0}%`,
                            }}
                          />
                        </div>
                        <b>{count}</b>
                      </div>
                    ))}
                  </div>
                  <div>
                    <h2>Top colours</h2>
                    {per("colour").map(([label, count]) => (
                      <div className="barline" key={label}>
                        <span>{label}</span>
                        <div>
                          <i
                            style={{
                              width: `${total ? (count / total) * 100 : 0}%`,
                            }}
                          />
                        </div>
                        <b>{count}</b>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="table-head">
                  <h2>
                    Reservations <span>(latest 5,000)</span>
                  </h2>
                  <button onClick={exportCsv} className="outline-button">
                    Export CSV
                  </button>
                </div>
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Colour</th>
                        <th>Size</th>
                        <th>Qty</th>
                        <th>Source</th>
                      </tr>
                    </thead>
                    <tbody>
                      {records.map((r) => (
                        <tr key={r.id}>
                          <td>{dateLabel(r.created_at)}</td>
                          <td>{r.first_name || "—"}</td>
                          <td>{r.email}</td>
                          <td>{r.colour}</td>
                          <td>{r.size}</td>
                          <td>{r.quantity}</td>
                          <td>{r.source || "direct"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {!records.length && (
                    <p className="empty">No reservations yet.</p>
                  )}
                </div>
              </>
            )}
          </>
        )}
      </section>
    </>
  );
}
export default function App() {
  return window.location.pathname.startsWith("/admin") ? <Admin /> : <Shop />;
}
