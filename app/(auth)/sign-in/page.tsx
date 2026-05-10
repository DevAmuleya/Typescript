"use client";

import React from "react";
import AuthForm from "@/components/AuthForm";
import { signInSchema } from "@/lib/validations";
import { signInWithCredentials } from "@/lib/actions/auth";

const Page = () => (
  <AuthForm
    type="SIGN_IN"
    schema={signInSchema}
    defaultValues={{
      email: "",
      password: "",
    }}
    onSubmit={signInWithCredentials}
  />
);

export default Page;





// const Page = () => {
//   const handleSignIn = async (data: any) => {
//     // 🔥 your real logic here (API call, fetch, etc.)
//     console.log("sign in data:", data);

//     // simulate backend response
//     return { success: true };
//   };

//   return (
//     <AuthForm
//       type="SIGN_IN"
//       schema={signInSchema}
//       defaultValues={{
//         email: "",
//         password: "",
//       }}
//       onSubmit={handleSignIn}
//     />
//   );
// };

// export default Page;