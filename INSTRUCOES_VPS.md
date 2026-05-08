# Guia de Instalação do Backend UnderRP na VPS

Este guia contém os passos necessários para configurar o backend do site UnderRP na VPS (Ubuntu/Debian) usando Nginx, PM2 e SSL.

## 1. Pré-requisitos na VPS
Certifique-se de que a VPS possui os seguintes componentes instalados:
- **Node.js** (v18 ou superior)
- **NPM**
- **PM2** (`npm install -g pm2`)
- **Nginx**
- **Certbot** (`sudo apt install certbot python3-certbot-nginx`)

## 2. Configurar o Subdomínio e DNS
Antes de iniciar na VPS, certifique-se de que o dono do domínio (na Hostgator) criou o subdomínio apontando para a VPS:
- **Nome:** `api.underrp.com.br`
- **Tipo:** `A`
- **Destino:** `82.21.8.140`

## 3. Upload e Preparação dos Arquivos
1. Crie uma pasta para o backend, por exemplo: `/var/www/underrp-api`
2. Envie o conteúdo do arquivo `backend-vps.zip` para dentro desta pasta.
3. Acesse a pasta no terminal e instale as dependências:
   ```bash
   cd /var/www/underrp-api
   npm install
   ```
4. Verifique se o arquivo `.env.production` está presente e correto. **Renomeie ele para `.env`**:
   ```bash
   mv .env.production .env
   ```

## 4. Iniciar o Servidor com PM2
Dentro da pasta `/var/www/underrp-api`, inicie o processo do backend:
```bash
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```
O backend passará a rodar internamente na porta `3001`.

## 5. Configurar o Nginx e SSL
O backend precisa ser acessível via HTTPS para que o frontend não bloqueie as requisições (Mixed Content).

1. Crie um arquivo de configuração no Nginx:
   ```bash
   sudo nano /etc/nginx/sites-available/underrp-api
   ```
2. Cole o seguinte conteúdo básico:
   ```nginx
   server {
       listen 80;
       server_name api.underrp.com.br;

       location / {
           proxy_pass http://127.0.0.1:3001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
3. Ative o site e reinicie o Nginx:
   ```bash
   sudo ln -s /etc/nginx/sites-available/underrp-api /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```
4. Gere o certificado SSL automaticamente com o Certbot:
   ```bash
   sudo certbot --nginx -d api.underrp.com.br
   ```

## 6. Configurar o Discord OAuth2 (Importante!)
Para que o login com Discord funcione no novo endereço, o desenvolvedor precisa ir no **Discord Developer Portal** (na aplicação do UnderRP) e adicionar a seguinte URL de redirecionamento (Redirect URI):
- `https://api.underrp.com.br/auth/discord/callback`

## 7. Configurar a API da Steam (Opcional, se usar login via Steam)
A URL de retorno da Steam também precisa ser configurada na chave da Steam se houver verificação restrita:
- `https://api.underrp.com.br/auth/steam/return`

---
✅ Após esses passos, a API estará rodando segura em `https://api.underrp.com.br` e o frontend conseguirá se conectar sem problemas!
