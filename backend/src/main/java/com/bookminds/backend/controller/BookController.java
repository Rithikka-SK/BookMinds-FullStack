package com.bookminds.backend.controller;

import com.bookminds.backend.entity.Book;
import com.bookminds.backend.repository.BookRepository;
import com.bookminds.backend.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

//@RestController: Tells Spring to return pure data (JSON) instead of HTML pages.
@RestController
//@RequestMapping: Sets the base URL (http://localhost:8080/api/books) for this entire class.
@RequestMapping("/api/books")
//@CrossOrigin: Bypasses browser security (CORS) so our separate frontend can talk to this backend.
@CrossOrigin(origins = "*")


public class BookController {

    // 1. Declare your dependencies as 'final'.
    // This ensures they can never be disconnected once Spring plugs them in.
    private final BookRepository bookRepository;
    private final BookService bookService;

    /* * 2. CONSTRUCTOR INJECTION (Industry Standard)
     * We don't use @Autowired on the variables anymore. Instead, when Spring Boot
     * builds this Controller, it automatically passes the Repository and Service
     * right through this constructor.
     */
    public BookController(BookRepository bookRepository, BookService bookService) {
        this.bookRepository = bookRepository;
        this.bookService = bookService;
    }

    // 1. Get a list of all books
    @GetMapping
    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    // 2. Add a brand new book to the database
    @PostMapping
    public Book createBook(@RequestBody Book book) {
        return bookService.saveBook(book);
    }

    // 3. Update the summary of an existing book

    // Handles PUT requests to update a specific book's summary using its ID from the URL.
    //{ID} makes it dynamic so we can update any book by changing the ID in the request URL.
    @PutMapping("/{id}/summary")
    public Book updateBookSummary(@PathVariable Long id, @RequestBody Map<String, String> request) {
        String summaryText = request.get("summaryText");
        return bookService.updateBookSummary(id, summaryText);
    }

    // 4. Delete an existing book by id
    //@DeleteMapping: Listens specifically for HTTP DELETE requests.
    // "/{id}" - dynamic placeholder: Captures the ID from the URL (e.g., /api/books/12) using @PathVariable.

    //If a user clicks the "Delete" button on the book with ID 12 in your frontend,
    // your JavaScript will send a DELETE request to http://localhost:8080/api/books/12.

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable Long id) {
        // Call service to delete the book and return no content
        bookService.deleteBook(id);
        return ResponseEntity.noContent().build();
    }
}