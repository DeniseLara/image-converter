import './FileConverter.css';
import { useState, useCallback } from 'react';
import { useFileConverter } from './hooks/useFileConverter';
import { OutputImageFormat } from './types/conversion.type';
import { Zap, Shield, RefreshCw, FileImage, ShieldCheck } from 'lucide-react';

import Dropzone from './components/Dropzone';
import FileInfo from './components/FileInfo';
import ConversionOptions from './components/ConversionOptions';

export default function FileConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<OutputImageFormat>('webp');
  const [quality, setQuality] = useState(75);
  const { 
    convertImage, 
    optimizeImage, 
    isLoading, 
    error, 
    validateFileSize,
    validateFileType, 
    setError,
    handleDownloadFile, 
  } = useFileConverter();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];

      // Validación en cascada: primero tipo, luego tamaño
      if (!validateFileType(selectedFile)) {
        setFile(null);
        return;
      }
      
      if (!validateFileSize(selectedFile)) {
        setFile(null);
        return;
      }
      
      setFile(selectedFile);
    }
  }, [validateFileSize, validateFileType]); 

  const handleRemoveFile = useCallback(() => {
    setFile(null)
    setFormat('webp')
    setQuality(75)
    setError(null)
  }, [setError])

  const handleConvert = async () => {
    if (!file) return;

    const result = await convertImage(file, { format, quality });
    handleDownloadFile(result.blob, `converted.${format}`);
  };

  const handleOptimize = async () => {
    if (!file) return;

    const result = await optimizeImage(file, quality);
    handleDownloadFile(result.blob, `optimized_${file.name}`);
  };

  const features = [
    { icon: Shield, text: 'Procesamiento local y seguro' },
    { icon: Zap, text: 'Conversión instantánea' },
    { icon: FileImage, text: 'Múltiples formatos' }
  ];

  return (
    <section className="file-converter-container">
      <div className="file-converter-wrapper">
        <header className="file-converter-header">
          <div className='icon__container'>
            <RefreshCw className='icon' strokeWidth={2.5} />
          </div>
          <h1 className="file-converter-title">
            Conversor de Imágenes
          </h1>
          <p className="file-converter-subtitle">
            Convierte y optimiza tus imágenes en segundos. Rápido y seguro.
          </p>
        </header>

        <ul className='features-grid'>
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <li 
                key={idx}
                className='feature-card'              
              >
                <div className='icon-box'>
                  <Icon />
                </div>
                <span>{feature.text}</span>
              </li>
            );
          })}
        </ul>

        <Dropzone 
          onDrop={onDrop}
          isLoading={isLoading}
          hasFile={!!file}
        />

        {file && <FileInfo file={file} onRemove={handleRemoveFile}/>}

        {file && 
        <ConversionOptions
            format={format}
            quality={quality}
            isLoading={isLoading}
            onFormatChange={setFormat}
            onQualityChange={setQuality}
            onConvert={handleConvert}
            onOptimize={handleOptimize}
        />
        }

        {error && (
          <div className="error-message">
            <p className="error-text">{error}</p>
          </div>
        )}

        <div className="footer">
          <p className="footer-text">
            <ShieldCheck size={16} strokeWidth={1.5} />
            Todo el procesamiento se realiza en memoria. No se almacenan archivos.
          </p>
        </div>
      </div>
    </section>
  );
};