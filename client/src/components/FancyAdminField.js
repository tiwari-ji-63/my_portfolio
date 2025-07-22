import React from "react";

/**
 * FancyAdminField - A reusable admin field card styled like the Job Titles UI
 * Props:
 *  - icon: JSX icon for the section
 *  - title: Section title (e.g., "Job Titles")
 *  - badge: Optional badge (e.g., "Featured")
 *  - value: The field value (string)
 *  - onChange: (e) => void for input
 *  - placeholder: Input placeholder
 *  - proTip: Pro tip/help text (string or JSX)
 *  - checked: Show checkmark if true
 */
export default function FancyAdminField({
  icon, title, badge, value, onChange, placeholder, proTip, checked, type = "text"
}) {
  return (
    <div className="fancy-admin-field space-y-2">
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <span className="text-2xl">{icon}</span>
        <span className="font-bold text-lg text-purple-700">{title}</span>
        {badge && (
          <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full border border-yellow-200 flex items-center gap-1">
            <span className="text-base">✨</span> {badge}
          </span>
        )}
        <span className="w-2 h-2 bg-purple-300 rounded-full ml-1"></span>
      </div>
      {/* Input */}
      <div className="relative">
        {type === "textarea" ? (
          <textarea
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full font-semibold text-md px-5 py-3 rounded-2xl border-2 border-orange-300 focus:border-purple-500 outline-none transition-all shadow-sm bg-white/90 text-purple-900 resize-none"
            rows={4}
          />
        ) : (
          <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full font-semibold text-md px-5 py-3 rounded-2xl border-2 border-orange-300 focus:border-purple-500 outline-none transition-all shadow-sm bg-white/90 text-purple-900"
          />
        )}
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl"
          style={{color: value && value.toString().trim() ? '#22c55e' : '#ef4444'}}
        >
          {value && value.toString().trim() ? '✔️' : '❌'}
        </span>
      </div>
      {/* Pro Tip */}
      {proTip && (
        <div className="mt-2 p-4 rounded-xl bg-purple-50/80 border border-purple-100 flex items-start gap-3">
          <span className="text-xl mt-0.5">💡</span>
          <div className="text-purple-700 text-sm">
            {proTip}
          </div>
        </div>
      )}
    </div>
  );
}
