import { Component, OnInit, Renderer2, TemplateRef } from '@angular/core';
import { FormService } from '../../../../services/form.service';
import { StoreService } from "../../../../services/store.service";
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
declare var $:any
declare var sweetAlert:any
@Component({
  selector: 'app-form-template',
  templateUrl: './form-template.component.html',
  styleUrls: ['./form-template.component.css']
})

export class FormTemplateComponent implements OnInit {
  registerForm: FormGroup;
  modalRef: BsModalRef;

  submitted = false;
  dataForm:any[] = []
  idperfilSelect:string = ''
  idRadioDependencia:string  = ''

  idEdit:string  = ''
  valueEdit:string  = ''
  perfiles:any[] = this._storeServises.dataSession[0]["perfiles"]
  dataValidaciones:any[] = [{
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
  }]
  //variables sub preguntas

  id_componente:number = 0
  dataSubForm:any[] = []
  idSubEdit:string  = ''
  valueSubEdit:string  = ''
  
  constructor(
    private _FormService: FormService,
    private _router: Router, 
    public _storeServises: StoreService,
    private formBuilder: FormBuilder,
    private renderer: Renderer2,
    private modalService: BsModalService
  ) { }

  ngOnInit(): void {
    setTimeout(()=>{
      //this.formulario()
    });

    this.registerForm = this.formBuilder.group(this.dataValidaciones[0]);
  }

  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  onSubmit() {
      this.submitted = true;

      // stop here if form is invalid
      if (this.registerForm.invalid) {
          return;
      }

      alert('SUCCESS!! :-)')
  }


  formulario(id:string){
    this.idRadioDependencia = ''
    this.idperfilSelect = id
    let params = {
      codigo: "3",
      parametro : id
    }
    this._storeServises.loading = true
    this._FormService.formulario(params).subscribe(
      resp => [
        this.dataForm = resp,
        console.log(resp)
      ], 
      err => [
        //this._storeServises.loading = false,
        this._storeServises.Notifications(err.error["message"],err.error["success"]),
        console.log(err.error)
      ], 
      () => [
        this._storeServises.loading = false,
        //this._storeServises.Notifications(this.datas["message"],this.datas["success"]),
        //this._storeServises.loading = false
      ]
    )
  }

  crearSeccion(id:string){

    if (this.idperfilSelect.length > 0) {
      let ultimo_ranking = 0
      if (this.dataForm.length > 0) {
        for (let i = 0; i < this.dataForm.length; i++) {
          ultimo_ranking = parseInt(this.dataForm[i]["ultimo_ranking"])+1 
        }
      }else{
        ultimo_ranking = 1
      }      
                     
      let params = {
        codigo: id,
        etiqueta1 : '0',
        clase1 : '0',
        dependencia1 : '0',
        value11 : '0',
        type11 : '0',
        ranking1 : ultimo_ranking,
        perfil1 : this.idperfilSelect
      }
      this._storeServises.loading = true
      this._FormService.crearControles(params).subscribe(
        resp => [
          this.formulario(this.idperfilSelect),
          console.log(resp)
        ], 
        err => [
          //this._storeServises.loading = false,
          this._storeServises.Notifications(err.error["message"],err.error["success"]),
          console.log(err.error)
        ], 
        () => [
          this._storeServises.loading = false,
          //this._storeServises.Notifications(this.datas["message"],this.datas["success"]),
          //this._storeServises.loading = false
        ]
      ) 
    } 
  }
  editarValor(id:string, value:string ){
    const element = $("#elementId")
    element.focus();
    this.idEdit = id
    this.valueEdit = value
  }

  updateControl(id:string, value:string){
    if (id.length > 0) {
      let params = {
        codigo: "2",
        parametro : id,
        parametro2 : value.trim()
      }
      this._storeServises.loading = true
      this._FormService.formulario(params).subscribe(
        resp => [
          this.formulario(this.idperfilSelect),
          console.log(resp)
        ], 
        err => [
          //this._storeServises.loading = false,
          this._storeServises.Notifications(err.error["message"],err.error["success"]),
          console.log(err.error)
        ], 
        () => [
          this._storeServises.loading = false,
          //this._storeServises.Notifications(this.datas["message"],this.datas["success"]),
          //this._storeServises.loading = false
        ]
      )
    }
     
  }

  crearPreguntas(id:string){
    if (this.idRadioDependencia.length < 1) {
      this._storeServises.Notifications('Seleccione la sección donde desea crear la pregunta.', false)
      return false
    }

    if (this.idperfilSelect.length > 0) {
                     
      let params = {
        codigo: id,
        etiqueta1 : '0',
        clase1 : '0',
        dependencia1 : this.idRadioDependencia,
        value11 : '0',
        type11 : '0',
        ranking1 :'0',
        perfil1 : this.idperfilSelect
      }
      this._storeServises.loading = true
      this._FormService.crearControles(params).subscribe(
        resp => [
          this.formulario(this.idperfilSelect),
          console.log(resp)
        ], 
        err => [
          //this._storeServises.loading = false,
          this._storeServises.Notifications(err.error["message"],err.error["success"]),
          console.log(err.error)
        ], 
        () => [
          this._storeServises.loading = false,
          //this._storeServises.Notifications(this.datas["message"],this.datas["success"]),
          //this._storeServises.loading = false
        ]
      ) 
    }else{
      this._storeServises.Notifications('No ha seleccionado el perfil', false)
    } 
  }

