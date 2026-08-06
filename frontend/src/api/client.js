import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const api = axios.create({ baseURL: BASE_URL });

const handleRequest = async (request) => {
  try {
    const response = await request;
    return { data: response.data, error: null };
  } catch (err) {
    return { data: null, error: err.message || 'API request failed' };
  }
};

export const healthCheck = () => handleRequest(api.get('/health'));
export const scrapeLinkedIn = async (query, maxResults = 10) => {
  const token = import.meta.env.VITE_APIFY_TOKEN;
  if (!token) {
    // Fallback to backend simulator if token is not set
    return handleRequest(api.post('/api/linkedin/scrape', { query, max_results: maxResults }));
  }

  try {
    const actorId = 'harvestapi/linkedin-profile-search';
    
    // 1. Start Run
    const startRes = await axios.post(
      `https://api.apify.com/v2/actors/${actorId}/runs?token=${token}`,
      {
        searchQuery: query,
        profileScraperMode: "Full",
        startPage: 1,
        takePages: 1,
        maxItems: maxResults
      }
    );
    
    const runId = startRes.data.data.id;
    const datasetId = startRes.data.data.defaultDatasetId;
    
    // 2. Poll Status (Frontend polling bypasses 100s server timeouts!)
    let status = 'RUNNING';
    while (status !== 'SUCCEEDED' && status !== 'FAILED' && status !== 'ABORTED' && status !== 'TIMED-OUT') {
      await new Promise(r => setTimeout(r, 4000));
      const statusRes = await axios.get(`https://api.apify.com/v2/actor-runs/${runId}?token=${token}`);
      status = statusRes.data.data.status;
    }
    
    if (status !== 'SUCCEEDED') throw new Error(`Apify run failed with status: ${status}`);
    
    // 3. Fetch Dataset
    const datasetRes = await axios.get(`https://api.apify.com/v2/datasets/${datasetId}/items?token=${token}`);
    const items = datasetRes.data;
    
    // 4. Map to Lead format
    const leads = items.map(item => ({
      name: item.fullName || `${item.firstName || ''} ${item.lastName || ''}`.trim() || 'Unknown',
      title: item.headline || item.title || 'Professional',
      company: item.companyName || item.currentCompany || 'Independent',
      source: 'LinkedIn',
      email: item.email || null,
      profile_url: item.linkedinUrl || item.profileUrl || '',
      bio: item.summary || item.about || item.headline || '',
      scraped_at: new Date().toISOString()
    })).slice(0, maxResults);
    
    return { data: leads, error: null };
  } catch (err) {
    console.error("Apify Scrape Error:", err);
    return { data: null, error: err.response?.data?.error?.message || err.message || 'Apify scrape failed' };
  }
};
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
