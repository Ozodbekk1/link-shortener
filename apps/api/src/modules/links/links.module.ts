import { Module } from '@nestjs/common';
import {
  WorkspaceLinksController,
  PublicLinksController,
} from './links.controller';
import { LinksService } from './links.service';

@Module({
  controllers: [WorkspaceLinksController, PublicLinksController],
  providers: [LinksService],
})
export class LinksModule {}
