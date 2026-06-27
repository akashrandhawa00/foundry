import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function UnderConstructionGIF() {
    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <div className="w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80">
                <DotLottieReact src="/working-animation.lottie" loop autoplay />
            </div>
            <div className="text-center px-4">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-200" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                    git push origin coming-soon
                </h2>
                <p className="text-sm sm:text-base text-gray-500 mt-2">
                    This page is currently in peer review. By me. I am the peer.
                </p>
            </div>
        </div>
    );
}
