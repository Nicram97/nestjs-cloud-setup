import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { CacheService } from '../cache/cache.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService, CacheService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
