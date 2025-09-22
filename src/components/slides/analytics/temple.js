import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { 
  FaUsers, FaSpinner, FaCrosshairs, FaUserCircle,
  FaIdCard, FaHistory, FaClock, FaMapMarkerAlt, FaExclamationTriangle, 
  FaVideo, FaMapMarkedAlt, FaPlay, FaPause, FaStepForward, FaStepBackward,
  FaMobileAlt, FaCamera, FaLock, FaShieldAlt, FaUserShield, FaUserSecret
} from 'react-icons/fa';
import { MdSecurity, MdPhotoCamera, MdReport, MdWarning } from 'react-icons/md';
import ShimmerCard from './ShimmerCard';
import { GoogleMap, useLoadScript, Marker, Polyline, OverlayView } from '@react-google-maps/api';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

// Add videoSources near the top after the imports
const videoSources = [
  '/temple/mobile_violation.mp4',
  '/temple/photography_violation.mp4',
  '/temple/intrusion_violation.mp4',
  '/temple/crowding_violation.mp4',
  '/temple/suspicious_activity.mp4',
  '/temple/harassment_violation.mp4'
];

// Temple violations data
const templeViolations = [
  {
    id: 1,
    type: "Mobile Phone Usage",
    personId: "OD-1001-PURI",
    location: "Singhadwara (East Gate)",
    timestamp: "2024-07-05 10:30",
    photo: "/mobile1.png",
    fine: 500,
    status: "PENDING",
    evidence: {
      confidence: "98%",
      camera_id: "CAM_SG_01",
      video_clip: videoSources[0],
      photo: "/mobile1.png"
    },
    person_details: {
      gender: "Male",
      age_group: "30-40",
      attire: "White Kurta",
      appearance: "Wearing glasses"
    },
    violation_details: {
      description: "Person using mobile phone in restricted area",
      severity: "Medium",
      repeat_offense: false
    }
  },
  {
    id: 2,
    type: "Unauthorized Photography",
    personId: "OD-1002-PURI",
    location: "Inner Sanctum Area",
    timestamp: "2024-07-05 11:15",
    photo: "/mobile1.png",
    fine: 1000,
    status: "PROCESSED",
    evidence: {
      confidence: "95%",
      camera_id: "CAM_IS_02",
      video_clip: videoSources[1],
      photo: "/mobile1.png"
    },
    person_details: {
      gender: "Male",
      age_group: "20-30",
      attire: "Blue Shirt",
      appearance: "Carrying backpack"
    },
    violation_details: {
      description: "Photography in prohibited area",
      severity: "High",
      repeat_offense: true
    }
  },
  {
    id: 3,
    type: "Restricted Area Entry",
    personId: "OD-1003-PURI",
    location: "Deity Chamber Perimeter",
    timestamp: "2024-07-05 12:00",
    photo: "/unauth1.png",
    fine: 1500,
    status: "PENDING",
    evidence: {
      confidence: "92%",
      camera_id: "CAM_DC_03",
      video_clip: videoSources[2],
      photo: "/unauth1.png"
    },
    person_details: {
      gender: "Male",
      age_group: "40-50",
      attire: "Red Dhoti",
      appearance: "Carrying Bag"
    },
    violation_details: {
      description: "Attempted entry to restricted ritual area",
      severity: "High",
      repeat_offense: false
    }
  },
  {
    id: 4,
    type: "Harassment",
    personId: "OD-1004-PURI",
    location: "Prasad Distribution Area",
    timestamp: "2024-07-05 13:45",
    photo: "/mobile1.png",
    fine: 2000,
    status: "PROCESSED",
    evidence: {
      confidence: "97%",
      camera_id: "CAM_PD_01",
      video_clip: videoSources[5],
      photo: "/mobile1.png"
    },
    person_details: {
      gender: "Male",
      age_group: "30-40",
      attire: "Yellow Kurta",
      appearance: "Tall build"
    },
    violation_details: {
      description: "Harassment of female devotees in queue",
      severity: "High",
      repeat_offense: false
    }
  },
  {
    id: 5,
    type: "Suspicious Activity",
    personId: "OD-1005-PURI",
    location: "Donation Counter",
    timestamp: "2024-07-05 14:30",
    photo: "/mobile1.png",
    fine: 1000,
    status: "PENDING",
    evidence: {
      confidence: "94%",
      camera_id: "CAM_DC_02",
      video_clip: videoSources[4],
      photo: "/mobile1.png"
    },
    person_details: {
      gender: "Male",
      age_group: "40-50",
      attire: "Grey Shirt",
      appearance: "Cap and sunglasses"
    },
    violation_details: {
      description: "Suspicious behavior near donation boxes",
      severity: "Medium",
      repeat_offense: true
    }
  }
];

