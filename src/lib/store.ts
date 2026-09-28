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
  verified: boolean;
  mine: boolean;
  status: RequestStatus;
  offers: string[];
  acceptedVolunteer?: string;
  thanks?: { mood: string; note: string };
};

export type Message = {
  id: string;
  requestId: string;
  from: "me" | "them";
  text: string;
  at: string;
};

export type VolunteerProfile = {
  name: string;
  neighbourhood: string;
  intro: string;
  categories: CategoryId[];
  availability: string;
  photo: string;
};

type State = {
  requests: HelpRequest[];
  messages: Message[];
  profile: VolunteerProfile | null;
};

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
  requests: seedRequests,
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
};

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
      "id" | "status" | "offers" | "mine" | "requesterName" | "verified"
    >,
  ) {
    const req: HelpRequest = {
      ...data,
      id: id(),
      status: "open",
      offers: [],
      mine: true,
      requesterName: "You",
      verified: true,
    };
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
  complete(requestId: string, mood: string, note: string) {
    set({
      requests: state.requests.map((r) =>
        r.id === requestId ? { ...r, status: "completed", thanks: { mood, note } } : r,
      ),
    });
  },
  saveProfile(profile: VolunteerProfile) {
    set({ profile });
  },
};
