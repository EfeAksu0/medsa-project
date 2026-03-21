'use client';

import { useState } from 'react';
import useSWR, { mutate } from 'swr';
import api from '@/lib/api';
import { Trade, TradeFormData } from '@/types/trade';
import { TradeTable } from '@/components/trades/TradeTable';
import { TradeForm } from '@/components/trades/TradeForm';
import { Modal } from '@/components/ui/Modal';
import { Plus, Folder, FolderPlus, ArrowLeft, Trash2 } from 'lucide-react';
import { QuickDelete } from '@/components/ui/QuickDelete';
import { toast } from 'sonner';

interface TradeFolder {
  id: string;
  name: string;
  _count?: {
    trades: number;
  };
}

const fetcher = (url: string) => api.get(url).then(res => res.data);

export default function TradesPage() {
  const [currentFolder, setCurrentFolder] = useState<TradeFolder | null>(null);

  // SWR for Folders
  const { data: folders = [], mutate: mutateFolders } = useSWR<TradeFolder[]>(
    !currentFolder ? '/trades/folders' : null,
    fetcher
  );

  // SWR for Trades
  const tradesKey = currentFolder
    ? `/trades?page=1&limit=50&folderId=${currentFolder.id}`
    : `/trades?page=1&limit=50&root=true`;

  const { data: tradesData, isLoading, mutate: mutateTrades } = useSWR<{ trades: Trade[], total: number }>(
    tradesKey,
    fetcher
  );

  const trades = tradesData?.trades || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrade, setEditingTrade] = useState<Trade | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [noteTrade, setNoteTrade] = useState<Trade | null>(null);
  const [tempNote, setTempNote] = useState('');

  const handleAddTrade = () => {
    setEditingTrade(null);
    setIsModalOpen(true);
  };

  const handleEditTrade = (trade: Trade) => {
    setEditingTrade(trade);
    setIsModalOpen(true);
  };

  const handleNoteClick = (trade: Trade) => {
    setNoteTrade(trade);
    setTempNote(trade.notes || '');
    setIsNoteModalOpen(true);
  };

  const handleSaveNote = async () => {
    if (!noteTrade) return;
    try {
      setIsSubmitting(true);
      await api.put(`/trades/${noteTrade.id}`, { notes: tempNote });
      mutateTrades(); // Refresh trades
      setIsNoteModalOpen(false);
    } catch (error) {
      console.error('Failed to save note', error);
      toast.error('Failed to save note');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTrade = async (id: string) => {
    // Optimistic UI: Remove from list immediately
    const previousData = tradesData;
    if (tradesData) {
      mutateTrades({ ...tradesData, trades: tradesData.trades.filter(t => t.id !== id) }, false);
    }

    try {
      await api.delete(`/trades/${id}`);
      toast.success('Trade deleted');
      mutateTrades(); // Final sync
    } catch (error) {
      console.error('Failed to delete trade', error);
      toast.error('Failed to delete trade');
      if (previousData) mutateTrades(previousData); // Rollback
    }
  };

  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [isFolderCreating, setIsFolderCreating] = useState(false);

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      toast.error("Please enter a folder name.");
      return;
    }
    try {
      setIsFolderCreating(true);
      await api.post('/trades/folders', { name: newFolderName.trim() });
      toast.success("Folder created.");
      setNewFolderName('');
      setIsCreatingFolder(false);
      mutateFolders();
    } catch (error: any) {
      console.error("Error creating folder", error);
      const msg = error?.response?.data?.message || error?.message || "Error creating folder.";
      toast.error(msg);
    } finally {
      setIsFolderCreating(false);
    }
  };

  const executeDeleteFolder = async (folderId: string) => {
    // Optimistic UI for SWR
    const previousFolders = folders;
    mutateFolders(folders.filter(f => f.id !== folderId), false);

    try {
      await api.delete(`/trades/folders/${folderId}`);
      toast.success("Folder deleted.");
      mutateFolders();
    } catch (error) {
      mutateFolders(previousFolders); // Rollback
      toast.error("Error deleting folder.");
    }
  };

  const handleMoveTrade = async (tradeId: string, folderId: string | null) => {
    try {
      await api.put(`/trades/${tradeId}`, { folderId });
      toast.success(folderId ? "Trade moved to folder." : "Trade removed from folder.");
      mutateTrades();
    } catch (error) {
      toast.error("Error moving trade.");
    }
  };

  const handleSubmit = async (data: TradeFormData) => {
    try {
      setIsSubmitting(true);

      // Sanitize relations: convert empty strings to null for backend/Prisma
      const sanitizedData = {
        ...data,
        accountId: data.accountId === "" ? null : data.accountId,
        modelId: data.modelId === "" ? null : data.modelId,
        folderId: currentFolder ? currentFolder.id : null, // Auto-assign folder if inside one
      };

      if (editingTrade) {
        await api.put(`/trades/${editingTrade.id}`, sanitizedData);
      } else {
        await api.post('/trades', sanitizedData);
      }
      setIsModalOpen(false);
      mutateTrades();
    } catch (error: any) {
      console.error('Failed to save trade', error);
      toast.error(error.response?.data?.error || error.message || 'Failed to save trade');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Header & Breadcrumbs */}
      <div className="flex justify-between items-end">
        <div>
          {currentFolder ? (
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={() => setCurrentFolder(null)}
                className="text-gray-500 hover:text-white transition-colors flex items-center gap-1 text-sm"
              >
                <ArrowLeft size={14} /> All Trades
              </button>
              <span className="text-gray-700">/</span>
              <span className="text-amber-500 font-semibold text-sm">{currentFolder.name}</span>
            </div>
          ) : (
            <div>
              <h1 className="text-2xl font-bold text-white">Trade Journal</h1>
              <p className="text-sm text-gray-500 mt-1">Manage and analyze your trading performance</p>
            </div>
          )}
          {currentFolder && (
            <p className="text-gray-500 text-sm">Viewing trades in <span className="text-white">{currentFolder.name}</span></p>
          )}
        </div>
        <div className="flex gap-2">
          {!currentFolder && (
            <button
              onClick={() => setIsCreatingFolder(true)}
              className="flex items-center gap-2 px-3 py-2.5 bg-gray-900/80 border border-gray-800 hover:border-amber-500/40 text-gray-400 hover:text-white text-sm font-medium rounded-xl transition-all"
            >
              <FolderPlus size={16} />
              <span>New Folder</span>
            </button>
          )}
          <button
            onClick={handleAddTrade}
            className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-amber-900/20"
          >
            <Plus size={18} />
            <span>Add Trade</span>
          </button>
        </div>
      </div>

      {/* Usage Note */}
      {
        !currentFolder && (
          <div className="bg-red-950/30 border border-red-900/50 p-3 rounded-lg flex items-start gap-3 text-sm">
            <div className="p-1 bg-red-900/20 rounded shrink-0 mt-0.5">
              <span className="text-red-500 font-bold block w-4 h-4 text-center leading-4">!</span>
            </div>
            <p className="text-red-200/80 leading-relaxed">
              <span className="font-semibold text-red-400">Note:</span> You can drag and drop trades into folders to organize them.
              If a trade is put into a folder, it will <span className="text-red-300 font-medium">not be seen</span> in this main dashboard view.
            </p>
          </div>
        )
      }

      {/* Create Folder Input */}
      {
        isCreatingFolder && (
          <div className="relative z-10 flex items-center gap-2 p-4 bg-gray-900 border border-amber-500/30 rounded-xl shadow-lg animate-in fade-in slide-in-from-top-2">
            <Folder size={20} className="text-amber-500 shrink-0" />
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Folder Name..."
              className="bg-transparent border-none focus:ring-0 text-white placeholder-gray-600 flex-1 outline-none"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && !isFolderCreating && handleCreateFolder()}
            />
            <button
              type="button"
              onClick={() => { setIsCreatingFolder(false); setNewFolderName(''); }}
              className="text-gray-500 hover:text-white px-2 py-1 rounded transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCreateFolder}
              disabled={isFolderCreating || !newFolderName.trim()}
              className="text-amber-500 hover:text-amber-400 font-bold px-2 py-1 rounded transition-colors disabled:opacity-40"
            >
              {isFolderCreating ? 'Creating...' : 'Create'}
            </button>
          </div>
        )
      }

      {
        isLoading && !tradesData ? (
          <div className="text-gray-400">Loading trades...</div>
        ) : (
          <div className="space-y-6 animate-fade-in">
            {/* Folders Grid (Only show in root) */}
            {!currentFolder && folders.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {folders.map(folder => (
                  <div
                    key={folder.id}
                    onClick={() => setCurrentFolder(folder)}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.add('border-amber-500', 'bg-gray-800');
                    }}
                    onDragLeave={(e) => {
                      e.currentTarget.classList.remove('border-amber-500', 'bg-gray-800');
                    }}
                    onDrop={async (e) => {
                      e.preventDefault();
                      e.currentTarget.classList.remove('border-amber-500', 'bg-gray-800');
                      const tradeId = e.dataTransfer.getData('text/plain');
                      if (tradeId) {
                        await handleMoveTrade(tradeId, folder.id);
                      }
                    }}
                    className="group bg-gray-900 border border-gray-800 hover:border-amber-500/50 p-4 rounded-xl cursor-pointer transition-all flex flex-col justify-between h-28 relative"
                  >
                    <div className="flex justify-between items-start pointer-events-none">
                      <Folder size={28} className="text-amber-600 group-hover:text-amber-500 transition-colors" />
                      <QuickDelete
                        onDelete={() => executeDeleteFolder(folder.id)}
                        iconSize={16}
                        className="opacity-0 group-hover:opacity-100 transition-all p-1 pointer-events-auto"
                      />
                    </div>
                    <div className="pointer-events-none">
                      <h3 className="font-bold text-gray-200 truncate">{folder.name}</h3>
                      <p className="text-xs text-gray-500">{folder._count?.trades || 0} items</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <TradeTable
              trades={trades}
              onEdit={handleEditTrade}
              onDelete={handleDeleteTrade}
              onNoteClick={handleNoteClick}
              onAddClick={handleAddTrade}
              // Pass drag handlers if we modify TradeTable, or wrap rows
              // For now, we need to modify TradeTable to support draggable
              draggableRows={true}
              onDragStart={(e, trade) => {
                e.dataTransfer.setData('text/plain', trade.id);
                e.dataTransfer.effectAllowed = 'move';
              }}
              currentFolderId={currentFolder?.id}
              onRemoveFromFolder={(tradeId) => handleMoveTrade(tradeId, null)}
              isLoading={isLoading}
            />
          </div>
        )
      }

      {/* Edit/Create Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTrade ? 'Edit Trade' : 'New Trade'}
        maxWidth="max-w-4xl"
      >
        <TradeForm
          initialData={editingTrade}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </Modal>

      {/* Quick Note Modal */}
      <Modal
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        title={`Quick Note: ${noteTrade?.instrument}`}
      >
        <div className="space-y-4">
          <textarea
            value={tempNote}
            onChange={(e) => setTempNote(e.target.value)}
            className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-white outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all h-40 resize-none"
            placeholder="Write your trade notes here..."
            autoFocus
          />
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setIsNoteModalOpen(false)}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveNote}
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors font-medium"
            >
              {isSubmitting ? 'Saving...' : 'Save Note'}
            </button>
          </div>
        </div>
      </Modal>
    </div >
  );
}
