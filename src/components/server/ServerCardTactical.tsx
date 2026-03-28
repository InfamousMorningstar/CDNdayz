import React, { useMemo, useState } from 'react';
import { Badge } from "@/components/ui/Badge";
import { 
    Users, 
    Signal, 
    Map as MapIcon, 
    Globe, 
    Zap, 
    Snowflake, 
    Trees, 
    Mountain,
    Radio,
    Copy,
    Check
} from "lucide-react";

interface ServerCardProps {
    name: string;
    map: string;
    players: number;
    maxPlayers: number;
    status: "online" | "offline" | "starting" | "maintenance" | "restarting";
    ping?: number;
    connect: string;
}

const ServerCardTactical: React.FC<ServerCardProps> = ({ 
    name, 
    map, 
    players, 
    maxPlayers, 
    status, 
    ping, 
    connect 
}) => {
    const isOnline = status === "online";
    const isRestarting = status === "restarting";
    const percentage = Math.round((players / maxPlayers) * 100);
    const [copied, setCopied] = useState(false);

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(connect);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Determine Theme based on Map

    // Determine Theme based on Map
    const theme = useMemo(() => {
        const lowerMap = map.toLowerCase();
        const lowerName = name.toLowerCase();
        const isHardcore = lowerName.includes('hardcore');

        if (lowerMap.includes('namalsk')) return { 
            color: 'text-cyan-400', 
            bg: 'bg-cyan-950', 
            bar: 'bg-cyan-400',
            border: 'group-hover:border-cyan-500/50', 
            icon: Snowflake,
            label: isHardcore ? 'Hardcore Arctic' : 'Arctic Survival'
        };
        if (lowerMap.includes('livonia')) return { 
            color: 'text-amber-400', 
            bg: 'bg-amber-950', 
            bar: 'bg-amber-400',
            border: 'group-hover:border-amber-500/50', 
            icon: Trees,
            label: isHardcore ? 'Hardcore Woodland' : 'Woodland Combat'
        };
        if (lowerMap.includes('deer')) return { 
            color: 'text-emerald-400', 
            bg: 'bg-emerald-950', 
            bar: 'bg-emerald-400',
            border: 'group-hover:border-emerald-500/50', 
            icon: Mountain,
            label: isHardcore ? 'Hardcore Island' : 'Island Operations'
        };
        
        // Default (Chernarus etc)
        // Check for specific keywords to customize the default theme
        if (lowerName.includes('deathmatch') || lowerName.includes('pvp')) return {
             color: 'text-rose-500', 
            bg: 'bg-rose-950', 
            bar: 'bg-rose-500',
            border: 'group-hover:border-rose-500/50', 
            icon: Zap,
            label: 'High Intensity PvP'
        };

        return { 
            color: 'text-red-500', 
            bg: 'bg-red-950', 
            bar: 'bg-red-500',
            border: 'group-hover:border-red-500/50', 
            icon:  MapIcon,
            label: isHardcore ? 'Hardcore Survival' : 'Standard Operations'
        };
    }, [map, name]);

    const ThemeIcon = theme.icon;

    // Grid Pattern SVG for background
    const GridPattern = () => (
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </svg>
    );

    return (
        <div className={`group relative h-full flex flex-col bg-neutral-900 border border-neutral-800 hover:bg-neutral-800/80 transition-all duration-300 ${theme.border}`}>
            {/* Tactical Corners */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20 group-hover:border-white/50 transition-colors" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/20 group-hover:border-white/50 transition-colors" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/20 group-hover:border-white/50 transition-colors" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/20 group-hover:border-white/50 transition-colors" />

            {/* Header / Map Visual */}
            <div className={`relative h-24 overflow-hidden border-b border-white/5 ${theme.bg} bg-opacity-20`}>
                <GridPattern />
                
                {/* Large Background Icon */}
                <ThemeIcon className={`absolute -right-4 -top-4 w-32 h-32 opacity-5 rotate-12 ${theme.color}`} />
                
                <div className="absolute top-4 right-4 flex gap-2">
                     {isOnline && ping && (
                        <Badge variant="outline" className="bg-black/40 backdrop-blur border-white/10 text-neutral-400 font-mono text-[10px]">
                            {ping}ms
                        </Badge>
                    )}
                    <Badge className={`${isOnline ? "bg-green-500/20 text-green-400 hover:bg-green-500/30" : isRestarting ? "bg-amber-500/20 text-amber-500 hover:bg-amber-500/30" : "bg-red-500/20 text-red-500 hover:bg-red-500/30"} border-0 uppercase tracking-widest text-[10px]`}>
                        {status}
                    </Badge>
                </div>

                <div className="absolute bottom-3 left-4">
                    <div className={`text-xs font-mono uppercase tracking-widest opacity-60 mb-1 ${theme.color}`}>
                        {theme.label}
                    </div>
                    <div className="flex items-center gap-2 text-white font-bold font-heading tracking-wide">
                        <Globe className="w-4 h-4 text-neutral-500" />
                        {map}
                    </div>
                </div>
            </div>

            {/* Content Body */}
            <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                <div>
                    <h3 className="text-xl font-heading text-white mb-1 group-hover:text-red-500 transition-colors truncate">{name}</h3>
                    <button
                        type="button"
                        onClick={handleCopy}
                        className="group/copy flex items-center gap-2 cursor-pointer w-fit select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/80 rounded"
                        aria-label={`Copy server connect address for ${name}`}
                    >
                         <p className={`text-xs uppercase tracking-wider font-mono transition-colors duration-200 ${copied ? "text-green-400" : "text-neutral-500 group-hover:text-neutral-300"}`}>
                            {copied ? "IP COPIED" : connect}
                        </p>
                        <div className={`transition-all duration-300 ${copied ? "opacity-100 scale-100" : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"}`}>
                             {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3 text-neutral-400 group-hover/copy:text-white" />}
                        </div>
                    </button>
                </div>

                {/* Population Stats */}
                <div className="space-y-2 mt-auto">
                    <div className="flex justify-between text-xs font-mono text-neutral-400">
                        <span className="flex items-center gap-1.5">
                            <Users className="w-3 h-3" />
                            <span>SURVIVORS</span>
                        </span>
                        <span>{players} / {maxPlayers}</span>
                    </div>
                    
                    <div className="relative h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                        <div 
                            className={`absolute top-0 left-0 h-full transition-all duration-1000 ease-out rounded-full ${theme.bar}`}
                            style={{ width: `${percentage}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServerCardTactical;
