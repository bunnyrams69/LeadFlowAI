import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000'
});

const handleRequest = async (request) => {
  try {
    const response = await request;
    return { data: response.data, error: null };
  } catch (err) {
    return { data: null, error: err.message || 'API request failed' };
  }
};

export const healthCheck = () => handleRequest(api.get('/health'));
export const scrapeLinkedIn = (query, maxResults = 10) => handleRequest(api.post('/api/linkedin/scrape', { query, max_results: maxResults }));
export const getLinkedInLeads = () => handleRequest(api.get('/api/linkedin/leads'));
export const scrapeInstagram = (query, maxPosts = 10) => handleRequest(api.post('/api/instagram/scrape', { query, max_posts: maxPosts }));
export const getInstagramLeads = () => handleRequest(api.get('/api/instagram/leads'));
export const writeEmail = (lead, productDesc, senderName) => handleRequest(api.post('/api/email/write', { lead, product_description: productDesc, sender_name: senderName }));
export const writeBulkEmails = (leads, productDesc, senderName) => handleRequest(api.post('/api/email/write-bulk', leads.map(l => ({ lead: l, product_description: productDesc, sender_name: senderName }))));
export const publishPost = (content, scheduleTime = null) => handleRequest(api.post('/api/post/publish', { content, schedule_time: scheduleTime }));
export const getPostHistory = () => handleRequest(api.get('/api/post/history'));
export const sendChatMessage = (message, history = []) => handleRequest(api.post('/api/chat', { message, conversation_history: history }));
export const uploadChatDocument = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return handleRequest(api.post('/api/chat/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } }));
};
export const runPipeline = (query, source, productDesc, senderName, autoPost = false) => 
  handleRequest(api.post('/api/pipeline/run', { query, source, product_description: productDesc, sender_name: senderName, auto_post: autoPost }));
