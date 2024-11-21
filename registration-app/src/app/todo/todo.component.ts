import { Component, OnInit } from '@angular/core';
import { TodoServiceService } from './todo-service.service';
import { Todo } from '../models/todo.model';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit {

  todos: Todo[] = [];
  filteredTodos: Todo[] = [];
  newTodo: Todo = { id: 0, title: '', description: '', status: 'incomplete' };
  filter: string = 'all'; // Used to track the selected filter (all, completed, incomplete)

  // Define the displayed columns for the table
  displayedColumns: string[] = ['title', 'description', 'status', 'actions'];

  constructor(private todoService: TodoServiceService) {}

  ngOnInit(): void {
    this.fetchTodos();
  }

  // Fetch and set the list of todos
  fetchTodos(): void {
    this.todoService.getTodos().subscribe(todos => {
      this.todos = todos;
      this.applyFilter(); // Apply the selected filter when fetching todos
    });
  }

  // Add or update a todo item
  onSubmit(): void {
    if (this.newTodo.id === 0) {
      this.todoService.createTodo(this.newTodo).subscribe((data: Todo) => {
        this.todos.push(data);
        this.applyFilter(); // Apply the current filter after adding
        this.resetForm();
      });
    } else {
      this.todoService.updateTodo(this.newTodo).subscribe((data: Todo) => {
        const index = this.todos.findIndex(todo => todo.id === data.id);
        if (index > -1) {
          this.todos[index] = data;
        }
        this.applyFilter(); // Apply the current filter after updating
        this.resetForm();
      });
    }
  }

  // Edit an existing todo
  onEdit(todo: Todo): void {
    this.newTodo = { ...todo };
  }

  // Reset the form fields
  resetForm(): void {
    this.newTodo = { id: 0, title: '', description: '', status: 'incomplete' };
  }

  // Delete a todo item
  onDelete(id: number): void {
    this.todoService.deleteTodo(id).subscribe(() => {
      this.todos = this.todos.filter(todo => todo.id !== id);
      this.applyFilter(); // Apply the current filter after deletion
    });
  }

  // Toggle the completion status of a todo item
  toggleStatus(id: number): void {
    this.todoService.toggleStatus(id).subscribe(updatedTodo => {
      const todo = this.todos.find(t => t.id === id);
      if (todo) {
        todo.status = updatedTodo.status;
      }
      this.applyFilter(); // Apply the current filter after status change
    });
  }

  // Show all todos
  showAll(): void {
    this.filter = 'all';
    this.applyFilter();
  }

  // Show only completed todos
  showCompleted(): void {
    this.filter = 'completed';
    this.applyFilter();
  }

  // Show only pending todos
  showPending(): void {
    this.filter = 'incomplete';
    this.applyFilter();
  }

  // Apply the current filter to refresh the displayed list
  private applyFilter(): void {
    switch (this.filter) {
      case 'completed':
        this.filteredTodos = this.todos.filter(todo => todo.status === 'completed');
        break;
      case 'incomplete':
        this.filteredTodos = this.todos.filter(todo => todo.status === 'incomplete');
        break;
      default:
        this.filteredTodos = this.todos;
        break;
    }
  }
}
