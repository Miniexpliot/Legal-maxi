import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
try {
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
  ).toString();
} catch {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '4.10.38'}/pdf.worker.min.mjs`;
}

const getApiBase = () => {
  const envUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL;
  if (!envUrl) return '/api';
  const clean = envUrl.replace(/\/$/, '');
  return clean.endsWith('/api') ? clean : `${clean}/api`;
};

const parseViaServer = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${getApiBase()}/parse-file`, {
      method: 'POST',
      body: formData,
      signal: AbortSignal.timeout(15000)
    });
    if (res.ok) {
      const data = await res.json();
      if (data.text && data.text.trim().length > 0) {
        return data.text.trim();
      }
    }
  } catch (err) {
    console.warn("Server document parser unavailable:", err.message);
  }
  return null;
};

export const parseDocumentFile = async (file) => {
  if (!file) throw new Error("No file provided.");

  const fileType = file.type || '';
  const fileName = file.name.toLowerCase();

  if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
    return await extractPdfText(file);
  } else if (fileName.endsWith('.docx') || fileName.endsWith('.doc')) {
    const serverResult = await parseViaServer(file);
    if (serverResult) return serverResult;
    throw new Error("Unable to parse Word (.docx) document. Please ensure the backend is connected or paste the text directly.");
  } else {
    return await extractPlainText(file);
  }
};

const extractPlainText = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      resolve(event.target.result);
    };
    reader.onerror = (error) => {
      reject(new Error("Failed to read text file: " + error.message));
    };
    reader.readAsText(file);
  });
};

const extractPdfText = async (file) => {
  // 1. Try client-side PDF.js first
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageStrings = content.items.map(item => item.str);
      const pageText = pageStrings.join(' ').trim();
      if (pageText) {
        fullText += `--- Page ${i} ---\n` + pageText + '\n\n';
      }
    }

    if (fullText.trim().length > 30) {
      return fullText.trim();
    }
  } catch (err) {
    console.warn("Client-side PDF.js extraction failed:", err);
  }

  // 2. Try Server-side PyPDF extraction
  const serverText = await parseViaServer(file);
  if (serverText && serverText.length > 30) {
    return serverText;
  }

  // 3. Fallback to plain text check if not binary
  const rawText = await extractPlainText(file);
  if (rawText && !rawText.startsWith('%PDF') && rawText.trim().length > 30) {
    return rawText;
  }

  throw new Error("Unable to extract text from this PDF. If this document is a scanned image, please upload a searchable PDF or paste the text directly.");
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};
