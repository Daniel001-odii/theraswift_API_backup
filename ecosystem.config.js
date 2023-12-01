module.exports = {
  apps: [
    {
      name: "Backend App",
      script: "index.js",
      instances: 4,
      autorestart: true,  
    },
  ],
};
