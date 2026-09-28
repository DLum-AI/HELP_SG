import { useSyncExternalStore } from "react";

export type CategoryId = "home" | "groceries" | "pets" | "companionship";

export const CATEGORIES: {
  id: CategoryId;
  emoji: string;
  label: string;
  blurb: string;
}[] = [
  {
    id: "home",
    emoji: "🏠",
    label: "Home Help",
    blurb: "Light cleaning, tidying and simple household chores.",
  },
  {
    id: "groceries",
    emoji: "🛒",
    label: "Groceries & Meals",
    blurb: "Grocery runs, collecting orders, buying and delivering meals.",
  },
  {
    id: "pets",
    emoji: "🐾",
    label: "Pet Care",
    blurb: "Feeding, walking or checking in on someone's pet.",
  },
  {
    id: "companionship",
    emoji: "❤️",
    label: "Companionship",
    blurb: "Clinic visits, a walk together, or simply some company.",
  },
];

export const NEIGHBOURHOODS = [
  "Bedok",
  "Tampines",
  "Pasir Ris",
  "Paya Lebar",
  "Toa Payoh",
  "Ang Mo Kio",
  "Clementi",
  "Punggol",
];

export function category(id: CategoryId) {
  return CATEGORIES.find((c) => c.id === id)!;
}

export type RequestStatus = "open" | "matched" | "completed";

export type HelpRequest = {
  id: string;
  category: CategoryId;
  title: string;
  description: string;
  instructions: string;
  date: string;
  time: string;
  duration: string;
  neighbourhood: string;
  recurring: boolean;
  requesterName: string;
  /** Optional photo (data URL) uploaded by the requester. */
  requesterPhoto?: string;
  verified: boolean;
  mine: boolean;
  status: RequestStatus;
  offers: string[];
  acceptedVolunteer?: string;
  thanks?: { mood: string; note: string };
  /** Private — only revealed to a volunteer after they offer help. */
  contact?: { email: string; phone: string; phoneVerified: boolean };
};

export type Message = {
  id: string;
  requestId: string;
  from: "me" | "them";
  text: string;
  at: string;
};

export type VolunteerStatus = "pending" | "approved" | "flagged";
export type TrustTier = "tier_1_errands" | "tier_2_full";

export type VolunteerRating = {
  id: string;
  requesterName: string;
  rating: number;
  tags: string[];
  comment: string;
  date: string;
};

export type VolunteerProfile = {
  name: string;
  neighbourhood: string;
  intro: string;
  categories: CategoryId[];
  availability: string;
  photo: string;
  status: VolunteerStatus;
  trustTier: TrustTier;
  ratings: VolunteerRating[];
  metrics: { completedTasks: number; ratingAverage: number; punctualityRate: number };
  verificationDetails: {
    phoneVerified: boolean;
    codeOfConductAccepted: boolean;
    emergencyContact: string;
  };
};

export const APPRECIATION_TAGS = [
  "Punctual",
  "Clear Communication",
  "Patient & Gentle",
  "Followed Instructions",
];

export const SENSITIVE_CATEGORIES: CategoryId[] = ["companionship", "home"];

export const TIER_LABEL: Record<TrustTier, string> = {
  tier_1_errands: "Errands tier · Groceries & Pet Care",
  tier_2_full: "Full tier · All categories incl. Home Help & Companionship",
};

type State = {
  requests: HelpRequest[];
  messages: Message[];
  profile: VolunteerProfile | null;
  volunteers: VolunteerProfile[];
};

function computeMetrics(ratings: VolunteerRating[], base = 0) {
  const avg = ratings.length
    ? Math.round((ratings.reduce((s, r) => s + r.rating, 0) / ratings.length) * 10) / 10
    : 0;
  const punctual = ratings.length
    ? Math.round((ratings.filter((r) => r.tags.includes("Punctual")).length / ratings.length) * 100)
    : 0;
  return { completedTasks: base + ratings.length, ratingAverage: avg, punctualityRate: punctual };
}