// Move mapOptions to the top, before any component definitions
const mapOptions = {
  styles: [
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
    { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] },
    { featureType: "water", elementType: "labels.text.stroke", stylers: [{ color: "#17263c" }] },
    { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] }
  ],
  disableDefaultUI: true,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: false
};

// Puri temple locations
const templeLocations = {
  "Singhadwara (East Gate)": { lat: 19.8133, lng: 85.8321 },
  "Uttaradwara (North Gate)": { lat: 19.8140, lng: 85.8315 },
  "Dakshinadwara (South Gate)": { lat: 19.8125, lng: 85.8315 },
  "Paschimadwara (West Gate)": { lat: 19.8133, lng: 85.8308 },
  "Inner Sanctum Area": { lat: 19.8133, lng: 85.8316 },
  "Prasad Distribution Area": { lat: 19.8136, lng: 85.8318 },
  "Deity Chamber Perimeter": { lat: 19.8133, lng: 85.8317 },
  "Donation Counter": { lat: 19.8135, lng: 85.8319 }
};

const DataWidget = ({ title, icon: Icon, children }) => (
  <motion.div
    className="bg-white/[0.02] backdrop-blur-md rounded-xl p-4 border border-white/[0.05] 
    shadow-[inset_0px_0px_40px_rgba(255,255,255,0.02)] 
    bg-gradient-to-b from-white/[0.05] to-transparent"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <div className="flex items-center gap-2 mb-3">
      <div className="p-1.5 rounded-lg bg-blue-500/20">
        <Icon className="text-lg text-blue-400" />
      </div>
      <h3 className="text-base font-semibold text-white">{title}</h3>
    </div>
    <div className="space-y-2">
      {children}
    </div>
  </motion.div>
);

