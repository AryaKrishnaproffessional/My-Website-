/*
 * Every project on the site comes from this list.
 * To add a project, add an entry here; the pages and the timeline update themselves.
 *
 * genre:  "software" (Classical) | "data" (Pop) | "ai" (EDM)
 * status: "done"      public repo
 *         "progress"  public and still being worked on
 *         "private"   private repo: no GitHub link
 *         "empty"     public repo with no commits yet
 * contact: true       private project whose card invites visitors to get in touch to learn more
 * current: true       shown on the Current projects page. Private or empty current
 *                     projects get the "Soon to roll!" stamp.
 * created: "YYYY-MM" (used for ordering and the timeline)
 * ended:   "YYYY-MM" optional; shown on the card as "April 2026 to June 2026"
 */
window.PROJECTS = [
  { title: 'Deep Learning Projects', repo: 'Projects-DeepLearning', genre: 'data', status: 'done', created: '2025-05',
    meta: 'Deep learning', desc: 'Notebooks from learning deep learning.' },
  { title: 'Facial Recognition', repo: 'Facial-Recognition-project', genre: 'data', status: 'done', created: '2025-06',
    meta: 'Computer vision', desc: 'Reads your facial expression live from your webcam.' },
  { title: 'Catheter Placement', repo: 'Catheter-Placement', genre: 'data', status: 'done', created: '2026-01',
    meta: 'Deep learning', desc: 'CNNs that detect catheter placement and abnormalities.' },
  { title: 'Virtual Internships', repo: 'Virtual-Internships-Monash', genre: 'data', status: 'done', created: '2026-01',
    meta: 'Prediction', desc: 'Predicts outcome scores and who gets into the Monash Engineering virtual internship.' },
  { title: 'Rossmann Sales', repo: 'Rossmann-sales', genre: 'data', status: 'done', created: '2026-01',
    meta: 'Forecasting', desc: 'Group project predicting Rossmann sales, with data cleaning and feature engineering.' },
  { title: 'Database Management', repo: 'Database-Management', genre: 'software', status: 'done', created: '2026-01',
    meta: 'Oracle SQL and MongoDB', desc: 'Schemas and queries written to answer university briefs.' },
  { title: 'Ride Booking Simulation', repo: 'Ride-Booking-Simulation-', genre: 'software', status: 'done', created: '2026-01',
    meta: 'Java', desc: 'A system where users book and manage rides.' },
  { title: 'UNO-Inspired Card Game', repo: 'Uno-Inspired-Card-Game-', genre: 'software', status: 'done', created: '2026-01',
    meta: 'Python', desc: 'A card game built on data structures chosen for good time and space complexity.' },
  { title: 'Job Market Analytics', repo: 'Job-Market-Analytics-and-Forecasting-Web-Platform-', genre: 'software', status: 'done', created: '2026-01',
    meta: 'JavaScript, Python and Azure', desc: 'A website showing job-market analytics, with a cloud database and a built-in chatbot.' },
  { title: 'RNA Sequence Project', repo: 'RNA-Sequence-Project', genre: 'data', status: 'done', created: '2026-01',
    meta: 'Kaggle', desc: 'A Kaggle competition entry on RNA sequences.' },
  { title: 'AI Chatbot', repo: 'AI_chatbot-using-cursor-', genre: 'ai', status: 'done', created: '2026-02', ended: '2026-04',
    meta: 'Built with Cursor', desc: 'An AI chatbot built with Cursor.' },
  { title: 'My Website', repo: 'My-Website-', genre: 'software', status: 'done', created: '2026-02',
    meta: 'JavaScript', desc: 'This portfolio. You are looking at it.' },
  { title: 'Trading Betting Bot', repo: 'Tradingbettingbot', genre: 'ai', status: 'done', created: '2026-04', ended: '2026-06',
    meta: 'Bots', desc: 'A bot for trading and betting decisions.' },
  { title: 'Game Theory Bot', repo: 'Game-Theory-Bot', genre: 'data', status: 'done', created: '2026-06',
    meta: 'Game theory', desc: 'Uses game theory to find the best plays in strategy games like poker.' },
  { title: 'MCFS Geofinance', repo: 'MCFS_geofinance_project', genre: 'data', status: 'private', contact: true, created: '2026-07',
    meta: 'Jupyter', desc: 'Geo-finance analysis in Jupyter notebooks.' },
  { title: 'Tuition Project', repo: 'Tuition_project', genre: 'software', status: 'private', created: '2026-11',
    meta: 'Tutoring', desc: 'A tutoring project.' },
  { title: 'NameTheLLM', repo: 'NameTheLLMKaggle', genre: 'ai', status: 'private', current: true, created: '2026-11',
    meta: 'Kaggle and MCP', desc: 'A Kaggle project built with MCP.' },
  { title: 'Local AI Chatbot', repo: 'local-ai-chatbot', genre: 'ai', status: 'private', current: true, created: '2026-11',
    meta: 'Local models and RAG', desc: 'A chatbot that runs AI models locally, with retrieval (RAG), request routing, load balancing and a guard that keeps conversations on topic.' }
];
