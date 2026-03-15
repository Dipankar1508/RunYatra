export default function AddPlayerRules() {
  return (
    <div className="mt-6 p-4 rounded-lg border border-blue-300 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-700">
      <h3 className="font-semibold text-blue-700 dark:text-blue-400 mb-2">
        Player Registration Rules
      </h3>

      <ul className="text-sm space-y-1 list-disc pl-5 text-blue-700 dark:text-blue-300">
        <li>Enter the correct player name before adding them to the squad.</li>

        <li>Jersey numbers should be unique within the team.</li>

        <li>
          Player roles (batsman, bowler, allrounder, wicketkeeper) should match
          the player's primary skill.
        </li>

        <li>Batting and bowling styles help track player statistics.</li>

        <li>
          Players cannot be added or edited once the tournament has started.
        </li>
      </ul>
    </div>
  );
}
