import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [];
  const maxVisible = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let endPage = Math.min(totalPages, startPage + maxVisible - 1);

  if (endPage - startPage + 1 < maxVisible) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <nav className="pagination">
      <ul>
        <li className={currentPage === 1 ? 'disabled' : ''}>
          <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
            <span className="fas fa-chevron-left"></span>
          </button>
        </li>

        {startPage > 1 && (
          <>
            <li>
              <button onClick={() => onPageChange(1)}>1</button>
            </li>
            {startPage > 2 && <li className="disabled"><span>...</span></li>}
          </>
        )}

        {pages.map((page) => (
          <li key={page} className={page === currentPage ? 'active' : ''}>
            <button onClick={() => onPageChange(page)}>
              {page}
            </button>
          </li>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <li className="disabled"><span>...</span></li>}
            <li>
              <button onClick={() => onPageChange(totalPages)}>{totalPages}</button>
            </li>
          </>
        )}

        <li className={currentPage === totalPages ? 'disabled' : ''}>
          <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
            <span className="fas fa-chevron-right"></span>
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
