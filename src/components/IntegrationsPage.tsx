import React from 'react';
import { Headphones, MessageSquare, Database, AlertCircle } from 'lucide-react';

export default function IntegrationsPage() {
  return (
    <div className="p-6 bg-dark-900 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Integrations</h1>
          <p className="text-gray-400">Connect your CRM with other tools</p>
        </div>

        <div className="mb-6 bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 flex items-center gap-3 text-blue-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>Integrations are coming soon! We're working hard to bring these powerful connections to your CRM.</p>
        </div>

        <div className="space-y-6">
          {/* Fireflies Integration */}
          <div className="card p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-500/10 rounded-lg">
                  <Headphones className="w-6 h-6 text-purple-500" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-white">Fireflies.ai</h3>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-accent-purple/10 text-accent-purple">
                      Coming Soon
                    </span>
                  </div>
                  <p className="text-gray-400">Connect meeting transcripts to your deals</p>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                  <p className="text-gray-300">Automatically link meeting transcripts to deals</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                  <p className="text-gray-300">Extract action items and key insights</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                  <p className="text-gray-300">Search through meeting history within deals</p>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-not-allowed">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  disabled
                />
                <div className="w-11 h-6 bg-dark-600 rounded-full peer"></div>
                <span className="ml-3 text-gray-400">Enable Integration</span>
              </label>
            </div>
          </div>

          {/* Instantly Integration */}
          <div className="card p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <MessageSquare className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-white">Instantly.ai</h3>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-accent-purple/10 text-accent-purple">
                      Coming Soon
                    </span>
                  </div>
                  <p className="text-gray-400">Create deals from campaign responses</p>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                  <p className="text-gray-300">Automatically create deals from positive responses</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                  <p className="text-gray-300">Smart sentiment analysis of responses</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                  <p className="text-gray-300">Track campaign performance within your CRM</p>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-not-allowed">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  disabled
                />
                <div className="w-11 h-6 bg-dark-600 rounded-full peer"></div>
                <span className="ml-3 text-gray-400">Enable Integration</span>
              </label>
            </div>
          </div>

          {/* Airtable Integration */}
          <div className="card p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500/10 rounded-lg">
                  <Database className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-white">Airtable</h3>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-accent-purple/10 text-accent-purple">
                      Coming Soon
                    </span>
                  </div>
                  <p className="text-gray-400">Sync your CRM data with Airtable bases</p>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                  <p className="text-gray-300">Bi-directional sync with Airtable bases</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                  <p className="text-gray-300">Custom field mapping and automation</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                  <p className="text-gray-300">Real-time updates across platforms</p>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-not-allowed">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  disabled
                />
                <div className="w-11 h-6 bg-dark-600 rounded-full peer"></div>
                <span className="ml-3 text-gray-400">Enable Integration</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}