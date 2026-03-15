export default function TeamsRules() {
  return (
    <div className="mt-6 p-4 rounded-xl border border-blue-300 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-700">
      <h3 className="font-semibold text-blue-700 dark:text-blue-400 mb-2">
        Team Rules
      </h3>

      <ul className="text-sm space-y-1 list-disc pl-5 text-blue-700 dark:text-blue-300">
        <li>Each team must have exactly the required number of players.</li>
        <li>The captain is automatically included as a player.</li>
        <li>Teams can be removed by the organizer if needed and a JoinCode resets.</li>
        <li>Once the tournament starts, avoid changing players.</li>
      </ul>
    </div>
  );
}
