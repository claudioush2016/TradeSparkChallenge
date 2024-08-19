import { Component, OnInit } from '@angular/core';
import { BookStoreService } from '../book-store.service';

@Component({
  selector: 'app-book-store',
  templateUrl: './book-store.component.html',
  styleUrls: ['./book-store.component.css']
})
export class BookStoreComponent implements OnInit {

  books: any[] = [];
  filterText: string = '';
  filterCriteria : string = "title";
  selectedBookTitle: string = '';
  categoryToDelete: string = '';
  message: string = ''; 
  book_delete_id : number;
  constructor(private bookStoreService: BookStoreService) { }

  ngOnInit(): void {
    this.bookStoreService.getBooks().subscribe((data: any[]) => {
      this.books = data;
    })
  }

  categoriesToString(categories: any[]): string {
    let categoriesString = "";
    categories.forEach((category, index) => {
      categoriesString += category.name;
      if (index < categories.length - 1) {
        categoriesString += ", ";
      }
    });
    return categoriesString;
  }


  filteredBooks() {
    if (!this.filterText) {
      return this.books;
    }

    const lowerFilter = this.filterText.toLowerCase();
    return this.books.filter(book => {
      if (this.filterCriteria === 'title') {
        return book["title"].toLowerCase().includes(lowerFilter);
      } else if (this.filterCriteria === 'author') {
        return book["author"]["name"].toLowerCase().includes(lowerFilter);
      } else if (this.filterCriteria === 'category') {
        return this.categoriesToString(book['categories']).toLowerCase().includes(lowerFilter);
      }
      return false;
    });
  }


  deleteCategory() {
    let refresh = false;
    if (this.book_delete_id !== null && this.categoryToDelete) {
      const selectedBook = this.books.find(book => book.id == this.book_delete_id);
      const category = selectedBook.categories.find(category => category.name.toLowerCase() === this.categoryToDelete.toLowerCase())
      if(category){
        this.bookStoreService.deleteCategoryFromBook(this.book_delete_id,selectedBook.title, this.categoryToDelete, category.id)
          .subscribe(response => {
            if (response.status === 'success')
              refresh = true;
              this.message = response.message;

          }, error => {
            this.message = 'An error occurred. Please try again.';
          });
      } else {
        this.message = "The category " + this.categoryToDelete + " does not exist in this book";
      }
    }else  this.message = 'Please select a book and enter a category to delete.';
    setTimeout(() => {
      this.message = "";
      if (refresh){
        this.ngOnInit();
      }
    }, 3000);
    
  }


}
