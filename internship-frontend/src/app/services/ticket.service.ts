import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Ticket } from '../models/ticket';


@Injectable({
  providedIn: 'root'
})
export class TicketService {


  private apiUrl = 'http://127.0.0.1:8000/api';



  constructor(
    private http: HttpClient
  ) {}





  // GET ALL TICKETS WITH PAGINATION

  getTickets(page:number = 1): Observable<any> {


    return this.http.get<any>(

      `${this.apiUrl}/tickets?page=${page}&per_page=10`

    ).pipe(


      map((res:any)=>{


        return {


          ...res,


          data:(res.data || []).map((t:any)=>({


            id:t.id,


            title:t.title,


            description:t.description,


            status:t.status,


            priority:t.priority,



            // ASSIGNED USER FIX

            assignedTo:
            t.assigned_to?.name
            || t.assignedTo?.name
            || t.assigned_to_name
            || 'Unassigned',



            assignedToId:
            t.assigned_to?.id
            || '',



            createdDate:
            t.created_at
            ? t.created_at.substring(0,10)
            : ''



          }))



        };



      }),



      catchError(()=>


        throwError(()=>


          new Error('API unavailable')


        )

      )


    );


  }









  // GET SINGLE TICKET


  getTicketById(id:string):Observable<any>{


    return this.http.get<any>(

      `${this.apiUrl}/tickets/${id}`

    ).pipe(



      map((res:any)=>{


        const t = res.data || res;



        return {



          id:t.id,


          title:t.title,


          description:t.description,


          status:t.status,


          priority:t.priority,



          assignedToId:

          t.assigned_to?.id || '',



          assignedTo:

          t.assigned_to?.name
          || 'Unassigned',



          createdDate:

          t.created_at
          ? t.created_at.substring(0,10)
          : ''



        };



      }),



      catchError(()=>


        throwError(()=>


          new Error('Ticket not found')


        )


      )



    );


  }









  // CREATE TICKET


  createTicket(ticket:any):Observable<any>{


    return this.http.post<any>(

      `${this.apiUrl}/tickets`,

      ticket

    );


  }









  // UPDATE TICKET


  updateTicket(
    id:string,
    ticket:any
  ):Observable<any>{


    return this.http.put<any>(

      `${this.apiUrl}/tickets/${id}`,

      ticket

    ).pipe(


      catchError(()=>


        throwError(()=>


          new Error('Update failed')


        )


      )


    );


  }









  // DELETE TICKET


  deleteTicket(id:string):Observable<any>{


    return this.http.delete<any>(

      `${this.apiUrl}/tickets/${id}`

    ).pipe(


      catchError(()=>


        throwError(()=>


          new Error('Delete failed')


        )


      )


    );


  }









  // DASHBOARD STATS


  getStats():Observable<any>{



    return this.getTickets(1).pipe(



      map((res:any)=>{


        const tickets = res.data || [];



        return {



          total:

          res.meta?.total

          || tickets.length,




          open:

          tickets.filter((t:any)=>

          t.status === 'open'

          || t.status === 'Open'

          ).length,





          closed:

          tickets.filter((t:any)=>

          t.status === 'closed'

          || t.status === 'Closed'

          ).length,





          high_priority:

          tickets.filter((t:any)=>

          t.priority === 'high'

          || t.priority === 'High'

          ).length




        };



      })



    );


  }



}