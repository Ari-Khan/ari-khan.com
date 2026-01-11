class MailingList extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="mailcontainer">
        <form
          class="gform"
          method="POST"
          action="https://script.google.com/macros/s/AKfycbw1l0BfyMcO0Hojk2X6SzXeQ9dIz9uZlnvVPpNhZi3TWb4fjpbglKpGDEbligQE-wvE/exec"
        >
          <h2 class="mailinglistheader">Join My Mailing List!</h2>

          <div class="thankyou_message" hidden>
            <h2>Thanks for joining!</h2>
          </div>

          <input type="email" name="email" placeholder="Enter your email..." required>
          <input type="text" name="website" tabindex="-1" autocomplete="off" hidden>

          <button type="submit">Join Mailing List</button>
        </form>
      </div>
    `;
  }
}

customElements.define("mailing-list", MailingList);