function demoVolunteer(
  name: string,
  neighbourhood: string,
  photo: string,
  intro: string,
  ratings: Omit<VolunteerRating, "id">[],
): VolunteerProfile {
  const rs = ratings.map((r, i) => ({ ...r, id: `${name}-${i}` }));
  return {
    name,
    neighbourhood,
    intro,
    photo,
    categories: ["groceries", "companionship", "home", "pets"],
    availability: "Weekends",
    status: "approved",
    trustTier: "tier_2_full",
    ratings: rs,
    metrics: computeMetrics(rs, 8),
    verificationDetails: { phoneVerified: true, codeOfConductAccepted: true, emergencyContact: "On file" },
  };
}

const seedVolunteers: VolunteerProfile[] = [
  demoVolunteer("Daniel", "Bedok", "🧑", "I enjoy running errands and chatting with older neighbours.", [
    { requesterName: "Mr Tan", rating: 5, tags: ["Punctual", "Patient & Gentle"], comment: "Very kind and patient with my mother.", date: "12 Sep" },
    { requesterName: "Priya", rating: 5, tags: ["Clear Communication"], comment: "Kept me updated the whole time.", date: "5 Sep" },
    { requesterName: "Jaya", rating: 4, tags: ["Punctual"], comment: "Thank you for the help!", date: "28 Aug" },
  ]),
  demoVolunteer("Mei Ling", "Tampines", "👩", "Retired teacher, happy to accompany neighbours to appointments.", [
    { requesterName: "Sarah", rating: 5, tags: ["Patient & Gentle", "Followed Instructions"], comment: "My mum felt safe and cared for.", date: "20 Sep" },
  ]),
];

const seedRequests: HelpRequest[] = [
  {
    id: "r1",
    category: "companionship",
    title: "Accompany someone to a clinic",
    description:
      "My mother has a follow-up appointment at the polyclinic and would feel much safer with someone walking beside her.",
    instructions: "Meet at the void deck. She walks slowly and uses a cane.",
    date: "Friday, 2 Oct",
    time: "2:00 PM",
    duration: "About 2 hours",
    neighbourhood: "Tampines",
    recurring: false,
    requesterName: "Sarah",
    verified: true,
    mine: false,
    status: "open",
    offers: [],
  },
  {
    id: "r2",
    category: "groceries",
    title: "Weekly groceries from the wet market",
    description:
      "A short list of vegetables, rice and eggs from Bedok market. I'll transfer the money beforehand.",
    instructions: "Please call when you reach the lift lobby.",
    date: "Saturday, 3 Oct",
    time: "9:30 AM",
    duration: "About 1 hour",
    neighbourhood: "Bedok",
    recurring: true,
    requesterName: "Mr Tan",
    verified: true,
    mine: false,
    status: "open",
    offers: [],
  },
  {
    id: "r3",
    category: "pets",
    title: "Evening walk for my corgi",
    description:
      "I'm on night shift this week and Mochi needs a 30 minute walk around the estate.",
    instructions: "Leash and treats are left with the neighbour.",
    date: "Wednesday, 30 Sep",
    time: "7:00 PM",
    duration: "About 45 minutes",
    neighbourhood: "Punggol",
    recurring: false,
    requesterName: "Aisha",
    verified: false,
    mine: false,
    status: "open",
    offers: [],
  },
  {
    id: "r4",
    category: "home",
    title: "Help tidying up after moving in",
    description:
      "Boxes to flatten and a bit of sweeping. Two pairs of hands would make it quick.",
    instructions: "No heavy lifting needed.",
    date: "Sunday, 4 Oct",
    time: "11:00 AM",
    duration: "About 2 hours",
    neighbourhood: "Toa Payoh",
    recurring: false,
    requesterName: "Priya",
    verified: true,
    mine: false,
    status: "open",
    offers: [],
  },
  {
    id: "r5",
    category: "companionship",
    title: "A walk and kopi at the park",
    description:
      "My father misses his morning walks. He enjoys chatting about football.",
    instructions: "Meet outside Blk 118.",
    date: "Tuesday, 6 Oct",
    time: "8:00 AM",
    duration: "About 1 hour",
    neighbourhood: "Paya Lebar",
    recurring: true,
    requesterName: "Jaya",
    verified: true,
    mine: false,
    status: "open",
    offers: [],
  },
  {
    id: "r6",
    category: "groceries",
    title: "Pick up a packed lunch",
    description:
      "Recovering from surgery and can't go downstairs yet. Any mixed rice stall is fine.",
    instructions: "Leave it at the door if I don't answer immediately.",
    date: "Thursday, 1 Oct",
    time: "12:15 PM",
    duration: "About 30 minutes",
    neighbourhood: "Pasir Ris",
    recurring: false,
    requesterName: "Wei Ling",
    verified: true,
    mine: false,
    status: "open",
    offers: [],
  },
];

