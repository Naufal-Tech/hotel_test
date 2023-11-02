module.exports = {
  HOST: "localhost", // Hostname or IP address of your database server
  USER: "postgres", // Database username
  PASSWORD: "1234567", // Password for the user
  DB: "NEW_HOTEL", // Name of the database
  dialect: "postgres", // Database dialect (PostgreSQL)

  pool: {
    max: 5, // Maximum number of database connections in the pool
    min: 0, // Minimum number of database connections to keep open
    acquire: 30000, // Maximum time (in milliseconds) to wait for a connection
    idle: 10000, // Maximum time (in milliseconds) a connection can be idle before being released
  },

  // Additional Sequelize options:
  define: {
    timestamps: true, // Automatically add createdAt and updatedAt columns to your tables
    underscored: true, // Use snake_case for table names and column names
  },

  logging: true, // Set to true to log SQL queries, or provide a custom logger

  // Connection pool options (for advanced use):
  dialectOptions: {
    ssl: {
      require: true, // Set to true for SSL connection
      rejectUnauthorized: false, // Set to false to avoid rejection for self-signed certificates
    },
  },
};
