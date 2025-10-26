const bookButtons = document.querySelectorAll(".book-btn");

bookButtons.forEach(button => {
  button.addEventListener("click", () => {
    const vehicleCard = button.closest(".vehicle-card");
    const carName = button.dataset.car;
    const priceText = vehicleCard.querySelector("h3 span").textContent; // e.g. $45/day
    const imageSrc = vehicleCard.querySelector("img").getAttribute("src");

    // For now, we'll use sample default locations
    const pickUp = "Delhi";
    const dropOff = "Bengaluru";

    // Build URL
    const url = new URL("booking.html", window.location.origin);
    url.searchParams.set("car", carName);
    url.searchParams.set("price", priceText);
    url.searchParams.set("image", imageSrc);
    url.searchParams.set("pickup", pickUp);
    url.searchParams.set("dropoff", dropOff);

    // Go to booking page
    window.location.href = url;
  });
});
// ========== VEHICLE BOOKING SCRIPT ==========

document.addEventListener("DOMContentLoaded", async () => {
  const buttons = document.querySelectorAll(".book-btn");

  // Get booking data from server
  const res = await fetch("http://localhost:3000/api/admin/bookings");
  const bookings = await res.json();

  // Optional: Get user's selected dates
  const pickupDate = document.getElementById("pickup-date")?.value;
  const dropoffDate = document.getElementById("dropoff-date")?.value;

  buttons.forEach(btn => {
    const carName = btn.getAttribute("data-car");

    // Check if car is booked for selected dates
    const isBooked = bookings.some(b => 
      b.carName === carName && b.status === "booked" &&
      (!pickupDate || !dropoffDate || 
        (pickupDate <= b.dropoffDate && dropoffDate >= b.pickupDate))
    );

    if (isBooked) {
      btn.textContent = "Already Booked";
      btn.disabled = true;
      btn.style.backgroundColor = "#ccc";
      btn.style.cursor = "not-allowed";
    }

    btn.addEventListener("click", () => {
      // Only allow booking if not disabled
      if (btn.disabled) return;

      const bookingData = {
        carName,
        pickupLocation: document.getElementById("pickup-location").value || "Chennai",
        dropoffLocation: document.getElementById("dropoff-location").value || "Bangalore",
        pickupDate: pickupDate || "2025-10-12",
        dropoffDate: dropoffDate || "2025-10-14",
        totalPrice: parseInt(btn.getAttribute("data-price")) || 7000
      };

      localStorage.setItem("bookingData", JSON.stringify(bookingData));
      window.location.href = "confirmation.html";
    });
  });
});
