# ============================================================
# PM2 Ecosystem — Under RP Backend
# Gerencia o processo Node.js em produção no VPS
# ============================================================

module.exports = {
  apps: [
    {
      name: 'underrp-backend',
      script: 'index.js',
      cwd: '/var/www/underrp/server',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env_production: {
        NODE_ENV: 'production',
      },
      // Carrega o .env.production automaticamente
      node_args: '--env-file=.env.production',
      error_file: '/var/log/underrp/err.log',
      out_file: '/var/log/underrp/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
    },
  ],
};
