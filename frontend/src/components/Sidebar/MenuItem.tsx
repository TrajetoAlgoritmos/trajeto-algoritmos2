'use client';

import { getAllProfessorNotificationsService } from '@/services/tracks';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Tooltip from 'rc-tooltip';
import { useEffect, useState } from 'react';
import Icon from '../Icon';

interface MenuItemProps {
  href: string;
  label: string;
  icon: LucidIcon;
}

function MenuItem({ href, label, icon }: MenuItemProps) {
  const pathname = usePathname();
  const [hasNotifications, setHasNotifications] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (label === 'Notificações') {
        try {
          const data = await getAllProfessorNotificationsService();
          const totalNotificacoes = data.reduce((acc, trilha) => acc + trilha.notificacoes.length, 0);
          setHasNotifications(totalNotificacoes > 0);
        } catch (err) {
          console.error('Erro ao buscar notificações:', err);
        }
      }
    };

    fetchNotifications();
  }, [label]);

  // Zera a bolinha quando o usuário está na página de notificações
  useEffect(() => {
    if (label === 'Notificações' && pathname === '/professor/notificacoes') {
      setHasNotifications(false);
    }
  }, [pathname, label]);

  return (
    <Tooltip
      overlay={<span className='font-medium text-white text-sm'>{label}</span>}
      placement='right'
      trigger={['hover']}
    >
      <Link
        data-selected={pathname === href}
        href={href}
        className='w-full flex items-center gap-2 hover:bg-[#20695c] data-[selected=true]:bg-[#20695c44] h-[48px] px-4 duration-300 rounded-md relative'
      >
        <Icon name={icon as LucidIcon} color='#fff' />
        {hasNotifications && (
          <span
            className='absolute top-2 right-2 inline-block w-2 h-2 bg-red-500 rounded-full'
            title="Nova notificação"
          />
        )}
      </Link>
    </Tooltip>
  );
}

export default MenuItem;
