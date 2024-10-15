import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { CartService } from '../cart.service';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-allhomeproducts',
  templateUrl: './allhomeproducts.component.html',
  styleUrl: './allhomeproducts.component.css',
 
})
export class AllhomeproductsComponent implements  OnInit {
  http: HttpClient;
  allprod: any;
  a:any
  cartservice: CartService;
  cd:any;
  router: Router;

  constructor(http:HttpClient,cartservice:CartService, cd: ChangeDetectorRef,router:Router){
    this.http=http
    this.cartservice=cartservice
    this.cd=cd
    this.router=router
  }

  ngOnInit(): void {
      
    this.http.get("http://localhost:78/getallcategorieswithproducts").subscribe((y)=>{
      this.allprod=y
    
        this.loaditems()
        
        this.cd.detectChanges();
    },(err)=>{
       
    })
  }

  loaditems() {
    this.cartservice.getcartitems().subscribe(i => {
      this.allprod.forEach((data: any) => {
        data.allproduct.forEach((y: any) => {
          
           y.quantity = 0; // Initialize quantity
          let m = i.find((k: any) =>k.productname == y.productname);

         
          if (m) {
            y.quantity = m.quantity; // Set the quantity from the cart
            
          }
         
        });
      });
      console.log(i);
      this.cd.detectChanges(); 
    });
  }

  addtocart(y:any){
    console.log(y)
    let d=this.cartservice.addtocart(y).subscribe(k=>{
      this.loaditems()
      this.cd.detectChanges(); // Manually trigger change detection to update UI

    })
   
  }
   
  inccart(h:any){
    this.cartservice.inccart(h).subscribe((i:any)=>{
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

  gotoproductviewpage(y:object){
    this.router.navigate(['/productview'],{ queryParams: { data: JSON.stringify(y) } })
  }

  trackById(index: number, item: any): string {
    return item._id; // Assuming _id is the unique identifier for products
  }
  
}
