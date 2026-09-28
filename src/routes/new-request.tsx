import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button, Field, RequiredLegend, Section, inputClass } from "@/components/ui-kit";
import { DatePicker, TimePicker } from "@/components/date-time";
import { CATEGORIES, NEIGHBOURHOODS, actions, type CategoryId } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/new-request")({
  head: () => ({
    meta: [
      { title: "Ask for help — HelpSG" },
      {
        name: "description",
        content:
          "Post a help request in three simple steps: pick a category, tell us more, then say when and where.",
      },
      { property: "og:title", content: "Ask for help — HelpSG" },
      {
        property: "og:description",
        content: "Post a request and let caring neighbours offer a hand.",
      },
    ],
  }),
  component: NewRequest,
});

function NewRequest() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [cat, setCat] = useState<CategoryId | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    instructions: "",
    date: "",
    time: "",
    duration: "About 1 hour",
    neighbourhood: NEIGHBOURHOODS[0]!,
    recurring: false,
  });

  const update = (k: keyof typeof form, v: string | boolean) =>
    setForm((f) => ({ ...f, [k]: v }));

  const [name, setName] = useState("");
  const [photo, setPhoto] = useState("");
  const [photoError, setPhotoError] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [phoneVerified, setPhoneVerified] = useState(false);
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim()) && email.length <= 255;
  const phoneDigits = phone.replace(/\D/g, "");
  const phoneValid = phoneDigits.length >= 8 && phoneDigits.length <= 15;

  const onPhoto = (file: File | undefined) => {
    setPhotoError("");
    if (!file) return;
    if (!/^image\/(jpeg|png)$/.test(file.type)) {
      setPhotoError("Please choose a JPG or PNG image.");
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      setPhotoError("Please choose an image under 3 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setPhoto(String(reader.result));
    reader.readAsDataURL(file);
  };

  const submit = () => {
    if (!cat || !name.trim() || !emailValid || !phoneVerified) return;
    const id = actions.createRequest({
      ...form,
      category: cat,
      requesterName: name.trim(),
      ...(photo ? { requesterPhoto: photo } : {}),
      contact: { email: email.trim(), phone: phone.trim(), phoneVerified },
    });
    navigate({ to: "/requests/$id", params: { id } });
  };

  return (
    <Section className="max-w-2xl">
      <p className="text-sm font-semibold text-primary">Step {step} of 3</p>
      <div className="mt-2 flex gap-1.5">
        {[1, 2, 3].map((s) => (
          <span
            key={s}
            className={cn(
              "h-1.5 flex-1 rounded-full",
              s <= step ? "bg-primary" : "bg-border",
            )}
          />
        ))}
      </div>

      <div className="card-soft mt-6 space-y-5 p-6 sm:p-8">
        {step === 1 && (
          <>
            <h1 className="text-2xl">What do you need help with?</h1>
            <div className="grid gap-3 sm:grid-cols-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCat(c.id)}
                  className={cn(
                    "rounded-2xl border p-4 text-left transition",
                    cat === c.id
                      ? "border-primary bg-primary-soft/60"
                      : "border-border hover:bg-muted",
                  )}
                >
                  <span aria-hidden className="text-2xl">
                    {c.emoji}
                  </span>
                  <p className="mt-1 font-semibold">{c.label}</p>
                  <p className="text-sm text-muted-foreground">{c.blurb}</p>
                </button>
              ))}
            </div>
            <Button disabled={!cat} onClick={() => setStep(2)} size="lg">
              Continue
            </Button>
          </>
        )}

        {step === 2 && (
          <>
            <h1 className="text-2xl">Tell us more</h1>
            <RequiredLegend />
            <Field label="Request title" required>
              <input
                className={inputClass}
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                placeholder="Accompany me to the polyclinic"
              />
            </Field>
            <Field label="Description" required>
              <textarea
                className={cn(inputClass, "min-h-28")}
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                placeholder="A short note about what you need."
              />
            </Field>
            <Field label="Specific instructions" hint="Optional — meeting point, access, anything helpful.">
              <textarea
                className={cn(inputClass, "min-h-20")}
                value={form.instructions}
                onChange={(e) => update("instructions", e.target.value)}
              />
            </Field>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button disabled={!form.title || !form.description} onClick={() => setStep(3)}>
                Continue
              </Button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h1 className="text-2xl">When & where?</h1>
            <RequiredLegend />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Date" required hint="Pick a single day, or a range if you're flexible.">
                <DatePicker
                  range
                  value={form.date}
                  onChange={(v) => update("date", v)}
                  placeholder="Pick a date or range"
                />
              </Field>
              <Field label="Time" required>
                <TimePicker
                  value={form.time}
                  onChange={(v) => update("time", v)}
                />
              </Field>
              <Field label="Estimated duration" required>
                <select
                  className={inputClass}
                  value={form.duration}
                  onChange={(e) => update("duration", e.target.value)}
                >
                  {["About 30 minutes", "About 1 hour", "About 2 hours", "Half a day"].map(
                    (d) => (
                      <option key={d}>{d}</option>
                    ),
                  )}
                </select>
              </Field>
              <Field label="Neighbourhood" required hint="Your exact address is never shown publicly.">
                <select
                  className={inputClass}
                  value={form.neighbourhood}
                  onChange={(e) => update("neighbourhood", e.target.value)}
                >
                  {NEIGHBOURHOODS.map((n) => (
                    <option key={n}>{n}</option>
                  ))}
                </select>
              </Field>
            </div>
            <label className="flex items-center gap-3 rounded-2xl bg-muted p-4 text-sm">
              <input
                type="checkbox"
                className="h-4 w-4 accent-[var(--primary)]"
                checked={form.recurring}
                onChange={(e) => update("recurring", e.target.checked)}
              />
              This is a recurring request
            </label>
            <div className="space-y-4 rounded-md border border-border p-4">
              <div>
                <p className="font-semibold">Your contact details</p>
                <p className="text-sm text-muted-foreground">
                  Your email and phone stay private — only shared with a volunteer after they offer to help.
                </p>
              </div>
              <Field label="Your name" required hint="Shown publicly on your request.">
                <input
                  className={inputClass}
                  value={name}
                  maxLength={60}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sarah"
                />
              </Field>
              <Field label="Your photo" hint="Optional — helps volunteers recognise you. JPG or PNG, under 3 MB.">
                <div className="flex items-center gap-3">
                  {photo ? (
                    <img
                      src={photo}
                      alt="Your photo preview"
                      className="h-14 w-14 rounded-full border border-border object-cover"
                    />
                  ) : (
                    <span className="grid h-14 w-14 place-items-center rounded-full bg-muted text-xl text-muted-foreground">
                      ?
                    </span>
                  )}
                  <label className={cn(inputClass, "cursor-pointer text-sm")}>
                    {photo ? "Change photo" : "Upload photo"}
                    <input
                      type="file"
                      accept="image/jpeg,image/png"
                      className="hidden"
                      onChange={(e) => onPhoto(e.target.files?.[0])}
                    />
                  </label>
                </div>
                {photoError ? (
                  <span className="block text-sm text-destructive">{photoError}</span>
                ) : null}
              </Field>
              <Field label="Email" required>
                <input
                  className={inputClass}
                  type="email"
                  value={email}
                  maxLength={255}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
                {email && !emailValid ? (
                  <span className="block text-sm text-destructive">Please enter a valid email.</span>
                ) : null}
              </Field>
              <Field label="Mobile number" required hint="We'll send a 6-digit code by SMS (demo: any 6 digits).">
                <div className="flex gap-2">
                  <input
                    className={inputClass}
                    value={phone}
                    disabled={phoneVerified}
                    maxLength={20}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+65 9123 4567"
                    inputMode="tel"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    disabled={phoneVerified || !phoneValid}
                    onClick={() => setOtpSent(true)}
                  >
                    {otpSent ? "Resend" : "Send code"}
                  </Button>
                </div>
              </Field>
              {phoneVerified ? (
                <p className="text-sm font-semibold text-primary">✓ Phone number verified</p>
              ) : otpSent ? (
                <Field label="Enter code">
                  <div className="flex gap-2">
                    <input
                      className={inputClass}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="123456"
                      inputMode="numeric"
                    />
                    <Button type="button" disabled={otp.length !== 6} onClick={() => setPhoneVerified(true)}>
                      Verify
                    </Button>
                  </div>
                </Field>
              ) : null}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button
                disabled={!form.date || !form.time || !name.trim() || !emailValid || !phoneVerified}
                onClick={submit}
                size="lg"
              >
                Post Request
              </Button>
            </div>
          </>
        )}
      </div>
    </Section>
  );
}
