
/*
 * RainyStar Reactive — avatar storage interface.
 *
 * This module does not modify the existing overlay.
 * Supabase operations will be enabled only after
 * a verified Supabase Auth session is available.
 */

const MAX_AVATAR_SIZE = 5 * 1024 * 1024;

const AVATAR_TYPES = {
  closed: "closed_image_path",
  open: "open_image_path",
};

function validateAvatarFile(file) {
  if (!(file instanceof File)) {
    throw new Error("Выберите PNG-файл.");
  }

  if (file.type !== "image/png") {
    throw new Error("Поддерживаются только PNG-файлы.");
  }

  if (file.size > MAX_AVATAR_SIZE) {
    throw new Error("Размер PNG не должен превышать 5 МБ.");
  }

  return true;
}

function validateAvatarPaths(paths) {
  if (!paths || typeof paths !== "object") {
    throw new Error("Не указаны пути к аватару.");
  }

  for (const key of Object.keys(AVATAR_TYPES)) {
    const path = paths[key];

    if (
      typeof path !== "string" ||
      path.length === 0 ||
      path.startsWith("/") ||
      path.includes("..")
    ) {
      throw new Error(`Некорректный путь для ${key}.`);
    }
  }

  return true;
}

/*
 * Storage backend is intentionally not connected yet.
 * Do not use browser-provided user IDs as authorization.
 */

async function saveAvatar() {
  throw new Error(
    "Сохранение в Supabase станет доступно после настройки безопасной авторизации."
  );
}

async function loadAvatar() {
  throw new Error(
    "Загрузка из Supabase станет доступна после настройки безопасной авторизации."
  );
}

async function deleteAvatar() {
  throw new Error(
    "Удаление из Supabase станет доступно после настройки безопасной авторизации."
  );
}

window.RainyStarAvatarStorage = Object.freeze({
  validateAvatarFile,
  validateAvatarPaths,
  saveAvatar,
  loadAvatar,
  deleteAvatar,
});
