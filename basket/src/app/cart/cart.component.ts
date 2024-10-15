import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CartService } from '../cart.service';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {

  carts:any=[]
  http: HttpClient;
  cartservice: CartService;
  a:any
  cd: ChangeDetectorRef;
  carttotal:number=0
  router:any;

  constructor(http:HttpClient,cartservice:CartService, cd: ChangeDetectorRef,router:Router){
   this.http=http
   this.cartservice=cartservice
   this.cd=cd
   this.router=router
  }

  ngOnInit(){
    this.loaditems()
   
  }

  loaditems(){
   this.cartservice.getcartitems().subscribe((u)=>
  {
    console.log(u)
    this.carts=u

    this.carttotal=this.carts.reduce((accumulator:any, currentValue:any) => {
      return accumulator + currentValue.itemtotal;
      
    }, 0)

    this.cd.detectChanges()
  })
  }
  
  inccart(t:any){
    this.cartservice.inccart(t).subscribe((i:any)=>{
      this.loaditems()
      this.cd.detectChanges(); // Manually trigger change detection to update UI

    })
  }

  desccart(k:any){
    console.log(k)
    this.cartservice.desccart(k).subscribe((u:any)=>{
 
     this.loaditems()
     this.cd.detectChanges();
    })
  }

  checkout(){
    console.log("hello")
    this.router.navigate(['/checkout'])
  }
}
