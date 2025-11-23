# 🖼️ Image Converter 

Una página web moderna para conversión y optimización de imágenes, desarrollada como proyecto de práctica para profundizar en NestJS, TypeScript y React.

## 🚀 Características Principales

### 🔄 Conversión de Formatos
- **Formatos de entrada**: JPEG, JPG, PNG, WebP, GIF, AVIF, TIFF, TIF, SVG
- **Formatos de salida**: JPEG, PNG, WebP, AVIF
- **Control de calidad**: Ajuste granular de compresión (1-95)
- **Redimensionado inteligente**: Límites por formato manteniendo proporciones

### ⚡ Optimización Inteligente
- **Procesamiento eficiente**: Límites de tamaño (5MB) y tiempo (10s)

### 🛡️ Seguridad y Privacidad
- **Procesamiento en memoria**: No se almacenan archivos en disco
- **Rate limiting**: 8 solicitudes por minuto por IP
- **Control de concurrencia**: 1 proceso simultáneo máximo
- **Validación estricta**: Tipado TypeScript en frontend y backend

## 🛠️ Stack Tecnológico

### Backend (NestJS + TypeScript)
- **NestJS** - Framework modular para aplicaciones escalables
- **TypeScript** - Tipado estático end-to-end
- **Sharp** - Procesamiento de imágenes de alto rendimiento
- **Arquitectura modular** - Guards, Pipes y Servicios especializados

### Frontend (React + Vite + TypeScript)
- **React 18** - Componentes funcionales con hooks
- **Vite** - Desarrollo ultrarrápido y builds optimizados
- **TypeScript** - Type-safe en todo el stack
- **Diseño moderno** - Interfaz atractiva con colores vibrantes

## 📊 Configuración de Formatos

Cada formato tiene configuraciones optimizadas:

| Formato | Calidad | Dimensión Máx | Especificaciones |
|---------|---------|---------------|------------------|
| **JPEG** | 75-85 | 1600px | Compresión mozjpeg |
| **PNG** | 80-90 | 1400px | Nivel 8, esfuerzo 4 |
| **WebP** | 75-85 | 1500px | Esfuerzo 3 |
| **AVIF** | 60-75 | 1200px | Esfuerzo 2 |

## 🌐 Deployment

**✅ Actualmente desplegado en Render**  

## 💡 Motivación del Proyecto
Como desarrolladores, frecuentemente necesitamos optimizar imágenes para web. Este proyecto nació de la necesidad de crear una herramienta práctica mientras se profundizaba en tecnologías modernas. La combinación de NestJS con TypeScript en el backend y React con Vite en el frontend demostró ser extremadamente efectiva para desarrollar aplicaciones robustas y mantenibles.

Procesamiento 100% en memoria - Tu privacidad está garantizada. Las imágenes se procesan temporalmente y se eliminan inmediatamente después de la conversión.

Desarrollado con ❤️ como parte del journey de aprendizaje en tecnologías modernas de desarrollo web
