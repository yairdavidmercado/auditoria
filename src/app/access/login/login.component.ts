import { Component, OnInit } from '@angular/core';
import { UsuarioService } from "./../../services/usuario.service";
import { StoreService } from "./../../services/store.service";
import { FormControl,FormGroup,Validators } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  datas: any[]
  usuario: string = ""
  password: string
  name_user:string
  constructor(
    private _usuariosServises: UsuarioService,
    private _router: Router, 
    public _storeServises: StoreService
  ) { }

  ngOnInit(): void {
    if (typeof this._storeServises.dataSession !== 'undefined') {
      if(this._storeServises.dataSession !== null){
        this._router.navigate(['/dashboard'])
      }
    }

  }
  
  loginForm = new FormGroup({
    usuario: new FormControl('', [Validators.required, Validators.minLength(1)]),
    password: new FormControl('', [Validators.required, Validators.minLength(3)])
  })
  get user(){
    return this.loginForm.get('usuario')
  }
  get pass(){
    return this.loginForm.get('password')
  }

  nombre_usuario(){
    if (this.usuario.length < 1) {
      this.name_user = ''
      return false
    }
    this._storeServises.loading = true
    let params = {
      codigo: "2",
      parametro : this.usuario,
      parametro2 : this.password
    }
    this._usuariosServises.access(params).subscribe(
      resp => [
        this.datas = resp,
        this.asignar_nombre(resp),
        console.log(resp)
      ], 
      err => [
        this.name_user = '',
        console.log(err.error)
      ], 
      () => [
        this._storeServises.loading = false
        //this._storeServises.Notifications(this.datas["message"],this.datas["success"]),
        //this._storeServises.loading = false
      ]
    )
  }

  asignar_nombre(value: any[]){
    if (value["success"]) {
      this.name_user = value["resultado"][0]['nombre']
    }else{
      this.name_user = ''
    }
  }

  Login(){
    let params = {
      codigo: "1",
      parametro : this.usuario,
      parametro2 : this.password
    }
    this._storeServises.loading = true
    this._usuariosServises.access(params).subscribe(
      resp => [
        this.datas = resp,
        console.log(resp),
        this.iniciarSession(resp)
      ], 
      err => [
        //this._storeServises.loading = false,
        this._storeServises.Notifications(err.error["message"],err.error["success"]),
        console.log(err.error)
      ], 
      () => [
        this._storeServises.loading = false,
        this._storeServises.Notifications(this.datas["message"],this.datas["success"]),
        //this._storeServises.loading = false
      ]
    )
  }

  iniciarSession(value: any[]){
    if (value["success"]) {
      localStorage.setItem("session", 'true')
      localStorage.setItem("dataSession", JSON.stringify(value))
      window.location.href = ''
    }else{
      localStorage.setItem("session", 'false')
      this._router.navigate(['login'])
    }
  }

}
