
const NOTIFICATION_URL = "https://script.google.com/macros/s/AKfycbxqz6ScYZ3eeIbFQp9fVwEk-9N6kjo-WUF3wzSBRYKGCLpzwIwjsnLqhQn9dxkf7p1_/exec";

const pages = ["home", "letterPage", "question", "result"];

function showPage(pageId) {
  pages.forEach((id) => {
    document.getElementById(id).classList.toggle(
      "hidden",
      id !== pageId
    );
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.getElementById("startButton").addEventListener("click", () => {
  showPage("letterPage");
});

document.getElementById("questionButton").addEventListener("click", () => {
  showPage("question");
});

async function kirimNotifikasi(answer) {
  if (!NOTIFICATION_URL.startsWith("https://script.google.com/")) {
    console.warn("URL Google Apps Script belum dipasang.");
    return;
  }

  await fetch(NOTIFICATION_URL, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "text/plain;charset=utf-8"
    },
    body: JSON.stringify({
      answer: answer,
      timestamp: new Date().toISOString()
    })
  });
}

document.querySelectorAll(".answer").forEach((button) => {
  button.addEventListener("click", () => {
    const answer = button.dataset.answer;

    if (answer === "yes") {
      document.getElementById("resultEmoji").textContent = "💗";
      document.getElementById("resultTitle").textContent =
        "Terima kasih, sayang! 💗";
      document.getElementById("resultMessage").textContent =
        "Aku senang kamu sudah jujur. Semoga kita bisa membicarakan semuanya dengan baik.";
    } else {
      document.getElementById("resultEmoji").textContent = "🤍";
      document.getElementById("resultTitle").textContent =
        "Tidak apa-apa 🤍";
      document.getElementById("resultMessage").textContent =
        "Aku mengerti. Ambil waktu yang kamu butuhkan. Aku menghargai perasaanmu.";
    }

    showPage("result");

    kirimNotifikasi(answer).catch((error) => {
      console.error("Permintaan notifikasi gagal:", error);
    });
  });
});

document.getElementById("backButton").addEventListener("click", () => {
  showPage("home");
});
