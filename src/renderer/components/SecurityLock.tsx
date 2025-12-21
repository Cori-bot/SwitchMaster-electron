import React, { useState, useEffect } from 'react';
import { Shield, Delete, AlertCircle, CheckCircle2 } from 'lucide-react';

interface SecurityLockProps {
  mode?: 'verify' | 'set';
  onVerify: (pin: string) => Promise<boolean>;
  onSet: (pin: string) => Promise<void>;
  onCancel?: () => void;
}

const SecurityLock: React.FC<SecurityLockProps> = ({ mode = 'verify', onVerify, onSet, onCancel }) => {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [step, setStep] = useState(1); // 1 for initial PIN, 2 for confirmation
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const PIN_LENGTH = 4;

  useEffect(() => {
    if (pin.length === PIN_LENGTH) {
      handleComplete();
    }
  }, [pin]);

  const handleNumberClick = (num: string | number) => {
    if (pin.length < PIN_LENGTH) {
      setPin(prev => prev + num);
      setError('');
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
  };

  const handleComplete = async () => {
    setLoading(true);
    if (mode === 'verify') {
      const isValid = await onVerify(pin);
      if (!isValid) {
        setError('Code PIN incorrect');
        setPin('');
      }
    } else if (mode === 'set') {
      if (step === 1) {
        setConfirmPin(pin);
        setPin('');
        setStep(2);
      } else {
        if (pin === confirmPin) {
          await onSet(pin);
        } else {
          setError('Les codes ne correspondent pas');
          setPin('');
          setStep(1);
          setConfirmPin('');
        }
      }
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#0a0a0a] flex flex-col items-center justify-center p-6 overflow-y-auto scrollbar-hide">
      <div className="w-full max-w-md flex flex-col items-center py-8">
        <div className={`w-20 h-20 rounded-3xl bg-blue-600/10 flex items-center justify-center text-blue-500 mb-8 shadow-2xl shadow-blue-600/10 ${loading ? 'animate-pulse' : ''}`}>
          <Shield size={40} />
        </div>

        <h2 className="text-3xl font-black text-white mb-2 text-center">
          {mode === 'verify' ? 'Verrouillé' : (step === 1 ? 'Définir un Code PIN' : 'Confirmer le PIN')}
        </h2>
        <p className="text-gray-400 text-center mb-12 max-w-xs">
          {mode === 'verify' 
            ? 'Entrez votre code PIN pour accéder à SwitchMaster' 
            : (step === 1 ? 'Entrez un nouveau code PIN à 4 chiffres' : 'Entrez le code à nouveau pour confirmer')}
        </p>

        <div className="flex gap-4 mb-12">
          {[...Array(PIN_LENGTH)].map((_, i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                i < pin.length 
                  ? 'bg-blue-500 border-blue-500 scale-125 shadow-[0_0_10px_rgba(59,130,246,0.5)]' 
                  : 'border-white/20'
              }`}
            />
          ))}
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-500 font-bold mb-8 animate-in fade-in slide-in-from-top-2 duration-200">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <div className="grid grid-cols-3 gap-4 w-full px-8">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleNumberClick(num.toString())}
              disabled={loading}
              className="h-16 rounded-2xl bg-white/5 hover:bg-white/10 text-white text-2xl font-bold transition-all active:scale-90 border border-white/5 disabled:opacity-50"
            >
              {num}
            </button>
          ))}
          <div />
          <button
            onClick={() => handleNumberClick('0')}
            disabled={loading}
            className="h-16 rounded-2xl bg-white/5 hover:bg-white/10 text-white text-2xl font-bold transition-all active:scale-90 border border-white/5 disabled:opacity-50"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            disabled={loading || pin.length === 0}
            className="h-16 rounded-2xl flex items-center justify-center text-gray-400 hover:text-white transition-all active:scale-90 disabled:opacity-30"
          >
            <Delete size={24} />
          </button>
        </div>

        {mode === 'set' && (
          <button
            onClick={onCancel}
            className="mt-12 text-gray-500 hover:text-white font-bold transition-colors"
          >
            Annuler
          </button>
        )}
      </div>
    </div>
  );
};

export default SecurityLock;
