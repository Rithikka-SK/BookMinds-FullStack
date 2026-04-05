//Entity class representing a book in the BookMinds application.
// It includes FIELDS for the book's title, category, favorite status, and a summary text.

package com.bookminds.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

/* * @Entity (JPA Annotation):  Tells Spring Boot, "Take this entire Java class and map it to a table in
 * the MySQL database." Every new Book object created in Java will eventually
 * become a new row in that database table.
 */
@Entity
// @Data: Lombok auto-generates all getters, setters, and constructors at Compile Time.
@Data
public class Book {
    // @Id marks this as the Primary Key.
    @Id
    // @GeneratedValue tells MySQL to auto-increment the ID automatically.
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String category;

    private boolean isFavorite;

    // Standard is VARCHAR(255) but overrides that to TEXT data type
    // for longer paragraphs (up to 65,535 characters!).
    @Column(columnDefinition = "TEXT")
    private String summaryText;
}