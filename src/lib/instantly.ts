import { InstantlyResponse } from '../types';

const INSTANTLY_API_URL = 'https://api.instantly.ai/api/v1';

export async function authenticateInstantly(apiKey: string): Promise<boolean> {
  try {
    const response = await fetch(`${INSTANTLY_API_URL}/authenticate?api_key=${apiKey}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Authentication failed');
    }

    const data = await response.json();
    return !!data.workspace_name;
  } catch (error) {
    console.error('Instantly authentication error:', error);
    throw new Error('Failed to authenticate with Instantly. Please check your API key.');
  }
}

export async function fetchResponses(apiKey: string): Promise<InstantlyResponse[]> {
  try {
    // First authenticate
    await authenticateInstantly(apiKey);

    // Then fetch emails using the Unibox endpoint
    const response = await fetch(
      `${INSTANTLY_API_URL}/unibox/emails?api_key=${apiKey}&email_type=received&preview_only=false`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      }
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch responses');
    }
    
    const data = await response.json();
    
    if (!data.data || !Array.isArray(data.data)) {
      return [];
    }
    
    return data.data.map((email: any) => ({
      id: email.id || '',
      subject: email.subject || 'No Subject',
      from: email.from_address_email || '',
      content: email.body?.text || email.content_preview || '',
      campaign_id: email.campaign_id || '',
      timestamp: email.timestamp_created || new Date().toISOString(),
      sentiment: analyzeSentiment(email.body?.text || email.content_preview || '')
    }));
  } catch (error) {
    console.error('Error fetching Instantly responses:', error);
    throw error instanceof Error ? error : new Error('Failed to fetch responses');
  }
}

function analyzeSentiment(text: string): 'positive' | 'neutral' | 'negative' {
  const positiveKeywords = ['interested', 'yes', 'sure', 'great', 'sounds good', 'positive', 'let\'s talk'];
  const negativeKeywords = ['no', 'not interested', 'unsubscribe', 'stop', 'remove'];
  
  const lowerText = text.toLowerCase();
  
  if (positiveKeywords.some(keyword => lowerText.includes(keyword))) {
    return 'positive';
  } else if (negativeKeywords.some(keyword => lowerText.includes(keyword))) {
    return 'negative';
  }
  
  return 'neutral';
}