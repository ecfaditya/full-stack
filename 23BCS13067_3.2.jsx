// App.jsx
import React, { useState } from "react";

const App = () => {
  const [books, setBooks] = useState([
    { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald" },
    { id: 2, title: "To Kill a Mockingbird", author: "Harper Lee" },
    { id: 3, title: "1984", author: "George Orwell" },
  ]);

  const [search, setSearch] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase())
  );

  const addBook = (e) => {
    e.preventDefault();
    if (newTitle.trim() === "" || newAuthor.trim() === "") return;
    const newBook = {
      id: Date.now(),
      title: newTitle,
      author: newAuthor,
    };
    setBooks([...books, newBook]);
    setNewTitle("");
    setNewAuthor("");
  };

  const removeBook = (id) => {
    setBooks(books.filter((book) => book.id !== id));
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1 style={{ textAlign: "center" }}>Library Management</h1>

      <input
        type="text"
        placeholder="Search by title or author..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: "8px",
          marginBottom: "20px",
          width: "100%",
          maxWidth: "400px",
          display: "block",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      />

      <form onSubmit={addBook} style={{ marginBottom: "20px", textAlign: "center" }}>
        <input
          type="text"
          placeholder="Book Title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          style={{ padding: "8px", marginRight: "10px" }}
        />
        <input
          type="text"
          placeholder="Author"
          value={newAuthor}
          onChange={(e) => setNewAuthor(e.target.value)}
          style={{ padding: "8px", marginRight: "10px" }}
        />
        <button type="submit" style={{ padding: "8px 16px" }}>
          Add Book
        </button>
      </form>

      <ul style={{ listStyle: "none", padding: 0, maxWidth: "500px", margin: "auto" }}>
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book) => (
            <li
              key={book.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                border: "1px solid #ddd",
                borderRadius: "6px",
                padding: "10px",
                marginBottom: "10px",
              }}
            >
              <span>
                <strong>{book.title}</strong> by {book.author}
              </span>
              <button
                onClick={() => removeBook(book.id)}
                style={{
                  background: "red",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  padding: "6px 10px",
                  cursor: "pointer",
                }}
              >
                Remove
              </button>
            </li>
          ))
        ) : (
          <p style={{ textAlign: "center" }}>No books found.</p>
        )}
      </ul>
    </div>
  );
};

export default App;
