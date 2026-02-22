export default function Loading() {
  return (
    <div className="global-loader-container">
      <div className="global-loader-pulse">
        <img 
          src="/logo.png" 
          alt="Loading..." 
          className="global-loader-logo"
        />
      </div>
      <style key="loader-styles">{`
        .global-loader-container {
          position: fixed;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0a0a12;
          z-index: 999999;
        }

        .global-loader-pulse {
          position: relative;
          width: 120px;
          height: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 20px;
          background: rgba(255, 90, 0, 0.1);
          border: 1px solid rgba(255, 90, 0, 0.3);
          box-shadow: 0 0 30px rgba(255, 90, 0, 0.2);
          animation: globalPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .global-loader-pulse::before {
          content: '';
          position: absolute;
          inset: -1px;
          border-radius: 20px;
          border: 1px solid rgba(255, 90, 0, 0.5);
          animation: globalRipple 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .global-loader-logo {
          width: 80%;
          height: 80%;
          object-fit: contain;
          animation: globalFloat 3s ease-in-out infinite;
        }

        @keyframes globalPulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(0.95);
            box-shadow: 0 0 50px rgba(255, 90, 0, 0.4);
          }
        }

        @keyframes globalRipple {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(1.4);
            opacity: 0;
          }
        }

        @keyframes globalFloat {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-4px);
          }
        }
      `}</style>
    </div>
  );
}
