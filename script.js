/* ════════════════════════════════════════════════════════════
   LOVE PROPOSAL — script.js
   Vanilla JS • No libraries • No database
   Step-by-step experience
   ════════════════════════════════════════════════════════════ */

/* ════════════════════════════════════════════════════════════
   ✨ PERSONALIZATION — EDIT EVERYTHING HERE
   ════════════════════════════════════════════════════════════ */
const proposalData = {
    herName: "Nethraaaa",                 // ← Her name (appears in letter)
    myName: "Suresh",                   // ← Your name (letter signature)
    herPhoto: "assets/her-photo.jpeg",    // ← Her photo (replace file in assets/)
    music: "assets/music.mp3"            // ← Your song (replace file in assets/)
};

/* ════════════════════════════════════════════════════════════
   MESSAGES — edit the wording below
   ════════════════════════════════════════════════════════════ */
const messages = {
    letterGreeting: "Dear " + proposalData.herName + " ❤️",
    letterSignature: proposalData.myName + " ❤️",
    yesTitle: "You Said YES! ❤️",
    yesSub: "You made my heart so happy 💕",
    considerTitle: "That's okay ❤️",
    considerText: "Take your time.\nI respect your feelings 🌸"
};

/* ════════════════════════════════════════════════════════════
   🔔 RESPONSE NOTIFICATION — CONFIGURATION (EDIT HERE)
   ════════════════════════════════════════════════════════════
   HOW TO SET UP (Formspree — free, no backend needed):
     1. Create a free account at https://formspree.io
     2. Click "New Form", give it any name (e.g. "Proposal")
     3. Copy the form endpoint it gives you — it looks like:
            https://formspree.io/f/xyzabc123
     4. Paste that URL as `endpoint` below
     5. Confirm your Formspree account via the email they
        send you (required before deliveries work)
     6. Keep `enabled: true`

   SECURITY NOTE: Formspree form IDs are public by design and
   safe to expose in frontend JavaScript. No private API keys,
   passwords, or secret tokens are stored in this file.
   ════════════════════════════════════════════════════════════ */
const notificationConfig = {
    enabled: true,
    endpoint: "https://formspree.io/f/mdekzzra"
};

/* ════════════════════════════════════════════════════════════ */

/* ---------- Elements ---------- */
const mainSite      = document.getElementById("mainSite");
const progressDots  = document.getElementById("progressDots");
const musicBtn      = document.getElementById("musicBtn");
const acceptBtn     = document.getElementById("acceptBtn");
const considerBtn   = document.getElementById("considerBtn");
const considerClose = document.getElementById("considerCloseBtn");
const celebration   = document.getElementById("celebration");
const considerOv    = document.getElementById("considerOverlay");
const heartBurst    = document.getElementById("heartBurst");

/* ---------- Auto-apply personalization ---------- */
document.getElementById("letterGreeting").textContent    = messages.letterGreeting;
document.getElementById("letterSignature").textContent  = messages.letterSignature;
document.getElementById("herPhoto").src                 = proposalData.herPhoto;
document.title                                          = "Will You Accept My Love" + (proposalData.herName !== "HER NAME" ? ", " + proposalData.herName : "") + "? ❤️";

celebration.querySelector(".celebration-title").textContent = messages.yesTitle;
celebration.querySelector(".celebration-sub").textContent   = messages.yesSub;
considerOv.querySelector("h2").textContent                  = messages.considerTitle;
considerOv.querySelector("p").textContent                   = messages.considerText;

const photo = document.getElementById("herPhoto");
photo.onerror = () => {
    /* Gentle fallback if photo is missing — never breaks the page */
    photo.style.opacity = "0.6";
    photo.alt = "assets/her-photo.jpeg";
    photo.src = "data:image/svg+xml;utf8," + encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500">' +
        '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
        '<stop offset="0" stop-color="#f8bbd0"/><stop offset="1" stop-color="#ede7f6"/></linearGradient></defs>' +
        '<rect width="400" height="500" fill="url(#g)"/>' +
        '<text x="200" y="235" font-size="30" fill="#c2185b" text-anchor="middle" font-family="sans-serif">❤️</text>' +
        '<text x="200" y="285" font-size="20" fill="#ad1457" text-anchor="middle" font-family="sans-serif">Place your photo here</text>' +
        '<text x="200" y="315" font-size="16" fill="#7b3b65" text-anchor="middle" font-family="monospace">assets/her-photo.jpeg</text></svg>');
};

