import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
//import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { PrismaService } from '../prisma/prisma.service';

@Controller('articles')
export class ArticlesController {

  constructor(private prisma: PrismaService) {}

  @Post()
  create(@Body() createArticleDto: CreateArticleDto) {
    //return this.prisma.article.create({ data: createArticleDto });
    return 'This action adds a new article';
  }

  @Get()
  findAll() {
    return this.prisma.article.findMany({ where: { published: true } });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.prisma.article.findUnique({ where: { id: +id } });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
    return this.prisma.article.update({ where: { id: +id }, data: updateArticleDto });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.prisma.article.delete({ where: { id: +id } });
  }
}
