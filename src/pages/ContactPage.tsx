import { useState, type FormEvent } from "react";

export function ContactPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = e.currentTarget;
    const data = new FormData(form);
    data.set("form-name", "contact");

    try {
      const body = new URLSearchParams();
      for (const [key, value] of data.entries()) {
        body.append(key, String(value));
      }
      const res = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="static-page">
      <div className="static-page__inner">
        <h1 className="static-page__title">Contact</h1>
        {status === "sent" ? (
          <p className="static-page__copy">
            Got it, thanks. I will reply when I can, usually pretty quickly.
          </p>
        ) : (
          <form
            className="form"
            name="contact"
            method="POST"
            data-netlify="true"
            netlify-honeypot="bot-field"
            onSubmit={onSubmit}
          >
            <input type="hidden" name="form-name" value="contact" />
            <p className="sr-only">
              <label>
                Do not fill this out: <input name="bot-field" />
              </label>
            </p>
            <label>
              Name
              <input name="name" type="text" required autoComplete="name" />
            </label>
            <label>
              Email
              <input name="email" type="email" required autoComplete="email" />
            </label>
            <label>
              Message
              <textarea name="message" required />
            </label>
            <button className="btn" type="submit" disabled={status === "sending"}>
              {status === "sending" ? "Sending…" : "Send"}
            </button>
            {status === "error" ? (
              <p className="error">
                That did not go through. Try once more, or give it a minute and
                try again.
              </p>
            ) : null}
          </form>
        )}
      </div>
    </div>
  );
}
