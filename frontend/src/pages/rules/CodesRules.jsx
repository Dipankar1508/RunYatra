export default function CodesRules() {
  return (
    <div className="mt-6 p-4 rounded-xl border border-indigo-300 bg-indigo-50 dark:bg-indigo-900/20 dark:border-indigo-700">
      <h3 className="font-semibold text-indigo-700 dark:text-indigo-400 mb-2">
        Join Code Rules
      </h3>

      <ul className="text-sm space-y-1 list-disc pl-5 text-indigo-700 dark:text-indigo-300">
        <li>Each join code allows exactly one team to join the tournament.</li>
        <li>Once a code is used it cannot be reused.</li>
        <li>Resetting codes removes all teams from the tournament.</li>
        <li>Share codes only with verified team captains.</li>
      </ul>
    </div>
  );
}
