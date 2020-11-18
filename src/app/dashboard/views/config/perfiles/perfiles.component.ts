import { Component, OnInit } from '@angular/core';
import { StoreService } from "../../../../services/store.service";
import { UsuarioService } from "../../../../services/usuario.service";
import { TipoAuditoriaService } from "../../../../services/tipo-auditoria.service";
declare var sweetAlert:any
@Component({
  selector: 'app-perfiles',
  templateUrl: './perfiles.component.html',
  styleUrls: ['./perfiles.component.css']
})
export class PerfilesComponent implements OnInit {
  textPerfil:string = ''
  EditPerfil:number = 0
  dataPerfiles:any[] = []
  detailPerfil:number = 0
  dataDetailPerfil:any[] = []
  constructor(
    public _storeServises: StoreService,
    private _usuarioServices: UsuarioService,
    private _TipoAuditoriaService: TipoAuditoriaService,
  ) { }

  ngOnInit(): void {
    setTimeout(()=>{
      this.mostrarTable()
    });
  }

  mostrarTable(){
    let params = {
      codigo: '4',
      parametro: '0'
    }
    this._storeServises.loading = true
    this._usuarioServices.access(params).subscribe(
      resp => [
        console.log(resp),
        this.dataPerfiles = resp["resultado"]
      ], 
      err => [
        this.dataPerfiles = [],
        console.log(err.error)
      ], 
      () => [
        this._storeServises.loading = false
        //this._storeServises.Notifications(this.datas["message"],this.datas["success"]),
        //this._storeServises.loading = false
      ]
    )
  }

  NuevoPerfil(){
    this.textPerfil = ''
    this.EditPerfil = 0
  }

  editPerfil(id:number, descripcion:string){
    this.textPerfil = descripcion
    this.EditPerfil = id
  }

  detailPerfiles(id:number){
    this.detailPerfil = id
    this.TiposAuditoria(this.detailPerfil)
  }

  TiposAuditoria(id:number){
    let params = {
      codigo: '2',
      codigo1: '',
      parametro: id,
      parametro2: ''
    }
    this._storeServises.loading = true
    this._TipoAuditoriaService.tableTipoAuditoria(params).subscribe(
      resp => [
        console.log(resp),
        this.dataDetailPerfil = resp["resultado"]
      ], 
      err => [
        this.dataDetailPerfil = [],
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
      codigo: '3',
      codigo1: id,
      parametro: this.detailPerfil,
      parametro2: item
    }
    this._storeServises.loading = true
    this._TipoAuditoriaService.tableTipoAuditoria(params).subscribe(
      resp => [
        console.log(resp),
        this.TiposAuditoria(this.detailPerfil)
      ], 
      err => [
        this.dataPerfiles = [],
        console.log(err.error)
      ], 
      () => [
        this._storeServises.loading = false
        //this._storeServises.Notifications(this.datas["message"],this.datas["success"]),
        //this._storeServises.loading = false
      ]
    )
  }

  guardarPerfil(){
    if (this.textPerfil.trim().length <= 1) {
      this._storeServises.Notifications('Por favor escriba el nombre del perfil', false)
      return false
    }
    let params = {
      codigo: '1',
      id: this.EditPerfil,
      descripcion: this.textPerfil,
      parent: '1'

    }
    this._storeServises.loading = true
    this._usuarioServices.guardarPerfil(params).subscribe(
      resp => [
        console.log(resp),
        this._storeServises.Notifications('Los datos fueron almacenados correctamente.', true),
        this.mostrarTable()
      ], 
      err => [
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
