import Icon from '../Icon';

interface PaginationProps {
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  total: number;
}

function Pagination({
  currentPage,
  onPageChange,
  total,
  itemsPerPage,
}: PaginationProps) {
  const totalPages = Math.ceil(total / itemsPerPage);
  const maxPagesToShow = 5;

  const handlePageChange = (page: number) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const renderPaginationLinks = () => {
    const paginationLinks: JSX.Element[] = [];

    paginationLinks.push(
      <li
        key={1}
        className={`flex items-center justify-center w-6 h-6 ${currentPage === 1 ? 'bg-[#1ba48a] text-white' : 'bg-gray-200 text-gray-700'} rounded-md`}
      >
        <button
          onClick={() => handlePageChange(1)}
          className='w-full h-full flex items-center justify-center text-sm font-semibold'
          aria-label={`Page 1`}
        >
          1
        </button>
      </li>
    );

    if (totalPages > maxPagesToShow && currentPage > maxPagesToShow) {
      paginationLinks.push(
        <li
          key={'leftEllipsis'}
          className='flex items-center justify-center w-6 h-6 text-gray-700'
        >
          ...
        </li>
      );
    }

    let startPage = Math.max(2, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 3);

    if (endPage - startPage + 1 < maxPagesToShow - 2) {
      startPage = Math.max(2, endPage - maxPagesToShow + 3);
    }

    for (let page = startPage; page <= endPage; page++) {
      paginationLinks.push(
        <li
          key={page}
          className={`flex items-center justify-center w-6 h-6 ${currentPage === page ? 'bg-[#1ba48a] text-white' : 'bg-gray-200 text-gray-700'} rounded-md`}
        >
          <button
            onClick={() => handlePageChange(page)}
            className='w-full h-full flex items-center justify-center text-sm font-semibold'
            aria-label={`Page ${page}`}
          >
            {page}
          </button>
        </li>
      );
    }

    if (
      totalPages > maxPagesToShow &&
      currentPage <= totalPages - maxPagesToShow
    ) {
      paginationLinks.push(
        <li
          key={'rightEllipsis'}
          className='flex items-center justify-center w-6 h-6 text-gray-700'
        >
          ...
        </li>
      );
    }

    if (totalPages > 1) {
      paginationLinks.push(
        <li
          key={totalPages}
          className={`flex items-center justify-center w-6 h-6 px-[2px] ${currentPage === totalPages ? 'bg-[#1ba48a] text-white' : 'bg-gray-200 text-gray-700'} rounded-md`}
        >
          <button
            onClick={() => handlePageChange(totalPages)}
            className='w-full h-full flex items-center justify-center text-sm font-semibold'
            aria-label={`Page ${totalPages}`}
          >
            {totalPages}
          </button>
        </li>
      );
    }

    return paginationLinks;
  };

  return (
    <div className='flex justify-center mt-8'>
      <nav aria-label='Pagination'>
        <ul className='flex space-x-2'>
          <li
            className={`flex items-center ${currentPage === 1 ? 'opacity-50 pointer-events-none' : ''}`}
          >
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className='w-full h-full flex items-center justify-center'
              aria-label='Previous'
            >
              <Icon name='ChevronLeft' />
            </button>
          </li>
          {renderPaginationLinks()}
          <li
            className={`flex items-center ${currentPage === totalPages ? 'opacity-50 pointer-events-none' : ''}`}
          >
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className='w-full h-full flex items-center justify-center'
              aria-label='Next'
            >
              <Icon name='ChevronRight' />
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Pagination;
