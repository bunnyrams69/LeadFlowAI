import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [allLeads, setAllLeads] = useState([]);
  const [emailsSent, setEmailsSent] = useState(0);
  const [postsPublished, setPostsPublished] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setEmailsSent(parseInt(localStorage.getItem('emails_sent_count') || '0'));
    setPostsPublished(parseInt(localStorage.getItem('posts_published_count') || '0'));
    
    const li = JSON.parse(localStorage.getItem('linkedin_leads') || '[]');
    const ig = JSON.parse(localStorage.getItem('insta_leads') || '[]');
    setAllLeads([...li, ...ig]);
  }, []);

  const incrementEmailsSent = () => {
    const newCount = emailsSent + 1;
    setEmailsSent(newCount);
    localStorage.setItem('emails_sent_count', newCount);
  };

  const incrementPostsPublished = () => {
    const newCount = postsPublished + 1;
    setPostsPublished(newCount);
    localStorage.setItem('posts_published_count', newCount);
  };

  return (
    <AppContext.Provider value={{
      allLeads, setAllLeads,
      emailsSent, incrementEmailsSent,
      postsPublished, incrementPostsPublished,
      isLoading, setIsLoading
    }}>
      {children}
    </AppContext.Provider>
  );
};
