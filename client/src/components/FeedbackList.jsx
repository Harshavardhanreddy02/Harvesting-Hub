import  { useEffect, useState } from 'react';
import FeedbackCard from './FeedbackCard';
import './FeedbackList.css';
import Sidebar from '../components/Sidebar.jsx';

function FeedbackList() {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/feedback/get`);
        const data = await response.json();
        setFeedbacks(data.reverse());
      } catch (error) {
        console.error('Error fetching feedbacks:', error);
      }
    };

    fetchFeedbacks();
  }, []);

  return (
    <div>
      <Sidebar/>
      <div className="feedback-list-container">
      <h2 className="feedback-list-title">Customer Feedback</h2>
      <div className="feedback-cards ml-52">
        {feedbacks.map((feedback) => (
          <FeedbackCard key={feedback._id} feedback={feedback} />
        ))}
      </div>
    </div>
    </div>
  );
}

export default FeedbackList;
