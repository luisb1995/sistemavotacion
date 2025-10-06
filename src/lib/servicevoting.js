import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/helpers/constants';

let provider = null;
let signer = null;
let contract = null;

const init = async () => {
  if (typeof window.ethereum === 'undefined') {
    throw new Error('MetaMask no está instalado');
  }

  provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);

  signer = provider.getSigner();

  if (!ethers.utils.isAddress(CONTRACT_ADDRESS)) {
    throw new Error('La dirección del contrato no es válida');
  }

  contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    CONTRACT_ABI,
    signer
  );
};

const getContract = async () => {
  if (!contract) {
    await init();
  }
  return contract;
};

export const votingService = {
  createElection: async (title, description, durationInMinutes) => {
    const contractInstance = await getContract();

    // ✅ Convertir minutos a segundos correctamente
    const mins = Number(durationInMinutes);
    if (isNaN(mins) || mins <= 0) {
      throw new Error("Duración inválida (minutos)");
    }
    const durationInSeconds = Math.floor(mins * 60);

    console.log('Creando elección:', {
      title,
      description,
      durationMinutes: mins,
      durationSeconds: durationInSeconds
    });

    const tx = await contractInstance.createElection(
      title,
      description,
      durationInSeconds
    );
    return tx;
  },
  getCurrentBlockTimestamp: async () => {
    const contractInstance = await getContract();
    const timestamp = await contractInstance.getCurrentTime();
    console.log('Timestamp del contrato:', timestamp.toNumber());
    return timestamp;
  },

  getAllElections: async () => {
    try {
      const contractInstance = await getContract();
      const contractInfo = await contractInstance.getContractInfo();

      // contractInfo devuelve una tupla => [owner, totalElections, activeElections]
      const totalElections = contractInfo[1].toNumber();
      console.log("Total elecciones:", totalElections);

      const elections = [];
      for (let i = 1; i <= totalElections; i++) {
        try {
          const election = await contractInstance.getElectionInfo(i);

          elections.push({
            id: i,
            title: election[0],
            description: election[1],
            startTime: election[2].toNumber(),   // en segundos
            endTime: election[3].toNumber(),     // en segundos
            startTimeFormatted: new Date(election[2].toNumber() * 1000).toLocaleString(),
            endTimeFormatted: new Date(election[3].toNumber() * 1000).toLocaleString(),
            isActive: election[4],
            totalVotes: election[5].toNumber(),
            candidateCount: election[6].toNumber(),
            creator: election[7]
          });
        } catch (error) {
          console.error(`Error obteniendo elección ${i}:`, error);
        }
      }

      return elections;
    } catch (error) {
      console.error("Error en getAllElections:", error);
      throw error;
    }
  },

  vote: async (electionId, candidateId) => {
    const contractInstance = await getContract();
    return await contractInstance.vote(electionId, candidateId);
  },

  getElectionDetails: async (electionId) => {
    const contractInstance = await getContract();
    const election = await contractInstance.getElectionInfo(electionId);

    return {
      id: electionId,
      title: election[0],
      description: election[1],
      startTime: election[2].toNumber(),
      endTime: election[3].toNumber(),
      isActive: election[4],
      totalVotes: election[5].toNumber(),
      candidateCount: election[6].toNumber(),
      creator: election[7]
    };
  },

  getCandidates: async (electionId) => {
    const contractInstance = await getContract();
    const [ids, names, descriptions, voteCounts] = await contractInstance.getCandidates(electionId);

    return {
      ids,
      names,
      descriptions,
      voteCounts
    };
  },

  addCandidate: async (electionId, name, description) => {
    try {
      const contractInstance = await getContract();

      // Verificar que la elección existe y está activa
      const election = await contractInstance.getElectionInfo(electionId);
      if (!election[4]) {
        throw new Error('La elección no está activa');
      }

      // Obtener cuenta actual
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      const currentAccount = accounts[0];

      // Configurar gas opcional
      const gasPrice = await provider.getGasPrice();
      const overrides = {
        gasLimit: 500000,
        gasPrice: gasPrice
      };

      console.log('Intentando añadir candidato con opciones:', {
        electionId,
        name,
        description,
        overrides,
        from: currentAccount
      });

      // Probar primero con callStatic (simulación)
      await contractInstance.callStatic.addCandidate(
        electionId,
        name,
        description,
        overrides
      );

      // Enviar transacción real
      const tx = await contractInstance.addCandidate(
        electionId,
        name,
        description,
        overrides
      );

      console.log('Transacción enviada:', tx.hash);

      return tx;
    } catch (error) {
      console.error('Error detallado en addCandidate:', {
        message: error.message,
        code: error.code,
        data: error.data,
        transaction: error.transaction
      });

      if (error.code === 'UNPREDICTABLE_GAS_LIMIT') {
        throw new Error(
          'Error al estimar gas. Verifica que:\n' +
          '1. La elección existe y está activa\n' +
          '2. Tienes suficiente ETH para gas\n' +
          '3. Eres el creador de la elección (si el contrato lo exige)'
        );
      }

      throw error;
    }
  },

  electionCounter: async () => {
    const contractInstance = await getContract();
    return await contractInstance.electionCounter();
  },

  getContractInfo: async () => {
    const contractInstance = await getContract();
    const info = await contractInstance.getContractInfo();
    return {
      contractOwner: info[0],
      totalElections: info[1].toNumber(),
      activeElections: info[2].toNumber()
    };
  },

  hasUserVoted: async (electionId, userAddress) => {
    const contractInstance = await getContract();
    return await contractInstance.hasUserVoted(electionId, userAddress);
  },
  async getUserVote(electionId, voterAddress) {
    const candidateId = await contract.getUserVote(electionId, voterAddress);
    return Number(candidateId);
  },
  async getWinner(electionId) {
  const candidatesData = await votingService.getCandidates(electionId);

  const candidatesList = candidatesData.ids.map((id, index) => ({
    id: Number(id),
    name: candidatesData.names[index],
    description: candidatesData.descriptions[index],
    voteCount: Number(candidatesData.voteCounts[index]),
  }));

  return candidatesList.reduce((max, c) =>
    c.voteCount > (max?.voteCount || 0) ? c : max
  , null);
},
};
