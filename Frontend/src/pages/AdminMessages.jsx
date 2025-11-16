import React, { useContext, useEffect, useState } from 'react';
import { Context } from "../main";
import axios from "axios";
import { Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import AdminSidebar from '../components/AdminSidebar';
import './AdminMessages.css';

// Icons
import { 
  FaEnvelope, FaSearch, FaFilter, FaReply, 
  FaCheckCircle, FaTrashAlt, FaRegClock, 
  FaPhone, FaEnvelopeOpen, FaInbox, FaDownload,
  FaPrint, FaExclamationCircle
} from 'react-icons/fa';

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const messagesPerPage = 6;
  const { isAuthenticated, user } = useContext(Context);

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get("http://localhost:4000/api/v1/message/getall", 
          { withCredentials: true }
        );
        
        // Add a read status and formatted date to each message
        const enhancedMessages = data.messages.map(message => ({
          ...message,
          isRead: Math.random() > 0.5, // Randomly set read status for demo
          formattedDate: formatDate(message.createdAt || new Date())
        }));
        
        setMessages(enhancedMessages);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching messages:", error);
        toast.error(error.response?.data?.message || "Failed to fetch messages");
        setLoading(false);
      }
    };
    
    if (isAuthenticated && user?.role === "Admin") {
      fetchMessages();
    }
  }, [isAuthenticated, user]);

  // Format date helper
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get initials for avatar
  const getInitials = (firstName, lastName) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Filter and search messages
  const filteredMessages = messages.filter(message => {
    const matchesSearch = searchTerm === '' || 
      `${message.firstName} ${message.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || 
      (filterStatus === 'read' && message.isRead) || 
      (filterStatus === 'unread' && !message.isRead);
    
    return matchesSearch && matchesFilter;
  });

  // Pagination
  const indexOfLastMessage = currentPage * messagesPerPage;
  const indexOfFirstMessage = indexOfLastMessage - messagesPerPage;
  const currentMessages = filteredMessages.slice(indexOfFirstMessage, indexOfLastMessage);
  const totalPages = Math.ceil(filteredMessages.length / messagesPerPage);

  // Handle marking message as read
  const handleMarkAsRead = (messageId) => {
    // In a real app, you would make an API call to update the message status
    setMessages(messages.map(message => 
      message._id === messageId ? { ...message, isRead: true } : message
    ));
    toast.success("Message marked as read");
  };

  // Handle message reply
  const handleReply = (email) => {
    // In a real app, you might open a compose modal or navigate to a reply page
    toast.info(`Reply functionality would open for ${email}`);
  };

  // Handle message deletion
  const handleDelete = (messageId) => {
    // In a real app, you would make an API call to delete the message
    setMessages(messages.filter(message => message._id !== messageId));
    toast.success("Message deleted successfully");
  };

  // Pagination controls
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (user && user.role !== "Admin") {
    return <Navigate to="/patient/dashboard" />;
  }

  return (
    <>
      <Helmet>
        <title>Patient Messages | Satya Hospital Admin</title>
        <meta name="description" content="View and manage messages from patients at Satya Hospital." />
      </Helmet>

      <div className="admin-messages-container">
        <AdminSidebar />
        
        <motion.div 
          className="messages-header"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5 }}
        >
          <h1 className="messages-title">Patient Messages</h1>
          <div className="messages-actions">
            <button className="message-action-btn message-action-secondary">
              <FaPrint />
              Print
            </button>
            <button className="message-action-btn message-action-primary">
              <FaDownload />
              Export
            </button>
          </div>
        </motion.div>

        <motion.div 
          className="messages-filters"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="messages-search">
            <FaSearch className="search-icon" />
            <input 
              type="text" 
              className="search-input" 
              placeholder="Search messages..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="messages-filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Messages</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
          </select>
        </motion.div>

        {loading ? (
          // Loading skeletons
        <div className="messages-grid">
            {[...Array(6)].map((_, index) => (
              <motion.div 
                key={index}
                className="message-skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <div className="message-skeleton-header">
                  <div className="skeleton-avatar"></div>
                  <div className="skeleton-info">
                    <div className="skeleton-name"></div>
                    <div className="skeleton-date"></div>
                  </div>
                </div>
                <div className="message-skeleton-body">
                  <div className="skeleton-line" style={{ width: '100%' }}></div>
                  <div className="skeleton-line" style={{ width: '100%' }}></div>
                  <div className="skeleton-line" style={{ width: '100%' }}></div>
                  <div className="skeleton-line" style={{ width: '70%' }}></div>
                </div>
                <div className="message-skeleton-footer">
                  <div className="skeleton-button"></div>
                  <div className="skeleton-button"></div>
                  <div className="skeleton-button"></div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : currentMessages.length === 0 ? (
          // Empty state
          <motion.div 
            className="empty-messages"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.5 }}
          >
            <FaEnvelopeOpen className="empty-messages-icon" />
            <h3 className="empty-messages-title">No Messages Found</h3>
            <p className="empty-messages-message">
              {searchTerm || filterStatus !== 'all' 
                ? "There are no messages matching your search criteria. Try adjusting your filters."
                : "There are no messages in the system yet. When patients send messages, they will appear here."
              }
            </p>
          </motion.div>
        ) : (
          // Messages grid
          <>
            <div className="messages-grid">
              {currentMessages.map((message, index) => (
                <motion.div 
                  className="message-card" 
                  key={message._id || index}
                  initial="hidden"
                  animate="visible"
                  variants={fadeIn}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <div className={`message-status ${message.isRead ? 'status-read' : 'status-new'}`}></div>
                  <div className="message-card-header">
                    <div className="message-avatar">
                      {getInitials(message.firstName, message.lastName)}
                    </div>
                    <div className="message-sender-info">
                      <h3 className="message-sender-name">{`${message.firstName} ${message.lastName}`}</h3>
                      <div className="message-date">
                        <FaRegClock /> {message.formattedDate}
                      </div>
                    </div>
                  </div>
                  <div className="message-card-body">
                    <ul className="message-info-list">
                      <li className="message-info-item">
                        <span className="message-info-label">Email:</span>
                        <span className="message-info-value">{message.email}</span>
                      </li>
                      <li className="message-info-item">
                        <span className="message-info-label">Phone:</span>
                        <span className="message-info-value">{message.phone}</span>
                      </li>
                    </ul>
                    <p className="message-content">{message.message}</p>
                  </div>
                  <div className="message-card-footer">
                    <button 
                      className="message-action message-reply"
                      onClick={() => handleReply(message.email)}
                    >
                      <FaReply /> Reply
                    </button>
                    {!message.isRead && (
                      <button 
                        className="message-action message-mark"
                        onClick={() => handleMarkAsRead(message._id)}
                      >
                        <FaCheckCircle /> Mark Read
                      </button>
                    )}
                    <button 
                      className="message-action message-delete"
                      onClick={() => handleDelete(message._id)}
                    >
                      <FaTrashAlt /> Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="messages-pagination">
                <button 
                  className={`pagination-btn ${currentPage === 1 ? 'disabled' : ''}`}
                  onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  &lt;
                </button>
                
                {[...Array(totalPages)].map((_, index) => (
                  <button 
                    key={index}
                    className={`pagination-btn ${currentPage === index + 1 ? 'active' : ''}`}
                    onClick={() => paginate(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}
                
                <button 
                  className={`pagination-btn ${currentPage === totalPages ? 'disabled' : ''}`}
                  onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  &gt;
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default AdminMessages;