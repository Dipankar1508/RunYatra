export default function TournamentPointsTableCard({ pointsTable = [] }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg">
      <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Points Table
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Group stage standings only
          </p>
        </div>
      </div>

      {pointsTable.length === 0 ? (
        <p className="text-gray-500">No data yet</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[330px] border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-purple-600 text-white">
                <th className="px-2 py-2 text-left">Team</th>
                <th className="px-2 py-2 text-center">P</th>
                <th className="px-2 py-2 text-center">W</th>
                <th className="px-2 py-2 text-center">L</th>
                <th className="px-2 py-2 text-center">Pts</th>
                <th className="px-2 py-2 text-center">NRR</th>
              </tr>
            </thead>

            <tbody>
              {pointsTable.map((team, index) => (
                <tr
                  key={team._id}
                  className={`border-b hover:bg-purple-50 dark:hover:bg-gray-700 ${
                    index % 2 === 0
                      ? "bg-gray-50 dark:bg-gray-900"
                      : "bg-white dark:bg-gray-800"
                  }`}
                >
                  <td className="px-2 py-2 font-medium">
                    {index + 1}. {team.team?.name}
                  </td>
                  <td className="px-2 py-2 text-center">{team.played}</td>
                  <td className="px-2 py-2 text-center text-green-600 font-semibold">
                    {team.won}
                  </td>
                  <td className="px-2 py-2 text-center text-red-500">
                    {team.lost}
                  </td>
                  <td className="px-2 py-2 text-center font-bold text-purple-600">
                    {team.points}
                  </td>
                  <td
                    className={`px-2 py-2 text-center font-semibold ${
                      team.netrunrate >= 0 ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {team.netrunrate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
