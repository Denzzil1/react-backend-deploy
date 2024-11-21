app.get("/api/search", async (req, res) => {
    const { keyword } = req.query;
  
    if (!keyword) {
      return res.status(400).json({ error: "Keyword parameter is required." });
    }
  
    try {
      const response = await fetch(
        `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${keyword}&api-key=${apiKey}`
      );
      const data = await response.json();
  
      if (!data.response || !data.response.docs || data.response.docs.length === 0) {
        return res.status(404).json({ error: "No articles found." });
      }
  
      const articles = data.response.docs.map((doc) => ({
        headline: doc.headline.main,
        abstract: doc.abstract,
        lead_paragraph: doc.lead_paragraph,
        web_url: doc.web_url,
        pub_date: doc.pub_date,
        multimedia: doc.multimedia,
      }));
  
      res.json({ articles });
    } catch (error) {
      console.error("Error fetching data from NY Times API:", error);
      res.status(500).json({ error: "Error fetching data from NY Times API." });
    }
  });
  