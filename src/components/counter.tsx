"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useMotionValue, useSpring, useTransform, animate } from "framer-motion";

interface CounterProps {
    value: string | number;
    direction?: "up" | "down";
}

export function Counter({ value, direction = "up" }: CounterProps) {
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    // Handle strings with symbols like ₦, K, T, %
    const stringValue = String(value);
    const numericMatch = stringValue.match(/[\d.]+/);
    const numericValue = numericMatch ? parseFloat(numericMatch[0].replace(/,/g, '')) : 0;

    // Extract prefix and suffix correctly
    const prefix = stringValue.match(/^[^\d.]+/)?.[0] || "";
    const suffix = stringValue.match(/[^\d.]+$/)?.[0] || "";

    const motionValue = useMotionValue(direction === "down" ? numericValue : 0);
    const springValue = useSpring(motionValue, {
        damping: 30,
        stiffness: 100,
    });

    useEffect(() => {
        if (isInView) {
            animate(motionValue, numericValue, {
                duration: 2,
                ease: "easeOut",
            });
        }
    }, [isInView, motionValue, numericValue]);

    const [display, setDisplay] = useState(stringValue);

    useEffect(() => {
        return springValue.on("change", (latest) => {
            const formatted = latest.toLocaleString("en-US", {
                maximumFractionDigits: numericValue % 1 === 0 ? 0 : 1,
            });
            setDisplay(`${prefix}${formatted}${suffix}`);
        });
    }, [springValue, prefix, suffix, numericValue]);

    return (
        <span ref={ref}>
            {display}
        </span>
    );
}
