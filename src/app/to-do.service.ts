import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Task } from './task';
@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private apiUrl = 'https://localhost:7269/api/Todo'; // Your API endpoint

  constructor(private http: HttpClient) {}

  getTodoItems(): any {
    try {
      return this.http.get<Task[]>(this.apiUrl);
    } catch (err) {
      console.log(err);
    }
  }

  postTodoItem(data: any) {
    return this.http.post<Task>(this.apiUrl, data).pipe(
      catchError((err) => {
        console.error('Error in POST occurred:', err);
        return err;
      })
    );
  }

  putTodoItem(data: Task) {
    return this.http.put<Task>(this.apiUrl + `/${data.id}`, data);
  }

  deleteTodoItem(id: number) {
    return this.http.delete<Task>(this.apiUrl + `/${id}`);
  }
}
