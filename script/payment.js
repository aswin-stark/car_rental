document.getElementById("paymentForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const cardNumber = document.getElementById("cardNumber").value;
  const expiryYear = document.getElementById("expiryYear").value;
  const cvv = document.getElementById("cvv").value;

  if (cardNumber && expiryYear && cvv) {
    alert("Payment successful! Thank you for your reservation.");
    window.location.href = "confirmation.html"; // optional confirmation page
  } else {
    alert("Please fill in all fields.");
  }
});
// payment.js

document.addEventListener("DOMContentLoaded", function() {
  const form = document.getElementById("paymentForm");

  form.addEventListener("submit", function(e) {
    e.preventDefault(); // Prevent form from submitting

    // Optionally, you can add validation or processing here

    // Redirect to confirmation page
    window.location.href = "confirmation.html";
  });
});

document.addEventListener("DOMContentLoaded", function() {
  const form = document.getElementById("paymentForm");
  const loader = document.getElementById("loader");

  form.addEventListener("submit", function(e) {
    e.preventDefault(); // Prevent actual form submission

    // Show loader
    loader.style.display = "flex";

    // Simulate payment processing delay (2 seconds)
    setTimeout(() => {
      window.location.href = "confirmation.html"; // Redirect after delay
    }, 2000);
  });
});
document.addEventListener("DOMContentLoaded", function() {
  const form = document.getElementById("paymentForm");
  const loader = document.getElementById("loader");

  form.addEventListener("submit", function(e) {
    e.preventDefault(); // Prevent actual form submission

    // Show loader
    loader.style.display = "flex";

    // Simulate payment processing delay (2 seconds)
    setTimeout(() => {
      window.location.href = "confirmation.html"; // Redirect after delay
    }, 2000);
  });
});

document.addEventListener("DOMContentLoaded", function() {
  const form = document.getElementById("paymentForm");
  const loader = document.getElementById("loader");

  form.addEventListener("submit", function(e) {
    e.preventDefault(); // Prevent actual form submission

    // Show loader overlay
    loader.style.display = "flex";

    // Simulate payment processing delay (2 seconds)
    setTimeout(() => {
      window.location.href = "confirmation.html"; // Redirect after delay
    }, 2000);
  });
});
document.addEventListener("DOMContentLoaded", function() {
  const form = document.getElementById("paymentForm");
  const loader = document.getElementById("loader");

  form.addEventListener("submit", function(e) {
    e.preventDefault(); // Prevent actual form submission

    // Show loader ONLY after clicking Pay Now
    loader.style.display = "flex";

    // Simulate payment delay
    setTimeout(() => {
      window.location.href = "confirmation.html";
    }, 2000);
  });
});

