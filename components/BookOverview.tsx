import React from "react";
import Image from "next/image";
import BookCover from "@/components/BookCover";
import BorrowBook from "@/components/BorrowBook";
import type { Book } from "@/types";

interface Props extends Book {
  userId: string;
}

const BookOverview = async ({
  id,
  title,
  author,
  genre,
  rating,
  total_copies,
  available_copies,
  description,
  color,
  cover,
  userId,
}: Props) => {
  // MOCK USER DATA (temporary until database is connected)
  const user = userId
    ? {
        id: userId,
        status: "APPROVED",
        name: "Amuleya",
      }
    : null;

  const borrowingEligibility = {
    isEligible: available_copies > 0 && user?.status === "APPROVED",
    message:
      available_copies <= 0
        ? "Book is not available"
        : user?.status !== "APPROVED"
        ? "You are not eligible to borrow this book"
        : "",
  };

  return (
    <section className="book-overview">
      <div className="flex flex-1 flex-col gap-5">
        <h1>{title}</h1>

        <div className="book-info">
          <p>
            By{" "}
            <span className="font-semibold text-light-200">
              {author}
            </span>
          </p>

          <p>
            Category{" "}
            <span className="font-semibold text-light-200">
              {genre}
            </span>
          </p>

          <div className="flex flex-row gap-1">
            <Image
              src="/icons/star.svg"
              alt="star"
              width={22}
              height={22}
            />

            <p>{rating}</p>
          </div>
        </div>

        <div className="book-copies">
          <p>
            Total Books <span>{total_copies}</span>
          </p>

          <p>
            Available Books <span>{available_copies}</span>
          </p>
        </div>

        <p className="book-description">{description}</p>

        {user && (
          <BorrowBook
            userId={user.id}
            bookId={id}
            borrowingEligibility={borrowingEligibility}
          />
        )}
      </div>

      <div className="relative flex flex-1 justify-center">
        <div className="relative">
          <BookCover
            variant="wide"
            className="z-10"
            coverColor={color}
            coverImage={cover}
          />

          <div className="absolute left-16 top-10 rotate-12 opacity-40 max-sm:hidden">
            <BookCover
              variant="wide"
              coverColor={color}
              coverImage={cover}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookOverview;