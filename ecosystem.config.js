module.exports = {
  apps: [
    {
      name: "Backend App",
      script: "index.js",
      instances: 1,
      autorestart: true,  
    },
  ],
};
