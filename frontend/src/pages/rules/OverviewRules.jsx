export default function OverviewRules() {
  return (
    <div className="mt-6 p-4 rounded-xl border border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-700">
      <h3 className="font-semibold text-yellow-700 dark:text-yellow-400 mb-2">
        Important Rules
      </h3>

      <ul className="text-sm space-y-1 text-yellow-700 dark:text-yellow-300 list-disc pl-5">
        <li>
          Set tournament rules carefully during creation. These settings affect
          teams and match scheduling.
        </li>
        <li>
          Overs per match, players per team, and max teams should match your
          tournament format.
        </li>
        <li>
          Tournament details can not be edited later, but the status of a
          tournament can be changed.
        </li>
        <li>
          Deleting a tournament permanently removes all teams, matches and
          results.
        </li>
      </ul>
    </div>
  );
}
