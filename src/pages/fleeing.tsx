"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import NoNormal from "@/assets/buttons/No_Normal.svg"

type ButtonProps = React.ComponentProps<typeof Button>;

interface FleeingButtonProps extends ButtonProps {
  fleeDistance?: number;
}

export function FleeingButton({ children, fleeDistance = 100, ...props }: FleeingButtonProps) {

  const buttonRef = useRef<HTMLButtonElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});

  const handleMouseMove = (e: React.MouseEvent) => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const button = buttonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const buttonCenterX = rect.left + rect.width / 2;
    const buttonCenterY = rect.top + rect.height / 2;

    const deltaX = e.clientX - buttonCenterX;
    const deltaY = e.clientY - buttonCenterY;
    const distance = Math.hypot(deltaX, deltaY);

    if (distance < fleeDistance) {
      const angle = Math.atan2(deltaY, deltaX);
      const pushFactor = fleeDistance - distance;
      const moveX = -Math.cos(angle) * pushFactor * 1.5;
      const moveY = -Math.sin(angle) * pushFactor * 1.5;

      setStyle({
        transform: `translate(${moveX}px, ${moveY}px)`,
        transition: `transform 0.1s ease-out`,
      });
    }
  };

  // DESKTOP Logic
  const handleMouseLeave = () => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    setStyle({
      transform: "translate(0px, 0px)",
      transition: "transform 0.5s ease-out",
    });
  };

  // MOBILE logic
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    const randomX = (Math.random() - 0.5) * 300;
    const randomY = (Math.random() - 0.5) * 300;

    setStyle({
      transform: `trabslate(${randomX}px, ${randomY}px)`,
      transition: `transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)`,
    });
  };

  return (
    <div
      className="inline-block p-6 -m-6 select-none touch-none"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Button
        ref={buttonRef}
        style={style}
        onTouchStart={handleTouchStart}
        {...props}
        size="lg"
        variant="ghost"
        className="p-0 bg-transparent hover:bg-transparent shadow-none"
        aria-label="No"
      >
        <img
          src={NoNormal}
          alt="No"
          className="w-full h-full object-contain"
        />
        {children}
      </Button>
    </div>
  )
}
