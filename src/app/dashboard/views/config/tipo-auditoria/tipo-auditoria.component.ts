import { Component, OnInit } from '@angular/core';
import { StoreService } from "../../../../services/store.service";
import { UsuarioService } from "../../../../services/usuario.service";
import { TipoAuditoriaService } from "../../../../services/tipo-auditoria.service";

@Component({
  selector: 'app-tipo-auditoria',
  templateUrl: './tipo-auditoria.component.html',
  styleUrls: ['./tipo-auditoria.component.css']
})
export class TipoAuditoriaComponent implements OnInit {
  
  textTipoAuditoria:string = ''
  finalizar:string = 'f'
  fecha_egre:string = 'f'
  fechas:string = 'f'
  EditTipoAuditoria:number = 0
  dataTipoAuditoriaes:any[] = []
  detailTipoAuditoria:number = 0
  dataDetailTipoAuditoria:any[] = []
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
  
  cambiarValor(tipo:string, value:string){
    if (tipo == 'finalizar') {
      if (value == 't') {
        this.finalizar = 'f' 
      }else{
        this.finalizar = 't' 
      }
    }

    if (tipo == 'fecha_egre') {
      if (value == 't') {
        this.fecha_egre = 'f' 
      }else{
        this.fecha_egre = 't' 
      }
    }

    if (tipo == 'fechas') {
      if (value == 't') {
        this.fechas = 'f' 
      }else{
        this.fechas = 't' 
      }
    }
  }

  mostrarTable(){
    let params = {
      codigo: '1',
      codigo1: '',
      parametro: '',
      parametro2: ''
    }
    this._storeServises.loading = true
    this._TipoAuditoriaService.tableTipoAuditoria(params).subscribe(
      resp => [
        console.log(resp),
        this.dataTipoAuditoriaes = resp["resultado"]
      ], 
      err => [
        this.dataTipoAuditoriaes = [],
        console.log(err.error)
      ], 
      () => [
        this._storeServises.loading = false
        //this._storeServises.Notifications(this.datas["message"],this.datas["success"]),
        //this._storeServises.loading = false
      ]
    )
  }

  NuevoTipoAuditoria(){
    this.textTipoAuditoria = ''
    this.EditTipoAuditoria = 0
    this.finalizar = 'f'
    this.fecha_egre = 'f'
    this.fechas = 'f'
  }

  editTipoAuditoria(id:number, texto:string, finalizar:string, fecha_egre:string, fechas:string){
    this.textTipoAuditoria = texto
    this.EditTipoAuditoria = id
    this.finalizar = finalizar
    this.fecha_egre = fecha_egre
    this.fechas = fechas
  }

  detailTipoAuditoriaes(id:number){
    this.detailTipoAuditoria = id
    this.TiposAuditoria(this.detailTipoAuditoria)
  }

  TiposAuditoria(id:number){
    let params = {
      codigo: '4',
      parametro: id
    }
    this._storeServises.loading = true
    this._usuarioServices.access(params).subscribe(
      resp => [
        console.log(resp),
        this.dataDetailTipoAuditoria = resp["resultado"]
      ], 
      err => [
        this.dataDetailTipoAuditoria = [],
        console.log(err.error)
      ], 
      () => [
        this._storeServises.loading = false
        //this._storeServises.Notifications(this.datas["message"],this.datas["success"]),
        //this._storeServises.loading = false
      ]
    )
  }

  guardarTipoAuditoria(){
    if (this.textTipoAuditoria.trim().length <= 1) {
      this._storeServises.Notifications('Por favor escriba el nombre del TipoAuditoria', false)
      return false
    }
    let params = {
      codigo: '1',
      id: this.EditTipoAuditoria,
      nombre: this.textTipoAuditoria,
      finalizar: this.finalizar,
      fecha_egre: this.fecha_egre,
      fechas: this.fechas

    }
    this._storeServises.loading = true
    this._TipoAuditoriaService.guardarTipoAuditoria(params).subscribe(
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
