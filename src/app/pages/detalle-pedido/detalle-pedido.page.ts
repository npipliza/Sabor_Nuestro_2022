import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { eEstadoMesa } from 'src/app/enums/eEstadoMesa';
import { eEstadoMesaCliente } from 'src/app/enums/eEstadoMesaCliente';
import { eEstadoProducto } from 'src/app/enums/eEstadoProducto';
import { MesasService } from 'src/app/services/mesas/mesas.service';
import { NotificationsService } from 'src/app/services/notifications/notifications.service';
import { PedidosService } from 'src/app/services/pedidos/pedidos.service';
import { CheckoutPage } from '../checkout/checkout.page';

@Component({
  selector: 'app-detalle-pedido',
  templateUrl: './detalle-pedido.page.html',
  styleUrls: ['./detalle-pedido.page.scss'],
})
export class DetallePedidoPage implements OnInit {
  public paramDocId: any;
  public pedido: any;
  public isLoaded: boolean = false;
  public currentUser: any;
  public isMozo: boolean;
  constructor(private route: ActivatedRoute, private router: Router, public pedidosSrv: PedidosService, public modalController: ModalController, public mesasSrv: MesasService, public pushSrv: NotificationsService) {
  }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem("userData"));
    this.isMozo = this.currentUser.rol == "EMPLEADO" ? true : false;
    this.pedidosSrv.TraerPedido(this.route.snapshot.paramMap.get('doc_id')).subscribe( pedido => {
      this.pedido = pedido;
      if(this.pedido){
        if (this.pedido.productos) {
          this.pedido.demora_estimada = Math.max.apply(Math, this.pedido.productos.map( x => {return x.tiempo_elaboracion}))
          this.pedido.total = 0;
          this.pedido.productos.forEach(element => {
            this.pedido.total += element.precio * element.cantidad;
          });
          let countReady = 0;
          this.pedido.productos.forEach((element,index) => {
            if(element.estado == eEstadoProducto.LISTO){
              countReady+=1; 
              if(this.pedido.productos.length == countReady){
                this.pedido.listoParaServir = true;
              }
            } 
          });
        }
        this.isLoaded = true;
        console.log(this.pedido)
      }
      else{
        if(!this.isMozo)
          this.router.navigate(['home-clientes'])
        else
          this.router.navigate(['home-mozo'])
      }
    })

  }

  navigateCarta(){
    this.router.navigate(['carta',{mesa: this.pedido.nro_mesa}])
  }

  AprobarPedido(){
    let hasBebida = this.pedido.productos.find( x => {return x.sector == "BEBIDA"})
    let hasCocina = this.pedido.productos.find( x => {return x.sector == "COCINA"})
    if (hasBebida) {
      this.pushSrv.sendNotification("Nuevo pedidos en cocina","Hay nuevos pedidos pendientes",'cocina')
    }
    if (hasCocina) {
      this.pushSrv.sendNotification("Nuevo pedido en barra", "Hay nuevos pedidos pendientes",'bar')
    }
    this.pedidosSrv.CambiarEstadoMesaCli(this.pedido.doc_id,eEstadoMesaCliente.ESPERANDO_PEDIDO)
  }

  ServirPedido(){
    this.pedidosSrv.CambiarEstadoMesaCli(this.pedido.doc_id,eEstadoMesaCliente.PEDIDO_ENTREGADO)
  }

  ConfirmarRecepcion(){
    this.pedidosSrv.CambiarEstadoMesaCli(this.pedido.doc_id,eEstadoMesaCliente.COMIENDO)
  }

  CerrarMesa(){
    this.mesasSrv.ActualizarMesaEstado(this.pedido.id_mesa,eEstadoMesa.LIBRE)
    this.pedidosSrv.CerrarMesa(this.pedido.doc_id);
    this.router.navigate(['mesas'])
  }

  async SolicitarCuenta(){
    const modal = await this.modalController.create({
      component: CheckoutPage,
      cssClass: 'checkout-modal',
      componentProps: { pedido: this.pedido }
    });
    modal.onDidDismiss().then(data=>{
      console.log(data)
    })
    return await modal.present();
  }

  goToChat(){
    this.router.navigate(['mozo/chat', {nroMesa: this.pedido.nro_mesa}]);
  }

}
