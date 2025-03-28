import { getMonthDates } from '@/utils/commission';
import { fetchContracts } from '../contracts/fetch-contracts';
import { fetchCommissionRules } from './fetch-commissions';
import { determineCommissionTier, calculateCommissionAmount } from '@/utils/commission';
import { Contract } from '@/types/contract';
import { CommissionRule } from '@/types/commissions';

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
    const tier = determineCommissionTier(contractsCount, commissionRules);
    const amount = calculateCommissionAmount(contractsCount, tier, commissionRules);
    
    return {
      freelancerId,
      contractsCount,
      tier,
      amount,
    };
  });
  
  return commissions;
};
