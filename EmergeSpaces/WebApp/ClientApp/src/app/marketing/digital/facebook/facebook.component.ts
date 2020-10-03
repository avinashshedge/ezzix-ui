import { OnInit, Component } from "@angular/core";
import { FacebookCommentsComponent } from "./facebook-comments";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
declare var FB: any;

@Component({
    selector: 'facebook-dashboard',
    templateUrl: './facebook.component.html'
  })
  export class FacebookComponent implements OnInit {
    data = []; 
    page = 0;
    size = 10;
    public pageAccountDetails:any;
    public selectedPage:any = "";
    public selectedPost:any;
    isValidCredentials:any;
    isLoggedIn = false;
    public fbAcccessToken:any;
    public posts:any = [];
    public comments: any=[];

    constructor( public dialog: MatDialog){}

    ngOnInit() {      
        // (window as any).fbAsyncInit = function() {
        //   FB.init({
        //     appId: '488258201887711',
        //     status: true,
        //     cookie: true,
        //     xfbml: true,
        //     version: 'v6.0',
            
        //   });
         
        //   FB.AppEvents.logPageView();

        //   FB.getLoginStatus(function(response) {
        //     if (response.authResponse) {
        //         // logged in and connected user, someone you know
        //         console.log('you know this user!!');
        //         this.isLoggedIn =true;
        //     } else {
        //         // no user session available, someone you dont know
        //         console.log('Howdy Stranger!');
        //     }
        // });

          
        // };
    
        // (function(d, s, id){
        //    var js, fjs = d.getElementsByTagName(s)[0];
        //    if (d.getElementById(id)) {return;}
        //    js = d.createElement(s); js.id = id;
        //    js.src = "https://connect.facebook.net/en_US/all.js";
        //    fjs.parentNode.insertBefore(js, fjs);
        //  }(document, 'script', 'facebook-jssdk'));    
         
        //this.testAPI();
          this.getLoginStatus();
         
    }

      fbLogout(){
        var self = this;
        FB.logout(function(response) {
            // user is now logged out
            self.isLoggedIn =false;
        });
      }
      
      testAPI() {                      // Testing Graph API after login.  See statusChangeCallback() for when this call is made.
        console.log('Welcome!  Fetching your information.... ');
        var access_token = localStorage.getItem('fb_access_token');
        FB.api('/me?access_token=' + access_token, function(response) {
          console.log('Successful login for: ' + response.name);
          document.getElementById('status').innerHTML =
            'Thanks for logging in, ' + response.name + '!';
        });
      }

      getLoginStatus(){
        var self = this;
        FB.getLoginStatus(function(response) {
            if (response.status === 'connected') {
            // The user is logged in and has authenticated your
            // app, and response.authResponse supplies
            // the user's ID, a valid access token, a signed
            // request, and the time the access token 
            // and signed request each expire.
            var uid = response.authResponse.userID;
            var accessToken = response.authResponse.accessToken;
            localStorage.setItem('fb_access_token',accessToken);
            self.isLoggedIn = true;
            self.getUserInfo(uid);
            } else if (response.status === 'not_authorized') {
            // The user hasn't authorized your application.  They
            // must click the Login button, or you must call FB.login
            // in response to a user gesture, to launch a login dialog.
            self.isLoggedIn = false;
            } else {
            // The user isn't logged in to Facebook. You can launch a
            // login dialog with a user gesture, but the user may have
            // to log in to Facebook before authorizing your application.
            self.isLoggedIn =false;
            }
        });
    }
    getData(obj) {
      let index=0,
          startingIndex=obj.pageIndex * obj.pageSize,
          endingIndex=startingIndex + obj.pageSize;
    
      this.data = this.posts.filter(() => {
        index++;
        return (index > startingIndex && index <= endingIndex) ? true : false;
      });
    }

      submitLogin(){
        // FB.login();
        FB.login((response)=>
            {
              console.log('submitLogin',response);
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
        debugger;
        this.selectedPage = id;
        this.getPosts(this.selectedPage.id);
      }

      getPosts(pageId){
          let self = this;
          FB.api(
              "/"+ pageId +"/posts?fields=id,from,message,picture,share,status_type,actions,comments.limit(25).summary(true),likes.limit(25).summary(true)",
              function (response) {
                if (response && !response.error) {
                  self.posts = response.data;
                  self.getData({pageIndex: self.page, pageSize: self.size});
                }
              }
          );
      }

      onPostClick(post)
      {
        this.selectedPost = post;
        //localStorage.setItem("selectedpost", JSON.stringify(post));
        this.getComments(post.id);
      }

      getComments(postId){
        var self =this;
        FB.api(
          "/"+ postId +"/?fields=comments{comments,from,id,message}",
          function (response) {
            if (response && !response.error) {
              //localStorage.setItem('comments',JSON.stringify(response.comments.data));              
              self.comments = response.comments != null ? response.comments.data : [];              
            }
            self.openCommentsModal();
          }
        );
      }

      openCommentsModal(){
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.width = '50%';
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
          post:this.selectedPost,
          comments:this.comments,
          FB:FB,
          pageAccessToken:this.selectedPage.access_token
        };
    
        const ref = this.dialog.open(FacebookCommentsComponent,dialogConfig); 
    
        ref.afterClosed().subscribe(result => {
          this.getPosts(this.selectedPage.id);
        });
      }

   


  }
