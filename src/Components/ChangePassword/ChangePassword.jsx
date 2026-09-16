import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FiCheck,
  FiEye,
  FiEyeOff,
  FiLock,
  FiShield,
} from "react-icons/fi";
import { ImSpinner6 } from "react-icons/im";
import ErrorMsg from "../../Components/ErrorMsg/ErrorMsg";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

export default function ChangePassword() {
  const [visibleFields, setVisibleFields] = useState({
    current: false,
    next: false,
    confirm: false,
  });

  const schema = z
    .object({
      current: z.string().min(1, "Current password is required"),

      next: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(
          /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])/,
          "Password must contain uppercase, lowercase, number and special character"
        ),

      confirm: z
        .string()
        .min(1, "Please confirm your new password"),
    })
    .refine((data) => data.next === data.confirm, {
      message: "Passwords do not match",
      path: ["confirm"],
    });

  const form = useForm({
    defaultValues: {
      current: "",
      next: "",
      confirm: "",
    },
    resolver: zodResolver(schema),
    mode: "all",
  });

  const {
    register,
    handleSubmit,
    formState,
    reset,
  } = form;

  function toggleField(field) {
    setVisibleFields((fields) => ({
      ...fields,
      [field]: !fields[field],
    }));
  }

  function changePass(values) {
    return axios.patch(
      "https://route-posts.routemisr.com/users/change-password",
      {
        password: values.current,
        newPassword: values.next,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          "Content-Type": "application/json",
        },
      }
    );
  }

  const { mutate, isPending } = useMutation({
    mutationFn: changePass,

    onSuccess: (response) => {
      const newToken = response?.data?.data?.token;

      if (newToken) {
        localStorage.setItem("userToken", newToken);
      }

      toast.success("Password changed successfully");

      reset();

      setVisibleFields({
        current: false,
        next: false,
        confirm: false,
      });
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to change password"
      );
    },
  });

  function handleChangePassword(values) {
    mutate(values);
  }

  const fields = [
    {
      name: "current",
      label: "Current password",
      placeholder: "Enter your current password",
    },
    {
      name: "next",
      label: "New password",
      placeholder: "Create a new password",
    },
    {
      name: "confirm",
      label: "Confirm new password",
      placeholder: "Repeat your new password",
    },
  ];

  return (
    <>
      <title>Change Password | Linky</title>

      <main className="min-h-[calc(100vh-4rem)] bg-slate-50 px-4 py-10 sm:px-8 lg:px-14">
        <div className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm lg:grid-cols-[0.85fr_1.15fr]">

          <section className="relative overflow-hidden bg-sky-500 px-6 py-8 text-white sm:p-10 lg:p-12">
            <div className="absolute -right-16 -top-20 h-52 w-52 rounded-full border-[28px] border-white/10" />

            <div className="absolute -bottom-24 -left-16 h-56 w-56 rounded-full border-[32px] border-white/10" />

            <div className="relative flex h-full flex-col justify-between gap-16">

              <div>
                <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20">
                  <FiShield size={28} />
                </div>

                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-sky-100">
                  Account security
                </p>

                <h1 className="max-w-xs text-3xl font-bold leading-tight sm:text-4xl">
                  Keep your account protected.
                </h1>

                <p className="mt-5 max-w-sm text-sm leading-6 text-sky-50">
                  Choose a strong password that is unique to your Linky
                  account.
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/15">
                <p className="mb-3 text-sm font-semibold">
                  A strong password should have:
                </p>

                <ul className="space-y-2 text-sm text-sky-50">
                  <li className="flex items-center gap-2">
                    <FiCheck />
                    At least 8 characters
                  </li>

                  <li className="flex items-center gap-2">
                    <FiCheck />
                    Uppercase and lowercase letters
                  </li>

                  <li className="flex items-center gap-2">
                    <FiCheck />
                    A number and special character
                  </li>
                </ul>
              </div>

            </div>
          </section>

          <section className="px-6 py-8 sm:p-10 lg:p-12">

            <div className="mb-8">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-500">
                <FiLock size={21} />
              </div>

              <h2 className="text-2xl font-bold text-slate-800">
                Change password
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Update your password regularly to keep your account secure.
              </p>
            </div>

            <form
              onSubmit={handleSubmit(handleChangePassword)}
              className="space-y-5"
            >

              {fields.map((field) => {
                const isVisible = visibleFields[field.name];

                return (
                  <div key={field.name}>

                    <label
                      htmlFor={field.name}
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      {field.label}
                    </label>

                    <div className="relative">

                      <input
                        {...register(field.name)}
                        id={field.name}
                        type={isVisible ? "text" : "password"}
                        placeholder={field.placeholder}
                        autoComplete={
                          field.name === "current"
                            ? "current-password"
                            : "new-password"
                        }
                        className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 pr-12 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 hover:border-sky-300 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
                      />

                      <button
                        type="button"
                        onClick={() => toggleField(field.name)}
                        aria-label={`${
                          isVisible ? "Hide" : "Show"
                        } ${field.label.toLowerCase()}`}
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 transition hover:bg-sky-50 hover:text-sky-500"
                      >
                        {isVisible ? (
                          <FiEyeOff size={18} />
                        ) : (
                          <FiEye size={18} />
                        )}
                      </button>

                    </div>

                    <ErrorMsg error={formState.errors[field.name]} />

                  </div>
                );
              })}

              <button
                type="submit"
                disabled={isPending}
                className="mt-3 flex h-12 w-full items-center justify-center rounded-xl bg-sky-500 text-sm font-semibold text-white shadow-md shadow-sky-100 transition hover:bg-sky-600 focus:outline-none focus:ring-4 focus:ring-sky-100 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {isPending ? (
                  <ImSpinner6 className="animate-spin text-xl" />
                ) : (
                  "Update password"
                )}
              </button>

            </form>
          </section>
        </div>
      </main>
    </>
  );
}