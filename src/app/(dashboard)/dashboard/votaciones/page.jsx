"use client";
import { useEffect, useState } from "react";
import { loadElections } from "@/helpers/loadElections";
import { votingService } from "@/lib/servicevoting";
import Swal from "sweetalert2";

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

    // 🔹 Actualizar elecciones automáticamente cada 30 segundos
    useEffect(() => {
        if (!walletAddress) return;

        const interval = setInterval(async () => {
            console.log("⏱️ Actualizando elecciones automáticamente...");
            await loadElections({
                votingService,
                walletAddress,
                pathname: "/dashboard/votaciones",
                setElections,
                loadCandidates,
            });
        }, 30000); // cada 30 segundos

        // 🧹 Limpiar intervalo al desmontar
        return () => clearInterval(interval);
    }, [walletAddress]);

    // 🔹 Emitir voto
    const handleVote = async (electionId, candidateId) => {
        if (!walletAddress) {
            Swal.fire({
                icon: "warning",
                title: "Wallet no conectada",
                text: "Por favor, conecta tu wallet para emitir un voto.",
            });
            return;
        }

        try {
            const tx = await votingService.vote(electionId, candidateId);
            await tx.wait(); // 👈 esto asegura que la transacción esté confirmada

            Swal.fire({
                icon: "success",
                title: "Voto registrado",
                text: "Tu voto ha sido registrado con éxito.",
            });

            // 🔁 Refrescar todo de inmediato 
            await loadElections({
                votingService,
                walletAddress,
                pathname: "/dashboard/votaciones",
                setElections,
                loadCandidates,
            });

            await loadCandidates(electionId);
        } catch (error) {
            console.error("Error al votar:", error);
            Swal.fire({
                icon: "error",
                title: "Error al votar",
                text: `No se pudo emitir tu voto: ${error.message}`,
            });
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

                        {election.remainingMinutes <= 0 ? (
                            // ✅ Votación finalizada → mostrar resultados finales
                            <div className="mt-2 text-center">
                                <span className="font-bold">Resultados finales:</span>
                                {candidates[election.id]?.length > 0 ? (
                                    <div className="mt-2">
                                        {candidates[election.id]
                                            .sort((a, b) => b.voteCount - a.voteCount)
                                            .map((candidate) => (
                                                <div
                                                    key={candidate.id}
                                                    className={`block w-full text-center border rounded-xl p-3 mb-2 ${election.winner &&
                                                        candidate.name === election.winner.name
                                                        ? "bg-green-100 font-bold"
                                                        : "bg-gray-100"
                                                        }`}
                                                >
                                                    {candidate.name} —{" "}
                                                    <strong>{candidate.voteCount} votos</strong>
                                                </div>
                                            ))}

                                        {(() => {
                                            const list = candidates[election.id];
                                            if (!list || list.length === 0) return null;

                                            const maxVotes = Math.max(...list.map((c) => c.voteCount));
                                            const topCandidates = list.filter((c) => c.voteCount === maxVotes);

                                            if (topCandidates.length > 1) {
                                                return (
                                                    <p className="mt-4 text-yellow-600 font-semibold">
                                                        🤝 Empate entre {topCandidates.map((c) => c.name).join(" y ")} ({maxVotes} votos)
                                                    </p>
                                                );
                                            } else {
                                                return (
                                                    <p className="mt-4 text-green-600 font-semibold">
                                                        🏆 Ganador: {topCandidates[0].name} ({topCandidates[0].voteCount} votos)
                                                    </p>
                                                );
                                            }
                                        })()}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 mt-2">Sin candidatos registrados</p>
                                )}
                            </div>
                        ) : (
                            // ✅ Si la votación sigue activa → mostrar candidatos para votar
                            <div className="w-full mt-4 text-center">
                                <span className="font-bold">Candidatos:</span>
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
                                                {candidate.description} —{" "}
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
