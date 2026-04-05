package com.bookminds.backend.repository;

import com.bookminds.backend.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

// @Repository tells Spring to create a Bean for this database component.
@Repository
/* * By extending JpaRepository<EntityName, PrimaryKeyType>, Spring Boot
 * automatically generates all the standard CRUD (Create, Read, Update, Delete)
 * database queries for us. No need to write SQL!
 */
public interface BookRepository extends JpaRepository<Book, Long> {
    // It stays empty! All the basic methods are inherited automatically.
}