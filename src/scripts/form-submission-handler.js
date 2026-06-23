(function() {
  function getFormData(form) {
    const elements = form.elements;
    const formData = Array.from(elements)
      .filter(el => el.name && el.name !== "website")
      .reduce((acc, el) => (acc[el.name] = el.value, acc), {});
    const honeypot = elements["website"]?.value;
    return { data: formData, honeypot };
  }

  async function handleFormSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const { data, honeypot } = getFormData(form);
    if (honeypot) return false;

    form.querySelector(".thankyou_message")?.style.setProperty("display", "block");
    form.querySelector(".mailinglistheader")?.style.setProperty("display", "none");

    [...form.querySelectorAll("button")].forEach(btn => btn.disabled = true);

    try {
      const response = await fetch(form.action, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(data)
      });

      if (response.ok) {
        form.reset();
      } else {
        console.error("Form submission failed:", response.statusText);
        form.querySelector(".error_message")?.style.setProperty("display", "block");
      }
    } catch (err) {
      console.error("Form submission error:", err);
      form.querySelector(".error_message")?.style.setProperty("display", "block");
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("form.gform").forEach(f => f.addEventListener("submit", handleFormSubmit));
  });
})();