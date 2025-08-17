import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from './button';
import { Card, CardContent } from './card';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  onImageRemove?: () => void;
  selectedImage?: string | null;
  className?: string;
  disabled?: boolean;
  maxSize?: number; // in MB
  acceptedTypes?: string[];
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageSelect,
  onImageRemove,
  selectedImage,
  className = '',
  disabled = false,
  maxSize = 5, // 5MB default
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp']
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    setError(null);

    // Check file type
    if (!acceptedTypes.includes(file.type)) {
      setError(`Tipo de arquivo não suportado. Use: ${acceptedTypes.join(', ')}`);
      return false;
    }

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`Arquivo muito grande. Tamanho máximo: ${maxSize}MB`);
      return false;
    }

    return true;
  };

  const handleFileSelect = (file: File) => {
    if (validateFile(file)) {
      onImageSelect(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const handleRemove = () => {
    if (onImageRemove) {
      onImageRemove();
    }
    setError(null);
  };

  return (
    <div className={`w-full ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(',')}
        onChange={handleFileInput}
        className="hidden"
        disabled={disabled}
      />

      {selectedImage ? (
        <Card className="relative overflow-hidden">
          <CardContent className="p-0">
            <div className="relative group">
              <img
                src={selectedImage}
                alt="Preview"
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleRemove}
                  disabled={disabled}
                >
                  <X className="h-4 w-4 mr-2" />
                  Remover
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card
          className={`border-2 border-dashed transition-colors cursor-pointer ${
            dragActive
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:border-primary/50'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <CardContent className="p-8 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 rounded-full bg-muted">
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <p className="text-lg font-medium text-foreground">
                  Clique para fazer upload
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  ou arraste e solte uma imagem aqui
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  PNG, JPG, WEBP até {maxSize}MB
                </p>
              </div>
              <Button variant="outline" disabled={disabled}>
                <Upload className="h-4 w-4 mr-2" />
                Selecionar Imagem
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <p className="text-sm text-destructive mt-2">{error}</p>
      )}
    </div>
  );
};
