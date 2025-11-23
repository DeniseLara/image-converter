import './FileInfo.css'
import { X } from "lucide-react"

type FileInfoProps = {
  file: File
  onRemove: () => void
}

export default function FileInfo({ file, onRemove }: FileInfoProps) {
  return(
    <div className="file-info">
      <button 
        className="remove-button"
        onClick={onRemove}
        type="button"
        aria-label="Eliminar archivo"
      >
        <X size={19} />
      </button>
            
      <p className="file-info-name">
        ✓ {file.name}
      </p>
      <p className="file-info-size">
        Tamaño: {(file.size / 1024 / 1024).toFixed(2)} MB
      </p>
    </div>
  )
}