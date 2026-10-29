
/*
 * RainyStar Reactive — avatar storage.
 * Local mode only. Supabase is not connected yet.
 */

(() => {
  "use strict";

  const MAX_AVATAR_SIZE = 5 * 1024 * 1024;

  const KEYS = {
    closed: "rsr_closed_png",
    open: "rsr_open_png",
  };

  function validateAvatarFile(file) {
    if (!(file instanceof File)) {
      throw new Error("Выбери PNG-файл.");
    }

    if (file.type !== "image/png") {
      throw new Error("Поддерживаются только PNG-файлы.");
    }

    if (file.size > MAX_AVATAR_SIZE) {
      throw new Error("Размер каждого PNG не должен превышать 5 МБ.");
    }

    return true;
  }

  function readAsDataURL(file) {
    validateAvatarFile(file);

    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (typeof reader.result !== "string") {
          reject(new Error("Не удалось прочитать PNG."));
          return;
        }

        resolve(reader.result);
      };

      reader.onerror = () => {
        reject(new Error("Ошибка чтения PNG."));
      };

      reader.readAsDataURL(file);
    });
  }

  function getStorage() {
    try {
      const storage = window.localStorage;
      const testKey = "__rsr_storage_test__";

      storage.setItem(testKey, "1");
      storage.removeItem(testKey);

      return storage;
    } catch {
      throw new Error(
        "Локальное хранилище недоступно в этом браузере."
      );
    }
  }

  async function saveAvatar(files) {
    if (!files || !files.closed || !files.open) {
      throw new Error(
        "Нужны оба файла: closed и open."
      );
    }

    const [closedData, openData] = await Promise.all([
      readAsDataURL(files.closed),
      readAsDataURL(files.open),
    ]);

    const storage = getStorage();

    try {
      // Save both images together, restoring previous values
      // if the second write fails.
      const previousClosed = storage.getItem(KEYS.closed);
      const previousOpen = storage.getItem(KEYS.open);

      try {
        storage.setItem(KEYS.closed, closedData);
        storage.setItem(KEYS.open, openData);
      } catch (error) {
        if (previousClosed === null) {
          storage.removeItem(KEYS.closed);
        } else {
          storage.setItem(KEYS.closed, previousClosed);
        }

        if (previousOpen === null) {
          storage.removeItem(KEYS.open);
        } else {
          storage.setItem(KEYS.open, previousOpen);
        }

        throw error;
      }
    } catch (error) {
      if (error instanceof Error &&
          error.message.includes("локальное хранилище")) {
        throw error;
      }

      throw new Error(
        "Не удалось сохранить PNG. Возможно, в браузере недостаточно места."
      );
    }

    return { saved: true, backend: "local" };
  }

  function loadAvatar() {
    const storage = getStorage();

    return {
      closed: storage.getItem(KEYS.closed),
      open: storage.getItem(KEYS.open),
      backend: "local",
    };
  }

  function deleteAvatar() {
    const storage = getStorage();

    storage.removeItem(KEYS.closed);
    storage.removeItem(KEYS.open);

    return { deleted: true, backend: "local" };
  }

  async function saveToSupabase() {
    throw new Error(
      "Supabase Storage пока отключён: сначала нужна безопасная авторизация."
    );
  }

  window.RainyStarAvatarStorage = Object.freeze({
    validateAvatarFile,
    saveAvatar,
    loadAvatar,
    deleteAvatar,
    saveToSupabase,
  });
})();
