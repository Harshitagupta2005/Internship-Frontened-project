import { Component, OnInit } from '@angular/core';
import { TicketService } from '../services/ticket.service';
import { Ticket } from '../models/ticket';


@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.css']
})
export class TicketListComponent implements OnInit {


  tickets: Ticket[] = [];

  searchText = '';

  isLoading = true;

  errorMessage = '';



  showNotification = false;

  notifType: 'success' | 'error' | 'warning' = 'success';

  notifMessage = '';



  // Pagination

  currentPage = 1;

  lastPage = 1;

  totalTickets = 0;



  constructor(
    private ticketService: TicketService
  ) {}




  ngOnInit(){

    this.loadTickets();

  }





  loadTickets(page:number = 1){


    this.isLoading = true;

    this.errorMessage = '';



    this.ticketService.getTickets(page)
    .subscribe({



      next:(res:any)=>{



        this.tickets = res.data || [];



        this.currentPage =
        res.meta?.current_page || 1;



        this.lastPage =
        res.meta?.last_page || 1;



        this.totalTickets =
        res.meta?.total || this.tickets.length;



        this.isLoading = false;



      },



      error:()=>{


        this.errorMessage =
        'Failed to load tickets. Please try again.';



        this.isLoading = false;



      }


    });


  }







  deleteTicket(ticket:Ticket){



    const confirmDelete =
    window.confirm(
      `Are you sure you want to delete ticket "${ticket.title}"?`
    );



    if(!confirmDelete) return;




    this.ticketService.deleteTicket(String(ticket.id))
    .subscribe({



      next:()=>{



        this.notifType='success';

        this.notifMessage =
        'Ticket deleted successfully!';



        this.showNotification=true;



        this.loadTickets(this.currentPage);



      },



      error:()=>{


        this.notifType='error';

        this.notifMessage =
        'Failed to delete ticket.';



        this.showNotification=true;


      }


    });



  }







  get filteredTickets():Ticket[]{


    if(!this.searchText){

      return this.tickets;

    }



    return this.tickets.filter(ticket =>

      ticket.title
      .toLowerCase()
      .includes(
        this.searchText.toLowerCase()
      )

    );


  }







  changePage(page:number){


    if(page >=1 && page <= this.lastPage){


      this.loadTickets(page);


    }


  }




}