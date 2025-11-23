import { useState } from 'react';
import { ConversionOptions, OutputImageFormat } from '../types/conversion.type';

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

const API_URL = import.meta.env.VITE_API_URL

export function useFileConverter() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownloadFile = (blob: Blob, filename: string) => {
    try {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError('No se pudo descargar el archivo. Inténtalo de nuevo.');
    }
  };

  // Nueva función para la validación de tamaño en el frontend
  const validateFileSize = (file: File): boolean => {
    setError(null);

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError(
        `Archivo demasiado grande: ${(file.size / 1024 / 1024).toFixed(2)}MB. Máximo permitido: 5MB.`
      );
      return false;
    }

    if (file.size === 0) {
      setError('El archivo está vacío.');
      return false;
    }

    return true;
  };

  const validateFileType = (file: File): boolean => {
    const allowedMimeTypes = [
        'image/jpeg', 
        'image/png', 
        'image/webp', 
        'image/gif',
        'image/avif'
    ];
    
    if (!allowedMimeTypes.includes(file.type)) {
      setError('Tipo de archivo no compatible. Usa JPEG, PNG, WebP, GIF o AVIF.');
      return false;
    }
    
    return true;
  };

  const apiCall = async (endpoint: string, file: File, options?: any) => {
    setIsLoading(true);
    setError(null);

    // Validaciones previas
    if (!validateFileType(file)) {
      setIsLoading(false);
      throw new Error('Tipo de archivo no compatible. Usa JPEG, PNG, WebP, GIF o AVIF.');
    }

    const formData = new FormData();
    formData.append('file', file);
    
    if (options) {
      Object.keys(options).forEach(key => {
        formData.append(key, options[key].toString());
      });
    }

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        body: formData,
      });


      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error en el servidor');
      }

      const blob = await response.blob();

      // Verificar que el blob no esté vacío
      if (blob.size === 0) {
        throw new Error('El archivo resultante está vacío.');
      }
      
      const outputFormat = response.headers.get('X-Output-Format') as OutputImageFormat;
      
      return {
        blob,
        originalSize: response.headers.get('X-Original-Size'),
        newSize: response.headers.get('X-New-Size'),
        savings: response.headers.get('X-Savings-Percent'),
        format: outputFormat
      };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const convertImage = (file: File, options: ConversionOptions) =>
    apiCall('/convert', file, options);

  const optimizeImage = (file: File, quality: number = 70) =>
    apiCall('/optimize', file, { quality });

  const getImageInfo = (file: File) =>
    apiCall('/info', file);

  return {
    convertImage,
    optimizeImage,
    getImageInfo,
    isLoading,
    error,
    validateFileSize,
    validateFileType,
    setError,
    handleDownloadFile
  };
};