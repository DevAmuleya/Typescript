"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Field,
  FieldContent,
  FieldLabel,
  FieldError,
  FieldSet,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { bookSchema } from "@/lib/validations";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import FileUpload from "@/components/FileUpload";
import ColorPicker from "@/components/admin/ColorPicker";
import { createBook } from "@/lib/admin/actions/book";
import { toast } from "sonner";
import type { Book } from "@/types";

interface Props extends Partial<Book> {
  type?: "create" | "update";
}

const BookForm = ({ type = "create", ...book }: Props) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof bookSchema>>({
    resolver: zodResolver(bookSchema),

    defaultValues: {
      title: book?.title || "",
      description: book?.description || "",
      author: book?.author || "",
      genre: book?.genre || "",
      rating: book?.rating || 1,
      totalCopies: book?.total_copies || 1,
      coverUrl: book?.cover || "",
      coverColor: book?.cover || "",
      videoUrl: book?.video || "",
      summary: book?.summary || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof bookSchema>) => {
    const result = await createBook(values);

    if (result.success) {
      toast.success(
        type === "update"
          ? "Book updated successfully"
          : "Book created successfully"
      );

      router.push(`/admin/books/${result.data.id}`);
    } else {
      toast.error(result.message);
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-8"
    >
      {/* BOOK TITLE */}
      <FieldSet>
        <Field>
          <FieldLabel className="text-base font-normal text-dark-500">
            Book Title
          </FieldLabel>

          <FieldContent>
            <Input
              {...form.register("title")}
              required
              placeholder="Book title"
              className="book-form_input"
            />
          </FieldContent>

          <FieldError>
            {form.formState.errors.title?.message}
          </FieldError>
        </Field>
      </FieldSet>

      {/* AUTHOR */}
      <FieldSet>
        <Field>
          <FieldLabel className="text-base font-normal text-dark-500">
            Author
          </FieldLabel>

          <FieldContent>
            <Input
              {...form.register("author")}
              required
              placeholder="Book author"
              className="book-form_input"
            />
          </FieldContent>

          <FieldError>
            {form.formState.errors.author?.message}
          </FieldError>
        </Field>
      </FieldSet>

      {/* GENRE */}
      <FieldSet>
        <Field>
          <FieldLabel className="text-base font-normal text-dark-500">
            Genre
          </FieldLabel>

          <FieldContent>
            <Input
              {...form.register("genre")}
              required
              placeholder="Book genre"
              className="book-form_input"
            />
          </FieldContent>

          <FieldError>
            {form.formState.errors.genre?.message}
          </FieldError>
        </Field>
      </FieldSet>

      {/* RATING */}
      <FieldSet>
        <Field>
          <FieldLabel className="text-base font-normal text-dark-500">
            Rating
          </FieldLabel>

          <FieldContent>
            <Input
              type="number"
              min={1}
              max={5}
              placeholder="Book rating"
              className="book-form_input"
              {...form.register("rating")}
            />
          </FieldContent>

          <FieldError>
            {form.formState.errors.rating?.message}
          </FieldError>
        </Field>
      </FieldSet>

      {/* TOTAL COPIES */}
      <FieldSet>
        <Field>
          <FieldLabel className="text-base font-normal text-dark-500">
            Total Copies
          </FieldLabel>

          <FieldContent>
            <Input
              type="number"
              min={1}
              max={10000}
              placeholder="Total copies"
              className="book-form_input"
              {...form.register("totalCopies")}
            />
          </FieldContent>

          <FieldError>
            {form.formState.errors.totalCopies?.message}
          </FieldError>
        </Field>
      </FieldSet>

      {/* COVER IMAGE */}
      <FieldSet>
        <Field>
          <FieldLabel className="text-base font-normal text-dark-500">
            Book Image
          </FieldLabel>

          <FieldContent>
            <FileUpload
              type="image"
              accept="image/*"
              placeholder="Upload a book cover"
              folder="books/covers"
              variant="light"
              value={form.watch("coverUrl")}
              onFileChange={(url) =>
                form.setValue("coverUrl", url, {
                  shouldValidate: true,
                })
              }
            />
          </FieldContent>

          <FieldError>
            {form.formState.errors.coverUrl?.message}
          </FieldError>
        </Field>
      </FieldSet>

      {/* COVER COLOR */}
      <FieldSet>
        <Field>
          <FieldLabel className="text-base font-normal text-dark-500">
            Primary Color
          </FieldLabel>

          <FieldContent>
            <ColorPicker
              value={form.watch("coverColor")}
              onPickerChange={(color) =>
                form.setValue("coverColor", color, {
                  shouldValidate: true,
                })
              }
            />
          </FieldContent>

          <FieldError>
            {form.formState.errors.coverColor?.message}
          </FieldError>
        </Field>
      </FieldSet>

      {/* DESCRIPTION */}
      <FieldSet>
        <Field>
          <FieldLabel className="text-base font-normal text-dark-500">
            Book Description
          </FieldLabel>

          <FieldContent>
            <Textarea
              {...form.register("description")}
              placeholder="Book description"
              rows={10}
              className="book-form_input"
            />
          </FieldContent>

          <FieldError>
            {form.formState.errors.description?.message}
          </FieldError>
        </Field>
      </FieldSet>

      {/* VIDEO URL */}
      <FieldSet>
        <Field>
          <FieldLabel className="text-base font-normal text-dark-500">
            Book Trailer
          </FieldLabel>

          <FieldContent>
            <FileUpload
              type="video"
              accept="video/*"
              placeholder="Upload a book trailer"
              folder="books/videos"
              variant="light"
              value={form.watch("videoUrl")}
              onFileChange={(url) =>
                form.setValue("videoUrl", url, {
                  shouldValidate: true,
                })
              }
            />
          </FieldContent>

          <FieldError>
            {form.formState.errors.videoUrl?.message}
          </FieldError>
        </Field>
      </FieldSet>

      {/* SUMMARY */}
      <FieldSet>
        <Field>
          <FieldLabel className="text-base font-normal text-dark-500">
            Book Summary
          </FieldLabel>

          <FieldContent>
            <Textarea
              {...form.register("summary")}
              placeholder="Book summary"
              rows={5}
              className="book-form_input"
            />
          </FieldContent>

          <FieldError>
            {form.formState.errors.summary?.message}
          </FieldError>
        </Field>
      </FieldSet>

      <Button
        type="submit"
        className="book-form_btn text-white"
      >
        {type === "update"
          ? "Update Book"
          : "Add Book to Library"}
      </Button>
    </form>
  );
};

export default BookForm;