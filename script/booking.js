// Fill car details from URL parameters
const params = new URLSearchParams(window.location.search);
const carName = params.get("car") || "Toyota Camry";
const carImage = params.get("image") || "toyota.jpg";
const carPrice = params.get("price") || "3500";

document.getElementById("car-name").textContent = "Car - " + carName;
document.getElementById("car-image").src = carImage;
document.getElementById("car-price").textContent = `${carPrice}`;

// Date inputs
const pickupDateInput = document.getElementById("pickup-date");
const dropoffDateInput = document.getElementById("dropoff-date");

// Set minimum date to today for both pick-up and drop-off
const today = new Date().toISOString().split("T")[0];
pickupDateInput.min = today;
dropoffDateInput.min = today;

// Update drop-off min if pick-up changes
pickupDateInput.addEventListener("change", () => {
    if (pickupDateInput.value) {
        dropoffDateInput.min = pickupDateInput.value;
    } else {
        dropoffDateInput.min = today;
    }
});
