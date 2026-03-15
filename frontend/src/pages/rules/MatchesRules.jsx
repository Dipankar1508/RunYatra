export default function MatchesRules() {
  return (
    <div className="mt-6 p-4 rounded-xl border border-purple-300 bg-purple-50 dark:bg-purple-900/20 dark:border-purple-700">
      <h3 className="font-semibold text-purple-700 dark:text-purple-400 mb-2">
        Match Rules
      </h3>

      <ul className="text-sm space-y-1 list-disc pl-5 text-purple-700 dark:text-purple-300">
        <li>Generate the schedule only after all teams have joined.</li>
        <li>Resetting the schedule deletes all match results.</li>
        <li>Update match results immediately after the match ends.</li>
        <li>Match results automatically update the points table.</li>
      </ul>
    </div>
  );
}
