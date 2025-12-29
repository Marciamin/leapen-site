export default {
  async fetch(request, env) {
    // CORS 헤더
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // OPTIONS 요청 처리 (CORS preflight)
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // ⚠️ 여기에 Notion API Key를 입력하세요
    const NOTION_API_KEY = 'YOUR_NOTION_API_KEY_HERE';
    
    // ⚠️ 여기에 Notion Database ID를 입력하세요 (32자리)
    const DATABASE_ID = 'YOUR_DATABASE_ID_HERE';

    try {
      // Notion API 호출
      const response = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${NOTION_API_KEY}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
      });

      if (!response.ok) {
        const errorData = await response.json();
        return new Response(
          JSON.stringify({ 
            error: 'Failed to fetch from Notion', 
            details: errorData 
          }),
          { 
            status: response.status,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      const data = await response.json();
      
      // 데이터 파싱 및 변환
      const parsedData = data.results.map(page => {
        const properties = page.properties;
        
        // Date 필드 파싱 (Date 타입)
        let date = '';
        if (properties.Date && properties.Date.date) {
          date = properties.Date.date.start || '';
        }
        
        // 링크 필드 파싱 (URL 타입)
        let link = '';
        if (properties['링크'] && properties['링크'].url) {
          link = properties['링크'].url || '';
        }
        
        // Summary 필드 파싱 (Rich Text 타입)
        let summary = '';
        if (properties.Summary && properties.Summary.rich_text) {
          summary = properties.Summary.rich_text.map(rt => rt.plain_text).join('');
        }
        
        // summary audio 필드 파싱 (Rich Text 타입, 소문자!)
        let summaryAudio = '';
        if (properties['summary audio'] && properties['summary audio'].rich_text) {
          summaryAudio = properties['summary audio'].rich_text.map(rt => rt.plain_text).join('');
        }
        
        // Discussion Questions 필드 파싱 (Rich Text 타입)
        let discussionQuestions = '';
        if (properties['Discussion Questions'] && properties['Discussion Questions'].rich_text) {
          discussionQuestions = properties['Discussion Questions'].rich_text.map(rt => rt.plain_text).join('');
        }
        
        return {
          id: page.id,
          date: date,
          link: link,
          summary: summary,
          summaryAudio: summaryAudio,
          discussionQuestion: discussionQuestions
        };
      });

      return new Response(
        JSON.stringify(parsedData),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({ 
          error: 'Internal server error', 
          details: error.message 
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
  }
};

