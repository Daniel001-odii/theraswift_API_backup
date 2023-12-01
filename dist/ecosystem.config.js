module.exports = {
  apps: [
    {
      name: "Backend App",
      script: "dist/index.js",
      instances: 4,
      autorestart: true,  
    },
  ],
};
