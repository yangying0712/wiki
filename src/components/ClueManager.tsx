import React, { useState } from 'react';

interface ClueFormData {
  title: string;
  description: string;
  status: 'planted' | 'recovered' | 'abandoned';
  plantedChapter: number;
  recoveredChapter?: number;
  importance: 'minor' | 'moderate' | 'major' | 'critical';
  theories: string[];
}

interface ClueManagerProps {
  initialClues: ClueFormData[];
  onSave?: (clues: ClueFormData[]) => void;
}

const statusLabels: Record<string, { label: string; color: string; icon: string }> = {
  planted: { label: '待回收', color: 'text-amber-600 bg-amber-100 dark:bg-amber-900/30', icon: '🌱' },
  recovered: { label: '已回收', color: 'text-green-600 bg-green-100 dark:bg-green-900/30', icon: '✅' },
  abandoned: { label: '已弃用', color: 'text-gray-500 bg-gray-100 dark:bg-gray-800', icon: '❌' },
};

const importanceLabels: Record<string, { label: string; color: string }> = {
  minor: { label: '次要', color: 'border-gray-300' },
  moderate: { label: '中等', color: 'border-blue-400' },
  major: { label: '重要', color: 'border-amber-400' },
  critical: { label: '关键', color: 'border-red-500' },
};

export const ClueManager: React.FC<ClueManagerProps> = ({ initialClues, onSave }) => {
  const [clues, setClues] = useState<ClueFormData[]>(initialClues);
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<ClueFormData>({
    title: '',
    description: '',
    status: 'planted',
    plantedChapter: 1,
    importance: 'moderate',
    theories: [],
  });
  const [newTheory, setNewTheory] = useState('');

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      status: 'planted',
      plantedChapter: 1,
      importance: 'moderate',
      theories: [],
    });
    setNewTheory('');
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
    setFormData({ ...clues[index] });
  };

  const handleDelete = (index: number) => {
    if (confirm('确定要删除这条伏笔吗？')) {
      const newClues = clues.filter((_, i) => i !== index);
      setClues(newClues);
      onSave?.(newClues);
    }
  };

  const handleSave = () => {
    if (!formData.title.trim()) {
      alert('请输入伏笔标题');
      return;
    }

    let newClues: ClueFormData[];
    if (editingIndex !== null) {
      newClues = clues.map((clue, i) => (i === editingIndex ? formData : clue));
    } else {
      newClues = [...clues, formData];
    }
    
    setClues(newClues);
    onSave?.(newClues);
    resetForm();
  };

  const addTheory = () => {
    if (newTheory.trim()) {
      setFormData({ ...formData, theories: [...formData.theories, newTheory.trim()] });
      setNewTheory('');
    }
  };

  const removeTheory = (index: number) => {
    setFormData({
      ...formData,
      theories: formData.theories.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6">
      {/* 工具栏 */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">伏笔管理</h3>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <span>➕</span> 添加伏笔
        </button>
      </div>

      {/* 编辑表单 */}
      {isEditing && (
        <div className="p-6 bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg space-y-4">
          <h4 className="font-semibold">{editingIndex !== null ? '编辑伏笔' : '添加新伏笔'}</h4>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">标题 *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-background)]"
                placeholder="伏笔标题"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">状态</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as ClueFormData['status'] })}
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-background)]"
              >
                {Object.entries(statusLabels).map(([key, { label, icon }]) => (
                  <option key={key} value={key}>{icon} {label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">埋线章节</label>
              <input
                type="number"
                min="1"
                value={formData.plantedChapter}
                onChange={(e) => setFormData({ ...formData, plantedChapter: parseInt(e.target.value, 10) || 1 })}
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-background)]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">回收章节 (可选)</label>
              <input
                type="number"
                min="1"
                value={formData.recoveredChapter || ''}
                onChange={(e) => setFormData({ ...formData, recoveredChapter: e.target.value ? parseInt(e.target.value, 10) : undefined })}
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-background)]"
                placeholder="留空表示未回收"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">重要性</label>
              <select
                value={formData.importance}
                onChange={(e) => setFormData({ ...formData, importance: e.target.value as ClueFormData['importance'] })}
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-background)]"
              >
                {Object.entries(importanceLabels).map(([key, { label }]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">描述</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-background)] min-h-[80px]"
              placeholder="伏笔描述..."
            />
          </div>
          
          {/* 预测/理论 */}
          <div>
            <label className="block text-sm font-medium mb-1">预测/理论</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newTheory}
                onChange={(e) => setNewTheory(e.target.value)}
                className="flex-1 px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-background)]"
                placeholder="添加预测..."
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTheory())}
              />
              <button
                onClick={addTheory}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                添加
              </button>
            </div>
            {formData.theories.length > 0 && (
              <ul className="space-y-1">
                {formData.theories.map((theory, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <span>💡</span>
                    <span className="flex-1">{theory}</span>
                    <button
                      onClick={() => removeTheory(i)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
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

      {/* 伏笔列表 */}
      <div className="space-y-3">
        {clues.map((clue, index) => (
          <div
            key={index}
            className={`p-4 border-l-4 ${importanceLabels[clue.importance].color} bg-[var(--color-card)] rounded-lg`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <span className="text-xl">{statusLabels[clue.status].icon}</span>
                <div>
                  <h4 className="font-medium">{clue.title}</h4>
                  <p className="text-sm text-[var(--color-muted)] mt-1">{clue.description}</p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-[var(--color-muted)]">
                    <span>埋线: 第{clue.plantedChapter}章</span>
                    {clue.recoveredChapter && (
                      <>
                        <span>→</span>
                        <span>回收: 第{clue.recoveredChapter}章</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusLabels[clue.status].color}`}>
                  {statusLabels[clue.status].label}
                </span>
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

      {clues.length === 0 && !isEditing && (
        <div className="text-center py-12 text-[var(--color-muted)]">
          暂无伏笔数据，点击上方按钮添加
        </div>
      )}
    </div>
  );
};

export default ClueManager;
