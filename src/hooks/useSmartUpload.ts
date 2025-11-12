import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { agentLogger } from '@/lib/logger.agent';

const logger = agentLogger;

export interface UploadOptions {
  bucket: string;
  folder?: string;
  maxSizeMB?: number;
  generateThumbnail?: boolean;
  compress?: boolean;
  onProgress?: (progress: number) => void;
}

export interface UploadResult {
  url: string;
  thumbnailUrl?: string;
  path: string;
  size: number;
  mimeType: string;
}

export const useSmartUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const compressImage = async (file: File, quality: number = 0.8): Promise<File> => {
    try {
      const sharp = await import('sharp');
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const compressed = await sharp.default(buffer)
        .resize(1920, 1920, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: Math.round(quality * 100) })
        .toBuffer();

      return new File([compressed], file.name, { type: 'image/jpeg' });
    } catch (err) {
      logger.warn('Compressão não disponível, usando arquivo original', { error: (err as Error).message });
      return file;
    }
  };

  const generateThumbnail = async (file: File): Promise<File | null> => {
    try {
      const sharp = await import('sharp');
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const thumbnail = await sharp.default(buffer)
        .resize(300, 300, { fit: 'cover' })
        .jpeg({ quality: 80 })
        .toBuffer();

      return new File([thumbnail], `thumb_${file.name}`, { type: 'image/jpeg' });
    } catch (err) {
      logger.warn('Geração de thumbnail não disponível', { error: (err as Error).message });
      return null;
    }
  };

  const upload = useCallback(
    async (file: File, options: UploadOptions): Promise<UploadResult | null> => {
      setUploading(true);
      setProgress(0);
      setError(null);

      try {
        const {
          bucket,
          folder = '',
          maxSizeMB = 10,
          generateThumbnail: shouldGenerateThumbnail = false,
          compress: shouldCompress = true,
          onProgress,
        } = options;

        // Validar tamanho
        const fileSizeMB = file.size / (1024 * 1024);
        if (fileSizeMB > maxSizeMB) {
          throw new Error(`Arquivo muito grande. Máximo: ${maxSizeMB}MB`);
        }

        // Processar arquivo
        let processedFile = file;
        if (shouldCompress && file.type.startsWith('image/')) {
          processedFile = await compressImage(file);
          setProgress(20);
          onProgress?.(20);
        }

        // Gerar thumbnail se necessário
        let thumbnailFile: File | null = null;
        if (shouldGenerateThumbnail && file.type.startsWith('image/')) {
          thumbnailFile = await generateThumbnail(file);
          setProgress(40);
          onProgress?.(40);
        }

        // Upload principal
        const filePath = `${folder ? `${folder}/` : ''}${Date.now()}_${processedFile.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(filePath, processedFile, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) throw uploadError;

        setProgress(70);
        onProgress?.(70);

        // Obter URL pública
        const {
          data: { publicUrl },
        } = supabase.storage.from(bucket).getPublicUrl(filePath);

        let thumbnailUrl: string | undefined;

        // Upload thumbnail se gerado
        if (thumbnailFile) {
          const thumbPath = `${folder ? `${folder}/` : ''}thumb_${Date.now()}_${file.name}`;
          const { error: thumbError } = await supabase.storage.from(bucket).upload(thumbPath, thumbnailFile, {
            cacheControl: '3600',
            upsert: false,
          });

          if (!thumbError) {
            const {
              data: { publicUrl: thumbPublicUrl },
            } = supabase.storage.from(bucket).getPublicUrl(thumbPath);
            thumbnailUrl = thumbPublicUrl;
          }
        }

        setProgress(100);
        onProgress?.(100);

        const result: UploadResult = {
          url: publicUrl,
          thumbnailUrl,
          path: filePath,
          size: processedFile.size,
          mimeType: processedFile.type,
        };

        logger.info('Upload concluído', { path: filePath, size: processedFile.size });
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido no upload';
        setError(errorMessage);
        logger.error('Erro no upload', { error: errorMessage });
        return null;
      } finally {
        setUploading(false);
        setTimeout(() => setProgress(0), 1000);
      }
    },
    [],
  );

  return {
    upload,
    uploading,
    progress,
    error,
  };
};