// Updated ViolationDetails component for temple violations
const ViolationDetails = ({ violation }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const getSeverityColor = (severity) => {
    switch(severity.toLowerCase()) {
      case 'high': return 'bg-red-500/20 text-red-400';
      case 'medium': return 'bg-orange-500/20 text-orange-400';
      case 'low': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-blue-500/20 text-blue-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Violation Header */}
      <div className="flex gap-4">
        <div className="w-96 rounded-xl overflow-hidden border-2 border-white/10">
          <img 
            src={violation.evidence.photo || violation.photo} 
            alt={violation.type} 
            className="w-full h-full object-contain transition-transform duration-300 hover:scale-110"
          />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-white">{violation.type}</h2>
              <p className="text-sm text-gray-400">
                Person ID: {violation.personId}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(violation.violation_details.severity)}`}>
              {violation.violation_details.severity} Severity
            </span>
          </div>
          
          {/* Violation Details Grid */}
          <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
            <div className="text-sm text-gray-400">
              Location: <span className="text-white">{violation.location}</span>
            </div>
            <div className="text-sm text-gray-400">
              Time: <span className="text-white">{violation.timestamp}</span>
            </div>
            <div className="text-sm text-gray-400">
              Fine Amount: <span className="text-red-400 font-medium">₹{violation.fine}</span>
            </div>
            <div className="text-sm text-gray-400">
              Status: <span className={`font-medium ${violation.status === 'PENDING' ? 'text-orange-400' : 'text-green-400'}`}>
                {violation.status}
              </span>
            </div>
            <div className="text-sm text-gray-400">
              Gender: <span className="text-white">{violation.person_details.gender}</span>
            </div>
            <div className="text-sm text-gray-400">
              Age Group: <span className="text-white">{violation.person_details.age_group}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Evidence Section - Single Video */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">Violation Evidence</h3>
        <div className="relative aspect-video rounded-xl overflow-hidden border-2 border-white/10">
          <video
            src={violation.evidence.video_clip}
            className="w-full h-full object-cover"
            loop
            muted
            playsInline
            {...(isPlaying ? { autoPlay: true } : {})}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20" />
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="absolute inset-0 flex items-center justify-center group"
          >
            <div className="w-16 h-16 rounded-full bg-white/10 group-hover:bg-white/20 
              flex items-center justify-center transition-all duration-200">
              {isPlaying ? (
                <FaPause className="text-2xl text-white" />
              ) : (
                <FaPlay className="text-2xl text-white ml-1" />
              )}
            </div>
          </button>
          
          {/* Video Info Overlay */}
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
            <div className="bg-black/50 px-3 py-1.5 rounded-lg">
              <span className="text-sm text-white/90">{violation.evidence.camera_id}</span>
            </div>
            <div className="bg-black/50 px-3 py-1.5 rounded-lg">
              <span className="text-sm text-white/90">Confidence: {violation.evidence.confidence}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Person Details Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">Person Details</h3>
        <div className="bg-white/[0.02] backdrop-blur-md rounded-xl p-4 border border-white/[0.05]">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <FaUserCircle className="text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Appearance</p>
                  <p className="text-white">{violation.person_details.appearance}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <FaIdCard className="text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Attire</p>
                  <p className="text-white">{violation.person_details.attire}</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <FaHistory className="text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Repeat Offense</p>
                  <p className="text-white">{violation.violation_details.repeat_offense ? "Yes" : "No"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <MdWarning className="text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Violation Type</p>
                  <p className="text-white">{violation.violation_details.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Large Action Buttons */}
      <div className="grid grid-cols-2 gap-6 mt-8">
        <button 
          onClick={() => {/* Handle reject */}}
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-500/5 to-red-500/10
            border-2 border-red-500/20 hover:border-red-500/40 transition-all duration-300"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 to-red-500/10 
            opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative px-6 py-8">
            <div className="flex flex-col items-center gap-3">
              <FaExclamationTriangle className="text-4xl text-red-400 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-2xl font-bold text-red-400">Dismiss Alert</span>
              <span className="text-sm text-red-400/70">Mark as false detection</span>
            </div>
          </div>
        </button>

        <button 
          onClick={() => {/* Handle accept */}}
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500/5 to-green-500/10
            border-2 border-green-500/20 hover:border-green-500/40 transition-all duration-300"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 to-green-500/10 
            opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative px-6 py-8">
            <div className="flex flex-col items-center gap-3">
              <FaIdCard className="text-4xl text-green-400 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-2xl font-bold text-green-400">Generate Notice</span>
              <span className="text-sm text-green-400/70">Fine Amount: ₹{violation.fine}</span>
            </div>
          </div>
        </button>
      </div>

      {/* Status Message */}
      <div className="text-center">
        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm
          ${violation.status === 'PENDING' 
            ? 'bg-orange-500/10 text-orange-400' 
            : 'bg-green-500/10 text-green-400'}`}
        >
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75
              ${violation.status === 'PENDING' ? 'bg-orange-400' : 'bg-green-400'}`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2
              ${violation.status === 'PENDING' ? 'bg-orange-500' : 'bg-green-500'}`}></span>
          </span>
          {violation.status === 'PENDING' 
            ? 'Awaiting verification by security officer'
            : 'Notice has been generated and sent'}
        </span>
      </div>
    </div>
  );
};

