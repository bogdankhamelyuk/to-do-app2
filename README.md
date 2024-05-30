# ToDoApp2

This is my second ToDo application, which is made using Angular for Frontend and ASP.Net Core + MySql database for Backend. 

## Requirements

* Frontend
  * [Angular CLI](https://www.npmjs.com/package/@angular/cli)
* Backend
  * [MySql server](https://downloads.mysql.com/archives/community/)
  * [.NET](https://dotnet.microsoft.com/en-us/download)
  * [MySql workbench](https://downloads.mysql.com/archives/workbench/)
 
_Please note that versions of MySql Server and Workbench must be equal and be compatible with your OS version!_

## Preparation
### General

1. Create new Angular Project:
```console
ng new to-do-app2  
```
  
2. Go into newly created folder and create new dotnet project by running:
```console
dotnet new webapi --use-controllers -o TodoApi
```

3. Inside of the TodoApi folder trust the HTTPS development certificate by running the following command:
```console
dotnet dev-certs https --trust
```
   
4. Run ASP.Net application:
   `dotnet run --launch-profile https`
   
### Creation of database

After installing MySql webserver, connect to it from MySql workbench. Use credentials you used, when installing. 

Create new database `mydb` (name however you want it, though) by running this query:

```sql
CREATE DATABASE mydb;
```

After running this command a new, empty database will be created.


## Setting up
### Backend

#### Connection string
Open `appsettings.json` inside of the TodoApi folder and add connection string into the general scope:

```json
"ConnectionStrings": {
    "DefaultConnection": "server=localhost;port=3306;database=mydb;user=root;password=<your_password_here>"
  },
```
_Please make sure that the values for `server`, `port` etc. are those ones, which are used, when installing MySql server._

#### Add a model class
A model is a set of classes that represent the data that the app manages. This will be used later by the Entity Framework to automatically create new table inside of database

The model for this app is the `TodoItem` class.

1) Add a folder named Models.
2) Add a TodoItem.cs file to the Models folder with the following code:

```cs
namespace TodoApi.Models;

public class TodoItem
{
    public long Id { get; set; }
    public string? Name { get; set; }
    public bool IsComplete { get; set; }
}
```

#### Add a database context
The database context is the main class that coordinates Entity Framework functionality for a data model. This class is created by deriving from the `Microsoft.EntityFrameworkCore.DbContext` class.

```cs
using Microsoft.EntityFrameworkCore;

namespace TodoApi.Models;

public class TodoContext : DbContext
{
    public TodoContext(DbContextOptions<TodoContext> options)
        : base(options)
    {
    }
    public DbSet<TodoItem> TodoItems { get; set; } = null!;
}
```

#### Register the database context
In ASP.NET Core, services such as the DB context must be registered with the dependency injection (DI) container. The container provides the service to controllers.
Update your `Program.cs` with this code:

```cs
using Microsoft.EntityFrameworkCore;
using TodoApi.Models;
using MySql.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// ASP.NET Core uses Dependency Injection (DI) to manage the lifetime and dependencies of services. 
// By calling AddDbContext<TodoContext>, you are registering TodoContext with the DI container.
builder.Services.AddDbContext<TodoContext>(options =>
    options.UseMySQL(builder.Configuration.GetConnectionString("DefaultConnection")));

// Do not forget about CORS:
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
        policy =>
        {
            policy.WithOrigins("http://localhost:4200")
                  .WithMethods("PUT", "DELETE", "GET", "POST")
                  .WithHeaders("Origin", "X-Requested-With", "Content-Type", "Accept");
        });
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowSpecificOrigin");
app.UseAuthorization();

app.MapControllers();

app.Run();

```
#### Install packages

```console
dotnet add package MySql.EntityFrameworkCore
dotnet add package Microsoft.VisualStudio.Web.CodeGeneration.Design
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet add package Microsoft.EntityFrameworkCore.SqlServer
dotnet add package Microsoft.EntityFrameworkCore.Tools
dotnet tool uninstall -g dotnet-aspnet-codegenerator
dotnet tool install -g dotnet-aspnet-codegenerator
dotnet tool update -g dotnet-aspnet-codegenerator
```

The preceding commands:

* Add NuGet packages required for scaffolding.
* Install the scaffolding engine (dotnet-aspnet-codegenerator) after uninstalling any possible previous version.

#### Update the database and make migration
Make sure you are in the TodoApi folder and then update the database and migrate it:

```console

dotnet ef migrations add mySqlMigration --context TodoContext

dotnet ef database update --context TodoContext
```
#### Build the project.

The command below will create controller in the new directory `Controllers`. This controller is responsible for processing the incoming inquiries via HTTPS. 

```console
dotnet aspnet-codegenerator controller -name TodoItemsController -async -api -m TodoItem -dc TodoContext -outDir Controllers
```

#### Update the PostTodoItem create method
Update the return statement in the PostTodoItem to use the nameof operator:

```cs
[HttpPost]
public async Task<ActionResult<TodoItem>> PostTodoItem(TodoItem todoItem)
{
    _context.TodoItems.Add(todoItem);
    await _context.SaveChangesAsync();

    return CreatedAtAction(nameof(PostTodoItem), new { id = todoItem.Id }, todoItem);
}
```

### Frontend

#### Creating service
In the frontend make sure to create service by running this command:

```console
ng g s to-do 
```
Paste following code inside:

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

```

Import this service in your component and call it inside of the functions as follows:

```typescript
this.todoService.deleteTodoItem(taskId).subscribe(
      (response: any) => {
        const index = this.tasks.findIndex((task) => task.id === taskId);
        if (index > -1) {
          this.tasks.splice(index, 1);
        }
      },
      (error: any) => {
        console.error('error upd task: ', error);
      }
);
```
It is important to mention, that UI logic must be inside of the `subscribe` method, otherwise changes won't be visible.

### Further details

To get more details on the frontend code you may check `/src/app/main-screen` folder. There you may see how stylings was applied and many more.
