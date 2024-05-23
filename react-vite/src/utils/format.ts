export const trimText = (txt: string) => {
  return txt.length > 20 ? txt.slice(0, 22) + "..." : txt;
};
export const copyText = async () => {
  if (navigator.clipboard) {
    await navigator.clipboard.readText();
    console.log("copied text");
  }
};
