import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormService } from '../../../../services/form.service';
import { StoreService } from "../../../../services/store.service";
import { UsuarioService } from "../../../../services/usuario.service";
import { Router } from '@angular/router';
declare var $:any
declare var sweetAlert:any
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  EditUsuario = 0
  detailUser = 0

  registerForm: FormGroup;
  registerFormEdit: FormGroup;
  submitted = false;
  firstName = ''
  password = ''
  dataForm:any[] = []
  dataUsuarios:any[] = []
  dataDetailUsuario:any[] = []
  totalRows = 0
  idperfilSelect:string = ''
  idRadioDependencia:string  = ''

  isCollapsed = -1;
  textBuscar:string = ''
  currentPage = 4;
  page: number = 1;

  idEdit:string  = ''
  valueEdit:string  = ''
  perfiles:any[] = this._storeServises.dataSession[0]["perfiles"]
  dataValidaciones:any[] = [{
      firstName: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4)]]
  }]

  dataValidacionesEdit:any[] = [{
    firstName: ['', Validators.required]
}]
  constructor(
    private _FormService: FormService,
    private _router: Router, 
    public _storeServises: StoreService,
    private _usuarioServices: UsuarioService,
    private formBuilder: FormBuilder,
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {
    setTimeout(()=>{
      this.mostrarTable(1, '')
    });
    this.registerForm = this.formBuilder.group(this.dataValidaciones[0]);
    this.registerFormEdit = this.formBuilder.group(this.dataValidacionesEdit[0]);
  }

  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  get d() { return this.registerFormEdit.controls; }

  onSubmit() {
      this.submitted = true;

      // stop here if form is invalid
      if (this.registerForm.invalid) {
          return;
      }

      this.guardarUsuario()
  }

  onSubmitEdit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerFormEdit.invalid) {
        return;
    }

    this.guardarUsuario()
}

  pageChanged(event: any): void {
    this.page = event.page;
    this.mostrarTable(event.page, this.textBuscar)
  }

  buscarEnTabla(){
    this.mostrarTable(this.page, this.textBuscar)
  }

  detailUsuario(id:number){
    this.detailUser = id
    this.PerfilesUsuarios(this.detailUser)
  }

  editUsers(id:number, nombre:string){
    this.EditUsuario = id
    this.firstName = nombre
  }

  NuevoUsers(){
    this.EditUsuario = 0
    this.firstName = ''
  }

  mostrarTable(page:number, nombre:string){
    this._storeServises.loading = true
    this._usuarioServices.tableUsuarios(page,nombre).subscribe(
      resp => [
        console.log(resp),
        this.dataUsuarios = resp,
        this.totalRows = resp['data'][0]['totalrows'],
      ], 
      err => [
        this.dataUsuarios = [],
        console.log(err.error)
      ], 
      () => [
        this._storeServises.loading = false
        //this._storeServises.Notifications(this.datas["message"],this.datas["success"]),
        //this._storeServises.loading = false
      ]
    )
  }

  guardarUsuario(){
    let params = {
      codigo: '1',
      cod_usua: this.EditUsuario,
      nombre: this.firstName,
      pass: this.password

    }
    this._storeServises.loading = true
    this._usuarioServices.guardarUsuario(params).subscribe(
      resp => [
        console.log(resp),
        sweetAlert("Los datos fueron almacenados correctamente."),
        this.mostrarTable(1, '')
      ], 
      err => [
        this.dataUsuarios = [],
        console.log(err.error)
      ], 
      () => [
        this._storeServises.loading = false
        //this._storeServises.Notifications(this.datas["message"],this.datas["success"]),
        //this._storeServises.loading = false
      ]
    )
  }

  PerfilesUsuarios(id:number){
    let params = {
      codigo: '4',
      parametro: id
    }
    this._storeServises.loading = true
    this._usuarioServices.access(params).subscribe(
      resp => [
        console.log(resp),
        this.dataDetailUsuario = resp["resultado"]
      ], 
      err => [
        this.dataDetailUsuario = [],
        console.log(err.error)
      ], 
      () => [
        this._storeServises.loading = false
        //this._storeServises.Notifications(this.datas["message"],this.datas["success"]),
        //this._storeServises.loading = false
      ]
    )
  }

  CheckPerfil(id:number, item:number){
    let params = {
      codigo: '5',
      codigo1: id,
      parametro: this.detailUser,
      parametro2: item
    }
    this._storeServises.loading = true
    this._usuarioServices.access(params).subscribe(
      resp => [
        console.log(resp),
        this.PerfilesUsuarios(this.detailUser)
      ], 
      err => [
        this.dataUsuarios = [],
        console.log(err.error)
      ], 
      () => [
        this._storeServises.loading = false
        //this._storeServises.Notifications(this.datas["message"],this.datas["success"]),
        //this._storeServises.loading = false
      ]
    )
  }

}
