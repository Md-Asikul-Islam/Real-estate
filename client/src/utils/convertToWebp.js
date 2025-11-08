// utils/convertToWebp.js
export const convertToWebp = async (file, quality = 0.8) => {
  const blob = await new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(
        (blob) => resolve(blob),
        "image/webp",
        quality // 0.1 - 1.0
      );
    };
    img.src = URL.createObjectURL(file);
  });

  return new File([blob], file.name.replace(/\.\w+$/, ".webp"), {
    type: "image/webp",
  });
};