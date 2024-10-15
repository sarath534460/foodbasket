import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  
  http: any;

  constructor(http:HttpClient) {
    this.http=http
   }

  sendmobieno(y: any):Observable<any>{
    return this.http.post("http://localhost:78/mobileverify",y)
  }

  verifyotp(k: any) {
    return this.http.post("http://localhost:78/verifyotp",{otp:k})

  }

  getlocalstorage():boolean{
    if(typeof localStorage !== 'undefined' && localStorage.getItem('token')){
        return true
    }
    else{
      return false
    }
  }
}
