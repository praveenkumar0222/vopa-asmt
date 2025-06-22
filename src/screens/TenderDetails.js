import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/tenderDetails.css';

import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const TenderDetails = () => {
  const { id } = useParams();
  const [tender, setTender] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const retrieveTenderData = async () => {
      setLoading(true);
      setFetchError(null);
      try {
        const response = await axios.get(`/api/es/tenders/${id}`);
        setTender(response.data);
      } catch (error) {
        console.error('Tender fetch failed:', error);
        setFetchError('Failed to load tender details. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    retrieveTenderData();
  }, [id]);

  const LoadingIndicator = () => (
    <div className="loader-container">
      <div className="loader"></div>
      <p className="loading-text">Loading tender details...</p>
    </div>
  );

  if (loading) {
    return <LoadingIndicator />;
  }

  if (fetchError) {
    return <div className="error-message">{fetchError}</div>;
  }

  if (!tender) {
    return <div className="no-data-message">Tender details not found.</div>;
  }

  const awardedDetails = tender.awarded?.[0] || {};

  const currentMoment = new Date();
  const deadlineDate = new Date(tender.deadline_date);
  const publishDate = new Date(tender.date);

  const totalDuration = !isNaN(deadlineDate.getTime()) && !isNaN(publishDate.getTime())
    ? deadlineDate.getTime() - publishDate.getTime()
    : 0;

  const remainingTime = !isNaN(deadlineDate.getTime())
    ? deadlineDate.getTime() - currentMoment.getTime()
    : 0;

  const completionPercentage = totalDuration > 0
    ? (remainingTime / totalDuration) * 100
    : (remainingTime <= 0 ? 0 : 100);

  const progressBarDisplayWidth = Math.max(0, 100 - completionPercentage);

  const progressBarColor = completionPercentage > 0
    ? (completionPercentage > 25 ? '#28a745' : '#ffc107')
    : '#dc3545';

  const chartInfo = {
    labels: ['Value One', 'Value Two', 'Value Three'],
    datasets: [
      {
        label: 'Tender Values',
        data: [
          parseFloat(awardedDetails.value_for_one || 0),
          parseFloat(awardedDetails.value_for_two || 0),
          parseFloat(awardedDetails.value_for_three || 0),
        ],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Awarded Value Breakdown',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
            display: true,
            text: 'Value (€)'
        }
      },
      x: {
        title: {
            display: true,
            text: 'Value Type'
        }
      }
    },
  };

  return (
    <div className="tender-details-container">
      <div className="tender-card">
        <h2 className="tender-title">Tender Details - ID: {tender.id}</h2>

        <div className="tender-section chart-section">
          <h3>Value Distribution</h3>
          <div style={{ height: '300px', width: '100%' }}>
            <Bar data={chartInfo} options={chartOptions} />
          </div>
        </div>

        <div className="tender-section progress-section">
          <h3>Deadline Progress</h3>
          <div className="progress-bar-container">
            <div
              className="progress-bar"
              style={{ width: `${progressBarDisplayWidth}%`, backgroundColor: progressBarColor }}
            />
            <p className="deadline-text">
              {completionPercentage > 0
                ? `Time Left: ${Math.ceil(remainingTime / (1000 * 60 * 60 * 24))} days`
                : 'Deadline Passed'}
            </p>
          </div>
        </div>

        <div className="tender-section">
          <h3>General Information</h3>
          <p><strong>Published:</strong> {tender.date || 'N/A'}</p>
          <p><strong>Deadline:</strong> {tender.deadline_date || 'N/A'}</p>
          <p><strong>Duration:</strong> {tender.deadline_length_days} days</p>
          <p><strong>Title:</strong> {tender.title || 'N/A'}</p>
          <p><strong>Category:</strong> {tender.category || 'N/A'}</p>
          <p><strong>SID:</strong> {tender.sid || 'N/A'}</p>
        </div>

        <div className="tender-section">
          <h3>Purchaser Details</h3>
          <p><strong>ID:</strong> {tender.purchaser?.id || 'N/A'}</p>
          <p><strong>Name:</strong> {tender.purchaser?.name || 'N/A'}</p>
        </div>

        <div className="tender-section">
          <h3>Tender Type</h3>
          <p><strong>Name:</strong> {tender.type?.name || 'N/A'}</p>
          <p><strong>Slug:</strong> {tender.type?.slug || 'N/A'}</p>
        </div>

        <div className="tender-section">
          <h3>Award Details</h3>
          <p><strong>Award Date:</strong> {awardedDetails.date || 'N/A'}</p>
          <p><strong>Supplier:</strong> {awardedDetails.suppliers_name || awardedDetails.suppliers?.[0]?.name || 'N/A'}</p>
          <p><strong>Supplier ID:</strong> {awardedDetails.suppliers_id || 'N/A'}</p>
          <p><strong>Offer Count:</strong> {awardedDetails.offers_count || 'N/A'}</p>
          <p><strong>Value One:</strong> € {parseFloat(awardedDetails.value_for_one || 0).toLocaleString()}</p>
          <p><strong>Value Two:</strong> € {parseFloat(awardedDetails.value_for_two || 0).toLocaleString()}</p>
          <p><strong>Value Three:</strong> € {parseFloat(awardedDetails.value_for_three || 0).toLocaleString()}</p>
          <p><strong>Total Award Value:</strong> € {parseFloat(awardedDetails.value || 0).toLocaleString()}</p>
        </div>

        <div className="tender-section">
          <a
            className="source-link"
            href={tender.src_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            View Official Website
          </a>
        </div>
      </div>
    </div>
  );
};

export default TenderDetails;
