const overlay = document.getElementById("introOverlay");
const openBtn = document.getElementById("openOverlay");
const brandHome = document.getElementById("brandHome");
const body = document.body;
function openDoor(scrollTarget = "#myTopnav") {
	overlay.classList.add("is-open");

	// unlock scrolling after the overlay starts moving
	setTimeout(() => {
		body.classList.remove("is-locked");
	}, 450);

	// optional: scroll once the overlay is mostly out of the way
	setTimeout(() => {
		const target = document.querySelector(scrollTarget);
		if (target) target.scrollIntoView({ behavior: "smooth" });
	}, 750);
}

function closeDoor() {
	// lock scroll first so it feels like the door is taking over again
	body.classList.add("is-locked");

	// go to top so the overlay return feels intentional
	document.getElementById("top")?.scrollIntoView({ behavior: "smooth" });

	// bring overlay back
	overlay.classList.remove("is-open");

	// focus the open button for accessibility
	setTimeout(() => openBtn?.focus(), 300);
}

// Open with button
openBtn.addEventListener("click", () => openDoor("#myTopnav"));

// Brand = replay / return to door
brandHome.addEventListener("click", (e) => {
	e.preventDefault();
	closeDoor();
});

// Optional: ESC to close the door
document.addEventListener("keydown", (e) => {
	if (e.key === "Escape" && overlay.classList.contains("is-open")) {
		closeDoor();
	}
});

function myFunction() {
	const x = document.getElementById("myTopnav");
	x.classList.toggle("responsive");
}