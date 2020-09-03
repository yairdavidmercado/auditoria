import { Component, OnInit } from '@angular/core';
import { StoreService } from "../services/store.service";
import { UsuarioService } from "../services/usuario.service";
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  dataSession: any[] = this._storeServises.dataSession
  perfiles:any[] = this._storeServises.dataSession[0]["perfiles"]
  name_session:string = ''
  name_perfil:string = ''
  constructor(
    public _storeServises: StoreService,
    private _router: Router,
    public _usuariosServises: UsuarioService
  ) { }
  
  ngOnInit(): void {
    if (typeof this._storeServises.dataSession !== 'undefined') {
      if(this._storeServises.dataSession == null){
        this._router.navigate(['/login'])
      }else{
        this.name_session = this._storeServises.dataSession[0]["nombre"]
        this.name_perfil = this._storeServises.dataSession[0]["nombre_perfil"]
      }
    }else{
      this._router.navigate(['/login'])
    }
  }

  cambiarPerfil(perfil:string){
    let params = {
      codigo: "3",
      parametro : this.dataSession[0]["cod_usua"],
      parametro2 : perfil
    }
    this._storeServises.loading = true
    this._usuariosServises.access(params).subscribe(
      resp => [
        console.log(resp),
        this.updateLocalstore(resp)
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

  updateLocalstore(newdata: any){
    let datas : any[] = this.dataSession
    datas[0]['id'] = newdata[0]['id']
    datas[0]['nombre'] = newdata[0]['nombre']
    datas[0]['perfil'] = newdata[0]['perfil']
    datas[0]['nombre_perfil'] = newdata[0]['nombre_perfil']
    datas[0]['perfiles'] = newdata[0]['perfiles']
    //alert(JSON.stringify(datas))
    this.dataSession = datas
    localStorage.setItem('dataSession', JSON.stringify(this.dataSession))
    this.name_session = this._storeServises.dataSession[0]["nombre"]
    this.name_perfil = this._storeServises.dataSession[0]["nombre_perfil"]
    this._router.navigate(['/dashboard/censo'])
  }

  cerrarSesion(){
    this._storeServises.cerrarSesion()
  }


}
