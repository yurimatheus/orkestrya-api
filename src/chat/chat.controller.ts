import { Body, Controller, Post, Res } from '@nestjs/common';
import { FastifyReply } from '@nestjs/platform-fastify';
import { ChatService } from './chat.service';

class StreamMessageDto {
  agentSlug: string;
  message: string;
}

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Post('stream')
  stream(@Body() body: StreamMessageDto, @Res() res: FastifyReply) {
    return this.chatService.streamMessage(body.agentSlug, body.message, res);
  }
}
