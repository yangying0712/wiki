import React, { useState } from 'react';

interface ExtraFormData {
  title: string;
  type: 'essay' | 'analysis' | 'fanfic' | 'meta' | 'review' | 'plot_analysis' | 'korean_trans' | 'brain_hole' | 'dark_zone';
  description: string;
  publishedAt: string;
  tags: string[];
  containsSpoilers: boolean;
  sensitiveContent?: boolean;
}

interface ExtraManagerProps {
  initialExtras: ExtraFormData[];
  onSave?: (extras: ExtraFormData[]) => void;
}

const typeLabels: Record<string, { label: string; color: string; icon: string }> = {
  essay: { label: '随笔', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: '✏️' },
  analysis: { label: '分析', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400', icon: '🔍' },
  fanfic: { label: '同人', color: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400', icon: '💕' },
  meta: { label: 'Meta', color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400', icon: '📊' },
  review: { label: '书评', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', icon: '📖' },
  plot_analysis: { label: '剧情/CP分析', color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400', icon: '💖' },
  korean_trans: { label: '韩网翻译', color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400', icon: '🇰🇷' },
  brain_hole: { label: '脑洞段子', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', icon: '💡' },
  dark_zone: { label: '鹿压抑专区', color: 'bg-gray-800 text-gray-100 dark:bg-gray-700 dark:text-gray-200', icon: '🌑' },
};

export const ExtraManager: React.FC<ExtraManagerProps> = ({ initialExtras, onSave }) => {
  const [extras, setExtras] = useState<ExtraFormData[]>(initialExtras);
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<ExtraFormData>({
    title: '',
    type: 'essay',
    description: '',
    publishedAt: new Date().toISOString().split('T')[0],
    tags: [],
    containsSpoilers: false,
    sensitiveContent: false,
  });
  const [newTag, setNewTag] = useState('');

  const resetForm = () => {
    setFormData({
      title: '',
      type: 'essay',
      description: '',
      publishedAt: new Date().toISOString().split('T')[0],
      tags: [],
      containsSpoilers: false,
      sensitiveContent: false,
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
    setFormData({ ...extras[index] });
  };

  const handleDelete = (index: number) => {
    if (confirm('确定要删除这篇随笔吗？')) {
      const newExtras = extras.filter((_, i) => i !== index);
      setExtras(newExtras);
      onSave?.(newExtras);
    }
  };

  const handleSave = () => {
    if (!formData.title.trim()) {
      alert('请输入标题');
      return;
    }

    let newExtras: ExtraFormData[];
    if (editingIndex !== null) {
      newExtras = extras.map((extra, i) => (i === editingIndex ? formData : extra));
    } else {
      newExtras = [...extras, formData];
    }
    
    setExtras(newExtras);
    onSave?.(newExtras);
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

  return (
    <div className="space-y-6">
      {/* 工具栏 */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">随笔管理</h3>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <span>➕</span> 添加随笔
        </button>
      </div>

      {/* 编辑表单 */}
      {isEditing && (
        <div className="p-6 bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg space-y-4">
          <h4 className="font-semibold">{editingIndex !== null ? '编辑随笔' : '添加新随笔'}</h4>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">标题 *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-background)]"
                placeholder="随笔标题"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">类型</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as ExtraFormData['type'] })}
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-background)]"
              >
                {Object.entries(typeLabels).map(([key, { label }]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">发布日期</label>
              <input
                type="date"
                value={formData.publishedAt}
                onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-background)]"
              />
            </div>
            
            <div className="flex flex-col gap-2 pt-6">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="containsSpoilers"
                  checked={formData.containsSpoilers}
                  onChange={(e) => setFormData({ ...formData, containsSpoilers: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="containsSpoilers" className="text-sm">⚠️ 含剧透内容</label>
              </div>
              {formData.type === 'dark_zone' && (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="sensitiveContent"
                    checked={formData.sensitiveContent}
                    onChange={(e) => setFormData({ ...formData, sensitiveContent: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <label htmlFor="sensitiveContent" className="text-sm">🌑 阴间泥塑嬷预警</label>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">描述</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-background)] min-h-[80px]"
              placeholder="随笔简介..."
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

      {/* 随笔列表 */}
      <div className="space-y-3">
        {extras.map((extra, index) => (
          <div
            key={index}
            className={`p-4 border border-[var(--color-border)] rounded-lg ${extra.type === 'dark_zone' ? 'bg-gray-900/50 dark:bg-gray-950' : 'bg-[var(--color-card)]'}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeLabels[extra.type]?.color || 'bg-gray-100 text-gray-700'}`}>
                    {typeLabels[extra.type]?.icon} {typeLabels[extra.type]?.label || extra.type}
                  </span>
                  {extra.containsSpoilers && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                      ⚠️ 含剧透
                    </span>
                  )}
                  {extra.sensitiveContent && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-800 text-gray-100 dark:bg-gray-700 dark:text-gray-200">
                      🌑 阴间预警
                    </span>
                  )}
                </div>
                <h4 className="font-medium">{extra.title}</h4>
                <p className="text-sm text-[var(--color-muted)] mt-1">{extra.description}</p>
                <div className="text-xs text-[var(--color-muted)] mt-2">
                  {extra.publishedAt}
                </div>
                {extra.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {extra.tags.map((tag, i) => (
                      <span key={i} className="px-2 py-0.5 bg-[var(--color-border)] rounded-full text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
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
          </div>
        ))}
      </div>

      {extras.length === 0 && !isEditing && (
        <div className="text-center py-12 text-[var(--color-muted)]">
          暂无随笔数据，点击上方按钮添加
        </div>
      )}
    </div>
  );
};

export default ExtraManager;
