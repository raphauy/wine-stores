"use client"

import Cal, { getCalApi } from "@calcom/embed-react"
import { useEffect } from "react"

type Props= {
    slug: string
    namespace: string
}
export default function ScheduleEmbedded({ slug, namespace }: Props) {
    useEffect(() => {
        (async function () {
            const cal = await getCalApi({ namespace })
            cal("ui", { "styles": { "branding": { "brandColor": "#000000" } }, "hideEventTypeDetails": false, "layout": "month_view" })
        })();
    }, [namespace])

    return (
        <Cal    
            namespace={namespace}
            calLink={`${slug}/${namespace}`}
            style={{ width: "100%", height: "100%", overflow: "scroll" }}
            config={{ layout: 'month_view' }}
        />
    )
};
