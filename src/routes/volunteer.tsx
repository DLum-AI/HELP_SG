import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Badge, Button, Field, Section, buttonClass, inputClass } from "@/components/ui-kit";
import {
  CATEGORIES,
  NEIGHBOURHOODS,
  TIER_LABEL,
  actions,
  useStore,
  type CategoryId,
  type VolunteerStatus,
} from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/volunteer")({
  head: () => ({
    meta: [
      { title: "Become a volunteer — HelpSG" },
      {
        name: "description",
        content:
          "Create a verified volunteer profile and start helping neighbours with chores, errands, pets or companionship.",
      },
      { property: "og:title", content: "Become a volunteer — HelpSG" },
      {
        property: "og:description",
        content: "Share what you can help with, get verified, and build neighbourly trust.",
      },
    ],
  }),
  component: VolunteerPage,
});

function isPhotoImage(photo: string) {
  return photo.startsWith("data:image");
}

function VolunteerPhoto({ photo, name, size = "h-20 w-20" }: { photo: string; name: string; size?: string }) {
  if (isPhotoImage(photo)) {
    return (
      <img
        src={photo}
        alt={`Photo of ${name}`}
        className={cn(size, "rounded-full border border-border object-cover")}
      />
    );
  }
  return (
    <span className={cn("grid place-items-center rounded-full bg-primary-soft text-4xl", size)} aria-hidden>
      {photo}
    </span>
  );
}

