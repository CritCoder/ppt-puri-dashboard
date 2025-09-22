import { motion } from 'framer-motion';
import { FaUsers, FaShieldAlt, FaMapMarkedAlt, FaMedkit } from 'react-icons/fa';
import { DataWidget } from '../Slide14';

export const Results = ({ type, data }) => {
  switch(type) {
    case 'crowd':
      return <CrowdAnalysisResults data={data} />;
    case 'cleaning':
      return <CleaningAnalysisResults data={data} />;
    case 'management':
      return <ManagementResults data={data} />;
    default:
      return null;
  }
};

// Keep your existing results components but split them into separate components
const CrowdAnalysisResults = ({ data }) => (
  <motion.div 
    className="grid grid-cols-2 gap-6"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    {/* Your existing density zones, security status, etc. components */}
  </motion.div>
);

// Add new analysis result components
const CleaningAnalysisResults = ({ data }) => (
  // Add cleaning analysis specific results
);

const ManagementResults = ({ data }) => (
  // Add management specific results
);