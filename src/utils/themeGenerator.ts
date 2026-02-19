
// Gera um número hash a partir de uma string/id
function getHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
}

// Converte HSL para Hex (opcional) ou retorna string CSS HSL
// Usaremos HSL diretamente no CSS para facilitar manipulação de luminosidade
export function generateThemeFromId(id: string | number) {
    const hash = getHash(String(id));

    // Matiz (Hue): 0-360
    const h = Math.abs(hash % 360);

    // Saturação: 60-90% para garantir cores vivas
    const s = 60 + (Math.abs(hash % 30));

    // Luminosidade: 40-50% para garantir contraste com texto branco
    const l = 40 + (Math.abs(hash % 10));

    return {
        primary: `hsl(${h}, ${s}%, ${l}%)`,
        primaryHover: `hsl(${h}, ${s}%, ${l - 10}%)`, // Mais escuro
        primaryLight: `hsl(${h}, ${s}%, 95%)`, // Fundo bem claro
        secondary: `hsl(${(h + 180) % 360}, ${s}%, ${l}%)`, // Complementar
    };
}
