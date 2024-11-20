import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { useSettingsStore } from '../store/settingsStore';
import { useDealStore } from '../store/dealStore';
import TeamSettings from './TeamSettings';
import { Plus, Trash2, Info } from 'lucide-react';
import clsx from 'clsx';

const CHANGELOG = [
  {
    version: '3.2.0',
    date: 'November 20, 2024',
    changes: [
      'Enhanced deal details with inline editing',
      'Added quick actions for deals',
      'Improved contact management in deals',
      'Enhanced lead management with bulk actions',
      'Improved drag and drop functionality',
      'Added activity tracking and timeline',
      'UI/UX improvements across the board'
    ]
  },
  {
    version: '3.1.0',
    date: 'November 19, 2024',
    changes: [
      'Enhanced deal ownership and team assignment',
      'Improved drag and drop interface',
      'Advanced filtering and sorting options',
      'Performance optimizations',
      'UI/UX improvements'
    ]
  }
];

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { settings, updateSettings } = useSettingsStore();
  const { stages, addStage, updateStage, deleteStage } = useDealStore();
  const [newStageName, setNewStageName] = useState('');
  const [activeTab, setActiveTab] = useState('display');

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-4xl w-full bg-dark-800 rounded-xl shadow-lg">
          <div className="flex h-[80vh]">
            {/* Sidebar */}
            <div className="w-48 border-r border-dark-700 p-4">
              <div className="space-y-1">
                <button
                  onClick={() => setActiveTab('display')}
                  className={clsx(
                    'w-full px-3 py-2 text-sm font-medium rounded-lg text-left',
                    activeTab === 'display'
                      ? 'bg-dark-700 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-dark-700'
                  )}
                >
                  Display
                </button>
                <button
                  onClick={() => setActiveTab('deal-stages')}
                  className={clsx(
                    'w-full px-3 py-2 text-sm font-medium rounded-lg text-left',
                    activeTab === 'deal-stages'
                      ? 'bg-dark-700 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-dark-700'
                  )}
                >
                  Deal Stages
                </button>
                <button
                  onClick={() => setActiveTab('team')}
                  className={clsx(
                    'w-full px-3 py-2 text-sm font-medium rounded-lg text-left',
                    activeTab === 'team'
                      ? 'bg-dark-700 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-dark-700'
                  )}
                >
                  Team
                </button>
                <button
                  onClick={() => setActiveTab('about')}
                  className={clsx(
                    'w-full px-3 py-2 text-sm font-medium rounded-lg text-left',
                    activeTab === 'about'
                      ? 'bg-dark-700 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-dark-700'
                  )}
                >
                  About
                </button>
              </div>

              <div className="absolute bottom-4 left-4 right-4">
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  Version 3.2.0
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              {activeTab === 'display' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-white mb-4">Display Settings</h2>
                    <div className="space-y-4">
                      <label className="flex items-center justify-between">
                        <span className="text-gray-300">Show Created Date</span>
                        <div className="relative inline-flex items-center">
                          <input
                            type="checkbox"
                            checked={settings.display.showCreatedDate}
                            onChange={(e) => updateSettings({
                              display: {
                                ...settings.display,
                                showCreatedDate: e.target.checked
                              }
                            })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-dark-600 rounded-full peer peer-checked:bg-accent-purple peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                        </div>
                      </label>

                      <label className="flex items-center justify-between">
                        <span className="text-gray-300">Show Company</span>
                        <div className="relative inline-flex items-center">
                          <input
                            type="checkbox"
                            checked={settings.display.showCompany}
                            onChange={(e) => updateSettings({
                              display: {
                                ...settings.display,
                                showCompany: e.target.checked
                              }
                            })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-dark-600 rounded-full peer peer-checked:bg-accent-purple peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                        </div>
                      </label>

                      <label className="flex items-center justify-between">
                        <span className="text-gray-300">Show Value</span>
                        <div className="relative inline-flex items-center">
                          <input
                            type="checkbox"
                            checked={settings.display.showValue}
                            onChange={(e) => updateSettings({
                              display: {
                                ...settings.display,
                                showValue: e.target.checked
                              }
                            })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-dark-600 rounded-full peer peer-checked:bg-accent-purple peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                        </div>
                      </label>

                      <label className="flex items-center justify-between">
                        <span className="text-gray-300">Show Probability</span>
                        <div className="relative inline-flex items-center">
                          <input
                            type="checkbox"
                            checked={settings.display.showProbability}
                            onChange={(e) => updateSettings({
                              display: {
                                ...settings.display,
                                showProbability: e.target.checked
                              }
                            })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-dark-600 rounded-full peer peer-checked:bg-accent-purple peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                        </div>
                      </label>

                      <label className="flex items-center justify-between">
                        <span className="text-gray-300">Show Expected Close Date</span>
                        <div className="relative inline-flex items-center">
                          <input
                            type="checkbox"
                            checked={settings.display.showExpectedCloseDate}
                            onChange={(e) => updateSettings({
                              display: {
                                ...settings.display,
                                showExpectedCloseDate: e.target.checked
                              }
                            })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-dark-600 rounded-full peer peer-checked:bg-accent-purple peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                        </div>
                      </label>

                      <label className="flex items-center justify-between">
                        <span className="text-gray-300">Show Custom Fields</span>
                        <div className="relative inline-flex items-center">
                          <input
                            type="checkbox"
                            checked={settings.display.showCustomFields}
                            onChange={(e) => updateSettings({
                              display: {
                                ...settings.display,
                                showCustomFields: e.target.checked
                              }
                            })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-dark-600 rounded-full peer peer-checked:bg-accent-purple peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'deal-stages' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-white mb-4">Deal Stages</h2>
                    <div className="space-y-4">
                      {stages.map((stage) => (
                        <div
                          key={stage.id}
                          className="flex items-center justify-between p-3 bg-dark-700 rounded-lg"
                        >
                          <input
                            type="text"
                            value={stage.name}
                            onChange={(e) => updateStage(stage.id, e.target.value)}
                            className="bg-transparent text-white focus:outline-none"
                          />
                          {stages.length > 1 && (
                            <button
                              onClick={() => deleteStage(stage.id)}
                              className="text-gray-400 hover:text-red-400"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}

                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newStageName}
                          onChange={(e) => setNewStageName(e.target.value)}
                          placeholder="New stage name..."
                          className="flex-1 input"
                        />
                        <button
                          onClick={() => {
                            if (newStageName) {
                              addStage({
                                id: crypto.randomUUID(),
                                name: newStageName,
                                deals: []
                              });
                              setNewStageName('');
                            }
                          }}
                          className="btn btn-primary"
                          disabled={!newStageName}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Stage
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'team' && <TeamSettings />}

              {activeTab === 'about' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-white mb-4">About NextClient CRM</h2>
                    <div className="space-y-4">
                      {CHANGELOG.map((release) => (
                        <div key={release.version} className="bg-dark-700 rounded-lg p-6">
                          <h3 className="text-white font-medium mb-2">Version {release.version}</h3>
                          <p className="text-gray-400 mb-4">Released {release.date}</p>
                          
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium text-gray-300">What's New</h4>
                            <ul className="list-disc list-inside text-gray-400 space-y-1">
                              {release.changes.map((change, i) => (
                                <li key={i}>{change}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}