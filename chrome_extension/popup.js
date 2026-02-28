document.addEventListener("DOMContentLoaded", () => {
  const fields = {
    serverUrl: document.getElementById("serverUrl"),
    secretKey: document.getElementById("secretKey"),
    trackingManually: document.getElementById("trackingManually"),
    trackingOwner: document.getElementById("trackingOwner"),
    customImgUrl: document.getElementById("customImgUrl"),
    trackLinks: document.getElementById("trackLinks"),
  };

  const saveButton = document.getElementById("saveButton");
  const statusEl = document.getElementById("status");
  const toggleSecretBtn = document.getElementById("toggleSecret");
  const autoTrackField = document.getElementById("autoTrackField");

  // --- Load stored settings ---
  chrome.storage.local.get("CONSTANTS", (data) => {
    if (data.CONSTANTS) {
      fields.serverUrl.value = data.CONSTANTS.SERVER_URL || "";
      fields.secretKey.value = data.CONSTANTS.SECRET_KEY || "";
      fields.trackingManually.checked = data.CONSTANTS.TRACKING_MANUALLY || false;
      fields.trackingOwner.value = data.CONSTANTS.TRACKING_AUTO_FOR_OWNER || "";
      fields.customImgUrl.value = data.CONSTANTS.CUSTOM_IMAGE_URL || "";
      fields.trackLinks.checked = data.CONSTANTS.TRACK_LINKS || false;
    }
    updateAutoTrackVisibility();
  });

  // --- Toggle secret key visibility ---
  toggleSecretBtn.addEventListener("click", () => {
    const isPassword = fields.secretKey.type === "password";
    fields.secretKey.type = isPassword ? "text" : "password";
    toggleSecretBtn.querySelector(".icon-eye").style.display = isPassword ? "none" : "";
    toggleSecretBtn.querySelector(".icon-eye-off").style.display = isPassword ? "" : "none";
  });

  // --- Conditional auto-track field ---
  function updateAutoTrackVisibility() {
    if (fields.trackingManually.checked) {
      autoTrackField.classList.remove("visible");
    } else {
      autoTrackField.classList.add("visible");
    }
  }

  fields.trackingManually.addEventListener("change", updateAutoTrackVisibility);

  // --- Save settings ---
  saveButton.addEventListener("click", () => {
    const CONSTANTS = {
      SERVER_URL: fields.serverUrl.value.trim(),
      SECRET_KEY: fields.secretKey.value.trim(),
      TRACKING_MANUALLY: fields.trackingManually.checked,
      TRACKING_AUTO_FOR_OWNER: fields.trackingOwner.value.trim(),
      CUSTOM_IMAGE_URL: fields.customImgUrl.value.trim(),
      TRACK_LINKS: fields.trackLinks.checked,
    };

    chrome.storage.local.set({ CONSTANTS }, () => {
      showStatus("Settings saved", "success");
    });
  });

  // --- Status feedback ---
  function showStatus(message, type) {
    statusEl.textContent = message;
    statusEl.className = "status " + type + " show";
    setTimeout(() => {
      statusEl.classList.remove("show");
    }, 2000);
  }
});
