'use client';
 
import UpdateCard from "../components/UpdateCard";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

export default function UpdatesPage() {

  const [updates, setUpdates] = useState([]);
  
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
    <div className='bg-black w-full min-h-screen'>
      <div className="max-w-3xl py-10 mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-left">Updates</h1>
        <div className="flex flex-col gap-2">
          {updates.map(updates => (
            <UpdateCard key={updates.id} update_props={updates} />
          ))}
        </div>
      </div>
    </div>
  );
}
