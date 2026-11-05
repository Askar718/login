// Простой вход: если логин и пароль совпали с аккаунтом из accounts.js —
// открываем ссылку этого аккаунта. Проверка идёт в браузере.
//
// Внимание: accounts.js открыт всем, логины/пароли/ссылки в нём видны.
// Это перенаправление, а не защита. Для настоящей защиты нужен Supabase/сервер.

const $ = (id) => document.getElementById(id);

function showError(message, kind = "error") {
  const el = $("error");
  el.textContent = message ?? "";
  el.hidden = !message;
  el.style.color = kind === "info" ? "var(--muted)" : "var(--danger)";
}

function updateSubmit() {
  $("submit").disabled = !($("login").value.trim() && $("password").value);
}

// Открываем только http/https (или ссылку относительно сайта), чтобы в accounts.js
// нельзя было случайно вписать что-то опасное.
function openUrl(url) {
  try {
    const u = new URL(url, window.location.href);
    if (u.protocol === "http:" || u.protocol === "https:") {
      window.location.href = u.href;
      return;
    }
  } catch {
    /* ниже покажем ошибку */
  }
  showError("Ссылка аккаунта в accounts.js указана неверно");
}

function findAccount(login, password) {
  const accounts = Array.isArray(window.ACCOUNTS) ? window.ACCOUNTS : [];
  return accounts.find(
    (a) =>
      String(a.login).toLowerCase() === login.toLowerCase() &&
      String(a.password) === password,
  );
}

// ---------- Обработчики ----------
$("login").addEventListener("input", updateSubmit);
$("password").addEventListener("input", updateSubmit);

$("auth-form").addEventListener("submit", (event) => {
  event.preventDefault();
  showError(null);

  if (!Array.isArray(window.ACCOUNTS)) {
    showError("Файл accounts.js не загрузился");
    return;
  }

  const login = $("login").value.trim();
  const password = $("password").value;
  const account = findAccount(login, password);

  if (account) openUrl(account.url);
  else showError("Неверный логин или пароль");
});

$("toggle-password").addEventListener("click", (event) => {
  const reveal = $("password").type === "password";
  $("password").type = reveal ? "text" : "password";
  event.currentTarget.setAttribute("aria-pressed", String(reveal));
});

$("forgot").addEventListener("click", () =>
  showError("Сброс пароля отправлено на электронную почту", "info"),
);

$("google").addEventListener("click", () =>
  showError(
    "Вход через Google нужно настроить отдельно — пока не подключён.",
    "info",
  ),
);

$("switch-mode").addEventListener("click", () =>
  showError(
    "Доступ выдаёт администратор: он добавляет аккаунт в файл accounts.js.",
    "info",
  ),
);

for (const id of ["terms-link", "privacy-link"]) {
  $(id).addEventListener("click", (event) => event.preventDefault());
}

updateSubmit();
