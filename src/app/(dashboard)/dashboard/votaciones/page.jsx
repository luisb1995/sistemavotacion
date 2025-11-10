"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseCliente";
import { loadElections } from "@/helpers/loadElections";
import { votingService } from "@/lib/servicevoting";
import Swal from "sweetalert2";

export default function VotacionesPage() {
  const router = useRouter();
  const [walletAddress, setWalletAddress] = useState("");
  const [elections, setElections] = useState([]);
  const [candidates, setCandidates] = useState({});
  const [loading, setLoading] = useState(false);
  const [userChecked, setUserChecked] = useState(false);

  // 🔹 Verificar sesión del usuario
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data?.user) {
        router.push("/iniciarsesion");
      } else {
        setUserChecked(true);
      }
    };
    checkUser();
  }, [router]);

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
      Swal.fire({
        icon: "warning",
        title: "MetaMask no detectado",
        text: "Por favor instala MetaMask para continuar.",
      });
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const selected = accounts[0];
      setWalletAddress(selected);
      localStorage.setItem("walletAddress", selected);
    } catch (err) {
      console.error("Error al conectar wallet:", err);
    }
  };

  // 🔹 Verificar wallet guardada o activa
  useEffect(() => {
    const checkWallet = async () => {
      if (!window.ethereum) return;
      const stored = localStorage.getItem("walletAddress");
      if (stored) {
        setWalletAddress(stored);
        return;
      }
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
    if (userChecked) fetchElections();
  }, [walletAddress, userChecked]);

  // 🔹 Actualizar automáticamente cada 30s
  useEffect(() => {
    if (!walletAddress || !userChecked) return;
    const interval = setInterval(async () => {
      await loadElections({
        votingService,
        walletAddress,
        pathname: "/dashboard/votaciones",
        setElections,
        loadCandidates,
      });
    }, 30000);
    return () => clearInterval(interval);
  }, [walletAddress, userChecked]);

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
      await tx.wait();

      Swal.fire({
        icon: "success",
        title: "Voto registrado",
        text: "Tu voto ha sido registrado con éxito.",
      });

      await loadElections({
        votingService,
        walletAddress,
        pathname: "/dashboard/votaciones",
        setElections,
        loadCandidates,
      });
      await loadCandidates(electionId);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error al votar",
        text: `No se pudo emitir tu voto: ${error.message}`,
      });
    }
  };

  // 🧭 Render seguro (sin alterar el orden de Hooks)
  if (!userChecked) {
    return (
      <div className="w-full h-screen flex justify-center items-center text-lg text-gray-600">
        Verificando sesión...
      </div>
    );
  }

  return (
    <section className="flex flex-col w-full min-h-screen items-center justify-start py-12 px-4 sm:px-8 bg-gray-50">
      <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-gray-800 text-center">
        🗳️ Lista de Votaciones
      </h1>

      {!walletAddress ? (
        <button
          onClick={connectWallet}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          🔗 Conectar Wallet
        </button>
      ) : loading ? (
        <p className="text-gray-600 text-lg mt-8 animate-pulse">
          Cargando elecciones...
        </p>
      ) : elections.length === 0 ? (
        <p className="text-gray-600 text-lg mt-8">
          No hay elecciones disponibles actualmente.
        </p>
      ) : (
        <div className="w-full max-w-5xl flex flex-col gap-8">
          {elections.map((election) => (
            <article
              key={election.id}
              className="w-full border border-gray-300 bg-white rounded-2xl shadow-md p-6 sm:p-8 text-center transition hover:shadow-lg"
            >
              <h2 className="text-2xl font-bold mb-2 text-gray-800">
                {election.title}
              </h2>
              <p className="text-gray-600 mb-4">{election.description}</p>
              <p className="text-gray-700 mb-4">
                🕒 Tiempo restante:{" "}
                <strong>{election.remainingMinutes} min</strong>
              </p>

              
              {election.remainingMinutes <= 0 ? (
                <section>
                  <p className="font-semibold mb-3 text-gray-800">
                    🏁 Resultados finales:
                  </p>
                  {candidates[election.id]?.length > 0 ? (
                    <div className="flex flex-col gap-3">
                      {candidates[election.id]
                        .sort((a, b) => b.voteCount - a.voteCount)
                        .map((candidate) => (
                          <div
                            key={candidate.id}
                            className={`p-3 rounded-xl border text-gray-800 ${
                              election.winner &&
                              candidate.name === election.winner.name
                                ? "bg-green-100 font-bold border-green-400"
                                : "bg-gray-100"
                            }`}
                          >
                            {candidate.name} —{" "}
                            <strong>{candidate.voteCount} votos</strong>
                          </div>
                        ))}
                      {/* Ganador o empate */}
                      {(() => {
                        const list = candidates[election.id];
                        if (!list || list.length === 0) return null;
                        const maxVotes = Math.max(...list.map((c) => c.voteCount));
                        const topCandidates = list.filter(
                          (c) => c.voteCount === maxVotes
                        );
                        if (topCandidates.length > 1) {
                          return (
                            <p className="mt-3 text-yellow-700 font-semibold">
                              🤝 Empate entre{" "}
                              {topCandidates.map((c) => c.name).join(" y ")} (
                              {maxVotes} votos)
                            </p>
                          );
                        } else {
                          return (
                            <p className="mt-3 text-green-700 font-semibold">
                              🏆 Ganador: {topCandidates[0].name} (
                              {topCandidates[0].voteCount} votos)
                            </p>
                          );
                        }
                      })()}
                    </div>
                  ) : (
                    <p className="text-gray-500 mt-2">
                      Sin candidatos registrados.
                    </p>
                  )}
                </section>
              ) : (
                <section className="mt-4">
                  <p className="font-semibold mb-3 text-gray-800">Candidatos:</p>
                  {candidates[election.id]?.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {candidates[election.id].map((candidate) => (
                        <button
                          key={candidate.id}
                          disabled={election.hasVoted}
                          onClick={() => handleVote(election.id, candidate.id)}
                          className={`p-4 rounded-xl border text-center text-gray-900 font-bold transition ${
                            election.hasVoted
                              ? "bg-gray-300 cursor-not-allowed"
                              : "hover:bg-blue-100 bg-white"
                          }`}
                        >
                          {candidate.name}
                          <p className="text-sm font-normal text-gray-600 mt-1">
                            {candidate.description} —{" "}
                            <strong>{candidate.voteCount} votos</strong>
                          </p>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">Sin candidatos registrados.</p>
                  )}
                </section>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
