export default function ComingSoon({ page }: { page?: string }) {
    return (
        <div className="flex min-h-screen bg-background">
            <div className="flex-1 flex flex-col min-w-0">
                <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
                    <div className="max-w-xl mx-auto h-full flex flex-col items-center justify-center text-center py-20">
                        <div className="rounded-[2rem] border border-border/60 bg-card/80 p-8 shadow-2xl shadow-black/10 backdrop-blur-xl">
                            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">Coming soon</p>
                            <h1 className="text-3xl sm:text-4xl font-semibold text-heading mb-3">
                                {page ?? 'This page'}
                            </h1>
                            <p className="text-sm text-muted-foreground max-w-md mx-auto">
                                We’re still building this experience. Check back soon for updates.
                            </p>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
