
// Import subscription service functions from appropriate modules
import { 
  getSubscriptionById,
  getAllSubscriptions,
  createSubscription,
  updateSubscription,
  cancelSubscription,
  renewSubscription,
  deleteSubscription 
} from './subscriptions-service';

import {
  fetchSubscriptionPlans,
  fetchSubscriptionPlanById,
  createSubscriptionPlan,
  updateSubscriptionPlan,
  deleteSubscriptionPlan
} from './subscription-plan-service';

// Create alias for getAllSubscriptions to match the naming convention
const fetchSubscriptions = getAllSubscriptions;

// Export all functions with proper names to avoid ambiguity
export {
  fetchSubscriptionPlans,
  fetchSubscriptionPlanById,
  fetchSubscriptions, // Add the new alias here
  getSubscriptionById,
  getAllSubscriptions, 
  createSubscription,
  updateSubscription,
  cancelSubscription,
  renewSubscription,
  deleteSubscription,
  createSubscriptionPlan,
  updateSubscriptionPlan,
  deleteSubscriptionPlan
};
