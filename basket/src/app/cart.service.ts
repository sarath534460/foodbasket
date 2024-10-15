import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
 
  http: HttpClient;
 // carts:any=[]

  constructor(http:HttpClient) { 
    this.http=http
    //this.http.get("http://localhost:78/getcart").subscribe(u=>{})
  }
  
  getcartitems():Observable<any>{
 
   return this.http.get("http://localhost:78/getcart")

  }
 

  addtocart(y:any):Observable<any>{
    console.log(y)
   // this.carts.push(y)
   return this.http.post("http://localhost:78/addtocart",y)
   
  }


  inccart(j:any){

   return  this.http.put("http://localhost:78/inccart",j)
  }

  desccart(l:any){
        console.log(l)
    return  this.http.delete(`http://localhost:78/desccart/${l.productname}/${l.quantity}/${l.price}`)

  }

  testapi():Observable<any>{
   return this.http.post(`http://localhost:78/testapi`,{name:3875})
  }
  
}
