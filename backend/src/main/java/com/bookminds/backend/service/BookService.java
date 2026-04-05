package com.bookminds.backend.service;

import com.bookminds.backend.entity.Book;
import com.bookminds.backend.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

// @Service marks this as the Business Logic layer and creates a Spring Bean.
@Service
public class BookService{

    @Autowired
    private BookRepository bookRepository;

    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    public Book saveBook(Book book) {
        return bookRepository.save(book);
    }

    public Book updateBookSummary(Long id, String summaryText) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found with id: " + id));
        //Setter method provided by lombok
        book.setSummaryText(summaryText);
        return bookRepository.save(book);
    }

    // Delete a book by its id. Short, clear comments inside for learning.

    // @Transactional ensures this entire method succeeds or fails as one single unit.
    // If an error happens, it rolls back the database to prevent partial deletions.
    @Transactional
    public void deleteBook(Long id) {
        // Check for null id and fail fast with a clear message
        if (id == null) {
            throw new RuntimeException("Provided id must not be null");
        }

        // Ensure the book exists; throw a clear error if not found (helps map to 404)
        bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found with id: " + id));

        // Delete the entity by id; JPA will execute a SQL DELETE on transaction commit
        bookRepository.deleteById(id);
    }
}