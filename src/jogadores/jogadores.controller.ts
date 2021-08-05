import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
  Param,
  Put,
} from '@nestjs/common';
import { AtualizarJogadorDTO } from './dtos/atualizar-jogador.dto';

import { CriarJogadorDTO } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { JogadoresService } from './jogadores.service';
import { JogadoresValidacaoParametrosPipe } from './pipes/jogadores-validacao-parametros.pipe';

@Controller('api/v1/jogadores')
export class JogadoresController {
  constructor(private readonly jogadoresService: JogadoresService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async criarJogador(
    @Body() criaJogadorDTO: CriarJogadorDTO,
  ): Promise<Jogador> {
    return await this.jogadoresService.criarJogador(criaJogadorDTO);
  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  async atualizarJogador(
    @Body() atualizarJogadorDTO: AtualizarJogadorDTO,
    @Param('_id', JogadoresValidacaoParametrosPipe) _id: string,
  ): Promise<void> {
    await this.jogadoresService.atualizarJogador(_id, atualizarJogadorDTO);
  }

  @Get()
  async consultarJogadores(): Promise<Jogador[]> {
    return this.jogadoresService.consultarTodosJogadores();
  }

  @Get('/:_id')
  async consultarJogadorPeloId(
    @Param('_id', JogadoresValidacaoParametrosPipe) _id: string,
  ): Promise<Jogador> {
    return this.jogadoresService.consultarJogadorPeloId(_id);
  }

  @Delete('/:_id')
  async deletarJogador(
    @Param('_id', JogadoresValidacaoParametrosPipe) _id: string,
  ): Promise<void> {
    this.jogadoresService.deletarJogador(_id);
  }
}
