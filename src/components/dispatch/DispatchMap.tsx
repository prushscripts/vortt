"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin, User, Navigation } from "lucide-react";
import type { Job, Tech } from "@/types";

interface DispatchMapProps {
  techs: Tech[];
  jobs: Job[];
  selectedJobId?: string | null;
  assignments: Map<string, string>;
}

const TECH_COLORS = ["#F97316", "#34C759", "#007AFF", "#FF9F0A", "#AF52DE"];

export function DispatchMap({ techs, jobs, selectedJobId, assignments }: DispatchMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
    if (!apiKey || apiKey === "your-google-maps-api-key") {
      setMapLoaded(false);
      return;
    }

    if (window.google?.maps) {
      initMap();
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = initMap;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const initMap = () => {
    if (!mapRef.current) return;

    const map = new google.maps.Map(mapRef.current, {
      center: { lat: 30.2729, lng: -97.7444 },
      zoom: 12,
      styles: [
        { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
        { featureType: "transit", stylers: [{ visibility: "off" }] },
      ],
      disableDefaultUI: true,
      zoomControl: true,
    });

    googleMapRef.current = map;
    setMapLoaded(true);
    renderMarkers(map);
  };

  const renderMarkers = (map: google.maps.Map) => {
    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];

    // Tech markers
    techs.forEach((tech, i) => {
      if (!tech.lat || !tech.lng) return;
      const color = TECH_COLORS[i % TECH_COLORS.length];
      const marker = new google.maps.Marker({
        position: { lat: tech.lat, lng: tech.lng },
        map,
        title: tech.name,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 12,
          fillColor: color,
          fillOpacity: 1,
          strokeColor: "#fff",
          strokeWeight: 2,
        },
        label: {
          text: tech.name.split(" ").map(n => n[0]).join(""),
          color: "#fff",
          fontSize: "10px",
          fontWeight: "bold",
        },
      });
      markersRef.current.push(marker);

      // Draw lines to assigned jobs
      jobs.forEach(job => {
        if (job.techId === tech.id && job.customer?.lat && job.customer?.lng) {
          const line = new google.maps.Polyline({
            path: [
              { lat: tech.lat!, lng: tech.lng! },
              { lat: job.customer.lat, lng: job.customer.lng },
            ],
            map,
            strokeColor: color,
            strokeOpacity: 0.4,
            strokeWeight: 2,
            geodesic: true,
          });
        }
      });
    });

    // Job markers
    jobs.forEach(job => {
      if (!job.customer?.lat || !job.customer?.lng) return;
      const isEmergency = job.priority === "emergency";
      const isUnassigned = !job.techId && !assignments.has(job.id);
      const isSelected = job.id === selectedJobId;

      const marker = new google.maps.Marker({
        position: { lat: job.customer.lat, lng: job.customer.lng },
        map,
        title: `${job.customer.firstName} ${job.customer.lastName}`,
        icon: {
          path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
          fillColor: isEmergency ? "#FF3B30" : isUnassigned ? "#8B5CF6" : "#34C759",
          fillOpacity: 1,
          strokeColor: isSelected ? "#1C1C1E" : "#fff",
          strokeWeight: isSelected ? 3 : 1.5,
          scale: isSelected ? 1.8 : 1.4,
          anchor: new google.maps.Point(12, 24),
        },
      });
      markersRef.current.push(marker);
    });
  };

  useEffect(() => {
    if (googleMapRef.current) {
      renderMarkers(googleMapRef.current);
    }
  }, [jobs, techs, selectedJobId, assignments]);

  if (!mapLoaded) {
    return (
      <FallbackMap techs={techs} jobs={jobs} assignments={assignments} selectedJobId={selectedJobId} />
    );
  }

  return <div ref={mapRef} className="w-full h-full" />;
}

