import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaHeart, FaChevronRight, FaTimes } from "react-icons/fa";

const Onboarding = ({ isOpen, onClose, onSave }) => {
  const [step, setStep] = useState(1);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedCauses, setSelectedCauses] = useState([]);

  const skillsList = ["Teaching", "Medical Care", "Cooking", "Environment", "First Aid", "Driving", "Gardening", "Counseling", "IT / Web"];
  const causesList = ["Education", "Health", "Homelessness", "Animals", "Elderly Care", "Environment", "Disaster Relief", "Food Drive"];

  const toggleSkill = (skill) => {
    setSelectedSkills(prev => 
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const toggleCause = (cause) => {
    setSelectedCauses(prev => 
      prev.includes(cause) ? prev.filter(c => c !== cause) : [...prev, cause]
    );
  };

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      onSave({ skills: selectedSkills, causes: selectedCauses });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-lg bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl relative"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600"
        >
          <FaTimes size={16} />
        </button>

        <div className="flex gap-2 mb-8">
          <div className={`h-1.5 flex-grow rounded-full transition-all duration-300 ${step >= 1 ? 'bg-blue-600' : 'bg-slate-200'}`} />
          <div className={`h-1.5 flex-grow rounded-full transition-all duration-300 ${step >= 2 ? 'bg-blue-600' : 'bg-slate-200'}`} />
        </div>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-2xl font-black text-slate-800 mb-2 flex items-center gap-2">
                What are your skills? <span className="text-blue-500">🛠️</span>
              </h2>
              <p className="text-slate-500 text-sm mb-6">Select the skills you want to contribute to the community.</p>

              <div className="grid grid-cols-3 gap-2.5 mb-8">
                {skillsList.map((skill) => {
                  const selected = selectedSkills.includes(skill);
                  return (
                    <button
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className={`py-2 px-3 rounded-2xl text-xs font-bold transition-all ${
                        selected 
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25 border-transparent' 
                          : 'bg-slate-50 text-slate-600 border border-slate-100 hover:bg-slate-100'
                      }`}
                    >
                      {skill}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-2xl font-black text-slate-800 mb-2 flex items-center gap-2">
                Causes you care about <FaHeart className="text-rose-500 animate-pulse" />
              </h2>
              <p className="text-slate-500 text-sm mb-6">Select the areas you are most passionate about helping.</p>

              <div className="grid grid-cols-2 gap-2.5 mb-8">
                {causesList.map((cause) => {
                  const selected = selectedCauses.includes(cause);
                  return (
                    <button
                      key={cause}
                      onClick={() => toggleCause(cause)}
                      className={`py-3 px-4 rounded-2xl text-xs font-bold transition-all flex items-center justify-between ${
                        selected 
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25 border-transparent' 
                          : 'bg-slate-50 text-slate-600 border border-slate-100 hover:bg-slate-100'
                      }`}
                    >
                      <span>{cause}</span>
                      {selected && <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400">Step {step} of 2</span>
          <button
            onClick={handleNext}
            className="flex items-center gap-2 py-3 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/20 transition-all hover:scale-105 active:scale-95"
          >
            <span>{step === 2 ? "Get Started" : "Continue"}</span>
            <FaChevronRight size={10} />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Onboarding;
