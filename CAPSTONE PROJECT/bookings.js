const prices = {
  platinum: 300,
  diamond: 200,
  gold: 120
};

const params = new URLSearchParams(window.location.search);
const screen = params.get("screen");

const title = document.getElementById("screen-title");
const layout = document.getElementById("layout");
const seatCountDiv = document.getElementById("seat-count");

title.innerText = screen.toUpperCase() + " SCREEN";

let maxSeats = 1;
let selectedSeats = [];

function selectSeatCount(num) {
  maxSeats = num;

  document.querySelectorAll(".seat-option").forEach(el => {
    el.classList.remove("active");
  });

  event.target.classList.add("active");
}

function startBooking() {
  if (maxSeats === 0) {
    alert("Please select number of seats");
    return;
  }

  document.getElementById("seat-panel").style.display = "none";
  document.getElementById("overlay").style.display = "none";

  // ✅ SHOW layout
  layout.style.display = "block";
  layout.classList.add("active");

  // remove blur
  layout.style.filter = "blur(0)";
  layout.style.pointerEvents = "auto";

  generateSeats("platinum", 20);
  generateSeats("diamond", 30);
  generateSeats("gold", 40);
}

function generateSeats(section, count) {
  const container = document.getElementById(section);

  for (let i = 0; i < count; i++) {
    const seat = document.createElement("div");
    seat.classList.add("seat");

    seat.dataset.section = section;
    seat.dataset.price = prices[section];

    // random booked
    if (Math.random() < 0.2) {
      seat.classList.add("booked");
    }

    seat.addEventListener("click", () => {
      if (seat.classList.contains("booked")) return;

      if (seat.classList.contains("selected")) {
        seat.classList.remove("selected");
        selectedSeats = selectedSeats.filter(s => s !== seat);
      } else {
        if (selectedSeats.length < maxSeats) {
          seat.classList.add("selected");
          selectedSeats.push(seat);
        } else {
          alert("You can only select " + maxSeats + " seats");
        }
      }

      updateSummary(); // 🔥 update price live
    });

    container.appendChild(seat);
  }
}

function updateSummary() {
  const count = selectedSeats.length;

  let total = 0;

  selectedSeats.forEach(seat => {
    total += parseInt(seat.dataset.price);
  });

  document.getElementById("seat-count-display").innerText = count;
  document.getElementById("total-price").innerText = total;
}

function goToSuccess() {
  if (selectedSeats.length === 0) {
    alert("Please select seats");
    return;
  }

  let total = 0;
  selectedSeats.forEach(seat => {
    total += parseInt(seat.dataset.price);
  });

  localStorage.setItem("seatCount", selectedSeats.length);
  localStorage.setItem("totalPrice", total);

  const isLoggedIn = localStorage.getItem("loggedIn");

  if (isLoggedIn === "true") {
    window.location.href = "payment.html";
  } else {
    localStorage.setItem("redirectAfterLogin", "payment.html");
    window.location.href = "login.html";
  }
}