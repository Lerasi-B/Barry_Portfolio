/*
 * Barry Portfolio — booking form functionality
 * Matches the elements in barryHome200.html.
 *
 * Set BOOKING_EMAIL to the address that should receive booking requests.
 * This uses the visitor's email application (mailto); it does not save
 * bookings to a database or automatically confirm appointments.
 */
(() => {
  "use strict";

  const BOOKING_EMAIL = "YOUR_EMAIL@example.com";

  const bookingDialog = document.getElementById("bookingContainer");
  const bookingForm = document.getElementById("bookingForm");

  if (!bookingDialog || !bookingForm) {
    console.warn("Booking form not found. Check the HTML IDs.");
    return;
  }

  const openButtons = [
    document.getElementById("openBooking"),
    document.getElementById("aboutBooking")
  ].filter(Boolean);

  const closeButton = document.getElementById("closeBooking");
  const nameField = document.getElementById("fullName");
  const emailField = document.getElementById("email");
  const phoneField = document.getElementById("phone");
  const sessionField = document.getElementById("sessionType");
  const dateField = document.getElementById("date");
  const timeField = document.getElementById("time");
  const messageField = document.getElementById("message");

  let previouslyFocusedElement = null;

  function localDateString() {
    const now = new Date();
    const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    return localDate.toISOString().slice(0, 10);
  }

  // Prevent selecting a date in the past.
  if (dateField) {
    dateField.min = localDateString();
  }

  function openBooking() {
    previouslyFocusedElement = document.activeElement;
    bookingDialog.style.display = "flex";
    bookingDialog.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    nameField?.focus();
  }

  function closeBooking() {
    bookingDialog.style.display = "none";
    bookingDialog.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    if (previouslyFocusedElement?.focus) {
      previouslyFocusedElement.focus();
    }
  }

  openButtons.forEach((button) => {
    button.addEventListener("click", openBooking);
  });

  closeButton?.addEventListener("click", closeBooking);

  // Close when the visitor clicks the backdrop.
  bookingDialog.addEventListener("click", (event) => {
    if (event.target === bookingDialog) closeBooking();
  });

  // Close with Escape.
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && bookingDialog.style.display === "flex") {
      closeBooking();
    }
  });

  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!bookingForm.reportValidity()) return;

    if (dateField?.value && dateField.value < localDateString()) {
      dateField.setCustomValidity("Please choose today or a future date.");
      dateField.reportValidity();
      dateField.setCustomValidity("");
      return;
    }

    if (
      !BOOKING_EMAIL ||
      BOOKING_EMAIL === "YOUR_EMAIL@example.com" ||
      !BOOKING_EMAIL.includes("@")
    ) {
      alert(
        "Please add your email address in booking.js by replacing YOUR_EMAIL@example.com in BOOKING_EMAIL."
      );
      return;
    }

    const details = {
      name: nameField?.value.trim() || "",
      email: emailField?.value.trim() || "",
      phone: phoneField?.value.trim() || "",
      session: sessionField?.value || "",
      date: dateField?.value || "",
      time: timeField?.value || "",
      message: messageField?.value.trim() || "No additional message"
    };

    const subject = encodeURIComponent(
      `Portfolio booking request - ${details.name}`
    );

    const body = encodeURIComponent([
      "New booking request from your portfolio website",
      "",
      `Name: ${details.name}`,
      `Email: ${details.email}`,
      `Phone: ${details.phone}`,
      `Session type: ${details.session}`,
      `Preferred date: ${details.date}`,
      `Preferred time: ${details.time}`,
      "",
      "Message:",
      details.message
    ].join("\n"));

    // Opens the visitor's email app with the booking request pre-filled.
    window.location.href =
      `mailto:${BOOKING_EMAIL}?subject=${subject}&body=${body}`;
  });

  // The booking dialog starts closed.
  bookingDialog.setAttribute("aria-hidden", "true");
})();
