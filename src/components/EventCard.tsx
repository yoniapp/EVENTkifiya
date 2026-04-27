import React from 'react';
import { Link } from 'react-router-dom';
import { Event } from '../types';
import { MapPin, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'motion/react';

interface EventCardProps {
  event: Event;
  index: number;
  key?: string | number;
}

export default function EventCard({ event, index }: EventCardProps) {
  const date = new Date(event.dateTime);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="group"
    >
      <Link 
        to={`/event/${event.id}`}
        className="block space-y-6"
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-line">
          <img 
            src={event.bannerUrl || "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&q=80&w=1000"} 
            alt={event.title}
            className="w-full h-full object-cover grayscale opacity-80 transition-all duration-700 group-hover:scale-110 group-hover:grayscale-0 group-hover:opacity-100"
          />
          <div className="absolute top-6 right-6 bg-paper px-4 py-2 text-[10px] font-black uppercase tracking-widest shadow-2xl border border-line">
            {event.category || 'Experience'}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-start gap-4">
            <h3 className="text-2xl font-black uppercase leading-tight group-hover:text-accent transition-colors">
              {event.title}
            </h3>
            <div className="pt-1">
              <ArrowRight className="w-5 h-5 text-muted group-hover:text-accent group-hover:translate-x-1 transition-all" />
            </div>
          </div>

          <div className="grid grid-cols-2 border-t border-line pt-4 gap-4">
            <div className="space-y-1">
              <span className="block text-[10px] font-bold uppercase tracking-widest text-muted">Date</span>
              <p className="text-[13px] font-bold uppercase tracking-tight">{format(date, 'dd MMM — HH:mm')}</p>
            </div>
            <div className="space-y-1 text-right">
              <span className="block text-[10px] font-bold uppercase tracking-widest text-muted">Venue</span>
              <div className="flex items-center justify-end gap-1 text-[13px] font-bold uppercase tracking-tight">
                <MapPin className="w-3 h-3 text-accent" />
                <span className="truncate max-w-[100px]">{event.location}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
