import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Task {
  id: number;
  text: string;
  done: boolean;
}

@Component({
  selector: 'app-main-screen',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './main-screen.component.html',
  styleUrl: './main-screen.component.css',
})
export class MainScreenComponent {
  tasks: Task[] = [];
  input: string = '';
  isButtonDisabled: boolean = true;

  addTask() {
    const newTask: Task = {
      id: this.tasks.length + 1,
      text: this.input,
      done: false,
    };
    this.tasks.push(newTask);
    this.input = ''; // Clear input field after adding task
    this.isButtonDisabled = true;
  }
  updateButtonState() {
    this.isButtonDisabled = this.input.trim().length === 0;
  }
  markAsDone(taskId: number) {
    // console.log(this.tasks);
    this.tasks[taskId].done = !this.tasks[taskId].done;
    // Implement your logic to mark the task as done
  }

  deleteTask(taskId: number) {
    console.log('Task deleted. Task ID:', taskId);
    // Implement your logic to delete the task
  }
}
