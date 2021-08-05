import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CriarJogadorDTO } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';

@Injectable()
export class JogadoresService {
  private jogadores: Jogador[] = [];

  constructor(
    @InjectModel('Jogador') private readonly jogadorModel: Model<Jogador>,
  ) {}

  private readonly logger = new Logger(JogadoresService.name);

  async criarJogador(criarJogadorDTO: CriarJogadorDTO): Promise<Jogador> {
    const { email } = criarJogadorDTO;

    const jogadorEncontrado = await this.jogadorModel.findOne({ email }).exec();

    if (jogadorEncontrado) {
      throw new BadRequestException(
        `Jogador com e-mail ${email} ja cadastrado!`,
      );
    }

    const jogadorCriado = new this.jogadorModel(criarJogadorDTO);

    return await jogadorCriado.save();
  }

  async atualizarJogador(
    _id: string,
    criarJogadorDTO: CriarJogadorDTO,
  ): Promise<void> {
    const jogadorEncontrado = await this.jogadorModel.findOne({ _id }).exec();

    if (!jogadorEncontrado) {
      throw new NotFoundException(`Jogador com ID ${_id} não encontrado!`);
    }

    await this.jogadorModel
      .findOneAndUpdate({ _id }, { $set: criarJogadorDTO })
      .exec();
  }

  async consultarTodosJogadores(): Promise<Jogador[]> {
    return await this.jogadorModel.find().exec();
  }

  async consultarJogadorPeloId(_id: string): Promise<Jogador> {
    const jogadorEncontrado = await this.jogadorModel.findOne({ _id }).exec();

    if (!jogadorEncontrado) {
      throw new NotFoundException(`Jogador com ID ${_id} não encontrado!`);
    }

    return jogadorEncontrado;
  }

  async deletarJogador(_id: string): Promise<any> {
    const jogadorEncontrado = await this.jogadorModel.findOne({ _id }).exec();

    if (!jogadorEncontrado) {
      throw new NotFoundException(`Jogador com ID ${_id} não encontrado!`);
    }

    return await this.jogadorModel.deleteOne({ _id }).exec();
  }
}