// Update the Challan Modal to Violation Notice Modal
const ViolationNoticeModal = ({ isOpen, closeModal, violation }) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/70" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                {/* Notice Header */}
                <div className="text-center border-b-2 border-gray-200 pb-4">
                  <div className="flex items-center justify-center gap-4">
                    <img src="/odisha-police-logo.png" alt="Odisha Police Logo" className="h-16" />
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">ଓଡିଶା ପୋଲିସ</h2>
                      <p className="text-lg text-gray-600">ଶ୍ରୀ ଜଗନ୍ନାଥ ମନ୍ଦିର ସୁରକ୍ଷା, ପୁରୀ</p>
                    </div>
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-red-600">ମନ୍ଦିର ଉଲ୍ଲଂଘନ ସୂଚନା / Temple Violation Notice</h3>
                </div>

                {/* Notice Content */}
                <div className="mt-4 space-y-4">
                  {/* Violation Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between border-b border-gray-200 pb-1">
                        <span className="text-gray-600">ସୂଚନା ସଂଖ୍ୟା / Notice No:</span>
                        <span className="font-medium">OD/PURI/{new Date().getFullYear()}/{Math.random().toString().slice(2, 8)}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-200 pb-1">
                        <span className="text-gray-600">ତାରିଖ / Date:</span>
                        <span className="font-medium">{new Date().toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-200 pb-1">
                        <span className="text-gray-600">ସମୟ / Time:</span>
                        <span className="font-medium">{violation.timestamp}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between border-b border-gray-200 pb-1">
                        <span className="text-gray-600">ବ୍ୟକ୍ତି ଆଇଡି / Person ID:</span>
                        <span className="font-medium">{violation.personId}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-200 pb-1">
                        <span className="text-gray-600">ଲିଙ୍ଗ / Gender:</span>
                        <span className="font-medium">{violation.person_details.gender}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-200 pb-1">
                        <span className="text-gray-600">ସ୍ଥାନ / Place:</span>
                        <span className="font-medium">{violation.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Violation Type and Fine */}
                  <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">ଉଲ୍ଲଂଘନ ବିବରଣୀ / Violation Details</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-gray-900">{violation.type}</p>
                          <p className="text-sm text-gray-600">{violation.violation_details.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">ଜରିମାନା / Fine</p>
                          <p className="text-xl font-bold text-red-600">₹{violation.fine}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Evidence */}
                  <div className="mt-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">ପ୍ରମାଣ / Evidence</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <img 
                        src={violation.photo} 
                        alt="Violation Evidence" 
                        className="w-full h-40 object-cover rounded-lg border border-gray-200"
                      />
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-600">Camera ID: {violation.evidence.camera_id}</p>
                        <p className="text-sm text-gray-600">Detection Confidence: {violation.evidence.confidence}</p>
                        <p className="text-sm text-gray-600 mt-2">Person Description:</p>
                        <p className="text-sm text-gray-800">{violation.person_details.attire}, {violation.person_details.appearance}</p>
                      </div>
                    </div>
                  </div>

                  {/* Temple Rules */}
                  <div className="mt-4 bg-yellow-50 p-3 rounded-lg">
                    <h4 className="text-sm font-semibold text-gray-900">Temple Rules Reminder</h4>
                    <ul className="text-xs text-gray-600 list-disc list-inside mt-1">
                      <li>Mobile phones and cameras are strictly prohibited inside the temple</li>
                      <li>Respect all designated restricted areas and barriers</li>
                      <li>Maintain queue discipline and respect for other devotees</li>
                      <li>Dress modestly and according to temple guidelines</li>
                      <li>Violation of temple rules may result in fines and/or legal action</li>
                    </ul>
                  </div>

                  {/* Footer */}
                  <div className="mt-6 border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-600">
                        <p>Generated by: AI Temple Security System</p>
                        <p>Verification Officer: SEC-PURI-{Math.random().toString().slice(2, 5)}</p>
                      </div>
                      <div className="text-right">
                        <button
                          onClick={closeModal}
                          className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        >
                          Close Notice
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

