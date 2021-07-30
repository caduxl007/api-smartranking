import { Injectable, Logger } from '@nestjs/common';
import * as uuid from 'uuid';

import { CriarJogadorDTO } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';

@Injectable()
export class JogadoresService {
  private jogadores: Jogador[] = [];

  private readonly logger = new Logger(JogadoresService.name);

  async criarAtualizarJogador(criarJogadorDTO: CriarJogadorDTO): Promise<void> {
    const { email } = criarJogadorDTO;

    const exictsEmail = this.jogadores.find(
      (jogador) => jogador.email === email,
    );

    if (exictsEmail) {
      throw new Error('Email ja cadastrado');
    }

    this.criar(criarJogadorDTO);
  }

  async consultarTodosJogadores(): Promise<Jogador[]> {
    return this.jogadores;
  }

  private criar(criarJogadorDTO: CriarJogadorDTO): void {
    const { nome, email, telefoneCelular } = criarJogadorDTO;

    const jogador: Jogador = {
      _id: uuid.v4(),
      nome,
      email,
      telefoneCelular,
      ranking: 'A',
      posicaoRanking: 2,
      urlFotoJogador: 'a',
    };

    this.logger.log(`criaJogadorDTO: ${JSON.stringify(jogador)}`);
    this.jogadores.push(jogador);
  }
}
