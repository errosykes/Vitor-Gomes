
import React, { useState, useRef } from 'react';
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from 'react-image-crop';
import { Check, X } from 'lucide-react';

interface ImageCropModalProps {
    isOpen: boolean;
    onClose: () => void;
    imageSrc: string | null;
    onSave: (croppedImage: string) => void;
}

function getCroppedImg(image: HTMLImageElement, crop: Crop): string {
  const canvas = document.createElement('canvas');
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  
  // Calculate the actual size of the crop in the original image's pixels
  // This prevents the image from being downscaled to the visual size of the crop box
  const pixelWidth = Math.floor(crop.width * scaleX);
  const pixelHeight = Math.floor(crop.height * scaleY);

  canvas.width = pixelWidth;
  canvas.height = pixelHeight;
  
  const ctx = canvas.getContext('2d');

  if (!ctx) {
      throw new Error('Could not get canvas context');
  }

  // Ensure high quality scaling
  ctx.imageSmoothingQuality = 'high';

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    pixelWidth,
    pixelHeight,
  );

  return canvas.toDataURL('image/png');
}

export const ImageCropModal: React.FC<ImageCropModalProps> = ({ isOpen, onClose, imageSrc, onSave }) => {
    const [crop, setCrop] = useState<Crop>();
    const imgRef = useRef<HTMLImageElement>(null);

    function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
        const { width, height } = e.currentTarget;
        const newCrop = centerCrop(
            makeAspectCrop(
                {
                    unit: '%',
                    width: 90,
                },
                1 / 1,
                width,
                height
            ),
            width,
            height
        );
        setCrop(newCrop);
    }

    const handleSaveClick = () => {
        if (imgRef.current && crop?.width && crop?.height) {
            const croppedImageUrl = getCroppedImg(imgRef.current, crop);
            onSave(croppedImageUrl);
        }
    };

    if (!isOpen || !imageSrc) return null;

    return (
         <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div
                className="bg-white rounded-xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800">Ajustar Foto do Treinador</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        <X size={24} />
                    </button>
                </header>
                <div className="p-4 bg-gray-100 flex justify-center items-center">
                    <ReactCrop
                        crop={crop}
                        onChange={c => setCrop(c)}
                        aspect={1}
                        circularCrop
                    >
                       <img
                         ref={imgRef}
                         src={imageSrc}
                         alt="Crop preview"
                         onLoad={onImageLoad}
                         style={{ maxHeight: '70vh' }}
                       />
                    </ReactCrop>
                </div>
                 <footer className="p-4 bg-gray-50 border-t flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSaveClick}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
                    >
                       <Check size={18} />
                       Salvar Ajustes
                    </button>
                </footer>
            </div>
        </div>
    );
};
