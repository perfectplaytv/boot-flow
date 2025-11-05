# 🌐 Guia: Configurar Domínio do Registro.br no Vercel

Este guia vai te ajudar a conectar seu domínio brasileiro (.br) do Registro.br ao Vercel.

## 📋 Pré-requisitos

1. ✅ Conta no Registro.br ativa
2. ✅ Domínio registrado e ativo
3. ✅ Projeto já deployado no Vercel
4. ✅ Acesso ao painel de controle do Registro.br

## 🚀 Passo 1: Obter as Configurações DNS no Vercel

1. **Acesse o Dashboard do Vercel:**
   - Vá para https://vercel.com
   - Faça login
   - Selecione seu projeto

2. **Vá para Configurações de Domínio:**
   - Clique em **Settings** (Configurações)
   - Clique em **Domains** (Domínios)
   - Clique em **Add Domain** (Adicionar Domínio)

3. **Digite seu domínio:**
   - Digite seu domínio completo (ex: `seu-site.com.br`)
   - Clique em **Add**

4. **Copie as configurações DNS:**
   - O Vercel vai mostrar os registros DNS que você precisa configurar
   - Você verá algo como:
     ```
     Tipo: A
     Nome: @
     Valor: 76.76.21.21 (exemplo)
     
     Tipo: CNAME
     Nome: www
     Valor: cname.vercel-dns.com.
     ```

## 🔧 Passo 2: Configurar DNS no Registro.br

### Opção A: Usar DNS do Vercel (Recomendado)

1. **Acesse o Registro.br:**
   - Vá para https://registro.br
   - Faça login com suas credenciais

2. **Vá para Gerenciamento de DNS:**
   - No menu lateral, clique em **DNS**
   - Selecione seu domínio

3. **Configure os Servidores DNS:**
   - Clique em **Alterar Servidores DNS**
   - Configure para usar os servidores DNS do Vercel:
     ```
     ns1.vercel-dns.com
     ns2.vercel-dns.com
     ```
   - Salve as alterações

4. **Aguarde a Propagação:**
   - Pode levar de 5 minutos a 48 horas
   - Normalmente leva 1-2 horas

### Opção B: Usar DNS do Registro.br (Método Manual)

1. **Acesse o Registro.br:**
   - Vá para https://registro.br
   - Faça login

2. **Vá para Zona DNS:**
   - Clique em **DNS** → **Zona DNS**
   - Selecione seu domínio

3. **Adicione os Registros DNS:**
   
   **Para domínio raiz (exemplo.com.br):**
   - Clique em **Adicionar Registro**
   - Tipo: **A**
   - Nome: **@** (ou deixe em branco)
   - Valor: Pegue o IP do Vercel (veja no painel do Vercel)
   - TTL: **3600** (ou padrão)
   - Salve

   **Para subdomínio www (www.exemplo.com.br):**
   - Clique em **Adicionar Registro**
   - Tipo: **CNAME**
   - Nome: **www**
   - Valor: **cname.vercel-dns.com.** (com ponto no final)
   - TTL: **3600**
   - Salve

   **Para subdomínio wildcard (opcional):**
   - Clique em **Adicionar Registro**
   - Tipo: **CNAME**
   - Nome: ***** (asterisco)
   - Valor: **cname.vercel-dns.com.** (com ponto no final)
   - TTL: **3600**
   - Salve

4. **Remova Registros Conflitantes:**
   - Verifique se não há outros registros A ou CNAME conflitantes
   - Remova se necessário

## ✅ Passo 3: Verificar no Vercel

1. **No Dashboard do Vercel:**
   - Vá para **Settings** → **Domains**
   - Você verá o status do domínio:
     - 🟡 **Pending** = Aguardando propagação DNS
     - 🟢 **Valid** = Domínio configurado corretamente
     - 🔴 **Invalid** = Problema na configuração

2. **Aguarde a Propagação:**
   - DNS pode levar até 48 horas para propagar
   - Normalmente leva 1-2 horas no Brasil
   - Você pode verificar o status em: https://www.whatsmydns.net

