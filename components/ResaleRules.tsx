'use client';

import { ResaleRules } from '@/lib/types';

interface ResaleRulesDisplayProps {
  rules: ResaleRules;
  faceValue: number;
  currency: string;
  compact?: boolean;
  dark?: boolean;
}

export default function ResaleRulesDisplay({ rules, faceValue, currency, compact = false, dark = false }: ResaleRulesDisplayProps) {
  const maxPrice = Math.floor(faceValue * rules.maxPriceMultiplier);
  const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency });

  if (compact) {
    return (
      <div className="flex flex-wrap gap-2 text-xs">
        <span className={`px-2 py-1 rounded ${dark ? 'bg-neutral-600 text-neutral-300' : 'bg-gray-100 text-gray-700'}`}>
          Max: {formatter.format(maxPrice)}
        </span>
        {rules.requiresIdMatch && (
          <span className={`px-2 py-1 rounded ${dark ? 'bg-amber-200/20 text-amber-200' : 'bg-blue-100 text-blue-800'}`}>ID Required</span>
        )}
        {rules.charityPercentage > 0 && (
          <span className={`px-2 py-1 rounded ${dark ? 'bg-emerald-900/50 text-emerald-400' : 'bg-green-100 text-green-800'}`}>
            {rules.charityPercentage}% to Charity
          </span>
        )}
      </div>
    );
  }

  if (dark) {
    return (
      <div className="bg-neutral-700/50 rounded-xl p-4 border border-neutral-600/50">
        <h4 className="font-semibold text-white mb-3 flex items-center">
          <svg className="w-5 h-5 mr-2 text-amber-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          Artist Resale Rules
        </h4>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-neutral-600/50">
            <span className="text-sm text-neutral-400">Maximum Resale Price</span>
            <span className="font-semibold text-white">{formatter.format(maxPrice)}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-neutral-600/50">
            <span className="text-sm text-neutral-400">Price Cap</span>
            <span className="font-medium text-neutral-300">{rules.maxPriceMultiplier * 100}% of face value</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-neutral-600/50">
            <span className="text-sm text-neutral-400">Fan-Only Window</span>
            <span className="font-medium text-neutral-300">{rules.fanOnlyWindowHours} hours</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-neutral-600/50">
            <span className="text-sm text-neutral-400">Transfer Deadline</span>
            <span className="font-medium text-neutral-300">{rules.transferDeadlineHours}h before show</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-neutral-600/50">
            <span className="text-sm text-neutral-400">ID Verification Required</span>
            <span className={`font-medium ${rules.requiresIdMatch ? 'text-emerald-400' : 'text-neutral-500'}`}>
              {rules.requiresIdMatch ? 'Yes' : 'No'}
            </span>
          </div>
          {rules.charityPercentage > 0 && (
            <div className="flex justify-between items-center py-2 bg-emerald-900/30 -mx-4 px-4 rounded-b-lg">
              <span className="text-sm text-emerald-400">Charity Contribution</span>
              <span className="font-semibold text-emerald-300">{rules.charityPercentage}% of premium</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200">
      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
        <svg className="w-5 h-5 mr-2 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        Artist Resale Rules
      </h4>
      <div className="space-y-3">
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="text-sm text-gray-600">Maximum Resale Price</span>
          <span className="font-semibold text-gray-900">{formatter.format(maxPrice)}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="text-sm text-gray-600">Price Cap</span>
          <span className="font-medium text-gray-700">{rules.maxPriceMultiplier * 100}% of face value</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="text-sm text-gray-600">Fan-Only Window</span>
          <span className="font-medium text-gray-700">{rules.fanOnlyWindowHours} hours</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="text-sm text-gray-600">Transfer Deadline</span>
          <span className="font-medium text-gray-700">{rules.transferDeadlineHours}h before show</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="text-sm text-gray-600">ID Verification Required</span>
          <span className={`font-medium ${rules.requiresIdMatch ? 'text-green-600' : 'text-gray-500'}`}>
            {rules.requiresIdMatch ? 'Yes' : 'No'}
          </span>
        </div>
        {rules.charityPercentage > 0 && (
          <div className="flex justify-between items-center py-2 bg-green-50 -mx-4 px-4 rounded-b-lg">
            <span className="text-sm text-green-800">Charity Contribution</span>
            <span className="font-semibold text-green-700">{rules.charityPercentage}% of premium</span>
          </div>
        )}
      </div>
    </div>
  );
}
