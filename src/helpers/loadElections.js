// helpers/voting.js
export const loadElections = async ({ votingService, walletAddress, pathname, setElections, loadCandidates }) => {
    if (!votingService) {
        console.warn("VotingService no está disponible. Asegúrate de que la wallet esté conectada.");
        return;
    }
    try {
        const allElections = await votingService.getAllElections();

        const formattedElections = await Promise.all(
            allElections.map(async (election) => {
                const id = Number(election.id);
                if (id <= 0) return null;

                const info = await votingService.getElectionDetails(id);
                const currentTimestamp = Math.floor(Date.now() / 1000);
                const elapsed = currentTimestamp - info.startTime;
                const duration = info.endTime - info.startTime;
                const hasExpired = elapsed >= duration;

                let winner = null;
                if (hasExpired) {
                    try {
                        const winnerData = await votingService.getWinner(id);
                        winner = { name: winnerData.name, votes: Number(winnerData.voteCount) };
                    } catch (err) {
                        console.warn(`No se pudo obtener el ganador de la elección ${id}:`, err);
                    }
                }

                let hasVoted = false;
                let userVote = null;

                if (walletAddress) {
                    hasVoted = await votingService.hasUserVoted(id, walletAddress);
                    if (hasVoted) {
                        try {
                            userVote = await votingService.getUserVote(id, walletAddress);
                        } catch (e) {
                            console.warn("No se pudo obtener el voto del usuario:", e);
                        }
                    }
                }

                const isReallyActive = info.isActive && !hasExpired;
                const remainingSeconds = Math.max(0, duration - elapsed);
                const remainingMinutes = Math.floor(remainingSeconds / 60);

                return {
                    id,
                    title: info.title,
                    description: info.description,
                    startTime: info.startTime,
                    endTime: info.endTime,
                    durationMinutes: Math.floor(duration / 60),
                    remainingMinutes,
                    remainingSeconds,
                    isActive: isReallyActive,
                    totalVotes: info.totalVotes,
                    candidateCount: info.candidateCount,
                    creator: info.creator?.toLowerCase(),
                    hasVoted,
                    userVote,
                    winner,
                };
            })
        );

        const filteredElections = formattedElections.filter(Boolean);

        const myElections =
            pathname === '/dashboard/crearvotacion'
                ? filteredElections.filter(election => election.creator === walletAddress?.toLowerCase())
                : filteredElections;

        setElections(myElections);

        for (const election of myElections) {
            await loadCandidates(election.id);
        }
    } catch (error) {
        console.error("Error cargando elecciones:", error);
    }
};