## 🔍 Passo 4: Verificar Propagação DNS

Use estas ferramentas para verificar se o DNS propagou:

1. **WhatsMyDNS:**
   - https://www.whatsmydns.net
   - Digite seu domínio
   - Verifique se os registros A e CNAME estão corretos

2. **DNS Checker:**
   - https://dnschecker.org
   - Verifique a propagação global

3. **Via Terminal (opcional):**
   ```bash
   # Verificar registro A
   dig exemplo.com.br A
   
   # Verificar registro CNAME
   dig www.exemplo.com.br CNAME
   ```

## 🐛 Troubleshooting

### Domínio não está funcionando após 24 horas

**Solução:**
1. Verifique se os registros DNS estão corretos no Registro.br
2. Verifique se não há registros conflitantes
3. Aguarde mais algumas horas (pode levar até 48 horas)
4. Entre em contato com o suporte do Registro.br se necessário

### Erro "Invalid Configuration" no Vercel

**Solução:**
1. Verifique se os registros DNS estão corretos
2. Certifique-se de que o ponto final está no valor do CNAME (ex: `cname.vercel-dns.com.`)
3. Verifique se não há registros conflitantes
4. Remova e adicione o domínio novamente no Vercel

### Domínio redireciona para outra página

**Solução:**
1. Verifique se o domínio está configurado corretamente no Vercel
2. Verifique se não há redirecionamentos configurados no Registro.br
3. Limpe o cache do navegador (Ctrl+Shift+Delete)

### SSL/HTTPS não está funcionando

**Solução:**
1. O Vercel fornece SSL automaticamente via Let's Encrypt
2. Pode levar até 24 horas após a configuração do DNS
3. Verifique se o domínio está marcado como "Valid" no Vercel

### Erro "DNS_PROBE_FINISHED_NXDOMAIN"

**Solução:**
1. O DNS ainda não propagou completamente
2. Aguarde mais algumas horas
3. Verifique os registros DNS no Registro.br
4. Limpe o cache DNS do seu computador:
   ```bash
   # Windows
   ipconfig /flushdns
   
   # Mac/Linux
   sudo dscacheutil -flushcache
   ```

## 📝 Checklist Final

- [ ] Domínio adicionado no Vercel
- [ ] Registros DNS configurados no Registro.br
- [ ] Aguardado tempo de propagação (1-48 horas)
- [ ] Domínio mostra status "Valid" no Vercel
- [ ] Site acessível via domínio personalizado
- [ ] SSL/HTTPS funcionando automaticamente

## 🔐 Configuração de HTTPS/SSL

O Vercel fornece **SSL automático** via Let's Encrypt:
- ✅ Certificado gratuito
- ✅ Renovação automática
- ✅ Suporte a HTTPS
- ✅ Ativado automaticamente após DNS propagar

Não é necessário configurar nada manualmente!

## 🌍 Configuração de Subdomínios

Se quiser adicionar subdomínios (ex: `app.exemplo.com.br`):

1. No Vercel, vá para **Settings** → **Domains**
2. Clique em **Add Domain**
3. Digite o subdomínio completo (ex: `app.exemplo.com.br`)
4. Configure o registro DNS no Registro.br:
   - Tipo: **CNAME**
   - Nome: **app** (ou o nome do subdomínio)
   - Valor: **cname.vercel-dns.com.** (com ponto no final)

## 📚 Recursos Úteis

- [Documentação do Vercel sobre Domínios](https://vercel.com/docs/concepts/projects/domains)
- [Guia do Registro.br sobre DNS](https://registro.br/dominio/dns/)
- [Suporte do Registro.br](https://registro.br/atendimento/)

---

**Pronto!** Seu domínio brasileiro está configurado no Vercel! 🎉

Após a propagação DNS (normalmente 1-2 horas), seu site estará acessível via seu domínio personalizado com HTTPS automático.

