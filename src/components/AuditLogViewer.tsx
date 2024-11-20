import React, { useState } from 'react';
import { useAuditStore } from '../store/auditStore';
import { useUserStore } from '../store/userStore';
import { format } from 'date-fns';
import { Filter, Download, Search } from 'lucide-react';

export default function AuditLogViewer() {
  const { getLogs } = useAuditStore();
  const { users } = useUserStore();
  const [filters, setFilters] = useState({
    entityType: '',
    action: '',
    performedBy: '',
    startDate: '',
    endDate: ''
  });

  const logs = getLogs(filters);

  const handleExport = () => {
    const csv = [
      ['Timestamp', 'Action', 'Entity Type', 'Entity ID', 'Performed By', 'Details'],
      ...logs.map(log => [
        format(new Date(log.timestamp), 'yyyy-MM-dd HH:mm:ss'),
        log.action,
        log.entityType,
        log.entityId,
        users.find(u => u.id === log.performedBy)?.name || 'Unknown',
        JSON.stringify(log.details)
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-log-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Audit Log</h2>
        <button onClick={handleExport} className="btn btn-secondary">
          <Download className="w-4 h-4 mr-2" />
          Export
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <select
          value={filters.entityType}
          onChange={(e) => setFilters({ ...filters, entityType: e.target.value })}
          className="input"
        >
          <option value="">All Entity Types</option>
          <option value="deal">Deals</option>
          <option value="lead">Leads</option>
          <option value="contact">Contacts</option>
          <option value="company">Companies</option>
        </select>

        <select
          value={filters.action}
          onChange={(e) => setFilters({ ...filters, action: e.target.value })}
          className="input"
        >
          <option value="">All Actions</option>
          <option value="created">Created</option>
          <option value="updated">Updated</option>
          <option value="deleted">Deleted</option>
          <option value="archived">Archived</option>
          <option value="unarchived">Unarchived</option>
        </select>

        <select
          value={filters.performedBy}
          onChange={(e) => setFilters({ ...filters, performedBy: e.target.value })}
          className="input"
        >
          <option value="">All Users</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>{user.name}</option>
          ))}
        </select>

        <input
          type="date"
          value={filters.startDate}
          onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
          className="input"
          placeholder="Start Date"
        />

        <input
          type="date"
          value={filters.endDate}
          onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
          className="input"
          placeholder="End Date"
        />
      </div>

      <div className="space-y-4">
        {logs.map((log) => (
          <div key={log.id} className="bg-dark-700 rounded-lg p-4 border border-dark-600">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-sm text-gray-400">
                  {format(new Date(log.timestamp), 'MMM d, yyyy h:mm a')}
                </span>
                <h3 className="text-white mt-1">
                  {users.find(u => u.id === log.performedBy)?.name || 'Unknown'}{' '}
                  <span className="text-gray-400">
                    {log.action} a {log.entityType}
                  </span>
                </h3>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                log.action === 'created' ? 'bg-green-500/10 text-green-400' :
                log.action === 'updated' ? 'bg-blue-500/10 text-blue-400' :
                log.action === 'deleted' ? 'bg-red-500/10 text-red-400' :
                'bg-gray-500/10 text-gray-400'
              }`}>
                {log.action}
              </span>
            </div>
            {log.details && (
              <div className="mt-2 text-sm text-gray-400">
                <pre className="whitespace-pre-wrap">
                  {JSON.stringify(log.details, null, 2)}
                </pre>
              </div>
            )}
          </div>
        ))}

        {logs.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            No audit logs found
          </div>
        )}
      </div>
    </div>
  );
}