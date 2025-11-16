import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext.jsx';

const NotAuthenticated = () => {
  const { translate } = useLanguage();

  return (
    <div style={{ 
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '50px 20px',
      textAlign: 'center',
      minHeight: '60vh',
      marginTop: '40px'
    }}>
      <div style={{
        background: '#f8f9fa',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        maxWidth: '600px',
        width: '100%'
      }}>
        <h2 style={{ color: '#dc3545', marginBottom: '20px' }}>{translate("Authentication Required")}</h2>
        
        <div style={{ marginBottom: '30px' }}>
          <p style={{ fontSize: '18px', marginBottom: '15px' }}>
            {translate("You need to be signed in to access this page.")}
          </p>
          <p style={{ fontSize: '16px', color: '#6c757d' }}>
            {translate("Please log in to your account to view your appointments, book new appointments, or access other patient features.")}
          </p>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' }}>
          <Link to="/login" style={{
            padding: '10px 20px',
            background: '#3939d9f2',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '5px',
            fontWeight: 'bold',
            border: 'none',
            cursor: 'pointer'
          }}>
            {translate("Log In")}
          </Link>
          
          <Link to="/register" style={{
            padding: '10px 20px',
            background: '#28a745',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '5px',
            fontWeight: 'bold',
            border: 'none',
            cursor: 'pointer'
          }}>
            {translate("Register")}
          </Link>
          
          <Link to="/" style={{
            padding: '10px 20px',
            background: '#6c757d',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '5px',
            fontWeight: 'bold',
            border: 'none',
            cursor: 'pointer'
          }}>
            {translate("Back to Home")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotAuthenticated;
