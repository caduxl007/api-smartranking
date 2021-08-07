import { Param, Put } from '@nestjs/common';
import {
  Body,
  Controller,
  Get,
  Query,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { DesafiosService } from './desafios.service';
import { AtribuirDesafioPartidaDTO } from './dtos/atribuir-desafio-partida.dto';
import { AtualizarDesafioDTO } from './dtos/atualizar-desafio.dto';
import { CriarDesafioDTO } from './dtos/criar-desafio.dto';
import { Desafio } from './interfaces/desafio.interface';
import { DesafioStatusValidacaoPipe } from './pipes/desafio-status-validation.pipe';

@Controller('api/v1/desafios')
export class DesafiosController {
  constructor(private readonly desafiosService: DesafiosService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async criarDesafio(
    @Body() criarDesafioDto: CriarDesafioDTO,
  ): Promise<Desafio> {
    return await this.desafiosService.criarDesafio(criarDesafioDto);
  }

  @Get()
  async consultarDesafios(@Query('idJogador') _id: string): Promise<Desafio[]> {
    return _id
      ? await this.desafiosService.buscarTodosDesafiosDeUmJogador(_id)
      : await this.desafiosService.buscarTodosDesafios();
  }

  @Put('/:desafio')
  async atualizarDesafio(
    @Body(DesafioStatusValidacaoPipe) atualizarDesafioDTO: AtualizarDesafioDTO,
    @Param('desafio') _id: string,
  ): Promise<void> {
    return await this.desafiosService.atualizarDesafio(
      _id,
      atualizarDesafioDTO,
    );
  }

  @Post('/:desafio/partida/')
  async atribuirDesafioPartida(
    @Body(ValidationPipe) atribuirDesafioPartidaDto: AtribuirDesafioPartidaDTO,
    @Param('desafio') _id: string,
  ): Promise<void> {
    return await this.desafiosService.atribuirDesafioPartida(
      _id,
      atribuirDesafioPartidaDto,
    );
  }
}
