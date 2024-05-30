# ToDoApp2

This is my second ToDo application, which is made using Angular for Frontend and ASP.Net Core + MySql database for Backend. 

## Requirements

* Frontend
  * Angular CLI
* Backend
  * [MySql server](https://downloads.mysql.com/archives/community/)
  * [.NET](https://dotnet.microsoft.com/en-us/download)
  * [MySql workbench](https://downloads.mysql.com/archives/workbench/)
 
_Please note that versions of MySql Server and Workbench must be equal and be compatible with your OS version!_

## Preparation
### General

1. Create new Angular Project;
2. Go into newly created folder and create new dotnet project by running:
   
   `dotnet new webapi --use-controllers -o TodoApi`

3. Inside of the TodoApi folder trust the HTTPS development certificate by running the following command:

   `dotnet dev-certs https --trust`
   
4. Run ASP.Net application:
   `dotnet run --launch-profile https`
   
### Creation of database

After installing MySql webserver, connect to it from MySql workbench. Use credentials you used, when installing. 

Create new database `mydb` (name however you want it, though) by running this query:

```
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



Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
