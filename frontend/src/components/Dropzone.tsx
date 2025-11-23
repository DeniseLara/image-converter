import './Dropzone.css'
import { useDropzone } from 'react-dropzone';
import { FileUp, UploadCloud } from 'lucide-react';

interface DropzoneProps {
  onDrop: (acceptedFiles: File[]) => void;
  isLoading: boolean
  hasFile?: boolean
}

export default function Dropzone({ isLoading, onDrop, hasFile }: DropzoneProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      onDrop(acceptedFiles);
    },
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp', '.bmp', '.tiff']
    },
    maxSize: 5 * 1024 * 1024, 
    multiple: false
  });


  return(
    <div
      {...getRootProps()}
      className={`dropzone-container ${isDragActive ? 'dropzone-active' : ''} ${isLoading ? 'dropzone-disabled' : ''}`}
      aria-busy={isLoading ? 'true' : 'false'}
    >
      <input {...getInputProps()} disabled={isLoading} />
      <div className="dropzone-icon">
      {isDragActive ? (
        <UploadCloud size={42} strokeWidth={1.5} />
      ) : (
        <FileUp size={42} strokeWidth={1.5} />
      )}
      </div>
      
      {isLoading ? (
        <p className="dropzone-text-primary">Procesando imagen...</p>
      ) : isDragActive ? (
        <p className="dropzone-text-active">Suelta el archivo aquí...</p>
      ) : hasFile ? (
        <div>
          <p className="dropzone-text-primary">
            Arrastra otra imagen o haz clic para reemplazar
          </p>
          <p className="dropzone-text-secondary">
            Máximo 5MB • JPEG, PNG, WebP, Gif, Avif, etc.
          </p>
        </div>
      ) : (
        <div>
          <p className="dropzone-text-primary">
            Arrastra una imagen o haz clic
          </p>
          <p className="dropzone-text-secondary">
            Máximo 5MB • JPEG, PNG, WebP, Gif, Avif, etc.
          </p>
        </div>
      )}
    </div>
  );
}