// Update the main component
const TempleViolationSystem = () => {
  const [selectedViolation, setSelectedViolation] = useState(templeViolations[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getSeverityColor = (severity) => {
    switch(severity.toLowerCase()) {
      case 'high': return 'bg-red-500/20 text-red-400';
      case 'medium': return 'bg-orange-500/20 text-orange-400';
      case 'low': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-blue-500/20 text-blue-400';
    }
  };

  // Map violation type to appropriate icon
  const getViolationIcon = (type) => {
    switch(type.toLowerCase()) {
      case 'mobile phone usage': return <FaMobileAlt className="text-blue-400" />;
      case 'unauthorized photography': return <FaCamera className="text-purple-400" />;
      case 'restricted area entry': return <FaLock className="text-red-400" />;
      case 'harassment': return <MdWarning className="text-amber-400" />;
      case 'suspicious activity': return <FaUserSecret className="text-indigo-400" />;
      default: return <MdSecurity className="text-green-400" />;
    }
  };

  return (
    <div className="w-full h-full  flex flex-col gap-8">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">AI-powered detection and monitoring system</h1>
          
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-white/10 px-4 py-2 rounded-lg">
            <span className="text-white text-sm">Total Violations Today: <span className="font-bold">{templeViolations.length}</span></span>
          </div>
          <div className="bg-green-500/10 px-4 py-2 rounded-lg">
            <span className="text-green-400 text-sm">Resolved: <span className="font-bold">2</span></span>
          </div>
          <div className="bg-orange-500/10 px-4 py-2 rounded-lg">
            <span className="text-orange-400 text-sm">Pending: <span className="font-bold">3</span></span>
          </div>
        </div>
      </div>

      {/* Violations Grid */}
      <div className="grid grid-cols-5 gap-4">
        {templeViolations.map((violation) => (
          <div
            key={violation.id}
            onClick={() => setSelectedViolation(violation)}
            className={`relative rounded-lg overflow-hidden cursor-pointer transition-all
              ${selectedViolation.id === violation.id 
                ? 'ring-2 ring-blue-500 scale-[1.02]' 
                : 'hover:scale-[1.02] hover:ring-2 hover:ring-white/20'}`}
          >
            <div className="aspect-video relative">
              <img 
                src={violation.photo} 
                alt={violation.type}
                className="w-full h-full object-cover"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              
              {/* Violation Info */}
              <div className="absolute bottom-0 left-0 right-0 p-2">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-white">
                    {violation.type}
                  </p>
                  <p className="text-xs text-gray-300">
                    Fine: ₹{violation.fine}
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="absolute top-2 right-2">
                <span className={`text-xs px-2 py-1 rounded-full font-medium
                  ${violation.status === 'PENDING' 
                    ? 'bg-orange-500/20 text-orange-400' 
                    : 'bg-green-500/20 text-green-400'}`}>
                  {violation.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="flex gap-6">
        {/* Left Side - Large Violation Image */}
        <div className="w-1/2">
          <div className="relative aspect-[4/3] rounded-xl overflow-hidden border-2 border-white/10">
            <img 
              src={selectedViolation.evidence.photo || selectedViolation.photo} 
              alt={selectedViolation.type} 
              className="w-full h-full object-cover"
            />
            
            {/* Overlay Info */}
            
            
          </div>
        </div>

        {/* Right Side - Violation Details */}
        <div className="w-1/2 space-y-4">
          {/* Violation Summary Card */}
          <div className="bg-white/[0.02] backdrop-blur-md rounded-xl p-4 border border-white/[0.05]">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedViolation.type}</h3>
                  <p className="text-sm text-gray-400">{selectedViolation.violation_details.description}</p>
                </div>
                <div className={`px-4 py-2 rounded-lg text-lg font-bold
                  ${selectedViolation.violation_details.severity === 'High' 
                    ? 'bg-red-500/20 text-red-400' 
                    : 'bg-orange-500/20 text-orange-400'}`}
                >
                  ₹{selectedViolation.fine}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-gray-400">Person Details</p>
                  <p className="text-sm text-white">
                    {selectedViolation.person_details.gender}, {selectedViolation.person_details.age_group}
                  </p>
                  <p className="text-sm text-white">
                    {selectedViolation.person_details.attire}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-400">Detection Info</p>
                  <p className="text-sm text-white">
                    {selectedViolation.evidence.camera_id}
                  </p>
                  <p className="text-sm text-white">
                    Confidence: {selectedViolation.evidence.confidence}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Time and Location Card */}
          <div className="bg-white/[0.02] backdrop-blur-md rounded-xl p-4 border border-white/[0.05]">
            <h4 className="text-sm font-medium text-white mb-3">Time & Location</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <FaClock className="text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Detected At</p>
                  <p className="text-white">{selectedViolation.timestamp}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <FaMapMarkerAlt className="text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Location</p>
                  <p className="text-white">{selectedViolation.location}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => {/* Handle reject */}}
              className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-red-500/5 to-red-500/10
                border-2 border-red-500/20 hover:border-red-500/40 transition-all duration-300"
            >
              <div className="relative px-6 py-4">
                <div className="flex flex-col items-center gap-2">
                  <FaExclamationTriangle className="text-2xl text-red-400" />
                  <span className="text-lg font-bold text-red-400">Dismiss Alert</span>
                </div>
              </div>
            </button>

            <button 
              onClick={() => setIsModalOpen(true)}
              className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-green-500/5 to-green-500/10
                border-2 border-green-500/20 hover:border-green-500/40 transition-all duration-300"
            >
              <div className="relative px-6 py-4">
                <div className="flex flex-col items-center gap-2">
                  <FaIdCard className="text-2xl text-green-400" />
                  <span className="text-lg font-bold text-green-400">Generate Notice</span>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Notice Modal */}
      <ViolationNoticeModal 
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        violation={selectedViolation}
      />
    </div>
  );
};

export default TempleViolationSystem;