module.exports = {
  apps: [{
    name: 'web-dashboard',
    script: 'server.js',
    instances: 1,
    autorestart: true,
    watch: false, // Es mejor que Docker gestione los reinicios por cambios de código
  }],
};