import React from 'react'
import { Button } from "@/components/ui/button";
import BookOverview from '@/components/BookOverview';
import BookList from '@/components/BookList';
import { sampleBooks } from '@/constants';
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";

const Home = async () => {
  
  const result = await db.select().from(users);
  console.log(JSON.stringify(result, null, 2));

  return (
    <>
      <BookOverview
        {...sampleBooks[0]}
        userId=""
      />

      <BookList
        title="Explore Books"
        books={sampleBooks}
        containerClassName="mt-20"
       />
    </>
  )
}

export default Home