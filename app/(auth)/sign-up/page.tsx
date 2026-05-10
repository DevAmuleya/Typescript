"use client";

import AuthForm from "@/components/AuthForm";
import { signUpSchema } from "@/lib/validations";
import { signUp } from "@/lib/actions/auth";

const Page = () => (
  <AuthForm
    type="SIGN_UP"
    schema={signUpSchema}
    defaultValues={{
      email: "",
      password: "",
      fullName: "",
      universityId: 0,
      universityCard: "",
    }}
    onSubmit={signUp}
  />
);

export default Page;




// const page = () => {

//     const handleSignUp = async (data: any) => {
//     // 🔥 your real logic here (API call, fetch, etc.)
//     console.log("sign up data:", data);

//     // simulate backend response
//     return { success: true };
//    };

// return (
//   <AuthForm
//         type="SIGN_UP"
//         schema={signUpSchema}
//         defaultValues={{
//             email: "",
//             password: "",
//             fullName: "",
//             universityId: 0,
//             universityCard: "",

//         }}
//         onSubmit={handleSignUp}
//     />
//   )
// }

// export default page

