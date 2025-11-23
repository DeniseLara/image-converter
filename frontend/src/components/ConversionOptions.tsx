import './ConversionOptions.css'
import { OutputImageFormat } from "../types/conversion.type";
import { Wand2 } from "lucide-react";

interface ConversionOptionsProps {
  format: OutputImageFormat;
  quality: number;
  isLoading: boolean;
  onFormatChange: (format: OutputImageFormat) => void;
  onQualityChange: (quality: number) => void;
  onConvert: () => void;
  onOptimize: () => void;
}

export default function ConversionOptions({ 
  format, 
  quality, 
  isLoading, 
  onFormatChange, 
  onQualityChange, 
  onConvert, 
  onOptimize
}: ConversionOptionsProps) {

  return(
    <div className="options-section">
      <div className="options-grid">
        <div>
          <label className="form-label" htmlFor='format-select'>Formato</label>
            <select
              id='format-select'
              value={format}
              onChange={(e) => onFormatChange(e.target.value as any)}
              className="form-select"
              disabled={isLoading}
            >
              <option value="webp">WebP</option>
              <option value="jpeg">JPEG</option>
              <option value="png">PNG</option>
              <option value="avif">AVIF</option>
            </select>
        </div>

        <div>
          <label className="quality-label" htmlFor="quality-slider">Calidad: {quality}%</label>
            <input
              id='quality-slider'
              type="range"
              min="10"
              max="95"
              value={quality}
              onChange={(e) => onQualityChange(Number(e.target.value))}
              className="quality-slider"
              disabled={isLoading}
            />
        </div>
      </div>

      <div className="buttons-container">
        <button
          onClick={onConvert}
          disabled={isLoading}
          className="btn btn-convert"
        >
          {isLoading ? 'Procesando...' : 'Convertir'}
        </button>

        <button
          onClick={onOptimize}
          disabled={isLoading}
          className="btn btn-optimize"
        >
          <Wand2 size={18} strokeWidth={2} />
          Optimizar
        </button>
      </div>
    </div>
  );
}