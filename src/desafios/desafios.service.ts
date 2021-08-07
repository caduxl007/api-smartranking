import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoriasService } from 'src/categorias/categorias.service';
import { JogadoresService } from 'src/jogadores/jogadores.service';
import { AtualizarDesafioDTO } from './dtos/atualizar-desafio.dto';
import { CriarDesafioDTO } from './dtos/criar-desafio.dto';
import { DesafioStatus } from './enum/desafio-status.enum';
import { Desafio } from './interfaces/desafio.interface';

@Injectable()
export class DesafiosService {
  constructor(
    @InjectModel('Desafio') private readonly desafioModal: Model<Desafio>,
    private readonly jogadoresService: JogadoresService,
    private readonly categoriasService: CategoriasService,
  ) {}

  async criarDesafio(criarDesafioDto: CriarDesafioDTO): Promise<Desafio> {
    //verificar se os jogadores informados estão cadastrados
    const jogadores = await this.jogadoresService.consultarTodosJogadores();

    criarDesafioDto.jogadores.map((jogadorDto) => {
      const jogadorFilter = jogadores.filter(
        (jogador) => jogador._id == jogadorDto._id,
      );

      if (jogadorFilter.length === 0) {
        throw new BadRequestException(
          `O id ${jogadorDto._id} não é um jogador!`,
        );
      }
    });

    //verificar se o solicitante é um dos jogadores da partida
    const solicitanteEhJogadorDaPartida = criarDesafioDto.jogadores.filter(
      (jogador) => jogador._id == criarDesafioDto.solicitante,
    );

    if (!solicitanteEhJogadorDaPartida.length) {
      throw new BadRequestException(
        `O solicitante deve ser um jogador da partida!`,
      );
    }

    //verificar se o solicitante tem categoria
    const categoriaDoJogador =
      await this.categoriasService.consultarCategoriaDoJogador(
        criarDesafioDto.solicitante,
      );

    if (!categoriaDoJogador) {
      throw new BadRequestException(
        `O solicitante precisa estar registrado em uma categoria`,
      );
    }

    const desafioCriado = new this.desafioModal(criarDesafioDto);
    desafioCriado.categoria = categoriaDoJogador.categoria;
    desafioCriado.dataHoraSolicitacao = new Date();
    desafioCriado.status = DesafioStatus.PENDENTE;

    return await desafioCriado.save();
  }

  async buscarTodosDesafios(): Promise<Desafio[]> {
    return await this.desafioModal
      .find()
      .populate('solicitante')
      .populate('partida')
      .populate('jogadores')
      .exec();
  }

  async buscarTodosDesafiosDeUmJogador(_id: any): Promise<Desafio[]> {
    const jogadores = await this.jogadoresService.consultarTodosJogadores();

    const jogadorFilter = jogadores.filter((jogador) => jogador._id == _id);

    if (jogadorFilter.length === 0) {
      throw new BadRequestException(`O id ${_id} não é um jogador!`);
    }

    return await this.desafioModal
      .find()
      .where('jogadores')
      .in(_id)
      .populate('solicitante')
      .populate('partida')
      .populate('jogadores')
      .exec();
  }

  async atualizarDesafio(
    _id: string,
    atualizarDesafioDto: AtualizarDesafioDTO,
  ): Promise<void> {
    const desafioEncontrado = await this.desafioModal.findById(_id).exec();

    if (!desafioEncontrado) {
      throw new NotFoundException(`Desafio ${_id} nao encontrado!`);
    }

    if (atualizarDesafioDto.status) {
      desafioEncontrado.dataHoraResposta = new Date();
    }

    desafioEncontrado.status = atualizarDesafioDto.status;
    desafioEncontrado.dataHoraDesafio = atualizarDesafioDto.dataHoraDesafio;

    await this.desafioModal
      .findOneAndUpdate({ _id }, { $set: desafioEncontrado })
      .exec();
  }
}
