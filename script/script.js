
  // Set min date to today for both pick-up and drop-off
  window.addEventListener("DOMContentLoaded", () => {
    const today = new Date().toISOString().split("T")[0];
    document.getElementById("pickup-date").setAttribute("min", today);
    document.getElementById("dropoff-date").setAttribute("min", today);
  });


  document.getElementById("pickup-date").addEventListener("change", function () {
    const pickupDate = this.value;
    document.getElementById("dropoff-date").setAttribute("min", pickupDate);
  });

  document.getElementById("subscribe-form").addEventListener("submit", async function(e) {
  e.preventDefault();
  const email = document.getElementById("subscriber-email").value;
  const messageBox = document.getElementById("subscribe-message");

  try {
    const res = await fetch("http://localhost:3000/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email })
    });

    const data = await res.json();
    if (res.ok) {
      messageBox.textContent = "Subscription successful! Please check your email.";
    } else {
      messageBox.textContent = "Error: " + data.error;
    }
  } catch (err) {
    messageBox.textContent = "Failed to subscribe.";
  }
});


document.getElementById('contactForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const message = document.getElementById('message').value;

  const responseMessage = document.getElementById('responseMessage');

  try {
    const res = await fetch('http://localhost:3000/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, message })
    });

    const data = await res.json();
    if (data.success) {
      responseMessage.style.color = 'green';
      responseMessage.textContent = '✅ Message sent successfully!';
      document.getElementById('contactForm').reset();
    } else {
      responseMessage.style.color = 'red';
      responseMessage.textContent = '❌ Failed to send. Try again.';
    }
  } catch (error) {
    responseMessage.style.color = 'red';
    responseMessage.textContent = '❌ Something went wrong.';
    console.error(error);
  }
});

document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const formData = new FormData(this);
  
  fetch('/send-email', {
    method: 'POST',
    body: JSON.stringify(Object.fromEntries(formData)),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.text())
  .then(data => {
    alert('Message sent successfully!');
    this.reset();
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Error sending message. Please try again.');
  });
});


// Get form and message element
const subscribeForm = document.getElementById("subscribe-form");
const subscribeMessage = document.getElementById("subscribe-message");

// Handle form submit
subscribeForm.addEventListener("submit", async (e) => {
  e.preventDefault(); // ❌ Prevent page reload

  const email = document.getElementById("subscriber-email").value;

  try {
    const response = await fetch("/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (response.ok) {
      subscribeMessage.textContent = "✅ Subscription successful!";
      subscribeMessage.style.color = "green";
      subscribeForm.reset();
    } else {
      subscribeMessage.textContent = data.error || "❌ Subscription failed";
      subscribeMessage.style.color = "red";
    }
  } catch (err) {
    subscribeMessage.textContent = "❌ Server error, try again later";
    subscribeMessage.style.color = "red";
    console.error(err);
  }
});



document.getElementById("subscribe-form").addEventListener("submit", function(event) {
  event.preventDefault(); // Prevent form from refreshing the page

  const email = document.getElementById("subscriber-email").value;
  const messageElem = document.getElementById("subscribe-message");
  messageElem.textContent = "Please wait...";

  fetch("http://localhost:3000/subscribe", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ email })
  })
  .then(res => res.json())
  .then(data => {
    if (data.message) {
      messageElem.style.color = "green";
      messageElem.textContent = "Subscription successful! Please check your email.";
    } else {
      messageElem.style.color = "red";
      messageElem.textContent = "Failed to subscribe: " + (data.error || "Unknown error.");
    }
  })
  .catch(error => {
    messageElem.style.color = "red";
    messageElem.textContent = "Failed to subscribe. Please try again later.";
  });
});

