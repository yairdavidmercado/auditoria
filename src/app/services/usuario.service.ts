import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { StoreService } from './store.service';
@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(
    private _http: HttpClient,
    public _storeServises: StoreService
  ) { }

  //login
  access(params: any){
    return this._http.post<any[]>(this._storeServises.baseUrl+'/AppToolsAPI/sel_login.php', params )
  }

  //informacion paciente
  info_paciente(params: any){
    return this._http.get<any[]>(this._storeServises.baseUrl+'/auditoria_concurrente/php/sel_info_paciente.php?codigo='+params.codigo+'&parametro='+params.parametro )
  }

  //informacion paciente
  tableUsuarios(page:number, nombre:string){
    return this._http.get<any[]>(this._storeServises.baseUrl+'/AppToolsAPI/table_usuarios.php?page='+page+'&nombre='+nombre)
  }

  AllUsuarios(params: any){
    return this._http.post<any[]>(this._storeServises.baseUrl+'/AppToolsAPI/sel_login.php', params)
  }

  
  guardarUsuario(params: any){
    return this._http.post<any[]>(this._storeServises.baseUrl+'/AppToolsAPI/guardar_usuarios.php', params )
  }

  guardarPerfil(params: any){
    return this._http.post<any[]>(this._storeServises.baseUrl+'/AppToolsAPI/guardar_perfiles.php', params )
  }

}
