import React, { useState } from 'react';

interface QuoteFormData {
  quote: string;
  speaker: string;
  speakerColor?: string;
  chapter?: number;
  context?: string;
  importance: 'normal' | 'memorable' | 'iconic';
  tags: string[];
}

interface QuoteManagerProps {
  initialQuotes: QuoteFormData[];
  speakers: { id: string; name: string; color: string }[];
  onSave?: (quotes: QuoteFormData[]) => void;
}

const importanceLabels: Record<string, { label: string; icon: string; color: string }> = {
  normal: { label: '普通', icon: '💬', color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' },
  memorable: { label: '难忘', icon: '💎', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
  iconic: { label: '经典', icon: '⭐', color: 'bg-gradient-to-r from-blue-100 to-red-100 text-indigo-700 dark:from-blue-900/30 dark:to-red-900/30 dark:text-indigo-400' },
};

export const QuoteManager: React.FC<QuoteManagerProps> = ({ initialQuotes, speakers, onSave }) => {
  const [quotes, setQuotes] = useState<QuoteFormData[]>(initialQuotes);
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<QuoteFormData>({
    quote: '',
    speaker: speakers[0]?.id || '',
    importance: 'normal',
    tags: [],
  });
  const [newTag, setNewTag] = useState('');

  const resetForm = () => {
    setFormData({
      quote: '',
      speaker: speakers[0]?.id || '',
      importance: 'normal',
      tags: [],
    });
    setNewTag('');
    setEditingIndex(null);
    setIsEditing(false);
  };

  const handleAdd = () => {
    setIsEditing(true);
    setEditingIndex(null);
    resetForm();
  };

  const handleEdit = (index: number) => {
    setIsEditing(true);
    setEditingIndex(index);
    setFormData({ ...quotes[index] });
  };

  const handleDelete = (index: number) => {
    if (confirm('确定要删除这条金句吗？')) {
      const newQuotes = quotes.filter((_, i) => i !== index);
      setQuotes(newQuotes);
      onSave?.(newQuotes);
    }
  };

  const handleSave = () => {
    if (!formData.quote.trim()) {
      alert('请输入金句内容');
      return;
    }

    // 获取说话者的颜色
    const selectedSpeaker = speakers.find(s => s.id === formData.speaker);
    const dataToSave = {
      ...formData,
      speakerColor: selectedSpeaker?.color,
    };

    let newQuotes: QuoteFormData[];
    if (editingIndex !== null) {
      newQuotes = quotes.map((quote, i) => (i === editingIndex ? dataToSave : quote));
    } else {
      newQuotes = [...quotes, dataToSave];
    }
    
    setQuotes(newQuotes);
    onSave?.(newQuotes);
    resetForm();
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, newTag.trim()] });
      setNewTag('');
    }
  };

  const removeTag = (index: number) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((_, i) => i !== index),
    });
  };

  const getSpeakerInfo = (speakerId: string) => {
    return speakers.find(s => s.id === speakerId);
  };

  return (
    <div className="space-y-6">
      {/* 工具栏 */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">金句管理</h3>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-red-600 text-white rounded-lg hover:from-blue-700 hover:to-red-700 transition-colors flex items-center gap-2"
        >
          <span>➕</span> 添加金句
        </button>
      </div>

      {/* 编辑表单 */}
      {isEditing && (
        <div className="p-6 bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg space-y-4">
          <h4 className="font-semibold">{editingIndex !== null ? '编辑金句' : '添加新金句'}</h4>
          
          <div>
            <label className="block text-sm font-medium mb-1">金句内容 *</label>
            <textarea
              value={formData.quote}
              onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-background)] min-h-[100px]"
              placeholder="输入经典台词..."
            />
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">说话者</label>
              <select
                value={formData.speaker}
                onChange={(e) => setFormData({ ...formData, speaker: e.target.value })}
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-background)]"
              >
                {speakers.map((speaker) => (
                  <option key={speaker.id} value={speaker.id}>{speaker.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">出自章节 (可选)</label>
              <input
                type="number"
                min="1"
                value={formData.chapter || ''}
                onChange={(e) => setFormData({ ...formData, chapter: e.target.value ? parseInt(e.target.value, 10) : undefined })}
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-background)]"
                placeholder="章节号"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">重要性</label>
              <select
                value={formData.importance}
                onChange={(e) => setFormData({ ...formData, importance: e.target.value as QuoteFormData['importance'] })}
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-background)]"
              >
                {Object.entries(importanceLabels).map(([key, { label, icon }]) => (
                  <option key={key} value={key}>{icon} {label}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">语境说明 (可选)</label>
            <input
              type="text"
              value={formData.context || ''}
              onChange={(e) => setFormData({ ...formData, context: e.target.value })}
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-background)]"
              placeholder="说这句话时的情境..."
            />
          </div>
          
          {/* 标签 */}
          <div>
            <label className="block text-sm font-medium mb-1">标签</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="flex-1 px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-background)]"
                placeholder="例如: vibe:感动"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <button
                onClick={addTag}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                添加
              </button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, i) => (
                  <span key={i} className="inline-flex items-center gap-1 px-2 py-1 bg-[var(--color-border)] rounded-full text-sm">
                    {tag}
                    <button
                      onClick={() => removeTag(i)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex gap-2 pt-4">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              保存
            </button>
            <button
              onClick={resetForm}
              className="px-4 py-2 border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-card)] transition-colors"
            >
              取消
            </button>
          </div>
        </div>
      )}

      {/* 金句列表 */}
      <div className="space-y-4">
        {quotes.map((quote, index) => {
          const speaker = getSpeakerInfo(quote.speaker);
          return (
            <div
              key={index}
              className="relative p-6 bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg"
              style={{ borderLeftColor: quote.speakerColor || speaker?.color, borderLeftWidth: '4px' }}
            >
              {/* 重要性标记 */}
              <div className="absolute -top-2 -right-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${importanceLabels[quote.importance].color}`}>
                  {importanceLabels[quote.importance].icon} {importanceLabels[quote.importance].label}
                </span>
              </div>
              
              {/* 装饰性引号 */}
              <span 
                className="absolute -top-4 -left-1 text-6xl opacity-10 font-serif select-none"
                style={{ color: quote.speakerColor || speaker?.color }}
              >
                "
              </span>
              
              <blockquote className="text-lg italic mb-3 relative z-10">
                {quote.quote}
              </blockquote>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span 
                    className="font-semibold"
                    style={{ color: quote.speakerColor || speaker?.color }}
                  >
                    — {speaker?.name || quote.speaker}
                  </span>
                  {quote.chapter && (
                    <span className="text-sm text-[var(--color-muted)]">第 {quote.chapter} 章</span>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(index)}
                    className="p-1 text-blue-500 hover:text-blue-700"
                    title="编辑"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    className="p-1 text-red-500 hover:text-red-700"
                    title="删除"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              
              {quote.context && (
                <p className="text-sm text-[var(--color-muted)] mt-2 italic">{quote.context}</p>
              )}
              
              {quote.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {quote.tags.map((tag, i) => (
                    <span key={i} className="px-2 py-0.5 bg-[var(--color-border)] rounded-full text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {quotes.length === 0 && !isEditing && (
        <div className="text-center py-12 text-[var(--color-muted)]">
          暂无金句数据，点击上方按钮添加
        </div>
      )}
    </div>
  );
};

export default QuoteManager;
