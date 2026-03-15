import React from "react";

const TeamOverViewRules = () => {
  return (
    <div className="mt-6 p-4 rounded-lg border border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-700">
      <h3 className="font-semibold text-yellow-700 dark:text-yellow-400 mb-2">
        Squad Rules
      </h3>

      <ul className="text-sm space-y-1 list-disc pl-5 text-yellow-700 dark:text-yellow-300">
        <li>
          The captain is automatically part of the squad and cannot be removed.
        </li>

        <li>
          Make sure the squad contains the exact number of players required by
          the tournament.
        </li>

        <li>
          Player roles should be assigned correctly for better team balance.
        </li>

        <li>Players can be removed/added or edited before the tournament begins.</li>

        <li>
          Once the tournament starts, squad modifications may be restricted.
        </li>
      </ul>
    </div>
  );
};

export default TeamOverViewRules;
