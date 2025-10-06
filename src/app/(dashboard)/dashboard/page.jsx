"use client"
import { ethers } from 'ethers';
import { useGetUser } from "@/hooks/useGetUser";
import { useState, useEffect } from "react";
import { votingService } from '@/lib/servicevoting';

export default function Page() {
  const { role } = useGetUser();
  const [walletAddress, setWalletAddress] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [elections, setElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState(null);
  const [candidates, setCandidates] = useState({});
  const [userVotes, setUserVotes] = useState({});
  const [initialCandidates, setInitialCandidates] = useState([
    { name: '', description: '' },
    { name: '', description: '' }
  ]);
  const [newCandidate, setNewCandidate] = useState({
    name: '',
    description: ''
  });
  const [newElection, setNewElection] = useState({
    title: '',
    description: '',
    tiempo: ''
  });

  const [isAddingCandidate, setIsAddingCandidate] = useState(false);

  // 🔹 Crear elección
  async function handleCreateElection() {
    if (!newElection.title || !newElection.description || !newElection.tiempo) {
      alert("⚠️ Debes ingresar título, descripción y duración");
      return;
    }

    // ✅ Validar que haya al menos dos candidatos
    const validCandidates = initialCandidates.filter(
      (c) => c.name.trim() && c.description.trim()
    );
    if (validCandidates.length < 2) {
      alert("⚠️ Debes agregar al menos 2 candidatos válidos");
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const network = await provider.getNetwork();

      if (network.chainId !== 31337) {
        alert("Por favor, cambia a la red Hardhat Local");
        return;
      }

      setIsCreating(true);

      const durationMinutes = parseInt(newElection.tiempo, 10);

      const tx = await votingService.createElection(
        newElection.title,
        newElection.description,
        durationMinutes
      );
      const receipt = await tx.wait();

      const event = receipt.events.find(e => e.event === "ElectionCreated");
      const newElectionId = event?.args?.electionId.toNumber();

      alert(`✅ Elección creada con éxito! ID: ${newElectionId}`);

      // ✅ Añadir los candidatos automáticamente
      for (const candidate of validCandidates) {
        const txAdd = await votingService.addCandidate(
          newElectionId,
          candidate.name,
          candidate.description
        );
        await txAdd.wait();
      }

      alert("✅ Candidatos añadidos con éxito!");

      setInitialCandidates([{ name: '', description: '' }, { name: '', description: '' }]);
      setNewElection({ title: '', description: '', tiempo: '' });

      await loadElections();
    } catch (error) {
      console.error("Error:", error);
      alert("Error: " + error.message);
    } finally {
      setIsCreating(false);
    }
  }

  // 🔹 Añadir candidato
  async function handleAddCandidate(electionId) {
    try {
      if (!electionId) {
        alert("⚠️ Primero selecciona o crea una elección");
        return;
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const network = await provider.getNetwork();

      if (network.chainId !== 31337) {
        alert("Por favor, cambia a la red Hardhat Local");
        return;
      }

      setIsAddingCandidate(true);

      const tx = await votingService.addCandidate(
        electionId,
        newCandidate.name,
        newCandidate.description
      );

      await tx.wait();

      await loadCandidates(electionId);

      setNewCandidate({ name: '', description: '' });

    } catch (error) {
      console.error("Error detallado al añadir candidato:", error);
      alert("Error al añadir candidato: " + error.message);
    } finally {
      setIsAddingCandidate(false);
    }
  }

  // 🔹 Votar
  async function handleVote(electionId, candidateId) {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const network = await provider.getNetwork();

      if (network.chainId !== 31337) {
        alert("Por favor, cambia a la red Hardhat Local");
        return;
      }

      const tx = await votingService.vote(electionId, candidateId);
      await tx.wait();

      alert("✅ Voto registrado con éxito!");

      await loadElections();
      await loadCandidates(electionId);
    } catch (error) {
      console.error("Error al votar:", error);
      alert("Error al votar: " + error.message);
    }
  }
  const [contractTimestamp, setContractTimestamp] = useState(null);

  // 🔹 Cargar elecciones
  const loadElections = async () => {
    try {
      const allElections = await votingService.getAllElections();

      const formattedElections = await Promise.all(
        allElections.map(async (election) => {
          const id = Number(election.id);
          if (id <= 0) return null;

          const info = await votingService.getElectionDetails(id);

          // Usar tiempo real del sistema
          // ✅ Calcular cuánto tiempo ha pasado desde el inicio (usando tiempo real del sistema)
          const currentTimestamp = Math.floor(Date.now() / 1000);

          const elapsed = currentTimestamp - info.startTime;
          const duration = info.endTime - info.startTime;
          const hasExpired = elapsed >= duration;

          let winner = null;
          if (hasExpired) {
            try {
              const winnerData = await votingService.getWinner(id);
              winner = {
                name: winnerData.name,
                votes: Number(winnerData.voteCount)
              };
            } catch (err) {
              console.warn(`No se pudo obtener el ganador de la elección ${id}:`, err);
            }
          }

          console.log(`Elección ${id}:`, {
            startTime: info.startTime,
            endTime: info.endTime,
            currentTimestamp, // 👈
            elapsed: `${elapsed} segundos`,
            duration: `${duration} segundos`,
            hasExpired
          });
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
            remainingMinutes: remainingMinutes,
            remainingSeconds: remainingSeconds,
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

      setElections(formattedElections.filter(Boolean));

      for (const election of formattedElections.filter(Boolean)) {
        await loadCandidates(election.id);
      }
    } catch (error) {
      console.error("Error cargando elecciones:", error);
    }
  };
  // 🔹 Cargar candidatos
  const loadCandidates = async (electionId) => {
    try {
      const candidatesData = await votingService.getCandidates(electionId);

      const formattedCandidates = candidatesData.ids.map((id, index) => ({
        id: Number(id),
        name: candidatesData.names[index],
        description: candidatesData.descriptions[index],
        voteCount: Number(candidatesData.voteCounts[index])
      }));

      setCandidates((prev) => ({
        ...prev,
        [electionId]: formattedCandidates
      }));
    } catch (error) {
      console.error(`Error al cargar candidatos de ${electionId}:`, error);
      setCandidates((prev) => ({
        ...prev,
        [electionId]: []
      }));
    }
  };

  // 🔹 Wallet
  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (!accounts || accounts.length === 0) throw new Error('No se seleccionó ninguna cuenta');

        const selectedAccount = accounts[0];
        setWalletAddress(selectedAccount);
        localStorage.setItem("walletAddress", selectedAccount);

        window.ethereum.on('accountsChanged', (newAccounts) => {
          if (newAccounts.length > 0) {
            setWalletAddress(newAccounts[0]);
            localStorage.setItem("walletAddress", newAccounts[0]);
            loadElections();
          } else {
            disconnectWallet();
          }
        });

        await loadElections();
      } catch (error) {
        console.error("Error detallado:", error);
        alert("Error al conectar wallet: " + error.message);
        disconnectWallet();
      }
    } else {
      alert("Por favor instala MetaMask");
    }
  };

  const disconnectWallet = () => {
    if (window.ethereum) {
      window.ethereum.removeAllListeners('accountsChanged');
    }
    setWalletAddress(null);
    localStorage.removeItem("walletAddress");
    setElections([]);
    setCandidates({});
    setSelectedElection(null);
    setNewCandidate({ name: '', description: '' });
  };

  useEffect(() => {
    const storedWallet = localStorage.getItem("walletAddress");
    if (storedWallet) {
      setWalletAddress(storedWallet);
      loadElections();
    }

    // ⏱️ Refrescar automáticamente cada 30 segundos
    const interval = setInterval(() => {
      loadElections();
    }, 30000);

    // 🧹 Limpiar el intervalo al desmontar el componente
    return () => clearInterval(interval);
  }, [walletAddress]);

  return (
    <section className="flex w-full items-center justify-center min-h-screen">
      <div className="w-full max-w-4xl bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl text-center">
        {!walletAddress ? (
          <button
            onClick={connectWallet}
            className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
          >
            Conectar Wallet
          </button>
        ) : (
          <>
            <p className="mb-4 text-gray-600">
              Wallet conectada:{" "}
              <span className="font-mono text-sm">{walletAddress}</span>
            </p>

            {role === "admin" && (
              <div className="space-y-3 mb-6">
                <input
                  type="text"
                  placeholder="Título de la votación"
                  value={newElection.title || ""}
                  onChange={(e) => setNewElection(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-2 border rounded "
                />
                <input
                  type="text"
                  placeholder="Descripción de la votación"
                  value={newElection.description || ""}
                  onChange={(e) => setNewElection(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="number"
                  placeholder="Duración en minutos"
                  value={newElection.tiempo || ""}
                  onChange={(e) => setNewElection(prev => ({ ...prev, tiempo: e.target.value }))}
                  className="w-full p-2 border rounded"
                />
                <div className="space-y-4">
                  <h4 className="font-bold">Candidatos iniciales</h4>

                  {initialCandidates.map((candidate, index) => (
                    <div key={index} className="flex space-x-2 ">
                      <input
                        type="text"
                        placeholder={`Nombre candidato ${index + 1}`}
                        value={candidate.name}
                        onChange={(e) => {
                          const updated = [...initialCandidates];
                          updated[index].name = e.target.value;
                          setInitialCandidates(updated);
                        }}
                        className="w-1/2 p-2 border rounded"
                      />
                      <input
                        type="text"
                        placeholder={`Descripción candidato ${index + 1}`}
                        value={candidate.description}
                        onChange={(e) => {
                          const updated = [...initialCandidates];
                          updated[index].description = e.target.value;
                          setInitialCandidates(updated);
                        }}
                        className="w-1/2 p-2 border rounded"
                      />
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() =>
                      setInitialCandidates((prev) => [...prev, { name: '', description: '' }])
                    }
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    ➕ Agregar otro candidato
                  </button>
                </div>
                <button
                  onClick={handleCreateElection}
                  disabled={isCreating}
                  className="w-full py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition disabled:bg-gray-400"
                >
                  {isCreating ? "Creando..." : "Crear votación"}
                </button>
              </div>
            )}

            <div className="mt-8">
              <h3 className="text-xl font-bold mb-4">Elecciones Disponibles</h3>
              <button
                onClick={loadElections}
                className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                🔄 Actualizar lista
              </button>

              {elections.length > 0 ? (
                <div className="space-y-6">
                  {elections.map((election) => {
                    const estado = election.isActive ? "Activa" : "Finalizada";

                    return (
                      <div
                        key={election.id}
                        className="border p-4 rounded-lg text-left hover:border-blue-500 transition-colors"
                      >
                        <h4 className="text-center font-bold text-2xl">{election.title}</h4>
                        <p className="text-center pb-4 text-sm text-gray-600 text-xl">{election.description}</p>

                        <div className="mt-2 text-sm">
                          <p>ID: {election.id}</p>
                          <p>Duración: {election.durationMinutes} minuto{election.durationMinutes !== 1 ? 's' : ''}</p>
                          <p className="pb-4">
                            Estado: <span className={election.isActive ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                              {estado}
                            </span>
                            {election.isActive && election.remainingMinutes > 0 && (
                              <span className="text-sm"> ({election.remainingMinutes} min restantes)</span>
                            )}
                          </p>
                        </div>

                        {candidates[election.id]?.map((candidate) => (
                          <div
                            key={candidate.id}
                            className={`mt-2 p-2 border rounded ${election.hasVoted || !election.isActive
                              ? "opacity-50 cursor-not-allowed"
                              : "cursor-pointer hover:bg-blue-100"
                              }`}
                            onClick={() => {
                              if (election.isActive && !election.hasVoted) {
                                handleVote(election.id, candidate.id);
                              } else if (!election.isActive) {
                                alert("⚠️ Esta elección ya ha finalizado");
                              } else if (election.hasVoted) {
                                alert("⚠️ Ya has votado en esta elección");
                              }
                            }}
                          >
                            <p className="font-medium">{candidate.name}</p>
                            <p className="text-sm text-gray-600">{candidate.description}</p>
                            <p className="text-sm text-gray-500">Votos: {candidate.voteCount}</p>
                            {election.hasVoted && election.userVote === candidate.id && (
                              <p className="text-green-600 font-bold">✓ Ya votaste</p>
                            )}
                          </div>
                        ))}

                        {!election.isActive && election.winner && (
                          <div className="mt-3 p-3 bg-yellow-100 border border-yellow-300 rounded text-center">
                            🏆 <strong>Ganador:</strong> {election.winner.name}{" "}
                            <span className="text-sm text-gray-600">({election.winner.votes} votos)</span>
                          </div>
                        )}


                        {selectedElection === election.id ? (
                          <div className="mt-4 space-y-3">
                            <input
                              type="text"
                              placeholder="Nombre del candidato"
                              value={newCandidate.name || ""}
                              onChange={(e) => setNewCandidate(prev => ({ ...prev, name: e.target.value }))}
                              className="w-full p-2 border rounded"
                            />
                            <input
                              type="text"
                              placeholder="Descripción del candidato"
                              value={newCandidate.description || ""}
                              onChange={(e) => setNewCandidate(prev => ({ ...prev, description: e.target.value }))}
                              className="w-full p-2 border rounded"
                            />
                            <div className="flex space-x-2">
                              {walletAddress?.toLowerCase() === election.creator &&
                                role === "admin" &&
                                election.isActive && ( // ✅ solo si está activa
                                  <button
                                    onClick={() => handleAddCandidate(election.id)} // ✅ aquí cambiamos esto
                                    disabled={isAddingCandidate}
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
                                  >
                                    {isAddingCandidate ? "Añadiendo..." : "Añadir Candidato"}
                                  </button>
                                )}
                              <button
                                onClick={() => {
                                  setSelectedElection(null);
                                  setNewCandidate({ name: '', description: '' });
                                }}
                                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                              >
                                Cancelar
                              </button>
                            </div>
                          </div>
                        ) : (
                          walletAddress?.toLowerCase() === election.creator &&
                          role === "admin" &&
                          election.isActive && ( // ✅ solo mostrar si sigue activa
                            <button
                              onClick={() => setSelectedElection(election.id)}
                              className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                              Añadir Candidato
                            </button>
                          )
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500">No hay elecciones disponibles</p>
              )}
            </div>

            <button
              onClick={disconnectWallet}
              className="w-full py-3 mt-5 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition"
            >
              Desconectar Wallet
            </button>
          </>
        )}
      </div>
    </section >
  );
}
