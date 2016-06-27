/**
 * Copyright 2016 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the “License”);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an “AS IS” BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
using Microsoft.EntityFrameworkCore;
using Npgsql.EntityFrameworkCore.PostgreSQL;
using System.Linq;

namespace EFCoreToDo.Models
{
    public class ToDoDbContext : DbContext
    {
        public DbSet<ToDoItem> ToDoItems { get; set; }

        public ToDoDbContext(DbContextOptions<ToDoDbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.HasPostgresExtension("uuid-ossp");
        }
        
        internal void PopulateDatabase()
        {
            if (!ToDoItems.Any())
            {
                ToDoItems.Add(new ToDoItem { Text = "First ToDo" });
                ToDoItems.Add(new ToDoItem { Text = "Second ToDo" });
                ToDoItems.Add(new ToDoItem { Text = "Third ToDo" });
                SaveChanges();
            }
        }
    }
}