  //---------------SUB PREGUNTAS ------------------------------------------

  openModal(template: TemplateRef<any>, id:number) {
    this.modalRef = this.modalService.show(template,
      Object.assign({}, { class: 'gray modal-lg'}));
    this.id_componente = id
    this.subFormulario(this.idperfilSelect)
  }
  
  subFormulario(id:string){
    this.idRadioDependencia = ''
    this.idperfilSelect = id
    let params = {
      codigo: "5",
      parametro : id,
      parametro2 : this.id_componente
    }
    this._storeServises.loading = true
    this._FormService.formulario(params).subscribe(
      resp => [
        this.dataSubForm = resp,
        console.log(resp)
      ], 
      err => [
        //this._storeServises.loading = false,
        this._storeServises.Notifications(err.error["message"],err.error["success"]),
        console.log(err.error)
      ], 
      () => [
        this._storeServises.loading = false,
        //this._storeServises.Notifications(this.datas["message"],this.datas["success"]),
        //this._storeServises.loading = false
      ]
    )
  }

  crearSubSeccion(id:string){

    if (this.idperfilSelect.length > 0) {
      let ultimo_ranking = 0
      if (this.dataSubForm.length > 0) {
        for (let i = 0; i < this.dataSubForm.length; i++) {
          ultimo_ranking = parseInt(this.dataSubForm[i]["ultimo_ranking"])+1 
        }
      }else{
        ultimo_ranking = 1
      }      
                     
      let params = {
        codigo: id,
        etiqueta1 : '0',
        clase1 : '0',
        dependencia1 : '0',
        value11 : '0',
        type11 : '0',
        ranking1 : ultimo_ranking,
        perfil1 : this.idperfilSelect,
        id_componente1 : this.id_componente
      }
      this._storeServises.loading = true
      this._FormService.crearSubControles(params).subscribe(
        resp => [
          this.subFormulario(this.idperfilSelect),
          console.log(resp)
        ], 
        err => [
          //this._storeServises.loading = false,
          this._storeServises.Notifications(err.error["message"],err.error["success"]),
          console.log(err.error)
        ], 
        () => [
          this._storeServises.loading = false,
          //this._storeServises.Notifications(this.datas["message"],this.datas["success"]),
          //this._storeServises.loading = false
        ]
      ) 
    } 
  }

  crearSubPreguntas(id:string){
    if (this.idRadioDependencia.length < 1) {
      this._storeServises.Notifications('Seleccione la sección donde desea crear la pregunta.', false)
      return false
    }

    if (this.idperfilSelect.length > 0) {
                     
      let params = {
        codigo: id,
        etiqueta1 : '0',
        clase1 : '0',
        dependencia1 : this.idRadioDependencia,
        value11 : '0',
        type11 : '0',
        ranking1 :'0',
        perfil1 : this.idperfilSelect,
        id_componente1 : this.id_componente
      }
      this._storeServises.loading = true
      this._FormService.crearSubControles(params).subscribe(
        resp => [
          this.subFormulario(this.idperfilSelect),
          console.log(resp)
        ], 
        err => [
          //this._storeServises.loading = false,
          this._storeServises.Notifications(err.error["message"],err.error["success"]),
          console.log(err.error)
        ], 
        () => [
          this._storeServises.loading = false,
          //this._storeServises.Notifications(this.datas["message"],this.datas["success"]),
          //this._storeServises.loading = false
        ]
      ) 
    }else{
      this._storeServises.Notifications('No ha seleccionado el perfil', false)
    } 
  }

  updateSubControl(id:string, value:string){
    if (id.length > 0) {
      let params = {
        codigo: "6",
        parametro : id,
        parametro2 : value.trim()
      }
      this._storeServises.loading = true
      this._FormService.formulario(params).subscribe(
        resp => [
          this.subFormulario(this.idperfilSelect),
          console.log(resp)
        ], 
        err => [
          //this._storeServises.loading = false,
          this._storeServises.Notifications(err.error["message"],err.error["success"]),
          console.log(err.error)
        ], 
        () => [
          this._storeServises.loading = false,
          //this._storeServises.Notifications(this.datas["message"],this.datas["success"]),
          //this._storeServises.loading = false
        ]
      )
    }
     
  }

  editarSubValor(id:string, value:string ){
    const element = $("#elementSubId")
    element.focus();
    this.idSubEdit = id
    this.valueSubEdit = value
  }

}
