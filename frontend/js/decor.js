// Faint doctor symbols and motivational quotes on the sides of every page.
const QUOTES = [
  "Every chapter brings you closer to the white coat.",
  "Future doctors are made in moments like this.",
  "Small steps every day lead to big results.",
  "Discipline today, stethoscope tomorrow.",
  "Your patients are waiting for the doctor you will become.",
  "Dream it. Study it. Become it.",
  "Hard work beats talent when talent doesn't work hard.",
  "One more chapter. One step closer to MBBS.",
];

const SYMBOLS = ["⚕", "🩺", "🧬", "❤", "💊", "🔬", "🫀", "🧠"];

function buildSide(side, quotes) {
  const aside = document.createElement("aside");
  aside.className = `decor decor-${side}`;
  aside.setAttribute("aria-hidden", "true");
  quotes.forEach((quote, i) => {
    const symbol = document.createElement("span");
    symbol.className = "decor-symbol";
    symbol.textContent = SYMBOLS[(i * 2 + (side === "right" ? 1 : 0)) % SYMBOLS.length];
    const text = document.createElement("p");
    text.className = "decor-quote";
    text.textContent = quote;
    aside.append(symbol, text);
  });
  document.body.appendChild(aside);
}

buildSide("left", QUOTES.slice(0, 4));
buildSide("right", QUOTES.slice(4));

// Quote of the visit under the subtitle (visible on every screen size).
const subtitle = document.querySelector(".subtitle");
if (subtitle) {
  const daily = document.createElement("p");
  daily.className = "daily-quote";
  daily.textContent = `⚕ ${QUOTES[Math.floor(Math.random() * QUOTES.length)]}`;
  subtitle.after(daily);
}
