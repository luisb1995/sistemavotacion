"use client";
import { useEffect, useState } from "react";
import { loadElections } from "@/helpers/loadElections";
import { votingService } from "@/lib/servicevoting";

export default function VotacionesPage() {
    const [walletAddress, setWalletAddress] = useState("");
    const [elections, setElections] = useState([]);
    const [candidates, setCandidates] = useState({});
    const [loading, setLoading] = useState(false);

    // 🔹 Cargar candidatos
    const loadCandidates = async (electionId) => {
        try {
            const data = await votingService.getCandidates(electionId);
            const formatted = data.ids.map((id, i) => ({
                id: Number(id),
                name: data.names[i],
                description: data.descriptions[i],
                voteCount: Number(data.voteCounts[i]),
            }));
            setCandidates((prev) => ({ ...prev, [electionId]: formatted }));
        } catch (error) {
            console.error(`Error al cargar candidatos (${electionId}):`, error);
            setCandidates((prev) => ({ ...prev, [electionId]: [] }));
        }
    };

    // 🔹 Conectar wallet
    const connectWallet = async () => {

        if (!window.ethereum) {
            alert("Instala MetaMask");
            return;
        }

        try {
            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            const selected = accounts[0];
            setWalletAddress(selected);
            localStorage.setItem("walletAddress", selected); // ✅ Guardar wallet
        } catch (err) {
            console.error("Error al conectar wallet:", err);
        }
    };
    
    useEffect(() => {
        const checkWallet = async () => {
            if (!window.ethereum) return;

            // ✅ 1. Restaurar wallet desde localStorage
            const stored = localStorage.getItem("walletAddress");
            if (stored) {
                setWalletAddress(stored);
                return;
            }

            // ✅ 2. O comprobar si MetaMask ya tiene sesión activa
            const accounts = await window.ethereum.request({ method: "eth_accounts" });
            if (accounts && accounts.length > 0) {
                setWalletAddress(accounts[0]);
                localStorage.setItem("walletAddress", accounts[0]);
            }
        };

        checkWallet();
    }, []);

    // 🔹 Cargar elecciones al montar
    useEffect(() => {
        const fetchElections = async () => {
            if (!votingService) return;
            setLoading(true);
            await loadElections({
                votingService,
                walletAddress,
                pathname: "/dashboard/votaciones",
                setElections,
                loadCandidates,
            });
            setLoading(false);
        };

        fetchElections();
    }, [walletAddress]);

    // 🔹 Emitir voto
    const handleVote = async (electionId, candidateId) => {
        if (!walletAddress) {
            alert("Conecta tu wallet antes de votar.");
            return;
        }

        try {
            await votingService.vote(electionId, candidateId);
            alert("✅ Voto emitido correctamente!");
            await loadElections({
                votingService,
                walletAddress,
                pathname: "/dashboard/votaciones",
                setElections,
                loadCandidates,
            });
        } catch (error) {
            console.error("Error al votar:", error);
            alert("❌ No se pudo emitir el voto.");
        }
    };

    return (
        <div className="flex flex-col w-full justify-center align-middle items-center justify-items-center  text-center">
            <h1 className="text-2xl font-bold mb-4  text-center">🗳️ Lista de votaciones</h1>

            {!walletAddress ? (
                <button
                    onClick={connectWallet}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                    🔗 Conectar Wallet
                </button>
            ) : loading ? (
                <p>Cargando elecciones...</p>
            ) : elections.length === 0 ? (
                <p>No hay elecciones disponibles.</p>
            ) : (
                elections.map((election) => (
                    <div
                        key={election.id}
                        className="flex flex-col w-full border p-4 rounded-2xl mb-6 shadow-sm gap-6 justify-center justify-items-center text-center bg-white max-w-4xl"
                    >
                        <h2 className="text-xl font-semibold">{election.title}</h2>
                        <p className="text-gray-600 mb-2">{election.description}</p>
                        <p>
                            🕒 Tiempo restante:{" "}
                            <strong>{election.remainingMinutes} min</strong>
                        </p>

                        {election.winner ? (
                            <p className="mt-2 text-green-600 font-semibold">
                                🏆 Ganador: {election.winner.name} ({election.winner.votes} votos)
                            </p>
                        ) : (
                            <div className=" w-full mt-4 text-center">
                                <span className="font-bold">Candidatos: </span>
                                {candidates[election.id]?.length > 0 ? (
                                    candidates[election.id].map((candidate) => (
                                        <button
                                            key={candidate.id}
                                            disabled={election.hasVoted}
                                            onClick={() => handleVote(election.id, candidate.id)}
                                            className={`block w-full text-center border rounded-xl p-4 text-black font-extrabold mb-4 ${election.hasVoted
                                                ? "bg-gray-300 cursor-not-allowed"
                                                : "hover:bg-blue-100"
                                                }`}
                                        >
                                            {candidate.name}
                                            <br />
                                            <span className="font-normal text-gray-600">
                                                {candidate.description} -{" "}
                                                <strong>{candidate.voteCount} votos</strong>
                                            </span>
                                        </button>
                                    ))
                                ) : (
                                    <p className="text-gray-500">Sin candidatos registrados</p>
                                )}
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
}
