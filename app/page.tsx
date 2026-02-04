"use client";

import { useState } from "react";
import { trpc } from "@/trpc/client";
import { useRouter } from "next/navigation";
export default function Page() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [form, setForm] = useState({
    name: "",
    age: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [user, setUser] = useState<null | {
    id: number;
    name: string;
    email: string;
    age: number;
  }>(null);

  const createUser = trpc.userRouter.createUser.useMutation();
  const loginUser = trpc.userRouter.login.useMutation();
  const logoutUser = trpc.userRouter.logout.useMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    if (isSignUp) {
      try {
        await createUser.mutateAsync({
          name: form.name,
          age: Number(form.age),
          email: form.email,
          password: form.password,
        });
        setMessage("Sign up successful! You can now sign in.");
        setIsSignUp(false);
      } catch (err) {
        setMessage(err instanceof Error ? err.message : "Sign up failed");
      }
    } else {
      try {
        const u = await loginUser.mutateAsync({
          email: form.email,
          password: form.password,
        });
        setUser(u);
        setMessage("Login successful!");
        // redirect("/dashboard")
        router.push("/dashboard");
      } catch (err) {
        setMessage(err instanceof Error ? err.message : "Login failed");
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser.mutateAsync();
      setUser(null);
      setMessage("Logged out successfully");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Logout failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      {user ? (
        <>
          <h2 className="text-2xl font-bold mb-4">Welcome, {user.name}!</h2>
          <p className="mb-4">Email: {user.email}</p>
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 text-white p-2 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-4">
            {isSignUp ? "Sign Up" : "Sign In"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <>
                <input
                  name="name"
                  placeholder="Name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
                <input
                  name="age"
                  type="number"
                  placeholder="Age"
                  value={form.age}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </>
            )}
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
            >
              {isSignUp ? "Sign Up" : "Sign In"}
            </button>
          </form>
          <button
            className="mt-4 text-blue-600 underline"
            onClick={() => setIsSignUp((v) => !v)}
          >
            {isSignUp
              ? "Already have an account? Sign In"
              : "Don't have an account? Sign Up"}
          </button>
        </>
      )}
      {message && (
        <div className="mt-4 text-center text-red-600">{message}</div>
      )}
    </div>
  );
}
