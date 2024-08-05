export const format = {
  parsePlur: (n: number) => {
    return n * 10 ** 16;
  },
  parsexBZZ: (n: number) => {
    return n * 1e18;
  },
  formatPlur: (n: number) => {
    return n / 10 ** 16;
  },
  copyText: async (txt: string) => {
    return new Promise((res, rej) => {
      if (navigator.clipboard) {
        navigator.clipboard
          .writeText(txt)
          .then(() => res(true))
          .catch((err) => rej(err));
      } else {
        // fallback
        const txtarea = document.createElement("textarea");
        txtarea.value = txt;
        document.body.appendChild(txtarea);
        txtarea.select();

        try {
          document.execCommand("copy");
          res(true);
        } catch (err) {
          document.removeChild(txtarea);
          rej(err);
        }
      }
    });
  },
  trimText: (txt: string) => {
    return txt.length > 16
      ? txt.slice(0, 10) + "..." + txt.substring(txt.length - 10)
      : txt;
  },
};
