import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { mainModule } from 'process';
import { timeout } from 'rxjs/operators';
import { Usuario } from 'src/app/clases/usuario';
import { eRol } from 'src/app/enums/eRol';
import { EncuestaService } from 'src/app/services/encuesta/encuesta.service';
@Component({
  selector: 'app-encuesta',
  templateUrl: './encuesta.page.html',
  styleUrls: ['./encuesta.page.scss'],
})
export class EncuestaPage implements OnInit {

  public surveyForm: FormGroup;
  public currentUser: Usuario; 
  public survey: any = {
    q1: '',
    q2: '',
    q3: '',
    q4: '',
    q5: false
  }
  public questions: any;
  reportedUser: any;
  checkedYes: boolean = false;
  checkedNo: boolean = false;
  reportedUsername: string;
  submitted: boolean;
  showOK:boolean  = false;
  showForm : boolean = true;
  constructor(private fromBuilder: FormBuilder, public route: ActivatedRoute, public encuestasSrv: EncuestaService, public router: Router,private spinner: NgxSpinnerService) {
    this.surveyForm = this.fromBuilder.group({
      q1: [this.survey.q1, Validators.compose([Validators.required])],
      q2: [this.survey.q2, Validators.compose([Validators.required])],
      q3: [this.survey.q3, Validators.compose([Validators.required])],
      q4: [this.survey.q4, Validators.compose([Validators.required, Validators.minLength(4)])],
      q5: [this.survey.q4, Validators.compose([Validators.required])]
    })
   }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem("userData"));
    this.reportedUsername = this.route.snapshot.paramMap.get('username')
    console.log(this.reportedUsername)
    this.submitted = false

  }

  SubmitEncuesta(){
    console.log(this.surveyForm.valid)
    this.submitted = true;
    if (!this.surveyForm.invalid) {
      let nuevoReporte = {
        comentarios: this.surveyForm.get('q4').value,
        cumpleHorario: this.surveyForm.get('q5').value,
        realizaTareas: this.surveyForm.get('q3').value,
        limpieza: this.surveyForm.get('q2').value,
        respeta: this.surveyForm.get('q1').value,
        userName: this.reportedUsername
      }
      this.encuestasSrv.AgregarNuevoReporte(nuevoReporte)
      this.ClossingMessage();
    } else {
      
    }
  }

  ClossingMessage() {
    this.spinner.show();
    setTimeout(() => {
      this.showForm = false;
      this.spinner.hide()
      this.showOK = true;
      setTimeout(() => {
        this.router.navigate(['supervisor/users'])
      }, 2000);
    }, 2000);
  }

}
