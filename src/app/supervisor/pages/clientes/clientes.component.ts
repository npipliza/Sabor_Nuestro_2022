import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Email } from 'src/app/interfaces/email';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss'],
})
export class ClientesComponent implements OnInit {

  clientes:any[];

  constructor(private userService:UserService, 
    private authService:AuthService,
    private router:Router) { 
    this.clientes = [];
  }

  ngOnInit() {
    this.getUsers();
  }

  private getUsers(){
    this.userService.getClientesByStatus(false)
    .then((querySnapshot)=>{      
      this.clientes = querySnapshot.docs.map(d => {
        return {
          id:d.id,
          user:d.data()
        };
      });
    })
    .catch((err)=>{
      console.log(err);
    })
    .finally(()=>{

    })
  }

  saveUser(item:any){
    this.userService.setItemWithId(item.user, item.id)
  }

  aceptarCliente(aceptar:boolean, item:any){
    if(aceptar){
      item.user.aceptado = aceptar;    
      this.userService.setItemWithId(item.user, item.id).then(()=>{
        this.getUsers();
      });
    }
    else{
      this.userService.deleteItem(item.id).then(()=>{
        this.getUsers();
      });
    }
        
    const email: Email = {
      email: item.user.correo,
      asunto: aceptar? "Aceptado" : "Rechazado",
      destinatario: item.user.nombre  + " " + item.user.apellido,
      rechazo: !aceptar
    };    

  }  

  logout(){
    this.authService.SignOut().then(()=>{
      this.router.navigate(['login']);
    })
  }

  return(){
    this.router.navigate(['supervisor/home']);
  }
}
