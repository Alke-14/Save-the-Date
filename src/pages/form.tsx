import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { FleeingButton } from "@/pages/fleeing";

function Appointment() {
// ADD 'AVOID' LOGIC

  return (
    <>
      <Card className="w-full max-w-sm items-center">
        <CardHeader className="w-[inherit] justify-self-center">
          <CardTitle className="text-2xl justify-self-center">
            Save the Date
          </CardTitle>
        </CardHeader>

        <CardContent className="text-[15px]">
          Do you like coding?
        </CardContent>
        <CardFooter>
          <div className="flex gap-1">
            <Button className="text-[15px]" size="lg">Yes</Button>
            <FleeingButton variant="destructive" fleeDistance={120}>Nah</FleeingButton>
          </div>
        </CardFooter>
      </Card>
    </>
  )
}

export default Appointment;
