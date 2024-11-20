import { FirefliesTranscript } from '../types';

const FIREFLIES_API_URL = 'https://api.fireflies.ai/graphql';

export async function fetchTranscripts(apiKey: string): Promise<FirefliesTranscript[]> {
  const query = `
    query {
      transcripts {
        id
        title
        organizer_email
        transcript_url
        participants
        duration
        date
        meeting_attendees {
          displayName
          email
          name
        }
        summary {
          topics_discussed
          action_items
          overview
        }
      }
    }
  `;

  try {
    const response = await fetch(FIREFLIES_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({ query })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.errors) {
      throw new Error(data.errors[0]?.message || 'GraphQL Error');
    }

    return data.data?.transcripts || [];
  } catch (error) {
    console.error('Fireflies API Error:', error);
    throw new Error('Failed to connect to Fireflies. Please check your API key and try again.');
  }
}