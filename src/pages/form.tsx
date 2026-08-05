import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { FleeingButton } from "@/pages/fleeing";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";
import { Share2, Copy, Check, CalendarPlus } from "lucide-react";
import YesNormal from "@/assets/buttons/Yes_Normal.svg";
import YesSunken from "@/assets/buttons/Yes_Sunken.svg";
import ConfirmNormal from "@/assets/buttons/Confirm_Normal.svg";
import ConfirmSunken from "@/assets/buttons/Confirm_Sunken.svg";
import SubmitNormal from "@/assets/buttons/Submit_Normal.svg";
import SubmitSunken from "@/assets/buttons/Submt_Sunken.svg";

const cards: Variants = {
  initial: { opacity: 0, scale: 0.85, y: 15 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 350, damping: 25 },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: -15,
    transition: { duration: 0.15 },
  },
};

function Appointment() {
  const [isPressed, setIsPressed] = useState(false);
  const [step, setStep] = useState(1);
  const [questionChoice, setQuestionChoice] = useState<string | null>(null);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [action, setAction] = useState<string>("");
  const [copied, setCopied] = useState(false);

  // create ICS for automatic calendar setup
  const formatICSDate = (d: Date) => {
    return d.toISOString().replace(/-|:|\.\.\d+/g, "").slice(0.8);
  };

  const handleDownloadICS = () => {
    if (!date) return;

    const startDate = formatICSDate(date);

    const endDateDate = new Date(date);
    const endDate = formatICSDate(endDateDate);

    const title = `Our Date`;
    const description = `What are we doing? ${action}`;

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//My App//Wizard Event//EN",
      "CALSCALE:GREGORIAN",
      "BEGIN:VEVENT",
      `SUMMARY:${title}`,
      `DESCRIPTION:${description}`,
      `DTSTART;VALUE=DATE:${startDate}`,
      `DTEND;VALUE=DATE:${endDate}`,
      `STATUS:CONFIRMED`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute("download", `${action.toLowerCase().replace(/\s+/g, "-")}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Share Event
  const handleShareCopy = async () => {
    const summaryText = `Event:\nDid they yes? ${questionChoice}\nWhen? ${date ? format(date, "PPP") : "N/A"}\nWhat are we doing? ${action}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Calendar Event Details",
          text: summaryText,
        });
      } catch (err) {
        console.log(err)
      }
    } else {
      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRegularCopy = async () => {
    const summaryText = `Event Summary:\nDid she say yes? ${questionChoice}\nWhen? ${date ? format(date, "PPP") : "N/A"}\nWhat are we doing? ${action}`;
    await navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000)
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-[450px]">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="card1"
              variants={cards}
              initial="initial"
              animate="animate"
              exit="exit"

            >
              <Card className="w-100 max-w-sm items-center">
                <CardHeader className="w-[inherit] justify-self-center">
                  <CardTitle className="text-2xl justify-self-center">
                    Save the Date
                  </CardTitle>
                </CardHeader>

                <CardContent className="text-[15px]">
                  Would you like to go on a date?
                </CardContent>
                <CardFooter>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      className="p-0 bg-transparent hover:bg-transparent shadow-none"
                      onMouseDown={() => setIsPressed(true)}
                      onMouseUp={() => setIsPressed(false)}
                      aria-label="Yes"
                      size="lg"
                      onClick={() => {
                        setQuestionChoice("Yes");
                        setStep(2);
                      }}
                    >
                      <img
                        src={isPressed ? YesSunken : YesNormal}
                        alt="Yes"
                        className="w-full h-full object-contain"
                      />
                    </Button>
                    <FleeingButton fleeDistance={120}></FleeingButton>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          )}
          {step === 2 && (
            <motion.div
              key="card2"
              variants={cards}
              initial="initial"
              animate="animate"
              exit="exit"

            >
              <Card className="w-100 max-w-sm items-center">
                <CardHeader className="w-[inherit] justify-self-center">
                  <CardTitle className="text-2xl justify-self-center">
                    She said yes!
                  </CardTitle>
                  <CardDescription className="justify-self-center text-[15px]">When do you want to go out?</CardDescription>
                </CardHeader>

                <CardContent className="text-[15px]">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md morder shadow-sm"
                  />
                </CardContent>
                <CardFooter>
                    <Button
                      variant="ghost"
                      className="p-0 bg-transparent hover:bg-transparent shadow-none"
                      onMouseDown={() => setIsPressed(true)}
                      onMouseUp={() => setIsPressed(false)}
                      aria-label="Confirm"
                      size="lg"
                      disabled={!date}
                      onClick={() => setStep(3)}
                    >
                      <img
                        src={isPressed ? ConfirmSunken : ConfirmNormal}
                        alt="Confirm"
                        className="w-full h-full object-contain"
                      />
                    </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}
          {step === 3 && (
            <motion.div
              key="card3"
              variants={cards}
              initial="initial"
              animate="animate"
              exit="exit"

            >
              <Card className="w-100 max-w-sm items-center">
                <CardHeader className="w-[inherit] justify-self-center">
                  <CardTitle className="text-2xl justify-self-center">
                    Coolbeans!
                  </CardTitle>
                  <CardDescription className="justify-self-center text-[15px]">What do you want to do?</CardDescription>
                </CardHeader>

                <CardContent className="text-[15px]">
                  <Select value={action} onValueChange={(val) => setAction(val ?? "")}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pick an idea :)"/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Go shopping">Go shopping</SelectItem>
                      <SelectItem value="Do a picnic">Do a picnic</SelectItem>
                      <SelectItem value="Watch a movie">Watch a movie</SelectItem>
                      <SelectItem value="Build legos/gundams">Build legos/gundams</SelectItem>
                      <SelectItem value="Surprise me">Surprise me</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
                <CardFooter>
                    <Button
                      variant="ghost"
                      className="p-0 bg-transparent hover:bg-transparent shadow-none"
                      onMouseDown={() => setIsPressed(true)}
                      onMouseUp={() => setIsPressed(false)}
                      aria-label="Submit"
                      size="lg"
                      disabled={!action}
                      onClick={() => setStep(4)}
                    >
                      <img
                        src={isPressed ? SubmitSunken : SubmitNormal}
                        alt="Submit"
                        className="w-full h-full object-contain"
                      />
                    </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}
          {step === 4 && (
            <motion.div
              key="card4"
              variants={cards}
              initial="intial"
              animate="animate"
              exit="exit"
            >
              <Card className="w-100 max-w-sm items-center">
                <CardHeader className="w-[inherit] justify-self-center">
                  <CardTitle className="text-2xl justify-self-center">
                    It's a date!
                  </CardTitle>
                  <CardDescription>Here's the breakdown, add it to you calendar and share it with him!</CardDescription>
                </CardHeader>

                <CardContent className="text-[15px]">
                  <div className="flex justify-between py-1 border-b">
                    <span className="text-muted-foreground">Did she say yes?</span>
                    <span className="font-medium">{questionChoice}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b">
                    <span className="text-muted-foreground">Date:</span>
                    <span className="font-medium">
                      {date ? format(date, "PPP") : "None"}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-muted-foreground">What are we doing?</span>
                    <span className="font-medium">{action}</span>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                  {/* Primary Button: Add to Calendar (.ics Download) */}
                  <Button className="w-full" onClick={handleDownloadICS}>
                    <CalendarPlus className="mr-2 h-4 w-4" /> Add to Calendar (.ics)
                  </Button>

                  {/* Secondary Actions */}
                  <div className="flex gap-2 w-full">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={handleShareCopy}
                    >
                      <Share2 className="mr-2 h-4 w-4" /> Share
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={handleRegularCopy}
                    >
                      {copied ? (
                        <Check className="mr-2 h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="mr-2 h-4 w-4" />
                      )}
                      {copied ? "Copied!" : "Copy"}
                    </Button>
                  </div>

                </CardFooter>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}

export default Appointment;
