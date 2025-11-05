# 🔧 Solução: Erro ao Configurar Nameservers no Registro.br

Se você está tendo problemas ao configurar os nameservers do Vercel no Registro.br, aqui estão as soluções:

## ❌ Problema: Erro ao Configurar Nameservers

O Registro.br pode ter algumas restrições ou exigências específicas para nameservers.

## ✅ Solução 1: Usar DNS Manual (Recomendado para Registro.br)

Em vez de mudar os nameservers, configure os registros DNS diretamente no Registro.br:

### Passo 1: Obter IP do Vercel

1. No Vercel, vá para **Settings** → **Domains**
2. Adicione seu domínio
3. O Vercel vai mostrar os registros DNS necessários
4. Anote o IP fornecido (geralmente algo como `76.76.21.21` ou similar)

### Passo 2: Configurar no Registro.br

1. **Acesse o Registro.br:**
   - Vá para https://registro.br
   - Faça login

2. **Vá para Zona DNS:**
   - Clique em **DNS** → **Zona DNS**
   - Selecione seu domínio

3. **Limpe registros antigos (se houver):**
   - Remova registros A e CNAME antigos que possam conflitar

4. **Adicione Registro A (para domínio raiz):**
   - Tipo: **A**
   - Nome: **@** (ou deixe em branco para domínio raiz)
   - Valor: **76.76.21.21** (use o IP que o Vercel forneceu)
   - TTL: **3600**
   - Salve

5. **Adicione Registro CNAME (para www):**
   - Tipo: **CNAME**
   - Nome: **www**
   - Valor: **cname.vercel-dns.com.** (com ponto no final!)
   - TTL: **3600**
   - Salve

6. **Opcional - Wildcard (para todos os subdomínios):**
   - Tipo: **CNAME**
   - Nome: ***** (asterisco)
   - Valor: **cname.vercel-dns.com.** (com ponto no final!)
   - TTL: **3600**
   - Salve

### Passo 3: Verificar no Vercel

1. No Vercel, adicione o domínio em **Settings** → **Domains**
2. Aguarde a propagação DNS (1-48 horas)
3. O status deve mudar para "Valid"

## ✅ Solução 2: Verificar Nameservers Corretos

Se você realmente quiser usar nameservers, verifique se está usando os corretos:

### Nameservers do Vercel:

```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

**IMPORTANTE:**
- Alguns provedores podem exigir 4 nameservers
- O Registro.br pode ter regras específicas
- Verifique se não há espaços extras ou caracteres incorretos

### Como Configurar Corretamente:

1. No Registro.br, vá para **DNS** → **Alterar Servidores DNS**
2. Digite APENAS:
   ```
   ns1.vercel-dns.com
   ```
   (sem espaços, sem aspas)
3. Clique em adicionar
4. Digite:
   ```
   ns2.vercel-dns.com
   ```
5. Salve

## ✅ Solução 3: Usar DNS do Registro.br com Redirecionamento

Se os nameservers não funcionarem, você pode:

1. Manter os nameservers do Registro.br
2. Configurar apenas os registros A e CNAME conforme Solução 1
3. Não precisa mudar os nameservers

## 🐛 Erros Comuns e Soluções

### Erro: "Nameserver inválido"

**Causa:** Formato incorreto ou nameserver não reconhecido

**Solução:**
- Use o método de DNS manual (Solução 1)
- Verifique se digitou corretamente: `ns1.vercel-dns.com` (sem http:// ou https://)

### Erro: "Servidor DNS não responde"

**Causa:** Nameserver pode estar temporariamente indisponível

**Solução:**
- Use DNS manual (Solução 1)
- Aguarde algumas horas e tente novamente

### Erro: "Já existe um registro"

**Causa:** Registro DNS já existe

**Solução:**
- Remova o registro antigo primeiro
- Depois adicione o novo

### Erro: "Domínio não encontrado"

**Causa:** Domínio não está ativo ou não pertence à sua conta

**Solução:**
- Verifique se o domínio está ativo no Registro.br
- Verifique se você tem permissão para editar DNS

## 📝 Checklist para DNS Manual

- [ ] Registro A configurado para domínio raiz (@)
- [ ] Registro CNAME configurado para www
- [ ] Valor do CNAME termina com ponto (.)
- [ ] Sem registros conflitantes
- [ ] Domínio adicionado no Vercel
- [ ] Aguardando propagação (1-48 horas)

## 🔍 Como Verificar se Está Funcionando

### 1. Verificar DNS:
```bash
# No terminal (Windows)
nslookup seu-dominio.com.br

# No terminal (Mac/Linux)
dig seu-dominio.com.br A
```

### 2. Verificar Online:
- https://www.whatsmydns.net
- Digite seu domínio
- Verifique se os registros A aparecem corretamente

### 3. Verificar no Vercel:
- Vá para **Settings** → **Domains**
- Status deve ser "Valid" após propagação

## ⚠️ Importante

- **DNS Manual funciona perfeitamente** - não é obrigatório usar nameservers do Vercel
- O Registro.br aceita registros A e CNAME normalmente
- HTTPS/SSL funciona automaticamente mesmo com DNS manual
- A propagação pode levar até 48 horas (normalmente 1-2 horas)

## 💡 Recomendação

**Use a Solução 1 (DNS Manual)** - é mais simples e funciona melhor com Registro.br:
- Não precisa mudar nameservers
- Mais controle sobre seus registros DNS
- Menos problemas de compatibilidade
- Funciona perfeitamente com Vercel

## 📞 Precisa de Ajuda?

Se ainda tiver problemas:
1. Verifique os logs de erro específicos no Registro.br
2. Entre em contato com suporte do Registro.br: https://registro.br/atendimento/
3. Verifique se o domínio está ativo e pago

---

**Use DNS Manual (Solução 1) - é mais confiável!** ✅