let state: State = {
  requests: seedRequests.map((r, i) => ({
    ...r,
    contact: {
      email: `${r.requesterName.toLowerCase().replace(/[^a-z]/g, "")}@example.com`,
      phone: `+65 9${String(1000000 + i * 1234567).slice(0, 3)} ${String(4000 + i * 111)}`,
      phoneVerified: true,
    },
  })),
  messages: [
    {
      id: "m1",
      requestId: "r2",
      from: "them",
      text: "Hi! Thank you for offering to help with the market run 🙏",
      at: "Yesterday, 6:12 PM",
    },
  ],
  profile: null,
  volunteers: seedVolunteers,
};

export function findVolunteer(s: State, name: string): VolunteerProfile | undefined {
  if (name === "You") return s.profile ?? undefined;
  return s.volunteers.find((v) => v.name === name);
}

export function canHelpWith(profile: VolunteerProfile | null, cat: CategoryId) {
  if (!SENSITIVE_CATEGORIES.includes(cat)) return true;
  return profile?.status === "approved" && profile.trustTier === "tier_2_full";
}

const listeners = new Set<() => void>();

function set(next: Partial<State>) {
  state = { ...state, ...next };
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

function getSnapshot() {
  return state;
}

export function useStore() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

const id = () => Math.random().toString(36).slice(2, 9);

export const actions = {
  createRequest(
    data: Omit<
      HelpRequest,
      "id" | "status" | "offers" | "mine" | "verified"
    >,
  ) {
    const req: HelpRequest = {
      ...data,
      id: id(),
      status: "open",
      offers: [],
      mine: true,
      verified: true,
    };
    // Demo: a verified neighbour offers help so the offer + trust flow can be tried.
    const demo = state.volunteers.find((v) => v.neighbourhood === data.neighbourhood) ?? state.volunteers[0]!;
    req.offers = [demo.name];
    set({ requests: [req, ...state.requests] });
    return req.id;
  },
  offerHelp(requestId: string, name = "You") {
    set({
      requests: state.requests.map((r) =>
        r.id === requestId ? { ...r, offers: [...new Set([...r.offers, name])] } : r,
      ),
    });
  },
  acceptOffer(requestId: string, name: string) {
    set({
      requests: state.requests.map((r) =>
        r.id === requestId ? { ...r, status: "matched", acceptedVolunteer: name } : r,
      ),
    });
  },
  sendMessage(requestId: string, text: string) {
    set({
      messages: [
        ...state.messages,
        { id: id(), requestId, from: "me", text, at: "Just now" },
      ],
    });
  },
  complete(
    requestId: string,
    mood: string,
    note: string,
    rating?: { stars: number; tags: string[] },
  ) {
    const req = state.requests.find((r) => r.id === requestId);
    const next: Partial<State> = {
      requests: state.requests.map((r) =>
        r.id === requestId ? { ...r, status: "completed", thanks: { mood, note } } : r,
      ),
    };
    const volName = req?.acceptedVolunteer;
    if (rating && volName) {
      const entry: VolunteerRating = {
        id: id(),
        requesterName: req!.mine ? "You" : req!.requesterName,
        rating: rating.stars,
        tags: rating.tags,
        comment: note,
        date: "Just now",
      };
      const apply = (v: VolunteerProfile): VolunteerProfile => {
        const ratings = [entry, ...v.ratings];
        const m = computeMetrics(ratings, v.metrics.completedTasks - v.ratings.length);
        return {
          ...v,
          ratings,
          metrics: m,
          status: rating.stars < 3 ? "flagged" : v.status,
        };
      };
      if (volName === "You" && state.profile) next.profile = apply(state.profile);
      else next.volunteers = state.volunteers.map((v) => (v.name === volName ? apply(v) : v));
    }
    set(next);
  },
  saveProfile(profile: VolunteerProfile) {
    set({ profile });
  },
  setProfileStatus(status: VolunteerStatus) {
    if (!state.profile) return;
    set({
      profile: {
        ...state.profile,
        status,
        trustTier: status === "approved" ? "tier_2_full" : "tier_1_errands",
      },
    });
  },
};
