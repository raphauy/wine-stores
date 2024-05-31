import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

type Props = {
 title: string
 subtitle: string
 value: number
 percentange: number
}
export default function StatBox({ title, subtitle, value, percentange }: Props) {
return (
    <Card>
        <CardHeader className="pb-2">
            <CardDescription>{title}</CardDescription>
            <CardTitle className="text-4xl">{value}</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="text-xs text-muted-foreground">{subtitle}</div>
        </CardContent>
        <CardFooter>
            <Progress value={percentange} aria-label={`${title} progress`} className="h-3" />
        </CardFooter>
    </Card>
)
}
