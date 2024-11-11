'use client';

import WithSidebar from '@/components/Sidebar';
import { TracksProvider } from '@/contexts/TracksContext';
import { getCookie } from 'cookies-next';
import { useEffect, useState } from 'react';

function TeacherLayout({ children }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      const profile = getCookie('profile');
      const token = getCookie('token');
      if (profile !== 'aluno' || !token) {
        window.location.href = '/auth';
      }
      setLoading(false);
    }, 2000);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  if (loading) return <span>Carregando...</span>;

  return (
    <div className='w-full bg-[#f4f8f7]'>
      <TracksProvider>
        <WithSidebar profile='student'>{children}</WithSidebar>
      </TracksProvider>
    </div>
  );
}

export default TeacherLayout;
