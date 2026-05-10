"use client";

import { z, type ZodType } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useForm,
  Controller,
  type FieldValues,
  type DefaultValues,
  type Path,
} from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import Link from "next/link";
import { FIELD_NAMES, FIELD_TYPES } from "@/constants";
import { useRouter } from "next/navigation";
//import FileUpload from "@/components/FileUpload";
import ImageUpload from "@/components/ImageUpload";
import { toast } from "sonner"

interface Props<T extends FieldValues> {
  schema: ZodType<T, any>;
  defaultValues: DefaultValues<T>;
  onSubmit: (data: T) => Promise<{ success: boolean; error?: string }>;
  type: "SIGN_IN" | "SIGN_UP";
}

const AuthForm = <T extends FieldValues>({
  type,
  schema,
  defaultValues,
  onSubmit,
}: Props<T>) => {
  const router = useRouter();
  const isSignIn = type === "SIGN_IN";

  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const handleSubmit = async (data: T) => {
    const result = await onSubmit(data);

    if (result.success) {
    toast.success(
        isSignIn
        ? "You have successfully signed in."
        : "You have successfully signed up."
    );

    router.push("/");
    } else {
    toast.error(
        result.error ??
        `Error ${isSignIn ? "signing in" : "signing up"}`
    );
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <h1 className="text-2xl font-semibold text-white">
        {isSignIn
          ? "Welcome back to BookWise"
          : "Create your library account"}
      </h1>

      <p className="text-light-100">
        {isSignIn
          ? "Access the vast collection of resources, and stay updated"
          : "Please complete all fields and upload a valid university ID to gain access to the library"}
      </p>

      {/* Form */}
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="w-full space-y-6"
      >
        <FieldGroup>
          {Object.keys(defaultValues).map((name) => (
            <Controller
              key={name}
              control={form.control}
              name={name as Path<T>}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel className="capitalize">
                    {
                      FIELD_NAMES[
                        field.name as keyof typeof FIELD_NAMES
                      ]
                    }
                  </FieldLabel>

                  <FieldContent>
                    {field.name === "universityCard" ? (
                      <ImageUpload onFileChange={field.onChange} />
                    ) : ( 
                      <Input
                        {...field}
                        required
                        type={
                          FIELD_TYPES[
                            field.name as keyof typeof FIELD_TYPES
                          ]
                        }
                        {...field}
                        className="form-input"
                      />
                    )}
                  </FieldContent>

                  {fieldState.error && (
                    <FieldError>
                      {fieldState.error.message}
                    </FieldError>
                  )}
                </Field>
              )}
            />
          ))}
        </FieldGroup>

        <Button type="submit" className="form-btn">
          {isSignIn ? "Sign In" : "Sign Up"}
        </Button>
      </form>

      {/* Footer */}
      <p className="text-center text-base font-medium">
        {isSignIn ? "New to BookWise? " : "Already have an account? "}

        <Link
          href={isSignIn ? "/sign-up" : "/sign-in"}
          className="font-bold text-primary"
        >
          {isSignIn ? "Create an account" : "Sign in"}
        </Link>
      </p>
    </div>
  );
};

export default AuthForm;