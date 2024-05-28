import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task } from '../task';
import { TodoService } from '../to-do.service';

@Component({
  selector: 'app-main-screen',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './main-screen.component.html',
  styleUrl: './main-screen.component.css',
})
export class MainScreenComponent implements OnInit {
  tasks: Task[] = [];
  input: string = '';
  isButtonDisabled: boolean = true;

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.todoService.getTodoItems().subscribe((data: Task[]) => {
      this.tasks = data;
      console.log(this.tasks);
    });
  }

  addTask() {
    const newTask = {
      id: this.tasks.length + 1, // Remove this line to let the backend generate the ID
      name: this.input,
      isComplete: false,
    };

    this.todoService.postTodoItem(newTask).subscribe(
      (response) => {
        console.log('Task created successfully:', response);
        this.tasks.push(response); // Add the new task to the local array
        this.input = ''; // Clear input field after adding task
        this.isButtonDisabled = true; // Assuming there's logic to manage the button state
      },
      (error) => {
        console.error('Error creating task:', error);
      }
    );
  }

  updateButtonState() {
    this.isButtonDisabled = this.input.trim().length === 0;
  }
  markAsDone(taskId: number) {
    // console.log(this.tasks);
    this.tasks[taskId].isComplete = !this.tasks[taskId].isComplete;
    // Implement your logic to mark the task as done
  }

  deleteTask(taskId: number) {
    console.log('Task deleted. Task ID:', taskId);
    // Implement your logic to delete the task
  }
}
