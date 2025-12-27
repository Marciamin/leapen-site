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
        
        // DATE 필드 파싱 (Date 타입) - 다양한 속성명 시도
        let date = '';
        const dateProps = ['DATE', 'Date', 'date', '날짜'];
        for (const propName of dateProps) {
          if (properties[propName] && properties[propName].date) {
            date = properties[propName].date.start || '';
            break;
          }
        }
        
        // TODAY'S QUESTION 필드 파싱 (Rich Text 또는 Title) - 다양한 속성명 시도
        let question = '';
        const questionProps = ['TODAY\'S QUESTION', 'TODAY\'S QUESTION', 'Today\'s Question', 'Question', 'QUESTION', 'question'];
        for (const propName of questionProps) {
          const questionProp = properties[propName];
          if (questionProp) {
            if (questionProp.rich_text && questionProp.rich_text.length > 0) {
              question = questionProp.rich_text.map(rt => rt.plain_text).join('');
              break;
            } else if (questionProp.title && questionProp.title.length > 0) {
              question = questionProp.title.map(t => t.plain_text).join('');
              break;
            }
          }
        }
        
        return {
          id: page.id,
          date: date,
          question: question
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

