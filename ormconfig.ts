import configuration from './src/config/configuration';

const config = configuration();

const dbConfig = () => {
  if (config.sqlite) {
    return {
      type: 'sqlite',
      database: config.sqlite.DB_DATABASE,
      entities: config.sqlite.DB_ENTITIES,
      migrations: config.sqlite.DB_MIGRATIONS,
      cli: {
        migrationsDir: config.sqlite.DB_CLI,
      },
      synchronize: false,
      logging: false,
    };
  } else {
    console.log(config.database);
    return {
      type: 'postgres',
      host: config.database.DB_HOST,
      port: config.database.DB_PORT,
      username: config.database.DB_USERNAME,
      password: config.database.DB_PASSWORD,
      database: config.database.DB_DATABASE,
      entities: config.database.DB_ENTITIES,
      migrations: config.database.DB_MIGRATIONS,
      cli: {
        migrationsDir: config.database.DB_CLI,
      },
    };
  }
};

export default dbConfig();
