'use client';

import { Trade } from '@/types/trade';
import { Edit2, Trash2, Plus, Calendar, DollarSign, TrendingUp, BarChart3, Target, Brain, StickyNote, FolderMinus, Image as LucideImage } from 'lucide-react';
import { cn } from '@/lib/utils';
import { API_URL } from '@/lib/api';

interface TradeTableProps {
  trades: Trade[];
  onEdit: (trade: Trade) => void;
  onDelete: (id: string) => void;
  onNoteClick: (trade: Trade) => void;
  onAddClick?: () => void;
  draggableRows?: boolean;
  onDragStart?: (e: React.DragEvent, trade: Trade) => void;
  currentFolderId?: string;
  onRemoveFromFolder?: (tradeId: string) => void;
  isLoading?: boolean;
}


// Helper for date formatting (YYYY.MM.DD HH.MM)
const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return `${year}.${month}.${day} ${hours}.${minutes}`;
};

export function TradeTable({
  trades,
  onEdit,
  onDelete,
  onNoteClick,
  onAddClick,
  draggableRows,
  onDragStart,
  currentFolderId,
  onRemoveFromFolder,
  isLoading
}: TradeTableProps) {
  return (
    <div className={cn("overflow-x-auto bg-gray-900 rounded-lg border border-gray-800/50 transition-opacity duration-200", isLoading ? "opacity-60 pointer-events-none" : "opacity-100")}>
      <table className="w-full text-left text-xs">
        {/* ... thead stays same ... */}
        <thead className="border-b border-gray-800/50">
          <tr className="text-gray-400">
            <th className="px-3 py-2 font-medium">
              <div className="flex items-center gap-1.5">
                <BarChart3 size={12} className="text-gray-500" />
                Trade #
              </div>
            </th>
            <th className="px-3 py-2 font-medium">
              <div className="flex items-center gap-1.5">
                <LucideImage size={12} className="text-gray-500" />
                Chart
              </div>
            </th>
            <th className="px-3 py-2 font-medium">
              <div className="flex items-center gap-1.5">
                <StickyNote size={12} className="text-gray-500" />
                Notes
              </div>
            </th>
            <th className="px-3 py-2 font-medium">
              <div className="flex items-center gap-1.5">
                <Calendar size={12} className="text-gray-500" />
                Open Date
              </div>
            </th>
            <th className="px-3 py-2 font-medium">
              <div className="flex items-center gap-1.5">
                <Calendar size={12} className="text-gray-500" />
                Close Date
              </div>
            </th>
            <th className="px-3 py-2 font-medium">
              <div className="flex items-center gap-1.5">
                <TrendingUp size={12} className="text-gray-500" />
                Symbol
              </div>
            </th>
            <th className="px-3 py-2 font-medium">
              <div className="flex items-center gap-1.5">
                <DollarSign size={12} className="text-gray-500" />
                Account
              </div>
            </th>
            <th className="px-3 py-2 font-medium">
              <div className="flex items-center gap-1.5">
                <Brain size={12} className="text-gray-500" />
                Model
              </div>
            </th>
            <th className="px-3 py-2 font-medium">Lot/Contract</th>
            <th className="px-3 py-2 font-medium">
              <div className="flex items-center gap-1.5">
                <Target size={12} className="text-gray-500" />
                Position
              </div>
            </th>
            <th className="px-3 py-2 font-medium">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                Status
              </div>
            </th>
            <th className="px-3 py-2 font-medium">
              <div className="flex items-center gap-1.5">
                <DollarSign size={12} className="text-gray-500" />
                Net PnL
              </div>
            </th>
            <th className="px-3 py-2 font-medium">Strategy</th>
            <th className="px-3 py-2 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {(trades || []).map((trade, index) => {
            const entry = Number(trade.entryPrice);
            const pnl = trade.pnl !== null && trade.pnl !== undefined ? Number(trade.pnl) : 0;

            const statusConfig = {
              WIN: { dot: 'bg-green-500', text: 'text-green-400', label: 'Win' },
              LOSS: { dot: 'bg-red-500', text: 'text-red-400', label: 'Loss' },
              BREAKEVEN: { dot: 'bg-yellow-500', text: 'text-yellow-400', label: 'Breakeven' },
              OPEN: { dot: 'bg-blue-500', text: 'text-blue-400', label: 'Open' }
            }[trade.result];

            return (
              <tr
                key={trade.id}
                draggable={draggableRows}
                onDragStart={(e) => onDragStart && onDragStart(e, trade)}
                className="border-b border-gray-800/30 hover:bg-gray-800/30 transition-colors group cursor-move"
              >
                <td className="px-3 py-1 text-gray-400">
                  #{index + 1}
                </td>
                <td className="px-3 py-1">
                  {trade.imageUrl && (
                    <a
                      href={trade.imageUrl.startsWith('/') ? `${API_URL.replace('/api', '')}${trade.imageUrl}` : trade.imageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 block w-fit"
                      onClick={(e) => e.stopPropagation()}
                      title="View Chart"
                    >
                      <LucideImage size={14} />
                    </a>
                  )}
                </td>
                <td className="px-3 py-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onNoteClick(trade);
                    }}
                    className={cn(
                      "p-1.5 rounded transition-all",
                      trade.notes
                        ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600/30"
                        : "text-gray-500 hover:bg-gray-800 hover:text-gray-300 border border-transparent"
                    )}
                    title={trade.notes ? "View/Edit notes" : "Add note"}
                  >
                    <StickyNote size={14} className={trade.notes ? "fill-blue-400/20" : ""} />
                  </button>
                </td>
                <td className="px-3 py-1 text-gray-300 whitespace-nowrap">
                  {formatDate(trade.tradeDate)}
                </td>
                <td className="px-3 py-1 text-gray-300 whitespace-nowrap">
                  {formatDate(trade.exitDate)}
                </td>
                <td className="px-3 py-1">
                  <span className="text-white font-medium">{trade.instrument}</span>
                </td>
                <td className="px-3 py-1">
                  {trade.account ? (
                    <div className="flex flex-col gap-0">
                      <span className="text-gray-300">{trade.account.name}</span>
                      <span className="text-[10px] text-gray-500 uppercase">{trade.account.type}</span>
                    </div>
                  ) : (
                    <span className="text-gray-500">-</span>
                  )}
                </td>
                <td className="px-3 py-1">
                  {trade.model ? (
                    <span className="text-blue-400 font-medium">{trade.model.name}</span>
                  ) : (
                    <span className="text-gray-500">-</span>
                  )}
                </td>
                <td className="px-3 py-1 text-gray-300">
                  {trade.quantity}
                </td>
                <td className="px-3 py-1 text-gray-300">
                  <div className="flex flex-col gap-0">
                    <span className="text-[10px] text-gray-500">Entry: ${entry}</span>
                    {trade.exitPrice && (
                      <span className="text-[10px] text-gray-500">Exit: ${trade.exitPrice}</span>
                    )}
                  </div>
                </td>
                <td className="px-3 py-1">
                  <div className="flex items-center gap-1.5">
                    <span className={cn("w-1.5 h-1.5 rounded-full", statusConfig.dot)}></span>
                    <span className={cn(statusConfig.text)}>{statusConfig.label}</span>
                  </div>
                </td>
                <td className={cn(
                  "px-3 py-1 font-semibold",
                  pnl > 0 ? "text-green-400" : pnl < 0 ? "text-red-400" : "text-gray-400"
                )}>
                  {(trade.result === 'OPEN' && (trade.pnl === null || trade.pnl === undefined)) ? '-' : (
                    <span>{pnl >= 0 ? '+' : ''}${pnl.toFixed(2)}</span>
                  )}
                </td>
                <td className="px-3 py-1 text-gray-300">
                  {trade.strategy || '-'}
                </td>
                <td className="px-3 py-1">
                  <div className="flex justify-end gap-1 transition-opacity">
                    {/* Remove from Folder Button */}
                    {currentFolderId && onRemoveFromFolder && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveFromFolder(trade.id);
                        }}
                        className="p-1 hover:bg-gray-700/50 rounded text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        title="Remove from Folder"
                      >
                        <FolderMinus size={14} />
                      </button>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(trade);
                      }}
                      className="p-1 hover:bg-gray-700/50 rounded text-blue-400 transition-colors"
                      title="Edit trade"
                    >
                      <Edit2 size={12} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(trade.id);
                      }}
                      className="p-1 hover:bg-gray-700/50 rounded text-red-400 transition-colors"
                      title="Delete trade"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}

          {/* New page row */}
          <tr
            onClick={onAddClick}
            className="border-b border-gray-800/30 hover:bg-gray-800/30 transition-colors cursor-pointer group"
          >
            <td colSpan={14} className="px-3 py-2">
              <div className="flex items-center gap-2 text-gray-500 group-hover:text-gray-400">
                <Plus size={12} />
                <span className="">New page</span>
              </div>
            </td>
          </tr>

          {trades.length === 0 && (
            <tr>
              <td colSpan={14} className="px-6 py-8 text-center text-gray-500">
                No trades yet. Click &quot;+ New page&quot; to add your first trade!
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
