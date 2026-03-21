export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 animate-in fade-in duration-500">
            <div className="relative w-20 h-20">
                {/* Medysa Brand Spinner */}
                <div className="absolute inset-0 border-4 border-gray-800 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-t-amber-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-2 border-2 border-purple-500/20 rounded-full animate-pulse"></div>
            </div>

            <div className="space-y-2 text-center">
                <h3 className="text-xl font-medium text-white tracking-widest font-mono uppercase opacity-80">
                    Gathering Intelligence
                </h3>
                <p className="text-sm text-gray-500 font-serif italic">
                    Preparing the scribe&apos;s records...
                </p>
            </div>

            <div className="flex gap-1.5">
                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce"></div>
            </div>
        </div>
    );
}
