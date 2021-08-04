import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as uuid from 'uuid';

import { CriarJogadorDTO } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';

@Injectable()
export class JogadoresService {
  private jogadores: Jogador[] = [];

  constructor(
    @InjectModel('Jogador') private readonly jogadorModel: Model<Jogador>,
  ) {}

  private readonly logger = new Logger(JogadoresService.name);

  async criarAtualizarJogador(criarJogadorDTO: CriarJogadorDTO): Promise<void> {
    const { email } = criarJogadorDTO;

    // const jogadorEncontrado = this.jogadores.find(
    //   (jogador) => jogador.email === email,
    // );

    const jogadorEncontrado = await this.jogadorModel.findOne({ email }).exec();

    if (jogadorEncontrado) {
      await this.atualizar(criarJogadorDTO);
    } else {
      this.criar(criarJogadorDTO);
    }
  }

  async consultarTodosJogadores(): Promise<Jogador[]> {
    return await this.jogadorModel.find().exec();
  }

  async consultarUmJogador(email: string): Promise<Jogador> {
    const jogadorEncontrado = this.jogadores.find(
      (jogador) => jogador.email === email,
    );

    if (!jogadorEncontrado) {
      throw new NotFoundException(
        `Jogador com e-mail ${email} nao encontrado!`,
      );
    }

    return jogadorEncontrado;
  }

  async deletarJogador(email: string): Promise<void> {
    this.jogadores = this.jogadores.filter(
      (jogador) => jogador.email !== email,
    );
  }

  private async criar(criarJogadorDTO: CriarJogadorDTO): Promise<Jogador> {
    const jogadorCriado = new this.jogadorModel(criarJogadorDTO);
    return await jogadorCriado.save();

    // const { nome, email, telefoneCelular } = criarJogadorDTO;

    // const jogador: Jogador = {
    //   _id: uuid.v4(),
    //   nome,
    //   email,
    //   telefoneCelular,
    //   ranking: 'A',
    //   posicaoRanking: 2,
    //   urlFotoJogador: 'a',
    // };

    // this.logger.log(`criaJogadorDTO: ${JSON.stringify(jogador)}`);
    // this.jogadores.push(jogador);
  }

  private async atualizar(criarJogadorDTO: CriarJogadorDTO): Promise<Jogador> {
    return await this.jogadorModel
      .findOneAndUpdate(
        { email: criarJogadorDTO.email },
        { $set: criarJogadorDTO },
      )
      .exec();
  }
}
