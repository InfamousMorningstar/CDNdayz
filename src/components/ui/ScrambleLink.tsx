"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface ScrambleLinkProps {
  href: string;
  label: string;
  className?: string;
  icon?: any;
  onClick?: () => void;
}

export function ScrambleLink({ href, label, className, icon: Icon, onClick }: ScrambleLinkProps) {
  const [displayText, setDisplayText] = useState(label);
  const [isHovered, setIsHovered] = useState(false);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isHovered) {
      let iteration = 0;
      
      interval = setInterval(() => {
        setDisplayText(prev => 
          label
            .split("")
            .map((letter, index) => {
              if (index < iteration) {
                return label[index];
              }
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join("")
        );
        
        if (iteration >= label.length) {
          clearInterval(interval);
        }
        
        iteration += 1/3;
      }, 30);
    } else {
      setDisplayText(label);
    }

    return () => clearInterval(interval);
  }, [isHovered, label]);

  return (
    <Link
      href={href}
      className={className}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {Icon && <Icon className="w-4 h-4" />}
      <span>{displayText}</span>
    </Link>
  );
}
