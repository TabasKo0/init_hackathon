'use client';

import UpdateCard from "../components/UpdateCard";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

export default function UpdatesPage() {

  const [updates, setUpdates] = useState([]);

  //need to check later for bugs
  async function loadInitial() {
    const { data, error } = await supabase
      .from('updates')
      .select('*')
      .order('is_important', { ascending: false })
      .order('created_at', { ascending: false });
    if (!error) setUpdates(data);
  }

  useEffect(() => {
    loadInitial();

    const channel = supabase
      .channel('updates-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'updates' },
        payload => {
          setUpdates(prev => {
            if (payload.eventType === 'INSERT') {
              return [payload.new, ...prev];
            }
            if (payload.eventType === 'UPDATE') {
              return prev.map(u =>
                u.id === payload.new.id ? payload.new : u
              );
            }
            if (payload.eventType === 'DELETE') {
              return prev.filter(u => u.id !== payload.old.id);
            }
            return prev;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // test data
  const updates1 = [
    {
      id: 1,
      title: 'Welcome to the Hackathon!',
      content: 'We are excited to kick off the hackathon. Stay tuned for updates!',
      created_by: 'admin',
      is_important: true,
      created_at: '2024-06-01T10:00:00Z',
    },
    {
      id: 2,
      title: 'Schedule Released',
      content: 'The schedule for the hackathon has been released. Check it out on the website.',
      created_by: 'admin',
      is_important: false,
      created_at: '2024-06-02T12:00:00Z',
    },
    {
      id: 3,
      title: 'New Mentor Added',
      content: 'We have added a new mentor to our team. Welcome aboard!',
      created_by: 'admin',
      is_important: false,
      created_at: '2024-06-03T14:00:00Z',
    },
  ]

  return (
    <div className="relative h-[90vh] w-full overflow-hidden bg-black">

      {/* AI shit */}
      {/* Purple gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-black to-purple-950"></div>
      {/* Soft purple glow blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl"></div>
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-fuchsia-600/20 rounded-full blur-3xl"></div>


      {/* header */}
      <div className="relative z-10 max-w-3xl py-10 mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-2 text-purple-400">
            Live Hackathon Updates
          </h1>
          <p className="text-gray-400">
            Stay updated with the latest news and announcements from our hackathon.
          </p>
        </div>

        {/* updatecard */}
        <div className="flex flex-col gap-4">
          {updates.map(update => (
            <UpdateCard key={update.id} update_props={update} />
          ))}
        </div>
      </div>
    </div>
  );


}
