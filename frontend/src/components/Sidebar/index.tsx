'use client';

import { menus } from '@/utils/constants';
import Header from '../Header';
import Menu from './Menu';
import MenuItem from './MenuItem';

interface IWithSidebarProps {
  profile: 'teacher' | 'student';
  children: React.ReactNode;
}

function WithSidebar({ children, profile }: IWithSidebarProps) {
  return (
    <div className='w-full flex items-stretch'>
      <div className='group w-full max-w-[82px] hidden md:block fixed top-0 bottom-0 left-0 bg-[#1ba48a] p-4 duration-300'>
        <Menu>
          {menus[profile]?.map((menu) => (
            <MenuItem
              key={menu.href}
              href={menu.href}
              label={menu.label}
              icon={menu.icon as LucidIcon}
            />
          ))}
        </Menu>
      </div>
      <div className='w-full duration-300 md:ml-[82px]'>
        <Header />
        <div className='w-full p-4'>{children}</div>
      </div>
    </div>
  );
}

export default WithSidebar;
