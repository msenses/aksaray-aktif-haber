"use client";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

type GalleryItem = {
    id: string;
    url: string;
    alt: string;
};

export default function GalleryLightbox({ items }: { items: GalleryItem[] }) {
    const [open, setOpen] = useState(false);
    const [current, setCurrent] = useState(0);

    const hasItems = items && items.length > 0;

    const openAt = useCallback((index: number) => {
        setCurrent(index);
        setOpen(true);
    }, []);

    const close = useCallback(() => setOpen(false), []);

    const prev = useCallback(() => {
        setCurrent((i) => (i - 1 + items.length) % items.length);
    }, [items.length]);

    const next = useCallback(() => {
        setCurrent((i) => (i + 1) % items.length);
    }, [items.length]);

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") close();
            if (e.key === "ArrowLeft") prev();
            if (e.key === "ArrowRight") next();
        };
        document.addEventListener("keydown", onKey);
        document.documentElement.style.overflow = "hidden";
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.documentElement.style.overflow = "";
            document.body.style.overflow = "";
        };
    }, [open, close, prev, next]);

    if (!hasItems) return null;

    return (
        <div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {items.map((m, idx) => (
                    <button key={m.id} type="button" onClick={() => openAt(idx)} className="relative w-full aspect-[4/3] rounded overflow-hidden border border-black/10 dark:border-white/10">
                        <Image src={m.url} alt={m.alt} fill className="object-cover" />
                    </button>
                ))}
            </div>

            {open && (
                <div className="fixed inset-0 z-[10000]">
                    <div className="absolute inset-0 bg-black/80" onClick={close} />
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                        <div className="relative w-full max-w-5xl aspect-video">
                            <Image src={items[current].url} alt={items[current].alt} fill className="object-contain rounded" />
                        </div>
                        <button aria-label="Kapat" onClick={close} className="absolute top-4 right-4 p-2 rounded-full bg-white/90 text-black">✕</button>
                        {items.length > 1 && (
                            <>
                                <button aria-label="Önceki" onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/90 text-black">‹</button>
                                <button aria-label="Sonraki" onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/90 text-black">›</button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}


