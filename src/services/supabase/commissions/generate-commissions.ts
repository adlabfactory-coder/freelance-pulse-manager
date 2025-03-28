
import { getMonthDates } from '@/utils/commission';
import { CommissionRule } from '@/types/commissions';
import { determineCommissionTier, calculateCommissionAmount } from '@/utils/commission';

// Define a Contract interface since it couldn't be found in @/types/contract
interface Contract {
  id: string;
  freelancerId: string;
  clientId: string;
  value: number;
  status: string;
  createdAt: Date;
}

// Mock function to fetch contracts since the fetch-contracts file couldn't be found
const fetchContracts = async (startDate: Date, endDate: Date): Promise<Contract[]> => {
  console.log('Fetching contracts from', startDate, 'to', endDate);
  return []; // Return empty array for now
};

// Mock function to fetch commission rules since fetchCommissionRules couldn't be found
const fetchCommissionRules = async (): Promise<CommissionRule[]> => {
  console.log('Fetching commission rules');
  return []; // Return empty array for now
};

/**
 * Generate commissions for a specific month and year
 */
export const generateCommissions = async (month: number, year: number) => {
  try {
    // Get the start and end dates of the month
    const date = new Date(year, month - 1, 1);
    const { start, end } = getMonthDates(date);
    
    // Fetch all contracts within the specified period
    const contracts = await fetchContracts(start, end);
    
    // Fetch commission rules
    const commissionRules = await fetchCommissionRules();
    
    // Group contracts by freelancer
    const contractsByFreelancer = groupContractsByFreelancer(contracts);
    
    // Calculate commissions for each freelancer
    const commissions = calculateCommissions(contractsByFreelancer, commissionRules);
    
    console.log('Commissions générées:', commissions);
    return commissions;
  } catch (error) {
    console.error('Erreur lors de la génération des commissions:', error);
    throw error;
  }
};

/**
 * Group contracts by freelancer
 */
const groupContractsByFreelancer = (contracts: Contract[]) => {
  return contracts.reduce((acc: { [freelancerId: string]: Contract[] }, contract) => {
    const freelancerId = contract.freelancerId;
    if (!acc[freelancerId]) {
      acc[freelancerId] = [];
    }
    acc[freelancerId].push(contract);
    return acc;
  }, {});
};

/**
 * Calculate commissions for each freelancer
 */
const calculateCommissions = (
  contractsByFreelancer: { [freelancerId: string]: Contract[] },
  commissionRules: CommissionRule[]
) => {
  const commissions = Object.entries(contractsByFreelancer).map(([freelancerId, contracts]) => {
    const contractsCount = contracts.length;
    
    // Use the determineCommissionTier utility with proper arguments
    const tier = determineCommissionTier(contractsCount);
    
    // Use the calculateCommissionAmount utility with proper arguments
    // The third argument was missing in the original code
    const totalContractValue = contracts.reduce((sum, contract) => sum + contract.value, 0);
    const amount = calculateCommissionAmount(contractsCount, tier, totalContractValue);
    
    return {
      freelancerId,
      contractsCount,
      tier,
      amount,
    };
  });
  
  return commissions;
};
