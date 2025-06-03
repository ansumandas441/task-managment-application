import { Module } from '@nestjs/common';
import { CacheRepoService } from './cacherepo.service';

@Module({
  providers: [CacheRepoService],
  exports: [CacheRepoService],
})
export class CacherepoModule {}
