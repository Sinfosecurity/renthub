// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { supabase } from "@/lib/supabase";

// export function SignInForm() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const router = useRouter();

//   const handleSignIn = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");
//     const { error } = await supabase.auth.signInWithPassword({
//       email,
//       password,
//     });
//     if (error) {
//       setError(error.message);
//     } else {
//       router.push("/"); // Redirect on success
//     }
//   };

//   return (
//     <form onSubmit={handleSignIn}>
//       <input
//         type="email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         placeholder="Email"
//         required
//       />
//       <input
//         type="password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//         placeholder="Password"
//         required
//       />
//       {error && <div>{error}</div>}
//       <button type="submit">Sign In</button>
//     </form>
//   );
// }

"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface SignInFormData {
  email: string;
  password: string;
}

export function SignInForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm<SignInFormData>();

  const onSubmit = async (data: SignInFormData) => {
    clearErrors();

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        setError("root", { message: error.message });
      } else {
        router.push("/"); // Redirect on success
      }
    } catch (err) {
      setError("root", { message: "An unexpected error occurred" });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <input
          type="email"
          placeholder="Email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          })}
        />
        {errors.email && (
          <div style={{ color: "red" }}>{errors.email.message}</div>
        )}
      </div>

      <div>
        <input
          type="password"
          placeholder="Password"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
        />
        {errors.password && (
          <div style={{ color: "red" }}>{errors.password.message}</div>
        )}
      </div>

      {errors.root && <div style={{ color: "red" }}>{errors.root.message}</div>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Signing In..." : "Sign In"}
      </button>
    </form>
  );
}
