import { useTracks } from '@/hooks/useTracks';
import Tooltip from 'rc-tooltip';

function StudentsTable() {
  const { currentTrack } = useTracks();

  const abbreviate = (text: string) => {
    if (text.length > 15) {
      return text.slice(0, 15) + '...';
    }
    return text;
  };

  return (
    <div className='w-full mt-4 overflow-auto'>
      <table className='w-full'>
        <thead>
          <tr>
            <th className='border-b font-medium p-4 pl-8 pt-0 pb-3 text-left'>
              ID
            </th>
            <th className='border-b font-medium p-4 pl-8 pt-0 pb-3 text-left'>
              Name
            </th>
            <th className='border-b font-medium p-4 pl-8 pt-0 pb-3 text-left'>
              Email
            </th>
          </tr>
        </thead>
        <tbody>
          {currentTrack?.students?.map((student) => (
            <tr
              key={student.id}
              className='duration-300 hover:bg-[#1ba48b1c] cursor-pointer'
            >
              <td className='border-b border-slate-100 p-4 pl-8'>
                {student.id}
              </td>
              <td className='border-b border-slate-100 p-4 pl-8'>
                <Tooltip
                  overlay={
                    <span className='font-medium text-white text-sm'>
                      {student.name}
                    </span>
                  }
                  placement='top'
                  trigger={['hover']}
                  showArrow={false}
                >
                  <span>{abbreviate(student.name)}</span>
                </Tooltip>
              </td>
              <td className='border-b border-slate-100 p-4 pl-8'>
                <Tooltip
                  overlay={
                    <span className='font-medium text-white text-sm'>
                      {student.email}
                    </span>
                  }
                  placement='top'
                  trigger={['hover']}
                  showArrow={false}
                >
                  <a href={`mailto:${student.email}`}>
                    {abbreviate(student.email)}
                  </a>
                </Tooltip>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StudentsTable;
