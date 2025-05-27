import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { DataService, Item } from '../../services/data.service';
import { LoadingController, ToastController } from '@ionic/angular';


@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.page.html',
  styleUrls: ['./item-detail.page.scss'],
  standalone:false,
})
export class ItemDetailPage implements OnInit {

  // Declara uma propriedade 'item' do tipo Item, inicializada com valores vazios.
  // Será usada para vincular os dados do formulário (nome e descrição).
  item: Item = {
    name: '',
    description: ''
  };
  // Declara 'itemId' que pode ser uma string ou null. Armazenará o ID do item se estivermos editando.
  itemId: string | null = null;
  // Uma flag booleana para verificar se estamos criando um novo item (true) ou editando um existente (false).
  isNewItem = true;

    constructor(private route: ActivatedRoute,private dataService: DataService,private router: Router,
                private loadingController: LoadingController, private toastController: ToastController) { }

  ngOnInit() {
    this.itemId = this.route.snapshot.paramMap.get('id');
    // Verifica se um ID de item foi encontrado na URL.
    if (this.itemId) {
      // Se um ID existe, significa que estamos editando um item existente.
      this.isNewItem = false;
      // Chama o método para carregar os dados do item.
      this.loadItem();
    }
  }
  async loadItem() {
    // Cria um controle de carregamento (loading spinner) com uma mensagem.
    const loading = await this.loadingController.create({
      message: 'Carregando item...'
    });
    // Apresenta o loading spinner na tela.
    await loading.present();
    // Chama o método getItem do DataService para obter o item pelo ID.
    // O '!' (non-null assertion operator) informa ao TypeScript que itemId não será null aqui.
    this.dataService.getItem(this.itemId!).subscribe(res => {
      // Dispensa o loading spinner assim que a resposta for recebida.
      loading.dismiss();
      // Verifica se o item foi encontrado.
      if (res) {
        // Se encontrado, atribui os dados retornados à propriedade 'item' do componente.
        this.item = res;
      } else {
        // Se o item não for encontrado, exibe um toast de erro.
        this.presentToast('Item não encontrado!', 'danger');
        // Redireciona o usuário de volta para a página inicial.
        this.router.navigateByUrl('/home');
      }
    }, err => { // Trata erros na requisição.
      // Dispensa o loading spinner em caso de erro.
      loading.dismiss();
      // Exibe um toast de erro genérico.
      this.presentToast('Erro ao carregar item.', 'danger');
      // Redireciona o usuário de volta para a página inicial.
      this.router.navigateByUrl('/home');
    });
  }
  async saveItem() {
    // Cria um controle de carregamento (loading spinner) com uma mensagem.
    const loading = await this.loadingController.create({
      message: 'Salvando item...'
    });
    // Apresenta o loading spinner na tela.
    await loading.present();

    // Verifica se a flag 'isNewItem' é verdadeira, indicando que é um novo item.
    if (this.isNewItem) {
      // Se for um novo item, chama o método 'addItem' do DataService.
      this.dataService.addItem(this.item).then(() => {
        // Dispensa o loading spinner após o sucesso.
        loading.dismiss();
        // Exibe um toast de sucesso.
        this.presentToast('Item adicionado com sucesso!', 'success');
        // Redireciona o usuário para a página inicial.
        this.router.navigateByUrl('/home');
      }, err => { // Trata erros ao adicionar.
        // Dispensa o loading spinner em caso de erro.
        loading.dismiss();
        // Exibe um toast de erro.
        this.presentToast('Erro ao adicionar item.', 'danger');
      });
    } else { // Se 'isNewItem' for falsa, estamos atualizando um item existente.
      // Chama o método 'updateItem' do DataService.
      this.dataService.updateItem(this.item).then(() => {
        // Dispensa o loading spinner após o sucesso.
        loading.dismiss();
        // Exibe um toast de sucesso.
        this.presentToast('Item atualizado com sucesso!', 'success');
        // Redireciona o usuário para a página inicial.
        this.router.navigateByUrl('/home');
      }, err => { // Trata erros ao atualizar.
        // Dispensa o loading spinner em caso de erro.
        loading.dismiss();
        // Exibe um toast de erro.
        this.presentToast('Erro ao atualizar item.', 'danger');
      });
    }
  }

  async presentToast(message: string, color: string = 'primary') {
    // Cria um controle de toast com a mensagem, duração e cor.
    const toast = await this.toastController.create({
      message: message,
      duration: 2000, // O toast desaparecerá após 2 segundos.
      color: color // A cor do toast (pode ser primary, secondary, success, danger, etc.).
    });
    // Apresenta o toast na tela.
    toast.present();
  }
}
