import axios from 'axios';

// Utility helper to handle compression & upload
export const compressAndUpload = (file, maxWidth) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = async () => {
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.75);

        try {
          const blob = await fetch(dataUrl).then((r) => r.blob());
          const formData = new FormData();
          formData.append('image', blob, file.name);

          const res = await axios.post('/api/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          resolve(res.data.url);
        } catch (err) {
          console.error('Image upload failed, using dataURL', err);
          resolve(dataUrl); // fallback base64
        }
      };
      img.onerror = () => {
        alert('Error loading image. Please try another file.');
        resolve('');
      };
      img.src = e.target.result;
    };
    reader.onerror = () => {
      alert('Error reading file. Please try again.');
      resolve('');
    };
    reader.readAsDataURL(file);
  });
};
