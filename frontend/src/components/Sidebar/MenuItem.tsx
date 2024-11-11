'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Tooltip from 'rc-tooltip';
import Icon from '../Icon';

interface MenuItemProps {
  href: string;
  label: string;
  icon: LucidIcon;
}

function MenuItem({ href, label, icon }: MenuItemProps) {
  const pathname = usePathname();
  return (
    <Tooltip
      overlay={<span className='font-medium text-white text-sm'>{label}</span>}
      placement='right'
      trigger={['hover']}
    >
      <Link
        data-selected={pathname === href}
        href={href}
        className='w-full flex items-center gap-2 hover:bg-[#20695c] data-[selected=true]:bg-[#20695c44] h-[48px] px-4 duration-300 rounded-md'
      >
        <Icon name={icon as LucidIcon} color='#fff' />
      </Link>
    </Tooltip>
  );
}

export default MenuItem;