// Beautiful fallback when no API key
function FallbackMap({ techs, jobs, assignments, selectedJobId }: DispatchMapProps) {
  const TECH_COLORS = ["#F97316", "#34C759", "#007AFF", "#FF9F0A"];

  return (
    <div className="w-full h-full bg-[#1C1C1F] flex flex-col">
      {/* Map placeholder header */}
      <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
        <div className="bg-[rgba(17,17,22,0.9)] backdrop-blur-sm rounded-xl px-4 py-2 shadow-sm border border-zinc-200">
          <p className="text-xs font-semibold text-zinc-500">Live Dispatch Map</p>
          <p className="text-xs text-zinc-400">Add Google Maps API key to activate</p>
        </div>
        <div className="bg-[rgba(17,17,22,0.9)] backdrop-blur-sm rounded-xl px-3 py-2 shadow-sm border border-zinc-200">
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 rounded-full bg-vortt-red" />
              <span className="text-zinc-600">Emergency</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
              <span className="text-zinc-600">Unassigned</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 rounded-full bg-vortt-green" />
              <span className="text-zinc-600">Assigned</span>
            </div>
          </div>
        </div>
      </div>

      {/* Simulated map grid */}
      <div className="flex-1 relative overflow-hidden">
        {/* Grid lines */}
        <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#94a3b8" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Simulated road lines */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <line x1="0" y1="45%" x2="100%" y2="45%" stroke="#cbd5e1" strokeWidth="3"/>
          <line x1="0" y1="70%" x2="100%" y2="70%" stroke="#cbd5e1" strokeWidth="2"/>
          <line x1="30%" y1="0" x2="30%" y2="100%" stroke="#cbd5e1" strokeWidth="3"/>
          <line x1="65%" y1="0" x2="65%" y2="100%" stroke="#cbd5e1" strokeWidth="2"/>
          <line x1="0" y1="25%" x2="60%" y2="65%" stroke="#e2e8f0" strokeWidth="1.5"/>
          <line x1="40%" y1="20%" x2="100%" y2="60%" stroke="#e2e8f0" strokeWidth="1.5"/>
        </svg>

        {/* Tech positions */}
        {techs.map((tech, i) => {
          const x = [25, 55, 75, 40][i % 4];
          const y = [35, 60, 30, 70][i % 4];
          const color = TECH_COLORS[i % TECH_COLORS.length];

          return (
            <div
              key={tech.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              <div className="relative">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg border-2 border-white"
                  style={{ backgroundColor: color }}
                >
                  {tech.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <span className="text-[10px] font-semibold text-zinc-600 bg-[rgba(17,17,22,0.8)] px-1 rounded">
                    {tech.name.split(" ")[0]}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Job positions */}
        {jobs.slice(0, 6).map((job, i) => {
          const positions = [[45, 25], [20, 55], [70, 45], [55, 75], [80, 65], [35, 80]];
          const [x, y] = positions[i % positions.length];
          const isEmergency = job.priority === "emergency";
          const isUnassigned = !job.techId && !assignments.has(job.id);
          const isSelected = job.id === selectedJobId;
          const dotColor = isEmergency ? "#FF3B30" : isUnassigned ? "#8B5CF6" : "#34C759";

          return (
            <div
              key={job.id}
              className={`absolute transform -translate-x-1/2 -translate-y-full z-10 transition-all ${isSelected ? "scale-125" : ""}`}
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              <div className="relative">
                <svg width="24" height="32" viewBox="0 0 24 32">
                  <path
                    d="M12 0C5.37 0 0 5.37 0 12c0 9 12 20 12 20S24 21 24 12C24 5.37 18.63 0 12 0z"
                    fill={dotColor}
                    stroke={isSelected ? "#1C1C1E" : "white"}
                    strokeWidth={isSelected ? "2" : "1.5"}
                  />
                  <circle cx="12" cy="11" r="4" fill="white" fillOpacity="0.9"/>
                </svg>
              </div>
            </div>
          );
        })}

        {/* Connection lines for assigned jobs */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {jobs.map((job, i) => {
            if (!job.techId) return null;
            const techIdx = techs.findIndex(t => t.id === job.techId);
            if (techIdx === -1) return null;
            const techPositions = [[25, 35], [55, 60], [75, 30], [40, 70]];
            const jobPositions = [[45, 25], [20, 55], [70, 45], [55, 75], [80, 65], [35, 80]];
            const [tx, ty] = techPositions[techIdx % 4];
            const [jx, jy] = jobPositions[i % 6];
            const color = TECH_COLORS[techIdx % TECH_COLORS.length];

            return (
              <line
                key={`line-${job.id}`}
                x1={`${tx}%`} y1={`${ty}%`}
                x2={`${jx}%`} y2={`${jy}%`}
                stroke={color}
                strokeWidth="1.5"
                strokeOpacity="0.35"
                strokeDasharray="4 3"
              />
            );
          })}
        </svg>
      </div>

      {/* Bottom legend */}
      <div className="absolute bottom-0 left-0 right-0">
        <div className="bg-[#161618] border-t border-t-[#2A2A2E] px-4 py-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <p className="text-xs font-semibold text-[#8E8E93]">{techs.length} techs · {jobs.length} jobs</p>
            <div className="flex items-center gap-3">
              {techs.slice(0, 4).map((tech, i) => (
                <div key={tech.id} className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: TECH_COLORS[i % TECH_COLORS.length] }} />
                  <span className="text-xs text-[#8E8E93]">{tech.name.split(" ")[0]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
