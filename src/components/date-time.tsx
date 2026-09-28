import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { inputClass } from "@/components/ui-kit";

const fmtDay = (d: Date) => format(d, "EEE, d MMM");
const fmtShort = (d: Date) => format(d, "d MMM");

/** Calendar picker that supports a single date or a date range.
 *  `onChange` receives a display string like "Fri, 2 Oct" or "2 Oct – 5 Oct". */
export function DatePicker({
  value,
  onChange,
  range = false,
  placeholder = "Pick a date",
}: {
  value: string;
  onChange: (v: string) => void;
  range?: boolean;
  placeholder?: string;
}) {
  const [selected, setSelected] = React.useState<DateRange | undefined>();

  const apply = (r: DateRange | undefined) => {
    setSelected(r);
    if (!r?.from) return onChange("");
    if (range && r.to && r.to.getTime() !== r.from.getTime())
      onChange(`${fmtShort(r.from)} – ${fmtShort(r.to)}`);
    else if (!range) onChange(fmtDay(r.from));
    else onChange(fmtDay(r.from));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            inputClass,
            "flex items-center gap-2 text-left",
            !value && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
          {value || <span>{placeholder}</span>}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={selected}
          onSelect={apply}
          initialFocus
          className={cn("p-3 pointer-events-auto")}
        />
        {range && (
          <p className="border-t border-border px-3 py-2 text-xs text-muted-foreground">
            Tap one day for a single date, or two days for a range.
          </p>
        )}
      </PopoverContent>
    </Popover>
  );
}

const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1));
const MINUTES = ["00", "15", "30", "45"];

/** Simple time picker producing strings like "2:00 PM". */
export function TimePicker({
  value,
  onChange,
  placeholder = "Pick a time",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [hour, setHour] = React.useState("2");
  const [minute, setMinute] = React.useState("00");
  const [meridiem, setMeridiem] = React.useState("PM");
  const [open, setOpen] = React.useState(false);

  const selectClass =
    "rounded-lg border border-border bg-background px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            inputClass,
            "flex items-center gap-2 text-left",
            !value && "text-muted-foreground",
          )}
        >
          <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />
          {value || <span>{placeholder}</span>}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3" align="start">
        <div className="flex items-center gap-2">
          <select
            aria-label="Hour"
            className={selectClass}
            value={hour}
            onChange={(e) => setHour(e.target.value)}
          >
            {HOURS.map((h) => (
              <option key={h}>{h}</option>
            ))}
          </select>
          <span className="font-semibold">:</span>
          <select
            aria-label="Minute"
            className={selectClass}
            value={minute}
            onChange={(e) => setMinute(e.target.value)}
          >
            {MINUTES.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
          <select
            aria-label="AM or PM"
            className={selectClass}
            value={meridiem}
            onChange={(e) => setMeridiem(e.target.value)}
          >
            <option>AM</option>
            <option>PM</option>
          </select>
        </div>
        <Button
          className="mt-3 w-full"
          size="sm"
          onClick={() => {
            onChange(`${hour}:${minute} ${meridiem}`);
            setOpen(false);
          }}
        >
          Set time
        </Button>
      </PopoverContent>
    </Popover>
  );
}
