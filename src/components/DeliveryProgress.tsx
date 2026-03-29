import { motion } from "framer-motion";
import { Truck, Package, CheckCircle2, User } from "lucide-react";

interface Props {
  status: string;
  size?: 'sm' | 'lg';
  orientation?: 'horizontal' | 'vertical';
}

const statusMap: Record<string, number> = {
  'requested': 0,
  'accepted': 1,
  'in_transit': 2,
  'completed': 3,
};

const DeliveryProgress = ({ status, size = 'lg', orientation = 'horizontal' }: Props) => {
  const currentStep = statusMap[status] ?? 0;
  const progressPercent = (currentStep / 3) * 100;

  const steps = [
    { label: "Posted", icon: Package, color: "bg-[#2dd4bf]", shadow: "shadow-[#2dd4bf]/50", border: "border-[#1a1a1a]" },
    { label: "Accepted", icon: User, color: "bg-[#2dd4bf]", shadow: "shadow-[#2dd4bf]/50", border: "border-[#1a1a1a]" },
    { label: "In Transit", icon: Truck, color: "bg-[#f97316]", shadow: "shadow-[#f97316]/50", border: "border-[#1a1a1a]" },
    { label: "Delivered", icon: CheckCircle2, color: "bg-[#f97316]", shadow: "shadow-[#f97316]/50", border: "border-[#1a1a1a]" },
  ];

  const isLg = size === 'lg';
  const isVertical = orientation === 'vertical';

  return (
    <div className={`w-full h-full ${isLg ? 'p-8' : 'p-3'} flex ${isVertical ? 'flex-row' : 'flex-col'} items-center justify-center`}>
      <div className={`relative ${isVertical ? 'h-[250px] w-12' : 'w-full h-12'}`}>
        
        {/* Connection Line */}
        <div className={`absolute ${isVertical ? 'left-1/2 top-0 h-full w-2 -translate-x-1/2' : 'top-1/2 left-0 w-full h-2 -translate-y-1/2'} rounded-full bg-[#1a1a1a] overflow-hidden`}>
          <motion.div
            initial={isVertical ? { height: 0 } : { width: 0 }}
            animate={isVertical ? { height: `${progressPercent}%` } : { width: `${progressPercent}%` }}
            transition={{ duration: 1.5, ease: "circOut" }}
            className={`h-full w-full bg-gradient-to-${isVertical ? 'b' : 'r'} from-[#2dd4bf] to-[#f97316] relative`}
          >
             <div className="absolute inset-0 animate-pulse bg-white/20 blur-sm" />
          </motion.div>
        </div>

        {/* Status Indicators */}
        <div className={`relative flex ${isVertical ? 'flex-col h-full' : 'flex-row w-full'} justify-between items-center`}>
          {steps.map((step, index) => {
            const isActive = index <= currentStep;
            const isCurrent = index === currentStep;
            const StepIcon = step.icon;

            return (
              <div key={index} className={`flex ${isVertical ? 'flex-row w-full' : 'flex-row items-center'} items-center group relative`}>
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: isActive ? 1 : 0.8 }}
                  className={`relative flex ${isLg ? 'h-10 w-10' : 'h-7 w-7'} shrink-0 items-center justify-center rounded-full border-[3px] ${isActive ? 'border-[#0a0a0a]' : 'border-[#2a2a2a]'} ${isActive ? step.color : 'bg-[#1a1a1a]'} transition-all duration-300 z-10`}
                  style={{
                    boxShadow: isActive ? `0 0 30px 5px ${index < 2 ? '#2dd4bf60' : '#f9731660'}` : "none"
                  }}
                >
                  {/* Extra Glow Layer */}
                  {isActive && (
                    <div className={`absolute inset-0 rounded-full ${index < 2 ? 'bg-[#2dd4bf]' : 'bg-[#f97316]'} opacity-20 blur-md animate-pulse`} />
                  )}

                  {isLg && <StepIcon className={`h-4 w-4 ${isActive ? 'text-[#0a0a0a]' : 'text-muted-foreground/50'} z-10`} />}
                  
                  {isCurrent && (
                    <>
                      <motion.div
                        layoutId="inner-glow"
                        animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.5, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className={`absolute inset-0 rounded-full ${index < 2 ? 'bg-[#2dd4bf]' : 'bg-[#f97316]'} blur-xl -z-10`}
                      />
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="absolute -inset-1 border-t-2 border-white/50 rounded-full blur-[1px]"
                      />
                    </>
                  )}
                </motion.div>

                {isLg && (
                  <div className={`${isVertical ? 'ml-4 w-24 text-left' : 'absolute -bottom-8 left-1/2 -translate-x-1/2 text-center w-20'}`}>
                    <p className={`text-[10px] font-display font-black uppercase tracking-tighter transition-colors ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {step.label}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Animated Light Puck */}
        {currentStep > 0 && currentStep < 3 && (
          <motion.div
            initial={isVertical ? { top: '0%' } : { left: '0%' }}
            animate={isVertical ? { top: `${progressPercent}%` } : { left: `${progressPercent}%` }}
            transition={{ duration: 1.5, ease: "circOut" }}
            className="absolute z-20 pointer-events-none"
            style={isVertical ? { left: '50%', transform: 'translate(-50%, -50%)' } : { top: '50%', transform: 'translate(-50%, -50%)' }}
          >
            <div className={`h-4 w-4 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,1)] flex items-center justify-center`}>
               <div className="h-1.5 w-1.5 rounded-full bg-[#111]" />
            </div>
            <div className="absolute inset-0 bg-white blur-md opacity-50 animate-pulse" />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DeliveryProgress;
