'use client';

import { menus } from '@/utils/constants';
import { deleteCookie, getCookie } from 'cookies-next';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import Drawer from 'react-modern-drawer';
import 'react-modern-drawer/dist/index.css';
import Icon from '../Icon';

function Header() {
  const [profile, setProfile] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };

  const { push } = useRouter();

  const handleLogout = useCallback(() => {
    deleteCookie('token');
    deleteCookie('profile');
    push('/auth');
  }, [push]);

  useEffect(() => {
    const profile = getCookie('profile');
    if (!profile) return;
    setProfile(() => (String(profile) === 'professor' ? 'teacher' : 'student'));
  }, [push]);

  return (
    <>
      <Drawer
        open={isOpen}
        onClose={toggleDrawer}
        direction='left'
        className='p-4'
      >
        {menus[profile]?.map((menu) => (
          <Link
            key={menu.label}
            className='flex items-center gap-2 p-2'
            href={menu.href}
            onClick={toggleDrawer}
          >
            <Icon name={menu.icon} />
            <span className='font-medium text-gray-700'>{menu.label}</span>
          </Link>
        ))}
      </Drawer>
      <header className='w-full flex items-center justify-between bg-white p-4 h-[72px]'>
        <div className='hidden md:flex items-center p-2 gap-2'>
          <Icon name='Code2' size={40} />
          <span className='font-bold text-2xl'>Trajeto Algoritmos</span>
        </div>
        <div className='md:hidden flex items-center'>
          <button onClick={toggleDrawer}>
            <Icon name='Menu' size={30} />
          </button>
        </div>
        <button className='flex item-center gap-2' onClick={handleLogout}>
          <Icon name='LogOut' />
          <span className='leading-tight font-medium'>Sair</span>
        </button>
      </header>
    </>
  );
}

export default Header;
