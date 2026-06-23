import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { User } from '../models/user';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {

  users: User[] = [];
  paginatedUsers: User[] = [];

  isLoading = true;
  errorMessage = '';

  // Pagination
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 0;


  showNotification = false;
  notifType: 'success' | 'error' | 'warning' = 'success';
  notifMessage = '';


  constructor(
    private userService: UserService,
    private router: Router
  ) {}


  ngOnInit() {
    this.loadUsers();
  }



  loadUsers() {

    this.isLoading = true;

    this.userService.getUsers().subscribe({

      next: (data:any)=>{

        this.users = data;

        this.totalPages = Math.ceil(
          this.users.length / this.itemsPerPage
        );

        this.updatePagination();


        this.isLoading = false;

      },


      error:()=>{

        this.errorMessage =
        'Failed to load users. Please try again.';

        this.isLoading=false;

      }

    });

  }



  updatePagination(){

    const start =
    (this.currentPage - 1) * this.itemsPerPage;


    const end =
    start + this.itemsPerPage;


    this.paginatedUsers =
    this.users.slice(start,end);

  }



  changePage(page:number){

    if(page < 1 || page > this.totalPages)
      return;


    this.currentPage = page;

    this.updatePagination();

  }



  goToAddUser(){

    this.router.navigate(['/users/add']);

  }


}