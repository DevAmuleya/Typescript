import React from "react";
import BookCard from "@/components/BookCard";
import type { booklistProps } from "@/types";

const BookList = ({ title, books, containerClassName }: booklistProps) => {
  if (books.length < 2) return;

  return (
    <section className={containerClassName}>
      <h2 className="font-bebas-neue text-4xl text-light-100">{title}</h2>

      <ul className="book-list justify-center flex">
        {books.map((book) => (
          <BookCard key={book.title} {...book} />
        ))}
      </ul>
    </section>
  );
};
export default BookList;
