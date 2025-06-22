import React, {useState, useEffect} from 'react';
import axios from 'axios';
import '../styles/tableData.css';
import {useNavigate} from 'react-router-dom';

const TableData = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const maxPageNumbersToShow = 10; // New constant for the maximum number of page buttons to display

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/es/tenders');
        setUserData(response.data.data);
      } catch (error) {
        console.error('Data fetching error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const Loader = () => (
    <div className="loader-container">
      <div className="loader"></div>
      <p className="loading-text">Loading tenders...</p>
    </div>
  );

  const filteredData = userData.filter(
    row =>
      row.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.awarded?.[0]?.suppliers_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const currentTableData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const goToPage = pageNumber => {
    setCurrentPage(pageNumber);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    let startPage = Math.max(1, currentPage - Math.floor(maxPageNumbersToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPageNumbersToShow - 1);

    // Adjust startPage if we're at the end to ensure maxPageNumbersToShow are always visible
    if (endPage - startPage + 1 < maxPageNumbersToShow) {
      startPage = Math.max(1, endPage - maxPageNumbersToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => goToPage(i)}
          className={`pagination-button ${currentPage === i ? 'active' : ''}`}
          onMouseOver={e => {
            if (currentPage !== i) e.currentTarget.classList.add('hover');
          }}
          onMouseOut={e => {
            if (currentPage !== i) e.currentTarget.classList.remove('hover');
          }}>
          {i}
        </button>,
      );
    }

    // Add ellipsis for pages at the beginning if not showing from page 1
    if (startPage > 1) {
      pageNumbers.unshift(
        <span key="ellipsis-start" className="pagination-ellipsis">
          ...
        </span>,
        <button
          key={1}
          onClick={() => goToPage(1)}
          className={`pagination-button ${currentPage === 1 ? 'active' : ''}`}
          onMouseOver={e => {
            if (currentPage !== 1) e.currentTarget.classList.add('hover');
          }}
          onMouseOut={e => {
            if (currentPage !== 1) e.currentTarget.classList.remove('hover');
          }}>
          1
        </button>
      );
    }

    // Add ellipsis for pages at the end if not showing till the last page
    if (endPage < totalPages) {
      pageNumbers.push(
        <span key="ellipsis-end" className="pagination-ellipsis">
          ...
        </span>,
        <button
          key={totalPages}
          onClick={() => goToPage(totalPages)}
          className={`pagination-button ${currentPage === totalPages ? 'active' : ''}`}
          onMouseOver={e => {
            if (currentPage !== totalPages) e.currentTarget.classList.add('hover');
          }}
          onMouseOut={e => {
            if (currentPage !== totalPages) e.currentTarget.classList.remove('hover');
          }}>
          {totalPages}
        </button>
      );
    }


    return pageNumbers;
  };

  if (loading) return <Loader />;

  return (
    <div className="app-container">
      <div className="table-wrapper">
        <div className="search-bar-container">
          <input
            type="text"
            placeholder="Search by title or supplier name..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <h2 className="table-title">Tender Data Table</h2>

        <div className="table-content">
          <div className="table-scroll">
            <table className="data-table">
              <thead className="table-head">
                <tr>
                  <th className="header-cell">ID</th>
                  <th className="header-cell">Title</th>
                  <th className="header-cell">Supplier Name</th>
                  <th className="header-cell">Deadline</th>
                  <th className="header-cell">Value</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {currentTableData.map((row, index) => (
                  <tr
                    key={row.id}
                    className={`table-row ${
                      index % 2 === 0 ? 'even-row' : 'odd-row'
                    }`}
                    onClick={() => navigate(`/tender/${row.id}`)}
                    style={{cursor: 'pointer'}}
                    onMouseOver={e =>
                      e.currentTarget.classList.add('hover-row')
                    }
                    onMouseOut={e =>
                      e.currentTarget.classList.remove('hover-row')
                    }>
                    <td className="cell">{row.id || 'N/A'}</td>
                    <td className="cell title" title={row.title}>
                      {row.title || 'N/A'}
                    </td>
                    <td
                      className="cell supplier"
                      title={row.awarded?.[0]?.suppliers_name}>
                      {row.awarded?.[0]?.suppliers_name || 'N/A'}
                    </td>
                    <td className="cell">{row.deadline_date || 'N/A'}</td>
                    <td className="cell">
                      {parseFloat(
                        row.awarded?.[0]?.value || 0,
                      ).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {totalPages > 1 && ( // Only show pagination if there's more than one page
          <div className="pagination-controls">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`pagination-button prev-button ${
                currentPage === 1 ? 'disabled' : ''
              }`}
              onMouseOver={e => {
                if (currentPage !== 1) e.currentTarget.classList.add('hover');
              }}
              onMouseOut={e => {
                if (currentPage !== 1)
                  e.currentTarget.classList.remove('hover');
              }}>
              Previous
            </button>
            {renderPageNumbers()}
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`pagination-button next-button ${
                currentPage === totalPages ? 'disabled' : ''
              }`}
              onMouseOver={e => {
                if (currentPage !== totalPages)
                  e.currentTarget.classList.add('hover');
              }}
              onMouseOut={e => {
                if (currentPage !== totalPages)
                  e.currentTarget.classList.remove('hover');
              }}>
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TableData;