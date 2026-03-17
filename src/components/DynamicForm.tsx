"use client";

import { useState } from "react";
import type { Product, FormField } from "@/data/products";

interface DynamicFormProps {
  product: Product;
}

export default function DynamicForm({ product }: DynamicFormProps) {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    console.log(`[${product.title}] Form data:`, data);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const renderField = (field: FormField) => {
    const baseInputClasses =
      "w-full bg-black border border-primary text-white font-body text-base px-4 py-3 h-14 placeholder:text-white/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors";

    switch (field.type) {
      case "select":
        return (
          <select
            name={field.name}
            required={field.required}
            defaultValue=""
            className={`${baseInputClasses} appearance-none`}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2300e846' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 16px center",
            }}
          >
            <option value="" disabled className="text-white/50">
              Selecione...
            </option>
            {field.options?.map((opt) => (
              <option key={opt} value={opt} className="bg-black text-white">
                {opt}
              </option>
            ))}
          </select>
        );

      case "textarea":
        return (
          <textarea
            name={field.name}
            required={field.required}
            placeholder={field.placeholder}
            rows={4}
            className={`${baseInputClasses} h-auto resize-none`}
          />
        );

      case "checkbox":
        return (
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              name={field.name}
              required={field.required}
              className="h-10 w-10 flex-shrink-0 appearance-none border-2 border-primary bg-transparent checked:bg-primary"
            />
            <span className="font-body text-sm text-white">{field.placeholder}</span>
          </label>
        );

      default:
        return (
          <input
            type={field.type}
            name={field.name}
            required={field.required}
            placeholder={field.placeholder}
            className={baseInputClasses}
          />
        );
    }
  };

  return (
    <div key={product.id} className="animate-fadeIn">
      {/* Form header */}
      <div className="mb-8">
        <span className="mb-2 block h-1 w-8 bg-primary" />
        <h3 className="font-display text-2xl font-bold text-white">
          {product.title}
        </h3>
        <p className="mt-2 font-body text-sm text-gray-200">
          Preencha o formulário abaixo e entraremos em contato.
        </p>
      </div>

      {submitted ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="mb-4 flex h-16 w-16 items-center justify-center border-2 border-primary">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00e846" strokeWidth="2">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <p className="font-display text-xl font-bold text-primary">Enviado com sucesso!</p>
          <p className="mt-2 font-body text-sm text-gray-300">
            Em breve entraremos em contato.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-x-8">
          {product.fields.map((field) => (
            <div
              key={field.name}
              className={field.fullWidth ? "md:col-span-2" : ""}
            >
              <label className="mb-2 block font-body text-sm font-bold tracking-[0.04em] text-primary">
                {field.label}
                {field.required && <span className="ml-1 text-primary">*</span>}
              </label>
              {renderField(field)}
            </div>
          ))}

          {/* Submit */}
          <div className="md:col-span-2">
            <button
              type="submit"
              className="relative mt-4 mb-1.5 inline-flex items-center justify-center border-3 border-primary bg-transparent px-10 py-3.5 font-body text-base font-medium uppercase tracking-[0.07em] text-primary transition-all duration-300 hover:bg-primary hover:text-black"
            >
              Enviar
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
