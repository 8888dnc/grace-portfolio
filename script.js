const spreads = Array.from(document.querySelectorAll(".spread"));
const book = document.querySelector("#book");

let activeIndex = 0;
let mobileSecondPage = false;

function isMobile() {
  return window.matchMedia("(max-width: 760px)").matches;
}

function updateReader() {
  spreads.forEach((spread, index) => {
    spread.classList.toggle("is-active", index === activeIndex);
    spread.classList.toggle("show-second", index === activeIndex && mobileSecondPage);
  });
}

function goTo(index) {
  const nextIndex = Math.max(0, Math.min(spreads.length - 1, index));
  activeIndex = nextIndex;
  mobileSecondPage = false;
  updateReader();
}

function next() {
  if (isMobile()) {
    const hasSecondPage = spreads[activeIndex].children.length > 1;
    if (hasSecondPage && !mobileSecondPage) {
      mobileSecondPage = true;
      updateReader();
      return;
    }
  }
  if (activeIndex < spreads.length - 1) {
    goTo(activeIndex + 1);
  }
}

function previous() {
  if (isMobile() && mobileSecondPage) {
    mobileSecondPage = false;
    updateReader();
    return;
  }
  if (activeIndex > 0) {
    goTo(activeIndex - 1);
  }
}

book.addEventListener("click", (event) => {
  const jumpTarget = event.target.closest("[data-jump]");
  if (jumpTarget) {
    goTo(Number(jumpTarget.dataset.jump));
    return;
  }

  const bounds = book.getBoundingClientRect();
  const clickedLeftSide = event.clientX < bounds.left + bounds.width / 2;
  clickedLeftSide ? previous() : next();
});

window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight" || event.key === " ") {
    event.preventDefault();
    next();
  }
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    previous();
  }
  if (event.key === "Home") {
    event.preventDefault();
    goTo(0);
  }
});

window.addEventListener("resize", () => {
  if (!isMobile()) {
    mobileSecondPage = false;
  }
  updateReader();
});

updateReader();
