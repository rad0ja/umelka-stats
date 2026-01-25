"use client";

import { usePlayerCalculatedScore } from "@/app/hooks/usePlayerCalculatedScore";

export function GoalProgress() {
    const { goalsCalc, goalTarget, updateGoalTarget } = usePlayerCalculatedScore();

    const progress = Math.min((goalsCalc / goalTarget) * 100, 100);

    return (
        <div className="p-4 border rounded-lg shadow-md bg-white dark:bg-gray-800">
            <h3 className="text-lg font-bold mb-2">🎯 Goal Progress</h3>

            {/* Progress bar */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                <div
                    className="bg-green-500 h-4 transition-all duration-500"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                ⚽ {goalsCalc} / {goalTarget} goals
            </p>

            {/* Input to change goal target */}
            <div className="mt-3 flex items-center gap-2">
                <label className="text-sm text-gray-600 dark:text-gray-400">
                    Set new target:
                </label>
                <input
                    type="number"
                    value={goalTarget}
                    onChange={(e) => updateGoalTarget(Number(e.target.value))}
                    className="w-20 px-2 py-1 border rounded dark:bg-gray-700 dark:text-white"
                />
            </div>
        </div>
    );
}
