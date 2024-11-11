'use client';

import WithSidebar from '@/components/Sidebar';
import { getCookie } from 'cookies-next';
import { useEffect, useState } from 'react';

function TeacherLayout({ children }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      const profile = getCookie('profile');
      const token = getCookie('token');
      if (profile !== 'professor' || !token) {
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
    <div className='w-full min-h-screen bg-[#f4f8f7]'>
      <WithSidebar profile='teacher'>{children}</WithSidebar>
    </div>
  );
}

export default TeacherLayout;
