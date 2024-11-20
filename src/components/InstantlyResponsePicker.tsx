import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { fetchResponses } from '../lib/instantly';
import { InstantlyResponse } from '../types';
import { format } from 'date-fns';
import { Loader2, ThumbsUp, ThumbsDown, Minus, ChevronRight } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface InstantlyResponsePickerProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onCreateDeal: (deal: any) => void;
}

export default function InstantlyResponsePicker({
  isOpen,
  onClose,
  apiKey,
  onCreateDeal
}: InstantlyResponsePickerProps) {
  const [responses, setResponses] = useState<InstantlyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedResponse, setSelectedResponse] = useState<InstantlyResponse | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadResponses();
    }
  }, [isOpen, apiKey]);

  const loadResponses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchResponses(apiKey);
      setResponses(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch responses');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDeal = (response: InstantlyResponse) => {
    const deal = {
      id: uuidv4(),
      title: `Lead from ${response.subject || 'Campaign ' + response.campaign_id}`,
      company: 'TBD',
      contact: response.from,
      contactEmail: response.from,
      value: 0,
      probability: 20,
      stage: 'lead',
      expectedCloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      customFields: [
        {
          id: uuidv4(),
          label: 'Campaign ID',
          value: response.campaign_id
        },
        {
          id: uuidv4(),
          label: 'Initial Response',
          value: response.content
        }
      ]
    };

    onCreateDeal(deal);
    onClose();
  };

  const getSentimentIcon = (sentiment: InstantlyResponse['sentiment']) => {
    switch (sentiment) {
      case 'positive':
        return <ThumbsUp className="w-4 h-4 text-green-500" />;
      case 'negative':
        return <ThumbsDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-4xl w-full bg-dark-800 rounded-xl shadow-lg">
          <div className="p-6 border-b border-dark-700">
            <Dialog.Title className="text-xl font-semibold text-white">
              Campaign Responses
            </Dialog.Title>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-accent-purple" />
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-400">{error}</p>
                <button
                  onClick={loadResponses}
                  className="mt-4 btn btn-secondary"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {responses.length === 0 ? (
                  <p className="text-center text-gray-400 py-12">
                    No responses found
                  </p>
                ) : (
                  responses.map((response) => (
                    <div
                      key={response.id}
                      className="bg-dark-700 rounded-lg p-4 hover:bg-dark-600 transition-colors cursor-pointer"
                      onClick={() => setSelectedResponse(response)}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            {getSentimentIcon(response.sentiment)}
                            <h3 className="font-medium text-white">
                              {response.subject || 'No Subject'}
                            </h3>
                          </div>
                          <p className="text-sm text-gray-400 mt-1">
                            From: {response.from}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-400">
                            {format(new Date(response.timestamp), 'MMM d, yyyy h:mm a')}
                          </div>
                          <div className="text-sm text-gray-500">
                            Campaign: {response.campaign_id}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </Dialog.Panel>
      </div>

      {/* Response Details Modal */}
      <Dialog
        open={!!selectedResponse}
        onClose={() => setSelectedResponse(null)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-2xl w-full bg-dark-800 rounded-xl shadow-lg">
            {selectedResponse && (
              <>
                <div className="p-6 border-b border-dark-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getSentimentIcon(selectedResponse.sentiment)}
                      <Dialog.Title className="text-xl font-semibold text-white">
                        {selectedResponse.subject || 'No Subject'}
                      </Dialog.Title>
                    </div>
                    <div className="text-sm text-gray-400">
                      {format(new Date(selectedResponse.timestamp), 'MMM d, yyyy h:mm a')}
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-400 mb-2">From</h3>
                    <p className="text-white">{selectedResponse.from}</p>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Response</h3>
                    <div className="bg-dark-700 rounded-lg p-4">
                      <p className="text-white whitespace-pre-wrap">{selectedResponse.content}</p>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setSelectedResponse(null)}
                      className="btn btn-secondary"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleCreateDeal(selectedResponse)}
                      className="btn btn-primary"
                    >
                      Create Deal
                    </button>
                  </div>
                </div>
              </>
            )}
          </Dialog.Panel>
        </div>
      </Dialog>
    </Dialog>
  );
}