import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
@Injectable()
export class DbService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
    let connectionOptions: TypeOrmModuleOptions;
    if (this.configService.get<string>('sqlite.DB_DATABASE')) {
      connectionOptions = {
        type: 'sqlite',
        database: this.configService.get<string>('sqlite.DB_DATABASE'),
        entities: this.configService.get<string[]>('sqlite.DB_ENTITIES'),
        migrations: this.configService.get<string[]>('sqlite.DB_MIGRATIONS'),
        keepConnectionAlive: true,
        cli: {
          migrationsDir: this.configService.get<string>('sqlite.DB_CLI'),
        },
        synchronize: true,
        logging: false,
        name: 'sqliteConnectionName',
      };
    } else {
      connectionOptions = {
        name: 'default',
        type: 'postgres',
        host: this.configService.get<string>('database.DB_HOST'),
        port: this.configService.get<number>('database.DB_PORT'),
        username: this.configService.get<string>('database.DB_USERNAME'),
        password: this.configService.get<string>('database.DB_PASSWORD'),
        database: this.configService.get<string>('database.DB_DATABASE'),
        entities: this.configService.get<string[]>('database.DB_ENTITIES'),
        migrations: this.configService.get<string[]>('database.DB_MIGRATIONS'),
        keepConnectionAlive: true,
        cli: {
          migrationsDir: this.configService.get<string>('database.DB_CLI'),
        },
      };
    }
    return connectionOptions;
  }
}
