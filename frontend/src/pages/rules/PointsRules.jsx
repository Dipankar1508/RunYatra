export default function PointsRules() {
  return (
    <div className="mt-6 p-4 rounded-xl border border-green-300 bg-green-50 dark:bg-green-900/20 dark:border-green-700">
      <h3 className="font-semibold text-green-700 dark:text-green-400 mb-2">
        Points Table Rules
      </h3>

      <ul className="text-sm space-y-1 list-disc pl-5 text-green-700 dark:text-green-300">
        <li>Teams receive points based on match results.</li>
        <li>Net Run Rate (NRR) determines ranking when points are equal.</li>
        <li>Points table updates automatically after match results.</li>
        <li>Only completed matches affect the standings.</li>
      </ul>
    </div>
  );
}
