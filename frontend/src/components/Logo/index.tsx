import Icon from '../Icon';

function Logo({ fontSizeClass = 'text-3xl', logoSize = 40 }) {
  return (
    <div className='flex items-center p-2 gap-2'>
      <Icon name='Code2' size={logoSize} />
      <span className={`${fontSizeClass} font-bold`}>Trajeto Algoritmos</span>
    </div>
  );
}

export default Logo;
