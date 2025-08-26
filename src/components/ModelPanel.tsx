import React from 'react';
import { Bot, Settings, ToggleLeft, ToggleRight } from 'lucide-react';
import { LLMModel } from '../types';
import { predefinedRoles } from '../data/roles';

interface ModelPanelProps {
  models: LLMModel[];
  onUpdateModel: (modelId: string, updates: Partial<LLMModel>) => void;
}

export const ModelPanel: React.FC<ModelPanelProps> = ({ models, onUpdateModel }) => {
  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-800">Model Configuration</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {models.map((model) => (
          <div
            key={model.id}
            className={`border-2 rounded-lg p-4 transition-all duration-200 ${
              model.isActive 
                ? `border-${model.color}-200 bg-${model.color}-50` 
                : 'border-gray-200 bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div 
                  className={`w-3 h-3 rounded-full bg-${model.color}-500`}
                  style={{ backgroundColor: model.color === 'blue' ? '#3B82F6' : '#8B5CF6' }}
                />
                <span className="font-medium text-gray-800">{model.name}</span>
              </div>
              <button
                onClick={() => onUpdateModel(model.id, { isActive: !model.isActive })}
                className="flex items-center gap-1 text-sm"
              >
                {model.isActive ? (
                  <ToggleRight className="w-5 h-5 text-green-500" />
                ) : (
                  <ToggleLeft className="w-5 h-5 text-gray-400" />
                )}
                <span className={model.isActive ? 'text-green-600' : 'text-gray-500'}>
                  {model.isActive ? 'Active' : 'Inactive'}
                </span>
              </button>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Role Assignment
              </label>
              <select
                value={model.role || 'neutral'}
                onChange={(e) => onUpdateModel(model.id, { role: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={!model.isActive}
              >
                {predefinedRoles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-600">
                {predefinedRoles.find(r => r.id === (model.role || 'neutral'))?.description}
              </p>
            </div>

            <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
              <Bot className="w-3 h-3" />
              <span>{model.provider}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-600">
          <p className="font-medium mb-1">Active Models: {models.filter(m => m.isActive).length}</p>
          <p>Each active model will respond to your messages based on their assigned role.</p>
        </div>
      </div>
    </div>
  );
};