import {AppSidebar} from "@/components/app-sidebar"
import {ChartAreaInteractive} from "@/components/chart-area-interactive"
import {DataTable} from "@/components/data-table"
import {SiteHeader} from "@/components/site-header"
import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar"

interface LogEntry {
    type: "error" | "info" | "transaction"
    message: string
    context?: Record<string, unknown>
    timestamp: number
    app: string
    release: string
}

export default async function Page() {
    const res = await fetch("http://localhost:3000/api/logs", {
        cache: "no-store"
    })
    const data: LogEntry[] = await res.json()

    const transformedData = data.map((log, index) => ({
        id: index,
        type: log.type,
        message: log.message,
        app: log.app,
        release: log.release,
        timestamp: log.timestamp,
        context: log.context ?? {},
    }))

    return (
        <SidebarProvider>
            <AppSidebar variant="inset"/>
            <SidebarInset>
                <SiteHeader/>
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-2">
                        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                            <div className="px-4 lg:px-6">
                                <ChartAreaInteractive/>
                            </div>
                            <DataTable data={transformedData}/>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
