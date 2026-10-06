import type { ReservationStatus } from "./theme";

// ALL VALUES BELOW ARE DEMO DATA.
// They are not Naga Exchange's real rates, limits, hours or policies.
// Every rate shown on screen carries a "DEMO RATE" tag.

export const DEMO_RATES = [
  { code: "GBP", name: "İngiliz Sterlini", symbol: "£", rate: "64.95" },
  { code: "EUR", name: "Euro", symbol: "€", rate: "55.20" },
  { code: "USD", name: "ABD Doları", symbol: "$", rate: "49.35" },
  { code: "TRY", name: "Türk Lirası", symbol: "₺", rate: "1.00" },
] as const;

export const CUSTOMER_NAME = "Ahmet";

export const RESERVATION = {
  id: "NGR-1042",
  sell: { code: "GBP", symbol: "£", amount: "10,000" },
  receive: { code: "TRY", symbol: "₺", amount: "649,500", value: 649500 },
  rate: "64.95",
  branch: "Naga Exchange",
  branchArea: "İskele",
  time: "16:30",
  day: "Bugün",
} as const;

export const TIME_SLOTS = ["10:30", "12:00", "14:00", "15:00", "16:30", "18:00"] as const;

export type AdminRow = {
  id: string;
  time: string;
  amount: string;
  pair: string;
  status: ReservationStatus;
};

export const ADMIN_ROWS: AdminRow[] = [
  { id: "NGR-1038", time: "10:30", amount: "€5,000", pair: "EUR → TRY", status: "READY" },
  { id: "NGR-1040", time: "12:00", amount: "£3,000", pair: "GBP → TRY", status: "PREPARING" },
  { id: "NGR-1042", time: "16:30", amount: "£10,000", pair: "GBP → TRY", status: "NEW" },
  { id: "NGR-1045", time: "18:00", amount: "$7,500", pair: "USD → TRY", status: "READY" },
];

export const formatThousands = (n: number) =>
  Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
