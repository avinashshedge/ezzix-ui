import { OnInit, Component, ViewChild } from "@angular/core";
import { MarketingService } from "../../marketing.service";
import { FacebookSyncModalComponent } from "./facebook-sync-modal.component";
import { NotificationService } from "../../../NotificationService";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
declare var FB: any;

@Component({
    selector: 'facebook-ads',
    templateUrl: './facebook-ads.component.html'
  })
  export class FacebookAdsComponent implements OnInit {

    public pageAccountDetails:any;
    public selectedPage:any = "";
    public selectedPost:any;
    isValidCredentials:any;
    isLoggedIn = false;
    public fbAcccessToken:any;
    public ads:any = [];
    public comments: any=[];
    
    displayedColumns = ['name', 'status','leads_count','created_time','action'];
    dataSource = new MatTableDataSource<Element>();
    @ViewChild(MatSort) sort:MatSort;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    
    constructor(public dialog: MatDialog,private messageService:NotificationService,  
      private marketingService:MarketingService){}

    ngOnInit() {      
        this.getLoginStatus();
    }

      fbLogout(){
        var self = this;
        FB.logout(function(response) {
            // user is now logged out
            self.isLoggedIn =false;
        });
      }
            
      getLoginStatus(){
        var self = this;
        FB.getLoginStatus(function(response) {
            if (response.status === 'connected') {
                var uid = response.authResponse.userID;
                var accessToken = response.authResponse.accessToken;
                localStorage.setItem('fb_access_token',accessToken);
                self.isLoggedIn = true;
                self.getUserInfo(uid);
            } else if (response.status === 'not_authorized') {           
                self.isLoggedIn = false;
            } else {
                self.isLoggedIn =false;
            }
        });
    }

      submitLogin(){
        FB.login((response)=>
            {
              if (response.authResponse)
              {
                this.isLoggedIn = true;
                this.fbAcccessToken = response.authResponse.accessToken;
                  // accessToken
                  // userID
                this.getUserInfo(response.authResponse.userID);
               }
               else
               {
               console.log('User login failed');
             }
          },{ scope: "manage_pages,publish_pages,pages_show_list" });

      }

      getUserInfo(userId) {
        let self = this;
        FB.api(
          "/" + userId + '?fields=accounts',
          (result) => {
            if (result && !result.error) {
              //self.userName = result.name;
              //self.userEmail = result.email;
              self.pageAccountDetails = result.accounts.data;
              console.log(self.pageAccountDetails);
            }
            else {
              this.isValidCredentials = false;
            }
          });
      }

      onPageSelect(id){
        this.selectedPage = id;
        this.getAds(this.selectedPage.id,this.selectedPage.access_token);
      }

      getAds(pageId,access_token){
          let self = this;
          FB.api(
              "/"+ pageId +"/leadgen_forms?fields=id,name,status,leads_count,expired_leads_count,created_time,leads",{
                  access_token:access_token
              },
              function (response) {
                if (response && !response.error) {
                    self.ads = response.data;

                    self.dataSource = new MatTableDataSource<any>(self.ads);
                    self.dataSource.sort = self.sort;
                    self.dataSource.paginator = self.paginator;
                }
              }
          );
      }

      syncLeads(leads,name,projectId){
        debugger;
        if(leads)
        {
            var data = {
                facebookLeads: leads.data,
                adName:name,
                projectId:projectId
            }
            this.marketingService.syncLeads(data).subscribe(res =>{
                this.messageService.success('Leads sync successfully.');
            });
        }
      }
   
      showSyncModal(row){    
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.width = '50%';
        dialogConfig.autoFocus = true;
       
        const ref = this.dialog.open(FacebookSyncModalComponent,dialogConfig); 
    
        ref.afterClosed().subscribe(result => {
          if(result !=null){
            this.syncLeads(row.leads,row.name,result);
          }
        });
    
      }

  }
