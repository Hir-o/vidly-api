module.exports = {
    apps : [
        {
          name: "vidly",
          script: "./app.js",
          watch: true,
          env: {
            "PORT": 3000,
            "NODE_ENV": "development",
            "JWT_KEY": "vidly_jwtPrivateKey",
          },
          env_production: {
            "PORT": 3000,
            "NODE_ENV": "production",
            "JWT_KEY": "vidly_jwtPrivateKey",
          }
        }
    ]
  }