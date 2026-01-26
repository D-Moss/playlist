//INTRO DOOR OVERLAY
const overlay = document.getElementById("introOverlay");
const openBtn = document.getElementById("openOverlay");
const closeBtn = document.getElementById("closeOverlay");
const brandHome = document.getElementById("brandHome");
const body = document.body;

function openDoor(scrollTarget = "#top") {
	overlay.classList.add("is-open");
	setTimeout(() => body.classList.remove("is-locked"), 450);
	setTimeout(() => document.querySelector(scrollTarget)?.scrollIntoView({ behavior: "smooth" }), 750);
}

function closeDoor() {
	body.classList.add("is-locked");
	overlay.classList.remove("is-open");
	document.getElementById("top")?.scrollIntoView({ behavior: "smooth" });
}

openBtn?.addEventListener("click", () => openDoor("#top"));
closeBtn?.addEventListener("click", closeDoor);
brandHome?.addEventListener("click", (e) => { e.preventDefault(); closeDoor(); });


//2D CAROUSEL
const track = document.getElementById("track");
const cards = track ? Array.from(track.querySelectorAll(".chapter-card")) : [];

let index = 0;

function cardStepPx() {
	if (!cards.length) return 0;
	const card = cards[0];
	const styles = getComputedStyle(track);
	const gap = parseFloat(styles.columnGap || styles.gap || "0") || 0;
	return card.getBoundingClientRect().width + gap;
}

function render() {
	if (!track || !cards.length) return;

	cards.forEach((c, i) => c.classList.toggle("is-active", i === index));

	const step = cardStepPx();

	// center active card in viewport (with neighbor peeks)
	const viewport = document.querySelector(".carousel-viewport");
	const vw = viewport.getBoundingClientRect().width;

	const activeW = cards[index].getBoundingClientRect().width;
	const leftPadding = 18; // matches .carousel-track padding
	const x = (index * step) - ((vw - activeW) / 2) + leftPadding;

	track.style.transform = `translateX(${-x}px)`;
}

window.addEventListener("resize", () => requestAnimationFrame(render));


// ----- Read More Modal (Chapter Notes) -----
const readmoreOverlay = document.getElementById("readmoreOverlay");
const closeReadmore = document.getElementById("closeReadmore");
const readmoreTitle = document.getElementById("readmoreTitle");
const readmoreBody = document.getElementById("readmoreBody");

// Optional: remember the element that opened the modal (for focus return)
let lastFocusEl = null;

function openReadmoreFor(chapterNum) {
	const activeCard = document.querySelector(`.chapter-card[data-chapter="${chapterNum}"]`);
	const titleText = activeCard?.querySelector(".chapter-title")?.textContent?.trim() || `Chapter ${chapterNum}`;

	// Set modal title
	if (readmoreTitle) readmoreTitle.textContent = `${titleText} — Chapter Notes`;

	// Inject correct paragraph content from hidden template
	const template = document.getElementById(`rm-ch${chapterNum}`);
	if (template && readmoreBody) {
		readmoreBody.innerHTML = template.innerHTML;
	}

	readmoreOverlay?.classList.add("is-open");
	readmoreOverlay?.setAttribute("aria-hidden", "false");
	closeReadmore?.focus();
}

function closeReadmoreModal() {
	readmoreOverlay?.classList.remove("is-open");
	readmoreOverlay?.setAttribute("aria-hidden", "true");

	// return focus to whatever opened it
	if (lastFocusEl) lastFocusEl.focus();
	lastFocusEl = null;
}

closeReadmore?.addEventListener("click", closeReadmoreModal);

readmoreOverlay?.addEventListener("click", (e) => {
	if (e.target === readmoreOverlay) closeReadmoreModal();
});

document.addEventListener("keydown", (e) => {
	if (e.key === "Escape" && readmoreOverlay?.classList.contains("is-open")) {
		closeReadmoreModal();
	}
});


// ----- Motion Toggle: auto-advance -----
const motionToggle = document.getElementById("motionToggle");
const motionState = document.getElementById("motionState");

let spinTimer = null;

function startSpin() {
	stopSpin();
	spinTimer = setInterval(() => {
		index = (index + 1) % cards.length;
		render();
	}, 9000);
}

function stopSpin() {
	if (spinTimer) clearInterval(spinTimer);
	spinTimer = null;
}

motionToggle?.addEventListener("click", () => {
	const on = motionToggle.getAttribute("aria-pressed") === "true";
	const nextState = !on;

	motionToggle.setAttribute("aria-pressed", String(nextState));
	motionState.textContent = nextState ? "On" : "Off";

	if (nextState) startSpin();
	else stopSpin();
});

// pause while hovering carousel
const viewport = document.querySelector(".carousel-viewport");
viewport?.addEventListener("mouseenter", stopSpin);
viewport?.addEventListener("mouseleave", () => {
	if (motionToggle?.getAttribute("aria-pressed") === "true") startSpin();
});


// ----- Unified click handler for card nav buttons -----
document.addEventListener("click", (e) => {
	const btn = e.target.closest("[data-action]");
	if (!btn) return;

	const action = btn.dataset.action;

	if (action === "prev") {
		index = (index - 1 + cards.length) % cards.length;
		render();
	}

	if (action === "next") {
		index = (index + 1) % cards.length;
		render();
	}

	if (action === "read") {
		// Save focus to return after closing modal
		lastFocusEl = btn;

		// Prefer the card that button is on (more reliable than "active card")
		const card = btn.closest(".chapter-card");
		const ch = card?.dataset.chapter || cards[index]?.dataset.chapter || "1";
		openReadmoreFor(ch);
	}
});

// initial paint
requestAnimationFrame(render);