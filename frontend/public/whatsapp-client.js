document.addEventListener("DOMContentLoaded", () => {
  const qrcodeDiv = document.getElementById("qrcode");
  const statusDiv = document.getElementById("status");
  const enableSwitch = document.getElementById("whatsapp-toggle");

  let socket;

  function initializeSocket() {
    if (typeof io !== "undefined") {
      socket = io();

      socket.on("connect", () => {
        console.log("Connected to server");
        updateStatus("Connected to server. Waiting for WhatsApp connection...");
      });

      socket.on("qr", (qr) => {
        console.log("QR code received");
        displayQRCode(qr);
        updateStatus("Scan the QR code with WhatsApp");
      });

      socket.on("ready", () => {
        hideQRCode();
        updateStatus("WhatsApp is ready!");
      });

      socket.on("disconnected", () => {
        console.log("Disconnected from WhatsApp");
        updateStatus("Disconnected from WhatsApp");
        if (enableSwitch.checked) {
          displayQRCode(); // Show placeholder or last QR code
        }
      });

      socket.on("disconnect", () => {
        console.log("Disconnected from server");
        updateStatus("Disconnected from server");
        if (enableSwitch.checked) {
          displayQRCode(); // Show placeholder or last QR code
        }
      });
    } else {
      console.error("Socket.IO not loaded yet");
    }
  }

  function updateStatus(message) {
    statusDiv.textContent = message;
    // Dispatch a custom event to update the React component's state
    window.dispatchEvent(
      new CustomEvent("whatsappStatusUpdate", { detail: message })
    );
  }

  function displayQRCode(qr) {
    qrcodeDiv.innerHTML = "";
    if (qr) {
      new QRCode(qrcodeDiv, {
        text: qr,
        width: 256,
        height: 256,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H,
      });
    } else {
      // Display a placeholder or message when there's no QR code
      qrcodeDiv.textContent = "Waiting for QR code...";
    }
    qrcodeDiv.style.display = "block";
  }

  function hideQRCode() {
    qrcodeDiv.style.display = "none";
  }

  // Initialize Socket.IO connection
  initializeSocket();

  // Handle toggle changes
  enableSwitch.addEventListener("change", (event) => {
    const isEnabled = event.target.checked;
    if (isEnabled) {
      if (socket) {
        socket.connect();
      } else {
        initializeSocket();
      }
      displayQRCode(); // Show placeholder while waiting for actual QR code
    } else {
      if (socket) {
        socket.disconnect();
      }
      hideQRCode();
      updateStatus("WhatsApp integration disabled");
    }
  });
});
