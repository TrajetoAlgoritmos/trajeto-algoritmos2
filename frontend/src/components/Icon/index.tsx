import * as icons from 'lucide-react';

interface IconProps extends icons.LucideProps {
  name: LucidIcon;
  color?: string;
  size?: number;
}

function Icon({ name, color = '#1b2b34', size = 18, ...rest }: IconProps) {
  const LucideIcon = icons[name];
  return <LucideIcon color={color} size={size} {...rest} />;
}

export default Icon;