function VolunteerPage() {
  const { profile } = useStore();
  const [step, setStep] = useState(1);
  const [editing, setEditing] = useState(!profile);
  const [name, setName] = useState(profile?.name ?? "");
  const [neighbourhood, setNeighbourhood] = useState(
    profile?.neighbourhood ?? NEIGHBOURHOODS[0]!,
  );
  const [intro, setIntro] = useState(profile?.intro ?? "");
  const [photo, setPhoto] = useState(profile?.photo ?? "");
  const [photoError, setPhotoError] = useState("");

  const onPhotoPick = (file: File | null) => {
    setPhotoError("");
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setPhotoError("Please choose an image file (JPG or PNG).");
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      setPhotoError("Photo must be smaller than 3 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setPhoto(String(reader.result));
    reader.readAsDataURL(file);
  };
  const [availability, setAvailability] = useState(profile?.availability ?? "Weekends");
  const [cats, setCats] = useState<CategoryId[]>(profile?.categories ?? []);
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [phoneVerified, setPhoneVerified] = useState(
    profile?.verificationDetails.phoneVerified ?? false,
  );
  const [emergency, setEmergency] = useState(
    profile?.verificationDetails.emergencyContact ?? "",
  );
  const [coc, setCoc] = useState(profile?.verificationDetails.codeOfConductAccepted ?? false);

  const toggle = (id: CategoryId) =>
    setCats((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));

  if (profile && !editing) {
    return (
      <Section className="max-w-2xl">
        <StatusBanner status={profile.status} tier={TIER_LABEL[profile.trustTier]} />
        <AdminSimulation status={profile.status} />
        <div className="card-soft mt-6 p-6 sm:p-8">
          <VolunteerPhoto photo={profile.photo} name={profile.name} />
          <h1 className="mt-3 text-3xl">{profile.name}</h1>
          <p className="text-muted-foreground">{profile.neighbourhood}</p>
          <p className="mt-4 text-foreground/85">“{profile.intro}”</p>
          <p className="mt-6 text-sm font-semibold">I can help with:</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {profile.categories.map((c) => {
              const cat = CATEGORIES.find((x) => x.id === c)!;
              return (
                <Badge key={c} tone="secondary">
                  {cat.emoji} {cat.label}
                </Badge>
              );
            })}
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Available: {profile.availability}
          </p>

          <div className="mt-6 grid grid-cols-3 gap-3 rounded-md bg-muted p-4 text-center">
            <Stat label="Helped" value={String(profile.metrics.completedTasks)} />
            <Stat
              label="Rating"
              value={profile.metrics.ratingAverage ? `★ ${profile.metrics.ratingAverage}` : "—"}
            />
            <Stat
              label="Punctual"
              value={profile.ratings.length ? `${profile.metrics.punctualityRate}%` : "—"}
            />
          </div>

          <h2 className="mt-7 text-xl">Kind words from neighbours</h2>
          {profile.ratings.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">
              Thank-you notes will appear here after you help someone.
            </p>
          ) : (
            <ul className="mt-3 space-y-3">
              {profile.ratings.map((r) => (
                <li key={r.id} className="rounded-md border border-border p-4">
                  <p className="text-sm font-semibold">
                    {"★".repeat(r.rating)} · {r.requesterName} · {r.date}
                  </p>
                  {r.comment ? <p className="mt-1 text-sm">“{r.comment}”</p> : null}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link to="/requests" className={buttonClass("primary", "md")}>
              Browse requests
            </Link>
            <Button
              variant="outline"
              onClick={() => {
                setStep(1);
                setEditing(true);
              }}
            >
              Edit profile
            </Button>
          </div>
        </div>
      </Section>
    );
  }

  const step1Valid = name && intro && cats.length > 0 && isPhotoImage(photo);
  const step2Valid = phoneVerified && emergency.trim().length > 3 && coc;

  return (
    <Section className="max-w-2xl">
      <p className="text-sm font-semibold text-primary">Step {step} of 2</p>
      <h1 className="mt-1 text-3xl sm:text-4xl">
        {step === 1 ? "Create your volunteer profile" : "Verify and stay safe"}
      </h1>
      <p className="mt-2 text-muted-foreground">
        {step === 1
          ? "A friendly introduction helps neighbours feel comfortable asking for help."
          : "These checks help neighbours trust that every volunteer is who they say they are."}
      </p>

      {step === 1 ? (
        <div className="card-soft mt-6 space-y-5 p-6 sm:p-8">
          <RequiredLegend />
          <Field label="First name" required>
            <input
              className={inputClass}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Daniel"
            />
          </Field>
          <Field
            label="Profile photo"
            required
            hint="A clear photo of your face helps neighbours recognise and trust you. JPG or PNG, under 3 MB."
          >
            <div className="flex items-center gap-4">
              {photo ? (
                <VolunteerPhoto photo={photo} name={name || "volunteer"} />
              ) : (
                <span className="grid h-20 w-20 place-items-center rounded-full border border-dashed border-border text-sm text-muted-foreground">
                  No photo
                </span>
              )}
              <div className="space-y-2">
                <label className={cn(buttonClass("outline", "sm"), "cursor-pointer")}>
                  {photo ? "Change photo" : "Upload photo"}
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) => onPhotoPick(e.target.files?.[0] ?? null)}
                  />
                </label>
                {photoError ? <p className="text-sm text-destructive">{photoError}</p> : null}
              </div>
            </div>
          </Field>
          <Field label="Neighbourhood" required>
            <select
              className={inputClass}
              value={neighbourhood}
              onChange={(e) => setNeighbourhood(e.target.value)}
            >
              {NEIGHBOURHOODS.map((n) => (
                <option key={n}>{n}</option>
              ))}
            </select>
          </Field>
          <Field label="Short introduction" required>
            <textarea
              className={cn(inputClass, "min-h-24")}
              value={intro}
              onChange={(e) => setIntro(e.target.value)}
              placeholder="I enjoy helping older people with errands and companionship."
            />
          </Field>
          <Field label="Categories I can help with" required>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => toggle(c.id)}
                  className={cn(
                    "rounded-md border px-4 py-2 text-sm font-medium transition",
                    cats.includes(c.id)
                      ? "border-primary bg-secondary-soft text-secondary-foreground"
                      : "border-border hover:bg-muted",
                  )}
                >
                  {c.emoji} {c.label}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Availability">
            <select
              className={inputClass}
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
            >
              {["Weekday mornings", "Weekday evenings", "Weekends", "Flexible"].map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>
          </Field>
          <Button size="lg" disabled={!step1Valid} onClick={() => setStep(2)}>
            Continue
          </Button>
        </div>
      ) : (
        <div className="card-soft mt-6 space-y-5 p-6 sm:p-8">
          <RequiredLegend />
          <Field label="Mobile number" required hint="We'll send a 6-digit code by SMS (demo: any 6 digits).">
            <div className="flex gap-2">
              <input
                className={inputClass}
                value={phone}
                disabled={phoneVerified}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+65 9123 4567"
                inputMode="tel"
              />
              <Button
                type="button"
                variant="outline"
                disabled={phoneVerified || phone.replace(/\D/g, "").length < 8}
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
          <Field label="Emergency contact" required hint="Name and phone number. Kept private.">
            <input
              className={inputClass}
              value={emergency}
              onChange={(e) => setEmergency(e.target.value)}
              placeholder="Alex (brother) · +65 8123 4567"
            />
          </Field>
          <label className="flex items-start gap-3 rounded-md bg-primary-soft/60 p-4 text-sm">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 accent-[var(--primary)]"
              checked={coc}
              onChange={(e) => setCoc(e.target.checked)}
            />
            <span>
              <strong>HelpSG Community Code of Conduct.</strong> I agree to treat neighbours with
              dignity, follow safety guidelines, and never handle medical tasks.
            </span>
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button variant="outline" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button
              size="lg"
              disabled={!step2Valid}
              onClick={() => {
                actions.saveProfile({
                  name,
                  neighbourhood,
                  intro,
                  categories: cats,
                  availability,
                  photo,
                  status: profile?.status ?? "pending",
                  trustTier: profile?.trustTier ?? "tier_1_errands",
                  ratings: profile?.ratings ?? [],
                  metrics: profile?.metrics ?? {
                    completedTasks: 0,
                    ratingAverage: 0,
                    punctualityRate: 0,
                  },
                  verificationDetails: {
                    phoneVerified,
                    codeOfConductAccepted: coc,
                    emergencyContact: emergency,
                  },
                });
                setEditing(false);
              }}
            >
              {profile ? "Save Profile" : "Submit for Review"}
            </Button>
          </div>
        </div>
      )}
    </Section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-display text-xl font-semibold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function StatusBanner({ status, tier }: { status: VolunteerStatus; tier: string }) {
  if (status === "approved") {
    return (
      <div className="rounded-md bg-primary p-5 text-primary-foreground">
        <p className="font-display text-lg font-semibold">✓ Verified Community Volunteer</p>
        <p className="mt-1 text-sm opacity-90">{tier}</p>
      </div>
    );
  }
  if (status === "flagged") {
    return (
      <div className="rounded-md bg-accent-soft p-5 text-accent-foreground">
        <p className="font-semibold">Your profile is paused for a quick review</p>
        <p className="mt-1 text-sm">
          A community lead will reach out soon. You can still browse requests in the meantime.
        </p>
      </div>
    );
  }
  return (
    <div className="rounded-md bg-accent-soft p-5 text-accent-foreground">
      <p className="font-semibold">Application under review</p>
      <p className="mt-1 text-sm">
        Your application is under review by community leads. You can browse requests, but
        accepting vulnerable tasks requires verification.
      </p>
    </div>
  );
}

function AdminSimulation({ status }: { status: VolunteerStatus }) {
  const opts: { id: VolunteerStatus; label: string }[] = [
    { id: "pending", label: "Pending Approval" },
    { id: "approved", label: "Approved (Verified)" },
    { id: "flagged", label: "Flagged" },
  ];
  return (
    <div className="mt-3 rounded-md border border-dashed border-border p-3 text-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Admin simulation (demo only)
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {opts.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => actions.setProfileStatus(o.id)}
            className={cn(
              "rounded-md border px-3 py-1.5 text-xs font-semibold transition",
              status === o.id ? "border-primary bg-primary-soft text-primary" : "border-border hover:bg-muted",
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
