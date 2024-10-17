import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-productlist',
  templateUrl: './productlist.component.html',
  styleUrl: './productlist.component.css',
  
})
export class ProductlistComponent implements OnInit  {
  act: ActivatedRoute;
  http: any;
  subcat: any;
  a:any
  allprod: any;
  testfilter: any;
  router: Router;
  cd:any;
  cartservice: any;
  
  constructor(act:ActivatedRoute,http:HttpClient,router:Router, cd: ChangeDetectorRef,cartservice:CartService){
    this.act=act
    this.http=http
    this.router=router
    this.cd=cd;
    this.cartservice=cartservice
  }

  ngOnInit(){

    this.act.paramMap.subscribe(paramMap => {
      const categoryname = paramMap.get('name');

      
     this.http.post("http://localhost:78/allsubcategories",{categoryfruit:categoryname}).subscribe((data:any)=>{
      this.subcat=data
      this.subcat.push({categoryname:'All'})
      this.cd.detectChanges();

     })
    
     this.http.post("http://localhost:78/getallproductsbycategory",{categoryname:categoryname}).subscribe((allprod:any)=>{
      this.allprod=allprod
      this.testfilter=allprod
    
      this.loaditems()
      this.cd.detectChanges();
      console.log(this.allprod)
     })
     
    })

  }


  getsubcatpoducts(k:any,o:any){
    console.log(k)

   this.allprod= this.testfilter.filter((y:any)=>{
        if(y.categoryid==k){  
          return y.categoryid
        }
        if(k==null||undefined){
           return this.allprod
        }
     })
  }


  loaditems() {
    this.cartservice.getcartitems().subscribe((i:any) => {
      this.allprod.forEach((data: any) => {
        data.quantity = 0; 
          let m = i.find((k: any) =>k.productname == data.productname);

          if (m) {
            data.quantity = m.quantity; // Set the quantity from the cart
          }
       
      });
      console.log(i);
      this.cd.detectChanges(); 
    });
  }

  addtocart(y:any){
    console.log(y)
    let d=this.cartservice.addtocart(y).subscribe((k:any)=>{
      this.loaditems()
      this.cartservice.callcartlength()
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
    
   this.cartservice.desccart(k).subscribe((u:any)=>{
    
    this.loaditems()
    this.cartservice.callcartlength()

    this.cd.detectChanges();
   })
  }


  trackById(index: number, item: any): string {
    return item._id; // Assuming _id is the unique identifier for products
  }
  
  gotoproductviewpage(y:object){
    this.router.navigate(['/productview'],{ queryParams: { data: JSON.stringify(y) } })
  }

}
