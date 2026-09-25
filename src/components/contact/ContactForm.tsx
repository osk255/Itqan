"use client";

import { useEffect, useState, type FormEvent } from "react";
import { company } from "@/lib/site";

const TYPES = ["General Inquiry", "Business Cooperation", "Product Information"] as const;
const FIELD_BASE = "w-full rounded-[14px] border border-line bg-chip px-4 py-3 text-[16px] font-normal text-fg [transition:border-color_.3s,background_.3s] focus:border-fg";
const FIELD = `${FIELD_BASE} min-h-[54px]`;
const LABEL = "flex flex-col gap-2 text-[14px] font-semibold";
const ERROR = "text-[13px] font-medium text-[#ff8f7a]";

type Field = "name" | "email" | "message";
type Status = "idle" | "sending" | "sent" | "failed";

/** Netlify Forms endpoint: a static page carrying the hidden form definition (public/__forms.html). */
const ENDPOINT = "/__forms.html";

/**
 * Enquiry form (README › Contact form). Validated in the browser for fast
 * feedback; submissions go to Netlify Forms, which adds spam filtering and the
 * honeypot check server-side. `?type=cooperation|product&product=Name` preselects.
 */
export function ContactForm() {
  const [type, setType] = useState(0);
  const [product, setProduct] = useState("");
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    const q = new URLSearchParams(location.search);
    const t = q.get("type");
    // Reading the URL after hydration keeps the page fully static.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (t === "cooperation") setType(1);
    else if (t === "product") setType(2);
    setProduct(q.get("product") ?? "");
  }, []);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const get = (k: string) => String(data.get(k) ?? "").trim();
    const next: Partial<Record<Field, string>> = {};
    if (!get("name")) next.name = "Please enter your name.";
    if (!get("email")) next.email = "Please enter your email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(get("email"))) next.email = "Please enter a valid email address.";
    if (!get("message")) next.message = "Please enter a message.";
    setErrors(next);
    const first = Object.keys(next)[0];
    if (first) {
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    setStatus("sending");
    const body = new URLSearchParams({ "form-name": "enquiry", type: TYPES[type] ?? TYPES[0] });
    for (const k of ["bot-field", "name", "company", "email", "phone", "product", "message"]) body.set(k, get(k));
    try {
      const res = await fetch(ENDPOINT, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: body.toString() });
      setStatus(res.ok ? "sent" : "failed");
    } catch {
      setStatus("failed");
    }
  };

  if (status === "sent") {
    return (
      <div role="status" className="flex flex-col gap-[18px] rounded-2xl bg-lime p-7 text-ink">
        <p className="m-0 text-[28px] leading-[1.1] font-semibold">Thank you.</p>
        <p className="m-0 text-[16px] leading-[1.55]">Your message has been sent to Itqan Pharmaceutical Industries.</p>
        <button
          type="button"
          onClick={() => {
            setStatus("idle");
            setErrors({});
          }}
          className="min-h-12 self-start rounded-full border border-[rgba(14,10,18,.35)] bg-transparent px-5 text-[15px] font-semibold text-ink"
        >
          Send another message
        </button>
      </div>
    );
  }

  const input = (name: Field) => ({
    name,
    "aria-invalid": Boolean(errors[name]),
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
    className: FIELD,
  });
  const error = (name: Field) =>
    errors[name] && (
      <span id={`${name}-error`} role="alert" className={ERROR}>
        {errors[name]}
      </span>
    );

  return (
    <form onSubmit={onSubmit} noValidate aria-labelledby="form-title" className="flex flex-col gap-5">
      <fieldset className="m-0 border-0 p-0">
        <legend className="mb-[10px] p-0 text-[14px] font-semibold">Enquiry type</legend>
        <div className="flex flex-wrap gap-2">
          {TYPES.map((label, i) => {
            const on = i === type;
            return (
              <button
                key={label}
                type="button"
                aria-pressed={on}
                onClick={() => setType(i)}
                className={`min-h-12 rounded-full border px-5 text-[14px] font-semibold [transition:background_.3s,color_.3s] ${
                  on ? "border-fg bg-fg text-bg" : "border-line bg-transparent text-fg"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Honeypot: hidden from people; Netlify discards submissions that fill it. */}
      <label className="sr-only" aria-hidden="true">
        Leave this field empty
        <input name="bot-field" tabIndex={-1} autoComplete="off" />
      </label>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-4">
        <label className={LABEL}>
          Name *
          <input {...input("name")} autoComplete="name" />
          {error("name")}
        </label>
        <label className={LABEL}>
          Company
          <input name="company" autoComplete="organization" className={FIELD} />
        </label>
        <label className={LABEL}>
          Email *
          <input {...input("email")} type="email" autoComplete="email" />
          {error("email")}
        </label>
        <label className={LABEL}>
          Phone
          <input name="phone" type="tel" autoComplete="tel" className={FIELD} />
        </label>
      </div>

      {type === 2 && (
        <label className={LABEL}>
          Product
          <input name="product" defaultValue={product} key={product} className={FIELD} />
        </label>
      )}

      <label className={LABEL}>
        Message *
        <textarea {...input("message")} rows={6} className={`${FIELD_BASE} min-h-40 resize-y`} />
        {error("message")}
      </label>

      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex min-h-14 min-w-[min(220px,100%)] items-center justify-between gap-6 self-start rounded-full border-0 bg-accent pr-2 pl-6 text-[15px] font-semibold text-on-accent disabled:opacity-70"
      >
        {status === "sending" ? "Sending…" : "Submit"}
        <span aria-hidden="true" className="grid size-10 place-items-center rounded-full bg-on-accent text-accent">
          →
        </span>
      </button>

      {status === "failed" && (
        <p role="alert" className="m-0 text-[15px] leading-[1.55] text-mute">
          Sorry, your message could not be sent. Please email <a href={company.emailHref}>{company.email}</a> or call{" "}
          <a href={company.phoneHref}>{company.phone}</a>.
        </p>
      )}
    </form>
  );
}
