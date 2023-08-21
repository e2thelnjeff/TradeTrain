function Leaderboard({leaderboardData}){

    function LeaderboardRow(item, index) {
        let name = item.data()['name']
        let netLiq = item.data()['netLiq']

        return (
        <tr key={index}>
            <td>{`#${index + 1}`}</td>
            <td>{name}</td>
            <td>${netLiq.toLocaleString('en-US', {maximumFractionDigits:2})}</td>
        </tr>
        )
    }

    return (
    <table id="leaderboard">
        <thead>
            <tr>
                <th colSpan={3}>
                    Leaderboard
                </th>
            </tr>
        </thead>
        <tbody>
            {leaderboardData.map(LeaderboardRow)}
        </tbody>
    </table>
    )
}


export default Leaderboard;