/* ════════════════════════════════════════════════════════════
   STEP-BY-STEP NAVIGATION
   Only one step is visible at a time.
   ════════════════════════════════════════════════════════════ */
const steps = Array.from(document.querySelectorAll(".step"));
let currentStep = 1;
let isAnimating = false;
let photoHeartsSpawned = false;

/* ---------- Progress dots (● ○ ○ ○ ○ ○) ---------- */
function buildDots() {
    steps.forEach((_, i) => {
        const dot = document.createElement("span");
        dot.className = "dot";
        dot.setAttribute("aria-label", "Step " + (i + 1));
        progressDots.appendChild(dot);
    });
    updateDots();
}

function updateDots() {
    document.querySelectorAll(".dot").forEach((dot, i) => {
        dot.classList.toggle("done", i < currentStep - 1);
        dot.classList.toggle("active", i === currentStep - 1);
    });
}

/* ---------- Move between steps ---------- */
function goToStep(next) {
    if (isAnimating || next === currentStep || next < 1 || next > steps.length) return;

    isAnimating = true;
    const current = steps[currentStep - 1];
    const nextEl = steps[next - 1];

    /* Current step fades / slides / blurs out */
    current.classList.add("step-out");

    setTimeout(() => {
        current.classList.remove("active", "step-out");
        nextEl.classList.add("active");   /* next step animates in */
        currentStep = next;
        updateDots();

        /* Keep scroll at the top of the new step */
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });

        onStepEnter(nextEl);
        isAnimating = false;
    }, 550);
}

/* ---------- Per-step triggers (keeps existing animations) ---------- */
function onStepEnter(stepEl) {
    const n = Number(stepEl.dataset.step);

    /* Step 5: reveal the emotional highlight second line */
    if (n === 5) {
        if (document.getElementById("highlightTwo").classList.contains("hidden")) {
            document.getElementById("highlightTwo").classList.remove("hidden");
        }
    }

    /* Step 6: spawn the floating hearts around her photo once */
    if (n === 6 && !photoHeartsSpawned) {
        photoHeartsSpawned = true;
        spawnPhotoHearts();
    }
}

/* ---------- Navigation buttons (Start 💌 / Next ❤️ / ...) ---------- */
mainSite.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-next]");
    if (btn) goToStep(Number(btn.dataset.next));
});

/* ---------- Floating hearts around photo (step 6) ---------- */
function spawnPhotoHearts() {
    const container = document.querySelector(".photo-floating-hearts");
    const symbols = ["❤️", "💗", "🌸", "💖", "✨"];

    for (let i = 0; i < 10; i++) {
        const span = document.createElement("span");
        span.textContent = symbols[i % symbols.length];
        span.style.left = Math.random() * 100 + "%";
        span.style.animationDelay = (Math.random() * 5) + "s";
        span.style.animationDuration = (3.5 + Math.random() * 3) + "s";
        container.appendChild(span);
    }
}

/* ════════════════════════════════════════════════════════════
   RESPONSE NOTIFICATION — sends her answer to you
   ════════════════════════════════════════════════════════════ */
let responseNotificationBusy = false;

function isNotificationConfigured() {
    return Boolean(
        notificationConfig.enabled &&
        typeof notificationConfig.endpoint === "string" &&
        notificationConfig.endpoint.startsWith("https://formspree.io/f/") &&
        !notificationConfig.endpoint.includes("YOUR_NOTIFICATION_ENDPOINT")
    );
}

