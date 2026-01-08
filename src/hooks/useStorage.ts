
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface UploadResult {
    success: boolean;
    key?: string;
    url?: string;
    error?: string;
}

export function useStorage() {
    const { token } = useAuth();
    const [uploading, setUploading] = useState(false);

    const uploadFile = async (file: File, folder: string = 'uploads'): Promise<UploadResult> => {
        if (!token) {
            toast.error('Você precisa estar logado para fazer upload.');
            return { success: false, error: 'Usuário não autenticado' };
        }

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('folder', folder);

            const response = await fetch('/api/storage/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erro no upload');
            }

            return {
                success: true,
                key: data.key,
                url: data.url
            };

        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Erro desconhecido no upload';
            console.error('Upload failed:', error);
            toast.error(message);
            return {
                success: false,
                error: message
            };
        } finally {
            setUploading(false);
        }
    };

    return {
        uploadFile,
        uploading
    };
}
