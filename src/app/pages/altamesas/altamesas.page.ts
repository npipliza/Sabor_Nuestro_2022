import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Mesa } from 'src/app/clases/mesa';
import { Usuario } from 'src/app/clases/usuario';
import { AuthService } from 'src/app/services/auth/auth.service';
import { MesasService } from 'src/app/services/mesas/mesas.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-altamesas',
  templateUrl: './altamesas.page.html',
  styleUrls: ['./altamesas.page.scss'],
})
export class AltamesasPage implements OnInit {

  public mesasForm: FormGroup;
  public currentUser: Usuario; 
  public nuevaMesa: Mesa = new Mesa(); 
  public mesasList: Mesa[]; 
  constructor(private authService: AuthService, private fromBuilder: FormBuilder, public userSrv: UserService, public mesasSrv: MesasService) {
    this.mesasForm = this.fromBuilder.group({
      nro_mesa: [this.nuevaMesa.nro_mesa, Validators.compose([Validators.required])],
      comensales: [this.nuevaMesa.comensales, Validators.compose([Validators.required])],
      estado: [this.nuevaMesa.estado, Validators.compose([Validators.required])],
      tipo_mesa: [this.nuevaMesa.tipo_mesa, Validators.compose([Validators.required])]
    })
   }

  ngOnInit() {
    this.nuevaMesa = new Mesa();
    this.currentUser = JSON.parse(localStorage.getItem("userData"));
    const mesas$ = this.mesasSrv.TraerMesas().subscribe( mesas =>{
      console.log(mesas);
      this.mesasList = mesas;
      let mesanuevanro = this.mesasList.length + 1;
      this.mesasForm.get('nro_mesa').setValue(mesanuevanro);
    })
    this.mesasForm.get('estado').setValue(this.nuevaMesa.estado);
    console.log(this.currentUser);
  }

  GuardarNuevaMesa(){
    this.nuevaMesa.nro_mesa = this.mesasForm.get('nro_mesa').value;
    this.nuevaMesa.comensales = this.mesasForm.get('comensales').value;
    this.nuevaMesa.tipo_mesa = this.mesasForm.get('tipo_mesa').value;
    var resp = this.mesasSrv.GuardarNuevaMesa(this.nuevaMesa)
    if(resp){
      console.log("Guardo y entro")
      this.ResetearFormulario();
    }
    else{
    }
  }

  ResetearFormulario(){
    this.mesasForm.reset();
    this.nuevaMesa = new Mesa();
    let mesanuevanro = this.mesasList.length + 1;
    this.mesasForm.get('comensales').setValue(null);
    this.mesasForm.get('tipo_mesa').setValue(-1);
    this.mesasForm.get('nro_mesa').setValue(mesanuevanro);
    this.mesasForm.get('estado').setValue(this.nuevaMesa.estado);
  }

  

}
