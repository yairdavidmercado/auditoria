import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
declare var $:any
declare var sweetAlert:any
@Injectable({
  providedIn: 'root'
})
export class StoreService {
  loading: boolean = false
  dataSession: any[] = JSON.parse(localStorage.getItem('dataSession'))
  baseUrl: string = 'http://localhost'
  constructor() { }

  Notifications(texto: string, tipo: boolean){
    let title = ''
    let type = ''
    if (tipo === true) {
      title = 'Hecho!:'
      type = 'info'
    }else{
      title = 'Error:'
      type = 'danger'
    }
    $.notify({
      icon: 'flaticon-alarm-1',
      title: title,
      message: texto,
    },{
      type: type,
      placement: {
        from: "bottom",
        align: "right"
      },
      animate: {
        enter: 'animated fadeInDown',
        exit: 'animated fadeOutUp'
      },
      delay: 2000,
    });
  }

  Confirm(
    title:string,
    text:string,
    icon:string, 
    buttons:boolean, 
    dangerMode:boolean,
    messageSussess:string){
      alert('hola')
    sweetAlert({
      title: title,
      text: text,
      icon: icon,
      buttons: buttons,
      dangerMode: dangerMode,
    })
    .then((willDelete) => {
      if (willDelete) {
        sweetAlert(messageSussess, {
          icon: "success",
        });
      } else {
        sweetAlert(messageSussess);
      }
    })
  }

  cerrarSesion(){
    localStorage.setItem("session", 'false')
    //localStorage.removeItem('dataSession');
    localStorage.setItem("dataSession", null)
    window.location.href = ''
  }
}
