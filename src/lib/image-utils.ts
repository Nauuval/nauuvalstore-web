/**
 * Utility untuk mengompres dan mengonversi file gambar dari perangkat
 * menjadi data URL base64 yang ringan agar cepat dimuat dan hemat storage.
 */
export function compressImageFile(file: File, maxWidth = 1000, quality = 0.78): Promise<string> {
  return new Promise((resolve, reject) => {
    // Validasi tipe file
    if (!file.type.startsWith('image/')) {
      reject(new Error('File yang dipilih bukan gambar.'));
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Skala proporsional jika lebih besar dari maxWidth
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(img.src);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        // Konversi ke format JPEG dengan kompresi berkualitas
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedBase64);
      };

      img.onerror = (err) => reject(err);
    };

    reader.onerror = (err) => reject(err);
  });
}
