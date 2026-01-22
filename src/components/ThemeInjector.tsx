
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { generateThemeFromId } from '@/utils/themeGenerator';

export function ThemeInjector() {
    const { user } = useAuth();

    useEffect(() => {
        // Regra: Só aplicar se for revendedor e tiver ID
        if (user && user.role === 'reseller' && user.id) {
            const theme = generateThemeFromId(user.id);

            const root = document.documentElement;

            // Injeta as cores como variáveis CSS globais
            // Isso sobrescreve as variáveis do Tailwind se configurado corretamente
            // Para shadcn, --primary é geralmente HSL space-separated (e.g., 222.2 47.4% 11.2%)
            // Vamos tentar ajustar para o formato do shadcn se necessário

            // Format for standard CSS var usage:
            // root.style.setProperty('--primary', theme.primary);

            // Se o projeto usa HSL colors no tailwind configurado como 'hsl(var(--primary))':
            // Então --primary deve ser o valor completo 'hsl(...)' ou apenas os números dependendo da config.
            // Dado que não vi o tailwind.config, vou assumir injetar a cor HSL completa como override.

            // Tentativa segura: injetar como string completa
            root.style.setProperty('--primary', theme.primary);
            root.style.setProperty('--ring', theme.primary);

            console.log(`[Theme] Colors applied for Reseller ${user.id}`, theme);
        } else {
            // Reset se não for reseller (opcional)
            const root = document.documentElement;
            root.style.removeProperty('--primary');
            root.style.removeProperty('--ring');
        }
    }, [user]);

    return null; // Componente visualmente nulo
}
