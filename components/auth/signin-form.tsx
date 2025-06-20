// // "use client";

// // import { useState } from "react";
// // import { useRouter } from "next/navigation";
// // import { supabase } from "@/lib/supabase";

// // export function SignInForm() {
// //   const [email, setEmail] = useState("");
// //   const [password, setPassword] = useState("");
// //   const [error, setError] = useState("");
// //   const router = useRouter();

// //   const handleSignIn = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     setError("");
// //     const { error } = await supabase.auth.signInWithPassword({
// //       email,
// //       password,
// //     });
// //     if (error) {
// //       setError(error.message);
// //     } else {
// //       router.push("/"); // Redirect on success
// //     }
// //   };

// //   return (
// //     <form onSubmit={handleSignIn}>
// //       <input
// //         type="email"
// //         value={email}
// //         onChange={(e) => setEmail(e.target.value)}
// //         placeholder="Email"
// //         required
// //       />
// //       <input
// //         type="password"
// //         value={password}
// //         onChange={(e) => setPassword(e.target.value)}
// //         placeholder="Password"
// //         required
// //       />
// //       {error && <div>{error}</div>}
// //       <button type="submit">Sign In</button>
// //     </form>
// //   );
// // }

// "use client";

// import { useForm } from "react-hook-form";
// import { useRouter } from "next/navigation";
// import { supabase } from "@/lib/supabase";

// interface SignInFormData {
//   email: string;
//   password: string;
// }

// export function SignInForm() {
//   const router = useRouter();
//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//     setError,
//     clearErrors,
//   } = useForm<SignInFormData>();

//   const onSubmit = async (data: SignInFormData) => {
//     clearErrors();

//     try {
//       const { error } = await supabase.auth.signInWithPassword({
//         email: data.email,
//         password: data.password,
//       });

//       if (error) {
//         setError("root", { message: error.message });
//       } else {
//         router.push("/"); // Redirect on success
//       }
//     } catch (err) {
//       setError("root", { message: "An unexpected error occurred" });
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit(onSubmit)}>
//       <div>
//         <input
//           type="email"
//           placeholder="Email"
//           {...register("email", {
//             required: "Email is required",
//             pattern: {
//               value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
//               message: "Invalid email address",
//             },
//           })}
//         />
//         {errors.email && (
//           <div style={{ color: "red" }}>{errors.email.message}</div>
//         )}
//       </div>

//       <div>
//         <input
//           type="password"
//           placeholder="Password"
//           {...register("password", {
//             required: "Password is required",
//             minLength: {
//               value: 6,
//               message: "Password must be at least 6 characters",
//             },
//           })}
//         />
//         {errors.password && (
//           <div style={{ color: "red" }}>{errors.password.message}</div>
//         )}
//       </div>

//       {errors.root && <div style={{ color: "red" }}>{errors.root.message}</div>}

//       <button type="submit" disabled={isSubmitting}>
//         {isSubmitting ? "Signing In..." : "Sign In"}
//       </button>
//     </form>
//   );
// }

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithPassword } from "@/lib/data-service";

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export function SignInForm() {
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const validateForm = (formData: FormData): FormErrors => {
    const errors: FormErrors = {};
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email) {
      errors.email = "Email is required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      errors.email = "Invalid email address";
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    return errors;
  };

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    setErrors({});

    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const result = await signInWithPassword({ email, password });

      if (result.success) {
        // Redirect to home page - Supabase automatically handles localStorage
        router.push("/");
        router.refresh();
      } else {
        setErrors({ general: result.error || "Sign in failed" });
      }
    } catch (err) {
      setErrors({ general: "An unexpected error occurred" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Sign In
      </h2>

      <form action={handleSubmit} className="space-y-4">
        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
            disabled={isSubmitting}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
            disabled={isSubmitting}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        {errors.general && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {errors.general}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
          } text-white`}
        >
          {isSubmitting ? "Signing In..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