async function sendResponseNotification(responseLabel, subjectLine) {
    if (responseNotificationBusy) return false;
    responseNotificationBusy = true;

    try {
        /* 1 + 2. Record her response with the current date & time */
        const now = new Date();
        const dateStr = now.toLocaleDateString(undefined, {
            year: "numeric", month: "long", day: "numeric"
        });
        const timeStr = now.toLocaleTimeString(undefined, {
            hour: "2-digit", minute: "2-digit", second: "2-digit"
        });

        try {
            localStorage.setItem("proposalLastResponse", JSON.stringify({
                response: responseLabel,
                name: proposalData.herName,
                date: dateStr,
                time: timeStr
            }));
        } catch (_) { /* storage unavailable — notification still proceeds */ }

        if (!isNotificationConfigured()) {
            console.warn("[Notification] Not configured yet — set notificationConfig.endpoint in script.js (see comments above it).");
            return false;
        }

        /* 3. Send the notification */
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 10000);

        const res = await fetch(notificationConfig.endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                _subject: subjectLine,
                response: responseLabel,
                her_name: proposalData.herName,
                date: dateStr,
                time: timeStr,
                message:
                    subjectLine +
                    "\n\nName: " + proposalData.herName +
                    "\nDate: " + dateStr +
                    "\nTime: " + timeStr
            }),
            signal: controller.signal
        });

        clearTimeout(timer);
        if (!res.ok) throw new Error("Endpoint returned status " + res.status);

        /* 4 + 6. Only on real success do we confirm to her */
        showToast("Your response has been recorded ❤️", 4500);
        return true;
    } catch (err) {
        /* 5 + 7. Never expose technical errors or config to her */
        console.error("[Notification] Failed to send proposal response:", err);
        return false;
    } finally {
        responseNotificationBusy = false;
    }
}

/* ---------- 6+7. ACCEPT → celebration + confetti ---------- */
acceptBtn.addEventListener("click", () => {
    sendResponseNotification("ACCEPTED", "❤️ Proposal Response: ACCEPTED");
    celebration.classList.remove("hidden");
    document.body.style.overflow = "hidden";
    burstConfetti();
});

function burstConfetti() {
    const symbols = ["❤️", "💖", "💕", "🌸", "✨", "💗"];
    for (let i = 0; i < 80; i++) {
        const el = document.createElement("span");
        el.className = "heart-confetti";
        el.textContent = symbols[i % symbols.length];
        el.style.left = Math.random() * 100 + "vw";
        el.style.fontSize = (0.8 + Math.random() * 1.8) + "rem";
        el.style.cssText += `--dx:${(Math.random() * 240 - 120)}px;--rot:${(Math.random() * 720 - 360)}deg;--dur:${(2.4 + Math.random() * 2.4)}s`;
        heartBurst.appendChild(el);
        setTimeout(() => el.remove(), 6000);
    }
}

/* ---------- Toast helper (safe feedback) ---------- */
let toastEl = null;
function showToast(text, duration = 3000) {
    if (!toastEl) {
        toastEl = document.createElement("div");
        toastEl.className = "toast";
        document.body.appendChild(toastEl);
    }
    toastEl.textContent = text;
    toastEl.classList.add("show");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toastEl.classList.remove("show"), duration);
}

/* ---------- 9. "I NEED SOME TIME" — no pressure ---------- */
considerBtn.addEventListener("click", () => {
    sendResponseNotification("NEEDS SOME TIME", "🌸 Proposal Response: NEEDS SOME TIME");
    considerOv.classList.remove("hidden");
});

considerClose.addEventListener("click", () => {
    considerOv.classList.add("hidden");
});

considerOv.addEventListener("click", (e) => {
    if (e.target === considerOv) considerOv.classList.add("hidden");
});

/* ---------- 10. 🎵 Music play / pause (no autoplay) ---------- */
const audio = new Audio(proposalData.music);
audio.preload = "none";
audio.loop = true;

let musicOn = false;
musicBtn.addEventListener("click", () => {
    if (!musicOn) {
        audio.play()
            .then(() => {
                musicOn = true;
                musicBtn.textContent = "⏸️";
                musicBtn.classList.add("playing");
            })
            .catch(() => showToast("Tap again to play the music 🎵", 2500));
    } else {
        audio.pause();
        musicOn = false;
        musicBtn.textContent = "🎵";
        musicBtn.classList.remove("playing");
    }
});

/* ---------- Init ---------- */
buildDots();